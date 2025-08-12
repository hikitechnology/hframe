import { ImageSource } from './image-source';
export declare class URIImageSource extends ImageSource {
    private static _fallbackImage;
    private image;
    constructor(uri: string);
    getImage(): HTMLImageElement;
    get width(): number;
    get height(): number;
    static get fallbackImage(): HTMLImageElement;
}
