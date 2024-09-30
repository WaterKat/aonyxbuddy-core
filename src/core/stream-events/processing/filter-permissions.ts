import { Logger } from "../logger-monad.js";
import { TStreamEvent, EStreamEventType } from "../types.js";

/**
 * This type represents the different permission levels a user can have. A
 * user with a higher permission level can perform actions that a user with a
 * lower permission level cannot.
 */
export enum EPermissionLevel {
  STREAMER = 100,
  MODERATOR = 80,
  VIP = 60,
  SUBSCRIBER = 40,
  FOLLOWER = 20,
  CHATTER = 0,
}

/**
 * This type represents what permissions a user has. If a user is not in the
 * list, they are assumed to have the lowest permission level.
 */
export interface IUserPermissions {
  [username: string]: EPermissionLevel;
}

/**
 * This function returns the permission level of a user. If the user is not in
 * the list, they are assumed to have the lowest permission level.
 * @param username the username of the user
 * @param permissions the permissions object to be checked
 * @returns the permission level of the user
 */
const GetPermissionLevel = (
  username: string,
  permissions: IUserPermissions
): EPermissionLevel =>
  typeof permissions[username] !== "undefined"
    ? permissions[username]
    : EPermissionLevel.CHATTER;

/**
 * This type represents requirement levels needed for a given stream event
 * type. If a user does not have the required permission level, the event is
 * ignored.
 */
export type TProcessorFilterPermissions = Record<
  EStreamEventType,
  EPermissionLevel
>;

/**
 * This type represents the options for the ProcessorFilterPermissions function
 * @param permissionRequirements the permission requirements for each event type
 * @param permissions the permissions of the users
 */
export interface FilterPermissionsOptions {
  permissionRequirements: TProcessorFilterPermissions;
  permissions: IUserPermissions;
}

/**
 * This function returns a function that filters events based on the
 * permissions of the users. If the user does not have the required
 * permission level, the event is ignored.
 * @param options the options that contain the permission requirements and the
 * permissions of the users
 * @returns a function that filters events based on the permissions of the
 * users
 */
export function GetFilterPermissionsFunction(
  options?: FilterPermissionsOptions
): (event: TStreamEvent) => Logger<TStreamEvent> {
  if (!options || !options.permissionRequirements || !options.permissions) {
    return (event: TStreamEvent) => new Logger(event, ["options not defined"]);
  }

  return function (event: TStreamEvent): Logger<TStreamEvent> {
    const requiresPermissions = event.type in options.permissionRequirements;

    if (!requiresPermissions)
      return new Logger(event, ["no permissions required"]);

    //! LEGACY FIX
    let userPermissionLevel: EPermissionLevel;
    if (event.permissions) {
      userPermissionLevel = EPermissionLevel.CHATTER;
      if (event.permissions.streamer) userPermissionLevel = EPermissionLevel.STREAMER;
      else if (event.permissions.moderator) userPermissionLevel = EPermissionLevel.MODERATOR;
      else if (event.permissions.vip) userPermissionLevel = EPermissionLevel.VIP;
      else if (event.permissions.subscriber) userPermissionLevel = EPermissionLevel.SUBSCRIBER;
      else if (event.permissions.follower) userPermissionLevel = EPermissionLevel.FOLLOWER;
      else if (event.permissions.chatter) userPermissionLevel = EPermissionLevel.CHATTER;
    } else {
      userPermissionLevel = GetPermissionLevel(
        event.username,
        options.permissions
      );
    }

    const requiredPermissionLevel = options.permissionRequirements[event.type];

    console.log(userPermissionLevel, 'required:', requiredPermissionLevel);


    if (userPermissionLevel < requiredPermissionLevel) {
      return new Logger(
        {
          tstype: event.tstype,
          username: event.username,
          type: EStreamEventType.IGNORE,
          permissions: event.permissions,
          reason: "permissions",
        },
        [`permissions not met by ${event.username} for ${event.type}`]
      );
    } else {
      return new Logger(event, ["permissions met"]);
    }
  };
}
