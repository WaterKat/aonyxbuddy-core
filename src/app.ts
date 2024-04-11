/// <reference lib="dom" />

import * as StreamEvents from "./core/stream-events/index.js";
import * as TextToSpeech from "./ui/text-to-speech/index.js";
import * as StreamEventParser from "./stream-event-parser/index.js";
import StreamElements from "./stream-elements/index.js";

import {
  ClientConfigExample as config
} from "./config/iclient-config-fariaorion.test.js";

import Log from "./log.js";
import GetAonyxBuddyStreamEventListener from "./stream-event-listener/index.js";
import { GetAonyxBuddyInstance } from "./index.js";

import {
  ProcessCommand,
  IProcessCommandOptions,
  EPermissionLevel,
  IUserPermissions
} from "./core/stream-events/processing/index.js";
import { CreateCanvas } from "./ui/sprite-rendering/canvas.js";
import { ConvertLegacyConfiguration } from "./ui/sprite-rendering/legacy-support.js";
import { PopulateIRenderParams } from "./ui/sprite-rendering/renderer.js";

function main() {
  let skipCount = 0;

  const mouthParam = {
    name: "mouth",
    value: 0
  };

  const aonyxbuddy = GetAonyxBuddyInstance(config, mouthParam);

  //!``````````````````````````````````````````````````````````````````````````

  const convertedConfig = ConvertLegacyConfiguration(config.spriteRendering);
  
  const canvas = CreateCanvas(convertedConfig.canvas);
  document.body.appendChild(canvas);
  PopulateIRenderParams(); // TODO

  //Sprite Renderer
  //  let talkingFrame = 0;
  let idleFrame = 0;

  function Render(renderer: SpriteRendering.Types.IRenderer) {
    renderer.ClearCanvas();
    const speakingFrame = Math.floor(
      renderer.sprites["talking"].bitmap.length * mouthParam.mouth.value
    );
    renderer.RenderSprite("base", idleFrame);
    renderer.RenderSprite("mute", mutedFrame);
    renderer.RenderSprite("talking", speakingFrame, () => {
      Render(renderer);
    });
  }

  function FlipBaseImage(renderer: SpriteRendering.Types.IRenderer) {
    idleFrame++;
    idleFrame %= renderer.sprites["base"].bitmap.length;
    setTimeout(() => {
      FlipBaseImage(renderer);
    }, renderer.sprites["base"].delay[idleFrame]);
  }

  const renderer = SpriteRendering.default(config.spriteRendering).then(
    (renderer) => {
      if (renderer instanceof Error) throw renderer;
      Render(renderer);
      if (renderer.sprites["base"].bitmap.length > 0) FlipBaseImage(renderer);
    }
  );

  let mutedFrame = 0;
  /*
    //* Mute
    let isMuted = false;
    let mutedFrame = 0;

    function SetMuted() {
      isMuted = true;
      mutedFrame = 1;
      SkipAllSpeech();
    }

    function SetUnmuted() {
      isMuted = false;
      mutedFrame = 0;
    }
  */

  //* StreamEventParser

  function ParseEvent(streamEvent: StreamEvents.Types.TStreamEvent) {
    const response = StreamEventParser.Parser.GetResponse(
      config.responses,
      streamEvent,
      "voice"
    );
    aonyxbuddy.TextQueue.Append(response);

    //* Special Condition for Subscription (Sub Messages)

    if (
      streamEvent.type === StreamEvents.Types.EStreamEventType.SUBSCRIBER ||
      streamEvent.type === StreamEvents.Types.EStreamEventType.CHEER
    ) {
      aonyxbuddy.TextQueue.Append(streamEvent.message?.text ?? "");
    }
  }

  function ParseOther(otherEvent: StreamEvents.Types.TStreamEvent) {
    if (otherEvent.type !== "other") {
      Log("info", 'ParseOther: Event not "other" type');
      return;
    }

    if (!otherEvent.other) {
      Log("info", 'ParseOther: event "other" field not set');
      return;
    }

    if (!otherEvent.other.type) {
      Log("info", 'ParseOther: "type" field not set');
      return;
    }

    if (
      otherEvent.other.type === "chat-first" &&
      otherEvent.original.type === "chat"
    ) {
      const customChatFirstResponse = StreamEventParser.Parser.GetResponse(
        config.responses,
        otherEvent.original,
        "chat-first-custom",
        otherEvent.username
      );
      const generalChatFirstResponse = StreamEventParser.Parser.GetResponse(
        config.responses,
        otherEvent.original,
        "voice",
        "chat-first"
      );
      aonyxbuddy.TextQueue.Append(
        customChatFirstResponse.length > 0
          ? customChatFirstResponse
          : generalChatFirstResponse
      );
      Log("info", generalChatFirstResponse);
    } else {
      Log("info", 'ParseOther: "type" is not chat-first');
    }

    Log("error", otherEvent);
  }

  const command_identifier = config.commandIdentifier ?? "!";
  const command_group = config.commandGroup ?? "aonyxbuddy";

  function ParseCommand(event: StreamEvents.Types.TStreamEvent) {
    if (event.type !== "command") return;
    if (event.identifier !== command_identifier) return;
    if (
      event.group !== command_group &&
      event.group !== "aonyxbuddy"
    )
      return;
    const command = event.action.toLocaleLowerCase();
    switch (command) {
      case "debug":
        Log("log", "Muted:", mutedFrame);
        Log("log", "SkipCount:", skipCount);
        Log("log", aonyxbuddy.TextQueue.taskQueue);
        break;
      case "say":
        Log("info", "say command called");
        aonyxbuddy.TextQueue.Append(event.args);
        break;
      case "mute":
        Log("info", "mute called");
        mutedFrame = 1;
        skipCount = 1000;
        break;
      case "unmute":
        Log("info", "unmute called");
        mutedFrame = 0;
        skipCount = 0;
        break;
      case "skip":
        Log("info", "skip command called");
        if (event.args.trim().length < 1) {
          Log("info", "skip arg is empty, therefore using 1 as default");
          skipCount = aonyxbuddy.TextQueue.Skip(1 + skipCount);
        } else if (!isNaN(+event.args.trim())) {
          Log("info", "skip arg is number");
          skipCount = aonyxbuddy.TextQueue.Skip(
            Math.max(0, skipCount + +event.args)
          );
        } else if (event.args.trim() === "all") {
          Log("info", "skip all command");
          aonyxbuddy.TextQueue.Skip(100);
          if (mutedFrame < 1) skipCount = 0;
        } else if (event.args.trim() === "clear") {
          Log("info", "skip clear command");
          skipCount = 0;
        }
        break;
    }
  }

  //Stream Events
  function OnEventReceived(rawEvent: StreamEvents.Types.TStreamEvent) {
    const permissions: IUserPermissions = {
      [rawEvent.username]: rawEvent.permissions ?
        rawEvent.permissions.streamer ? EPermissionLevel.STREAMER :
          rawEvent.permissions.moderator ? EPermissionLevel.MODERATOR :
            rawEvent.permissions.vip ? EPermissionLevel.VIP :
              rawEvent.permissions.subscriber ? EPermissionLevel.SUBSCRIBER :
                rawEvent.permissions.follower ? EPermissionLevel.FOLLOWER :
                  EPermissionLevel.CHATTER
        : EPermissionLevel.CHATTER
    };

    const event: StreamEvents.TStreamEvent =
      StreamEvents.ProcessEvent(rawEvent, {
        FilterWordsCaseInsensitiveOptions: {
          wordsToFilter: config.blockedWords,
          replacement: "ploop"
        },
        FilterWordsCaseSensitiveOptions: {
          wordsToFilter: [],
          replacement: "ploop"
        },
        CommandOptions: {
          identifiers: ["!aonyxbuddy", `${command_identifier}${command_group}`],
          actions: ["debug", "say", "mute", "unmute", "skip"]
        },
        GetNicknameOptions: {
          nicknameMap: config.nicknames,
          randomBetween01Func: () => Math.random()
        },
        FilterBlacklistOptions: {
          blacklist: config.blacklist
        },
        FilterEmojisOptions: {
          replacement: ""
        },
        FilterBotlistOptions: {
          botlist: config.botlist,
          allow: [StreamEvents.EStreamEventType.COMMAND]
        },
        FilterPermissionsOptions: {
          permissionRequirements: {
            [StreamEvents.EStreamEventType.TS_TYPE]: EPermissionLevel.CHATTER,
            [StreamEvents.EStreamEventType.CHAT]: EPermissionLevel.CHATTER,
            [StreamEvents.EStreamEventType.CHAT_FIRST]:
              EPermissionLevel.FOLLOWER,
            [StreamEvents.EStreamEventType.CHEER]: EPermissionLevel.CHATTER,
            [StreamEvents.EStreamEventType.SUBSCRIBER]:
              EPermissionLevel.CHATTER,
            [StreamEvents.EStreamEventType.FOLLOW]: EPermissionLevel.CHATTER,
            [StreamEvents.EStreamEventType.RAID]: EPermissionLevel.CHATTER,
            [StreamEvents.EStreamEventType.GIFT_BULK_RECEIVED]:
              EPermissionLevel.CHATTER,
            [StreamEvents.EStreamEventType.GIFT_BULK_SENT]:
              EPermissionLevel.CHATTER,
            [StreamEvents.EStreamEventType.GIFT_SINGLE]:
              EPermissionLevel.CHATTER,
            [StreamEvents.EStreamEventType.COMMAND]: EPermissionLevel.MODERATOR,
            [StreamEvents.EStreamEventType.REDEEM]: EPermissionLevel.CHATTER,
            [StreamEvents.EStreamEventType.IGNORE]: EPermissionLevel.CHATTER,
            [StreamEvents.EStreamEventType.OTHER]: EPermissionLevel.CHATTER,
          },
          permissions: permissions
        },
        FilterCheermotesOptions: {
          replacement: " "
        },
        FilterConditionOptions: {
          condition: !(mutedFrame > 0),
        }
      });



    /*
    let streamEvent = rawEvent;
    /*    streamEvent = StreamEvents.Manipulation
          .ProcessFilterWordsCaseInsensitive(
            streamEvent,
            {
              wordsToFilter: config.blockedWords,
              replacement: "ploop"
            }
          );
    //streamEvent = StreamEvents.Manipulation.ParseCommand(streamEvent, true);
    streamEvent = ProcessCommand(streamEvent, {
      identifiers: ["!aonyxbuddy", `${command_identifier}${command_group}`],
      actions: ["debug", "say", "mute", "unmute", "skip"]
    });
    streamEvent = StreamEvents.Manipulation.IgnoreCommandWithoutPermission(
      streamEvent,
      "CommandPermission"
    );
    streamEvent = StreamEvents.Manipulation.FilterEmojis(streamEvent, "");
    streamEvent = StreamEvents.Manipulation.FilterCheers(streamEvent, " ");
    streamEvent = StreamEvents.Manipulation.IgnoreFromBlacklist(
      streamEvent,
      config.blacklist
    );
    streamEvent = StreamEvents.Manipulation.IgnoreFromBotlist(
      streamEvent,
      config.botlist
    );
    streamEvent = StreamEvents.Manipulation.ProcessNicknames(
      streamEvent,
      config.nicknames
    );
    streamEvent = StreamEvents.Manipulation.IgnoreWithCondition(
      streamEvent,
      !(mutedFrame > 0),
      "MuteToggle"
    );
    streamEvent = StreamEvents.Detection.DetectFirstEvent(
      streamEvent,
      ParseOther
    );
    */
    //    console.info("RawEvent:", streamEvent);
    if (event.type === "other") {
      ParseOther(event);
    } else if (event.type === "command") {
      ParseCommand(event);
    } else {
      ParseEvent(event);
    }

    aonyxbuddy.TextQueue.Skip(1);
  }

  StreamElements(OnEventReceived);
  GetAonyxBuddyStreamEventListener(OnEventReceived);

  aonyxbuddy.TextQueue.Append(
    `'A-onyx Buddy systems online. ${config.nickname}, is active.'`
  );
}

//* Preparing Body Styling
document.body.style.margin = "0 0";
document.body.style.padding = "0 0";

main();

//# sourceURL=browsertools://aonyxbuddy/aonyxbuddy.js
