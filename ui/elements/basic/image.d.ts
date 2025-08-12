import { Painter } from '../../../render/painter';
import { ImageSource } from '../../../utils/image/image-source';
import { Rect } from '../../../utils/shapes/rect';
import { Element } from '../../abstract/element';
export declare class Image extends Element {
    image: ImageSource;
    constructor(image: ImageSource);
    protected update(): void;
    protected render(rect: Rect, painter: Painter): void;
}
