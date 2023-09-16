import * as ConfigComponents  from "./config-old-components.js";

export type Config = {
    id: string;
    admin: ConfigComponents.Admin;
    chat: ConfigComponents.Chat;
    messages: ConfigComponents.ResponsesPerEvent;
    frank: ConfigComponents.Frank;
}

