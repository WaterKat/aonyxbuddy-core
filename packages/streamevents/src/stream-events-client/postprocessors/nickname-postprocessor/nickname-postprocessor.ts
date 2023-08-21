import { StreamEvent } from "../../../stream-events/stream-event";
import { IEventPostProcessor } from "../../ievent-handlers";
import { INicknamePostProcessorOptions } from "./inickname-post-processor-options";

export class NicknamePostProcessor implements IEventPostProcessor {
    options : INicknamePostProcessorOptions = {};

    constructor(options : INicknamePostProcessorOptions){
        this.options = options;
    }

    process(_event: StreamEvent) : StreamEvent {
        if (_event.username in this.options){
            const nicknames = this.options[_event.username];
            _event.nickname = _event.nickname ?? nicknames[Math.floor(Math.random() * nicknames.length)];
        }
        return _event;
    }
}
