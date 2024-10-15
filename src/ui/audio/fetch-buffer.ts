import { TStreamElementsVoiceID } from "./text-to-speech.js";
import { TFilterAudioBufferOptions, FilterAudioBuffer } from "./text-to-speech.js";

/**
 * Will generate an audio buffer that speaks the text given using the voice
 * model specified by the voiceID. The audio buffer will be normalized to the
 * loudest point in the buffer.
 * @param text the text to be be generated as speech
 * @param voiceID the voice identifier for stream elements
 * @param audioContext the audio context to use for decoding the audio buffer
 * @returns a normalized audio buffer that contains the speech of the text
 * provided. If the request fails, undefined will be returned instead.
 */
export async function GetStreamElementsVoiceAudioBuffer(
  audioContext: AudioContext,
  text: string,
  voiceID: TStreamElementsVoiceID,
  options: TFilterAudioBufferOptions = {
    normalize: true,
    downmix_to_mono: true,
  }
): Promise<AudioBuffer> {
  if (!text || text.length < 1) throw new Error("Text must be provided");

  const url: string =
    `https://api.streamelements.com/kappa/v2/speech` +
    `?voice=${voiceID}` +
    `&text=${encodeURIComponent(text.trim())}`;

  return GetAudioFromURL(audioContext, url, options);
}

/**
 * Will generate an audio buffer from a URL and normalize it to the loudest
 * point in the buffer
 * @param audioContext the audio context to use for decoding the audio buffer
 * @param url the url to the audio file
 * @param normalize optional, if true the audio buffer will be normalized to
 * the loudest point in the buffer
 * @returns the audio buffer from the URL provided
 */
export async function GetAudioFromURL(
  audioContext: AudioContext,
  url: string,
  options?: TFilterAudioBufferOptions
): Promise<AudioBuffer> {
  const response: Response = await fetch(url);
  const arrayBuffer: ArrayBuffer = await response.arrayBuffer();
  const audioBuffer: AudioBuffer = await audioContext.decodeAudioData(
    arrayBuffer
  );

  if (options) {
    return FilterAudioBuffer(audioContext, audioBuffer, options);
  }
  return audioBuffer;
}



