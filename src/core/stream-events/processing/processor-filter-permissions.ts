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
    CHATTER = 0
}

/**
 * This type represents what permissions a user has. If a user is not in the
 * list, they are assumed to have the lowest permission level.
 */
export interface IUserPermissions {
    [username: string]: EPermissionLevel
};

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
): EPermissionLevel => (
    typeof permissions[username] !== "undefined"
        ? permissions[username]
        : EPermissionLevel.CHATTER
);

/**
 * This type represents requirement levels needed for a given stream event 
 * type. If a user does not have the required permission level, the event is
 * ignored. 
 */
export type TProcessorFilterPermissions =
    Record<EStreamEventType, EPermissionLevel>

/**
 * This type represents the options for the ProcessorFilterPermissions function
 * @param permissionRequirements the permission requirements for each event type
 * @param permissions the permissions of the users
 */
export interface IProcessFilterPermissionsOptions {
    permissionRequirements: TProcessorFilterPermissions,
    permissions: IUserPermissions
}

/**
 * This function filters out events that require permissions that the user does
 * not have. If the user does not have the required permission level, the event
 * is ignored.
 * @param event the event to be processed 
 * @param options the options that contain the permission requirements and the
 * permissions of the users
 * @returns the event if permissions are met, otherwise an ignored event
 */
export const ProcessFilterPermissions = (
    event: TStreamEvent,
    options: IProcessFilterPermissionsOptions
): TStreamEvent => {
    const requiresPermissions = event.type in options.permissionRequirements;
    if (!requiresPermissions)
        return event;
    const userPermissionLevel = GetPermissionLevel(
        event.username,
        options.permissions
    );
    const requiredPermissionLevel = options.permissionRequirements[event.type];
    if (userPermissionLevel < requiredPermissionLevel) {
        return <TStreamEvent>{
            tstype: event.tstype,
            username: event.username,
            type: EStreamEventType.IGNORE,
            reason: 'permissions'
        }
    } else {
        return event;
    }
}
