//import { FetchAndPopulateBuffers, ParseTextToSpeechText, TTextToSpeechOptions } from "./text-to-speech.js";

/*

test("TTS URLs", () => {
  RenderDefaults

  const options: TTextToSpeechOptions = {
    voiceID: "Brian",
    commandIdentifier: "$",
    availableVoices: ["Brian", "Amy"],
    soundClipURLs: {
      TEST: "https://example.com/test.mp3",
      SOUND: "https://example.com/sound.mp3",
    },
  };

  const message =
    "Hello, world! $Amy This is a test. $Brian and now for a $SOUND testing $TEST";
  const urls = ParseTextToSpeechText(message, options);
  console.log(urls);
  
  FetchAndPopulateBuffers(urls).then(() => {

  });
});

*/

/*
import puppeteer from "puppeteer";
import express from "express";

function TestAudioInBrowser(){
  const options: TTextToSpeechOptions = {
    voiceID: "Brian",
    commandIdentifier: "$",
    availableVoices: ["Brian", "Amy"],
    soundClipURLs: {
      TEST: "https://example.com/test.mp3",
      SOUND: "https://example.com/sound.mp3",
    },
  };

  const message =
    "Hello, world! $Amy This is a test. $Brian and now for a $SOUND testing $TEST";
  const urls = ParseTextToSpeechText(message, options);
  console.log(urls);
  
  FetchAndPopulateBuffers(urls).then(() => {
  });
}

test("TTS URLs", (done) => {
  
  console.log("TestAudioInBrowser", TestAudioInBrowser.toString());

  done();
  return;
  (async () => {
    const app = express();
    app.get("/", (_req, res) => {
      res.send(`<script>console.log("Hello World!");</script>`);
    });
    const server = app.listen(8080);

    const browser = await puppeteer.launch({
      args: ["--use-fake-ui-for-media-stream"],
      ignoreDefaultArgs: ["--mute-audio"],
    });
    const page = await browser.newPage();
    await page.goto("http://localhost:8080/");
    await page.setViewport({ width: 1080, height: 1024 });

    await new Promise((resolve) => setTimeout(resolve, 5000));

    await browser.close();
    server.close();
    done();
  })();
});
*/