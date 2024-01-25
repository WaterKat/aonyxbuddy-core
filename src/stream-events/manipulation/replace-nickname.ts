//import { Types } from "../index.js";
import { AonyxBuddyStreamEvent } from "@aonyxbuddy/stream-events";

export function ProcessNicknames(streamEvent: AonyxBuddyStreamEvent, nicknameMap: { [key: string]: string[] }): AonyxBuddyStreamEvent {
    const validUsernames = Object.keys(nicknameMap);
    if (validUsernames.includes(streamEvent.username)) {
        const nicknames = nicknameMap[streamEvent.username];
        streamEvent.nickname = nicknames[Math.floor(Math.random() * nicknames.length)] ?? streamEvent.nickname;
    } else {
        streamEvent.nickname == streamEvent.nickname ?? streamEvent.username;
    }
    return streamEvent;
}