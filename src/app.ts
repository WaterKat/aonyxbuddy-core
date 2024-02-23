/// <reference lib="dom" />

import * as SpriteRendering from "./sprite-rendering/index.js";
import * as StreamEvents from "./stream-events/index.js";
import * as TextToSpeech from "./text-to-speech/index.js";
import * as StreamEventParser from "./stream-event-parser/index.js";
import StreamElements from "./stream-elements/index.js";

//import { ClientConfigExample as config } from './config/iclient-config-cupidjpeg.test.js';
//import { ClientConfigExample as config } from './config/iclient-config-waterkattv.test.js';
import { ClientConfigExample as config } from "./config/iclient-config-fariaorion.test.js";

import Log from "./log.js";
import GetAonyxBuddyStreamEventListener from "./stream-event-listener/index.js";
import { GetAonyxBuddyInstance } from "./index.js";

function main() {
  let skipCount = 0;

  const aonyxbuddy = GetAonyxBuddyInstance(config);

  //!```````````````````````````````````````````````````````````````````````````````````````

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

  function ParseEvent(streamEvent: StreamEvents.Types.StreamEvent) {
    const response = StreamEventParser.Parser.GetResponse(
      config.responses,
      streamEvent,
      "voice"
    );
    aonyxbuddy.TextQueue.Append(response);

    //* Special Condition for Subscription (Sub Messages)

    if (
      streamEvent.type === StreamEvents.Types.StreamEventType.SUBSCRIBER ||
      streamEvent.type === StreamEvents.Types.StreamEventType.CHEER
    ) {
      aonyxbuddy.TextQueue.Append(streamEvent.message?.text ?? "");
    }
  }

  function ParseOther(otherEvent: StreamEvents.Types.StreamEvent) {
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

  function ParseCommand(event: StreamEvents.Types.StreamEvent) {
    if (event.type !== "command") return;
    if (event.command_identifier !== command_identifier) return;
    if (
      event.command_group !== command_group &&
      event.command_group !== "aonyxbuddy"
    )
      return;
    const command = event.command_request.toLocaleLowerCase();
    switch (command) {
      case "debug":
        Log("log", "Muted:", mutedFrame);
        Log("log", "SkipCount:", skipCount);
        Log("log", aonyxbuddy.TextQueue.taskQueue);
        break;
      case "say":
        Log("info", "say command called");
        aonyxbuddy.TextQueue.Append(event.command_args);
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
        if (event.command_args.trim().length < 1) {
          Log("info", "skip arg is empty, therefore using 1 as default");
          skipCount = aonyxbuddy.TextQueue.Skip(1 + skipCount);
        } else if (!isNaN(+event.command_args.trim())) {
          Log("info", "skip arg is number");
          skipCount = aonyxbuddy.TextQueue.Skip(
            Math.max(0, skipCount + +event.command_args)
          );
        } else if (event.command_args.trim() === "all") {
          Log("info", "skip all command");
          aonyxbuddy.TextQueue.Skip(100);
          if (mutedFrame < 1) skipCount = 0;
        } else if (event.command_args.trim() === "clear") {
          Log("info", "skip clear command");
          skipCount = 0;
        }
        break;
    }
  }

  //Sprite Renderer
  let talkingFrame = 0;
  let idleFrame = 0;

  function Render(renderer: SpriteRendering.Types.IRenderer) {
    renderer.ClearCanvas();
    renderer.RenderSprite("base", idleFrame);
    renderer.RenderSprite("mute", mutedFrame);
    renderer.RenderSprite("talking", Math.floor(talkingFrame), () => {
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

  //Stream Events
  function OnEventReceived(rawEvent: StreamEvents.Types.StreamEvent) {
    let streamEvent = rawEvent;
    streamEvent = StreamEvents.Manipulation.FilterBannedWords(
      streamEvent,
      config.blockedWords,
      "ploop",
      false
    );
    streamEvent = StreamEvents.Manipulation.ParseCommand(streamEvent, true);
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
    console.info("RawEvent:", streamEvent);
    if (streamEvent.type === "other") {
      ParseOther(streamEvent);
    } else if (streamEvent.type === "command") {
      ParseCommand(streamEvent);
    } else {
      ParseEvent(streamEvent);
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
