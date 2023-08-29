

export interface IDeliveryStation<TContents> {
    addRoute: (route: IRoute<TContents>) => boolean;
}

export interface IRoute<TContents> {
    receiveRoll: (roll: IRoll<TContents>) => boolean;
}

export interface IDeliverer<TContents> extends IDeliveryStation<TContents>, IRoute<TContents> { }

export interface IRoll<TContents> {
    path: string;
    contents: TContents;
}

