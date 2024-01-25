import { GetSpeechSkipping } from "./speech-skipping";
import { IRendererParam } from "../sprite-rendering";

export function GetMuteWrapper(speechSkippingWrapper: ReturnType<typeof GetSpeechSkipping>, muteRendererParam: IRendererParam) {
    //* Mute 
    let isMuted = false;
    //let mutedFrame = 0;

    function SetMuted() {
        isMuted = true;
        muteRendererParam.value = muteRendererParam.max;
        //mutedFrame = 1;
        speechSkippingWrapper.SkipAllSpeech();
    }

    function SetUnmuted() {
        isMuted = false;
        //mutedFrame = 0;
        muteRendererParam.value = muteRendererParam.min;
    }
    
    return {
        isMuted,
        SetMuted,
        SetUnmuted
    }
}