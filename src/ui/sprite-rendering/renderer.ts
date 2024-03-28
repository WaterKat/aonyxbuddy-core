
interface IRendererInfo {
    name: string,
    range : {
        min: number,
        max: number
    },
    bitmaps: ImageBitmap[]
}

interface IRendererParam {
    name: string,
    value: number
}

interface IRendererOptions { 
    canvas: HTMLCanvasElement;
}

export function CreateRenderer(options: IRendererOptions) {

}

interface IRenderOptions {
    canvas: HTMLCanvasElement,
    renderInfos: IRendererInfo[];
    params: IRendererParam[]
}

export function RenderParams(options: IRenderOptions) {
    
}
