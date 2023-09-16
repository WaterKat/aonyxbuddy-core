export type PNGRendering = {
    GetInstance: (_canvas: HTMLCanvasElement, _options: PNGRenderOptions) => PNGRenderer
};

export type PNGRenderer = {
    requestAnimation: () => void;
    update_amplitude: (_amplitude: number) => void;
};

export type PNGRenderOptions = {
    fps : number,
    sources: {
        idle: Array<string> | string;
        talking: Array<string> | string;
    }
    size?: {
        x: number;
        y: number;
    }
};

/*
export type PNGSprites = {
    idle: 
    talking : Array<HTMLImageElement>;
}
*/

export type PNGImageData = {
    delay: number;
    bitmap: ImageBitmap;
}
