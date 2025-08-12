import { Context } from '../../../context';
import { Painter } from '../../../render/painter';
import { Theme } from '../../../style/theme';
import { Pos2D } from '../../../utils/shapes/pos2d';
import { Rect } from '../../../utils/shapes/rect';
import { Element } from '../../abstract/element';
import { Freeform } from '../../layout/freeform';
import { Button } from '../basic/button';
export declare class Menu extends Element {
    private layer;
    private open;
    private justClosed;
    private prevPos;
    private innerLayout;
    private prevContents;
    constructor(layer: Freeform);
    setContents(buttons: Button[]): void;
    openAt(pos: Pos2D): void;
    close(): void;
    protected update(rect: Rect, context: Context): void;
    protected render(rect: Rect, painter: Painter): void;
    updateTheme(theme: Theme): void;
    get minWidth(): number;
    get minHeight(): number;
}
