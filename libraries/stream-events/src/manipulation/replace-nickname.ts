import { Types } from "../index.js";

export function ProcessNicknames(streamEvent: Types.StreamEvent, nicknameMap: { [key: string]: string[] }): Types.StreamEvent {
    const validUsernames = Object.keys(nicknameMap);
    if (validUsernames.includes(streamEvent.username)) {
        const nicknames = nicknameMap[streamEvent.username];
        streamEvent.nickname = streamEvent.nickname ?? nicknames[Math.floor(Math.random() * nicknames.length)];
    } else {
        streamEvent.nickname == streamEvent.nickname ?? '';
    }
    return streamEvent;
}