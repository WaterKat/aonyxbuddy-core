import * as StreamCharacters from '@aonyxbuddy/stream-characters';
import * as StreamEvents from '@aonyxbuddy/stream-events';
import * as Tools from '@aonyxbuddy/tools';

import config from './config/config.js';

async function GetEventClient(
  blockedText: string[],
  botBlacklist: string[],
  nicknames: StreamEvents.Clients.PostProcessors.Nickname.INicknamePostProcessorOptions
): Promise<StreamEvents.Clients.EventManager> {
  const client = new StreamEvents.Clients.EventManager();
  const streamElementsEventListener =
    new StreamEvents.Clients.StreamElementsEventListener();
  client.attachListener(streamElementsEventListener);

  //remove bad words
  const textFilterPostProcessor =
    StreamEvents.Clients.PostProcessors.TextFilterPostProcessor(
      blockedText,
      false,
      "EEEE"
    );
  client.attachPostProcessor(textFilterPostProcessor);

  //convert chat messages into command event
  const commandPostProcessor =
    StreamEvents.Clients.PostProcessors.CommandPostProcessor();
  client.attachPostProcessor(commandPostProcessor);

  //blacklist chat messsages
  const blacklistPostProcessor =
    new StreamEvents.Clients.PostProcessors.BlackList.BlackListPostProcessor(
      botBlacklist
    );
  client.attachPostProcessor(blacklistPostProcessor);

  //convert command say to custom event
  const commandSayPostProcessor =
    new StreamEvents.Clients.PostProcessors.CommandSay.CommandSayPostProcessor();
  client.attachPostProcessor(commandSayPostProcessor);

  //remove commands without permissions
  const permissionPostProcessor =
    new StreamEvents.Clients.PostProcessors.Permissions.SkipEventCommandPostProcessor();
  client.attachPostProcessor(permissionPostProcessor);

  //nicknames
  const nicknamePostProcessor =
    new StreamEvents.Clients.PostProcessors.Nickname.NicknamePostProcessor(
      nicknames
    );
  client.attachPostProcessor(nicknamePostProcessor);

  //mute command post processor
  const muteCommandPostProcessor =
    new StreamEvents.Clients.PostProcessors.MuteCommandPostProcessor();
  client.attachPostProcessor(muteCommandPostProcessor);

  //skip command post processor
  const skipCommandPostProcessor =
    new StreamEvents.Clients.PostProcessors.SkipEventCommandPostProcessor();
  client.attachPostProcessor(skipCommandPostProcessor);

  //remove emojis
  const emojiFilterPostProcessor =
    StreamEvents.Clients.PostProcessors.EmojiPostProcessor();
  client.attachPostProcessor(emojiFilterPostProcessor);

  //raid timeout for messages and follows
  const raidIgnorePostProcessor =
    new StreamEvents.Clients.PostProcessors.RaidIgnorePostProcessor();
  client.attachPostProcessor(raidIgnorePostProcessor);

  //hybrid - wait for first chat message then send new custom first-message event.
  const firstMessagePostProcessor =
    new StreamEvents.Clients.PostProcessors.FirstEventPostProcessor();
  client.attachListener(firstMessagePostProcessor);
  client.attachPostProcessor(firstMessagePostProcessor);

  //hybrid - process subscriber event and send their message as seperate say event
  const subscriberPostProcessor =
    new StreamEvents.Clients.PostProcessors.Subscriber.SubscriberPostProcessor();
  client.attachListener(subscriberPostProcessor);
  client.attachPostProcessor(subscriberPostProcessor);

  return client;
}

async function GetCharacter(
  pngconfig: StreamCharacters.PNG.IPNGRendererOptions,
  ttsconfig: StreamCharacters.TextToSpeech.StreamElementsTTS.IStreamElementsTTSOptions
): Promise<StreamCharacters.StreamCharacters.StreamCharacter> {
  const renderer = await Tools.AsyncClassInitializer.create(
    StreamCharacters.PNG.PNGRenderer,
    pngconfig
  );

  if (!renderer) throw renderer;

  const tts =
    new StreamCharacters.TextToSpeech.StreamElementsTTS.StreamElementsTTS(
      ttsconfig
    );

  const streamCharacterOptions: StreamCharacters.StreamCharacters.IStreamCharacterOptions =
  {
    renderer: renderer,
    tts: tts,
  };

  const character = await Tools.AsyncClassInitializer.create(
    StreamCharacters.StreamCharacters.StreamCharacter,
    streamCharacterOptions
  );

  if (!character) throw character;

  return character;
}

async function main() {
  const helloWorldMessage = `My name is ${config.name}. Glad to meet you!`;

  const character = await GetCharacter(
    config.png,
    config.tts
  );
  const eventClient = await GetEventClient(
    config.badWords,
    config.botBlacklist,
    config.nicknames
  );

  eventClient.eventSubscription.subscribe((event) => {
    console.log(event);
  });

  if (!character || !eventClient) {
    console.error(character, eventClient);
    throw "error on init";
  }

  console.log("Frank client-browser has been initiated");
  await character.Speak(helloWorldMessage);

  const eventParserOptions = config.responses;
  const eventParser = new StreamEvents.Parsers.StreamEventParser(
    eventParserOptions
  );

  const standardEventList: StreamEvents.StreamEvent[] = [];
  let listPlaying = false;

  eventClient.eventSubscription.subscribe(ProcessEvent);

  function ProcessEvent(event: StreamEvents.StreamEvent) {
    if (event.type === "command") {
      if (event.command_identifier === "!" && event.command_group === "frank") {
        if (event.command_request === "skip") {
          console.log("skip requested");
          character.Interrupt();
        }
      }
    } else if (event.type !== "ignore") {
      standardEventList.push(event);
      if (!listPlaying) PlayEventList();
    }
  }

  async function PlayEventList() {
    listPlaying = true;

    while (standardEventList.length > 0) {
      const currentEvent = standardEventList.shift();
      if (!currentEvent) break;

      const response = eventParser.GetVoiceResponse(currentEvent);
      await character.Speak(response);
    }

    listPlaying = false;
  }
}

main();
