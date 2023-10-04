import { Types } from "../index.js";

export function ProcessNicknames(streamEvent: Types.StreamEvent, nicknameMap: { [key: string]: string[] }): Types.StreamEvent {
    const validUsernames = Object.keys(nicknameMap);
    if (validUsernames.includes(streamEvent.username)) {
        const nicknames = nicknameMap[streamEvent.username];
        streamEvent.nickname = nicknames[Math.floor(Math.random() * nicknames.length)] ?? streamEvent.nickname;
    } else {
        streamEvent.nickname == streamEvent.nickname ?? streamEvent.username;
    }
    return streamEvent;
}