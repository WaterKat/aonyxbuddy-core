import {
  FetchAndPopulateBuffers,
  ParseTextToSpeechText,
  TTextToSpeechOptions,
} from "../text-to-speech.js";

import {
  NodeAudioBufferPlayer,
  TNodeAudioBufferPlayerOptions,
} from "./node-audiobuffer-player.js";

//import { jest } from "@jest/globals";

//@ts-expect-error jest
async function speakerTest(done) {
  const options: TTextToSpeechOptions = {
    voiceID: "Brian",
    commandIdentifier: "$",
    availableVoices: ["Brian", "Amy"],
    soundClipURLs: {
      DISCORDJOIN: "https://www.aonyxlimited.com/assets/audio/discord-join.mp3",
      DISCORDLEAVE:
        "https://www.aonyxlimited.com/assets/audio/discord-leave.mp3",
      KNOCK: "https://www.aonyxlimited.com/assets/audio/knock.mp3",
      HUH: "https://www.aonyxlimited.com/assets/audio/huh.mp3",
      VINEBOOM: "https://www.aonyxlimited.com/assets/audio/vine-boom.mp3",
    },
  };

  const message =
    "$DISCORDJOIN Hey why does it smell so bad in here? $DISCORDJOIN $Amy I don't know, maybe it's because you're here. $DISCORDLEAVE $Brian That's not very nice. $KNOCK$HUH$VINEBOOM$DISCORDLEAVE";
  const bufferRequests = ParseTextToSpeechText(message, options);

  if (typeof bufferRequests[0] === "undefined") return;

  const bufferDatas = await FetchAndPopulateBuffers(bufferRequests);

  if (typeof bufferDatas[0].arrayBuffer === "undefined") {
    done(new Error("Failed to fetch audio data"));
    return;
  }

  for (const bufferData of bufferDatas) {
    if (typeof bufferData.arrayBuffer === "undefined") continue;
    await new Promise<void>((resolve) => {
      if (typeof bufferData.arrayBuffer === "undefined") return;
      const playoptions: TNodeAudioBufferPlayerOptions = {
        arrayBuffer: bufferData.arrayBuffer,
        logger: console,
        onend: () => {
          resolve();
        },
      };
      const player = new NodeAudioBufferPlayer(playoptions);
      player.play();
    });

    /*
    await NodePlayAudioBuffer(url.arrayBuffer, audioBuffer).catch((error) =>
      done(error)
    );
    */
  }

  done();
}

test(
  "speaker",
  (done) => {

    speakerTest(done).catch((error) => {
      done(error);
    });
  },
  1000 * 20
);
