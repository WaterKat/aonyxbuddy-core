import { IAsyncInitializable } from './initializable.js';

export class AsyncClassInitializer{
    public static async create<T extends IAsyncInitializable, TOptions>(type : new (options : TOptions) => T, options : TOptions) : Promise<T | undefined> {
        const instance = new type(options);
        await instance.Initialize();
        return instance;
    }
}
