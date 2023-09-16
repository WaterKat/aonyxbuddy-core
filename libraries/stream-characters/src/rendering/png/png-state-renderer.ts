import { parseGIF, decompressFrames } from 'gifuct-js'

import { AnimationStateManager, IAsyncInitializable } from '../../external.js';

import * as PNGConfig from './ipng-config.js';

import { IRenderer, IRendererInputs } from '../irenderer.js';

export type PNGImageData = {
    delay: number;
    bitmap: ImageBitmap;
}

interface IPNGConfig extends PNGConfig.IPNGConfig { }

export interface IPNGRendererOptions {
    config: IPNGConfig;
}


export class PNGRenderer implements IAsyncInitializable, IRenderer {
    private options: IPNGRendererOptions;
    private enabled: boolean = false;
    constructor(options: IPNGRendererOptions) {
        this.options = options;
    }
    /**/
    private config!: IPNGConfig;
    private externalData!: IRendererInputs;
    private canvas!: HTMLCanvasElement;
    private context!: CanvasRenderingContext2D;
    private stateMachine!: AnimationStateManager;

    private sprites: Record<string, PNGImageData[]> = {};

    async Initialize() {
        if (this.enabled) return;

        this.config = this.options.config;
        this.externalData = { tts: { amplitude: () => { return 0; }, is_playing: () => { return false; } } };

        this.canvas = this.GenerateCanvas(this.config.size.x, this.config.size.y);

        const context = this.canvas.getContext('2d');
        if (context) {
            this.context = context;
            this.context.imageSmoothingEnabled = this.options.config.smoothed;
        }
        else {
            throw ('PNGRenderer: Context does not exist on canvas');
        }

        this.stateMachine = new AnimationStateManager();

        await this.fetchImageData(this.config);
        await this.getStatesFromImageData();

        this.stateMachine.Start();

        this.getTransitions();


        this.enabled = true;
    }

    async RequestAndAwaitState(_targetID: string): Promise<void> {
        await this.stateMachine.RequestAnimation(_targetID);
    }

    GetState() {
        return this.stateMachine.GetState();
    }

    Link(inputs: IRendererInputs) {
        this.externalData = inputs;
    }

    // Utility functions:
    GenerateCanvas(width: number, height: number, parent?: HTMLElement): HTMLCanvasElement {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        parent ? parent.appendChild(canvas) : document.body.appendChild(canvas);
        return canvas;
    }

    async sleep(ms: number) {
        return new Promise<void>(resolve => setTimeout(resolve, ms));
    }

    ResizeWithAspectRatio(width: number, height: number, maxWidth: number, maxHeight: number): { width: number, height: number } {
        const aspectRatio = width / height;
        let ratioWidth: number, ratioHeight: number;

        if (maxWidth / aspectRatio <= maxHeight) {
            ratioWidth = maxWidth;
            ratioHeight = maxWidth / aspectRatio;
        } else {
            ratioWidth = maxHeight * aspectRatio;
            ratioHeight = maxHeight;
        }
        return { width: ratioWidth, height: ratioHeight };
    }

    // Image processing:
    async fetchImageData(_pngConfig: PNGConfig.IPNGConfig) {
        for (const key in _pngConfig.sprites) {
            const spriteArray = _pngConfig.sprites[key];
            const imageData = await this.GetImageBitmap(spriteArray, _pngConfig.defaultFPS)
            this.sprites[key] = imageData;
        }
    }

    async GetImageBitmap(_input: string | string[], _fps: number): Promise<PNGImageData[]> {
        let processedInput = _input;
        if (typeof _input === 'string' && !(processedInput as string).endsWith('.gif')) {
            processedInput = [processedInput as string];
        }

        if (typeof processedInput === 'string') {
            return this.GetGifImageBitmap(processedInput);
        } else {
            return this.GetImageArrayBitmaps(processedInput, _fps);
        }
    }

