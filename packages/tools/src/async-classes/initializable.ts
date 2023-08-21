export interface IAsyncInitializable {
    Initialize : () => Promise<void>;
}
