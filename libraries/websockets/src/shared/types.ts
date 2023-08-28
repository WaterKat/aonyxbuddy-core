interface IDiscriminatedInterface {
  discriminator: string;
}

export interface IWSAuthData extends IDiscriminatedInterface {
  discriminator: 'IWSAuthData';
  token: string;
}

export interface IWSPacketData extends IDiscriminatedInterface {
  discriminator: 'IWSPacketData';
  id: string;
  type: string;
  data: any;
}

export interface IWSResponse extends IDiscriminatedInterface {
  discriminator: 'IWSReponse';
  id: string;
  code: number;
  message: string;
}

export type IWSType = IWSAuthData | IWSPacketData | IWSResponse;
