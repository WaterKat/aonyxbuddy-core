import { IWSAuthData, IWSPacketData, IWSResponse, IWSType } from './types.js';

export function ParseStringToWSType(packetString: string): IWSType {
  const errorPacket: IWSPacketData = {
    discriminator: 'IWSPacketData',
    id: 'null',
    type: 'null',
    data: null,
  };

  let json: any;
  try {
    json = JSON.parse(packetString);
  } catch (e) {
    console.error(e);
    return errorPacket;
  }

  if (typeof json.type_discriminator !== 'string') {
    console.error('Not an IWSType');
    return errorPacket;
  }

  switch (json.type_discriminator) {
    case 'IWSPacketData':
      return json as IWSPacketData;
    case 'IWSAuthData':
      return json as IWSAuthData;
    case 'IWSResponse':
      return json as IWSResponse;
    default:
      console.error('Not an IWSType');
      return errorPacket;
  }
}
