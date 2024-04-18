# AonyxBuddy

## AonyxLimited
### By WaterKat

AonyxBuddy is a plugin for StreamElements that takes user-generated responses to events in a stream. It allows users to interact with their Twitch channels in new ways, as well as serve as a management tool for new streamers.

## Features

- AonyxBuddy will respond to Twitch events with provided responses:
  - New Follows
  - New Subscribers
  - Gifted Subs
  - Cheer Events
  - Raid Events
  - First Chat of the Stream (Welcome)
- AonyxBuddy can also be interacted with commands:
  - AonyxBuddy will respond to its given name or "aonyxbuddy".
  - For example, `!aonyxbuddy say hello world!` can be used as well as `!sol say hello world!` if "sol" has been assigned as its name.
  - Commands:
    - "say": will speak the text following the command.
        - it is possible to assign aliases in the configuration, allowing commands such as ```!: hello world!```
        to work properly as an alias for ```!aonyxbuddy say hello world!```
    - "skip" followed by "$args": will have different behaviors:
      - none (no arguments): will cut off the current spoken message, or if none is being spoken, will skip the next incoming speech event.
      - number (a valid integer above 0): will cut off the current spoken message and will add the skip count.
      - "all": will cut off the current spoken message and will skip all queued messages.

---

&copy; 2024 AonyxLimited. All rights reserved.