    async GetGifImageBitmap(_url: string): Promise<PNGImageData[]> {
        const response = await fetch(_url);
        const arrayBuffer = await response.arrayBuffer();
        const gif = parseGIF(arrayBuffer);
        const frames = decompressFrames(gif, true);

        const { imageWidth, imageHeight } = (function () {
            let imageWidth = 0;
            let imageHeight = 0;
            frames.forEach(frame => {
                const frameWidth = frame.dims.width + frame.dims.left;
                const frameHeight = frame.dims.height + frame.dims.top;
                imageWidth = Math.max(imageWidth, frameWidth);
                imageHeight = Math.max(imageHeight, frameHeight);
            });
            return { imageWidth, imageHeight };
        })();

        frames.forEach(frame => {
            const patchLength = imageWidth * imageHeight * 4;
            frame.patch = new Uint8ClampedArray(patchLength);

            for (let i = 0; i < frame.pixels.length; i++) {
                const localX = (i % frame.dims.width);
                const localY = ((i - localX) / frame.dims.width) + frame.dims.top;
                const imageX = localX + frame.dims.left;
                const imageY = localY + frame.dims.top;

                const setIndex = (imageX + (imageY * imageWidth)) * 4;

                const colorIndex = frame.pixels[i];
                const color = frame.colorTable[colorIndex];
                if (frame.transparentIndex !== undefined && colorIndex === frame.transparentIndex) {
                    // Set to fully transparent
                    frame.patch.set([0, 0, 0, 0], setIndex);
                } else {
                    // Set to the color from the color table
                    frame.patch.set([...color, 255], setIndex);
                }
            }
        });

        const imageDatas = frames.map(frame => {
            return new ImageData(
                new Uint8ClampedArray(
                    frame.patch
                ),
                imageWidth,
                imageHeight
            );
        });

        const imageBitmaps = await Promise.all(imageDatas.map(imageData => createImageBitmap(imageData)));

        const PNGImageDatas: PNGImageData[] = [];
        for (let i = 0; i < imageBitmaps.length; i++) {
            PNGImageDatas.push({
                delay: frames[i].delay,
                bitmap: imageBitmaps[i]
            });
        }

        return PNGImageDatas;
    }

    GetImageArrayBitmaps(_urls: string[], _fps: number): Promise<PNGImageData[]> {
        return new Promise((resolve, reject) => {
            const imagePromises: Array<Promise<Response>> = [];
            for (const key in _urls) {
                imagePromises.push(fetch(_urls[key]));
            }
            Promise.all(imagePromises)
                .then(responses => {
                    return Promise.all(responses.map(response => response.blob()));
                })
                .then(blobs => {
                    return Promise.all(blobs.map(blob => createImageBitmap(blob)));
                })
                .then(imageBitmaps => {
                    resolve(imageBitmaps.map(imageBitmap => {
                        return {
                            delay: 1000 / _fps,
                            bitmap: imageBitmap
                        }
                    }));
                })
                .catch(error => { console.log('Image Array Error: ', error); reject(); });
        });
    }



    async getStatesFromImageData() {
        for (const key in this.config.sprites) {
            const imageData = this.sprites[key];

            const animation = {
                id: key,
                animate: async () => {
                    let animating = true;

                    let index = 0;
                    let getIndex: () => number = () => index;
                    let nextIndex: () => void = () => index++;

                    const getCheckedIndex = () => Math.min(Math.max(0, Math.round(getIndex())), imageData.length - 1);
                    const getFrame = () => imageData[getCheckedIndex()];
                    let getFrameDelay = () => getFrame().delay;

                    if (key.endsWith('talking')) {
                        //                        console.log('created talking');
                        getIndex = () => index < imageData.length ? this.externalData.tts.amplitude() * imageData.length - 1 : index;
                        nextIndex = () => { if (!this.externalData.tts.is_playing()) { index = imageData.length; } };
                        getFrameDelay = () => 1000 / 24;
                    }

                    while (animating) {
                        const frame = getFrame();
                        if (!frame || !frame.bitmap) {
                            console.error('no bitmap', key, getIndex(), nextIndex(),);
                        }
                        //                        console.log('ampl', this.externalData.tts.amplitude());

                        const renderPromise = new Promise<void>(resolve => {
                            const animate = async () => {
                                const { width, height } = this.ResizeWithAspectRatio(
                                    frame.bitmap.width, frame.bitmap.height, this.config.size.x, this.config.size.y
                                );

                                this.context?.clearRect(0, 0, this.config.size.x, this.config.size.y);
                                this.context?.drawImage(frame.bitmap, 0, 0, width, height);
                                resolve();
                            };
                            requestAnimationFrame(animate);
                        });

                        const frameDelayPromise = new Promise(resolve => setTimeout(resolve, getFrameDelay()));

                        await Promise.all([
                            renderPromise,
                            frameDelayPromise
                        ]);

                        nextIndex();

                        if (getIndex() >= imageData.length) {
                            animating = false;
                        }
                    }
                }
            }

            this.stateMachine.addState(animation);
        }
    }

    getTransitions() {
        for (const transitionKey in this.config.transitions) {
            for (const key in this.config.transitions[transitionKey]) {
                const transition = this.config.transitions[transitionKey][key];
                if (typeof transition[2] !== 'undefined') {
                    this.stateMachine.addTransition(transitionKey, transition[0], transition[1], transition[2]);
                } else if (typeof transition[1] !== 'undefined') {
                    this.stateMachine.addTransition(transitionKey, transition[0], transition[1]);
                } else {
                    this.stateMachine.addTransition(transitionKey, transition[0]);
                }
            }
        }
    }

    // GetImageBitmap functionality here

    // Additional methods for getting GIFs and Image array from URLs
}
