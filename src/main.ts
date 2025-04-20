import { HFrame } from "../lib/hframe";
import { Horizontal } from "../lib/ui/layout/horizontal";
import { Vertical } from "../lib/ui/layout/vertical";

const canvas = document.getElementById("app") as HTMLCanvasElement;
const hframe = new HFrame(canvas);

const app = new Vertical();
hframe.addLayer(app);

const menuBar = new Horizontal();
const topHalf = new Horizontal();
const bottomHalf = new Horizontal();

app
  .addSized(menuBar, 20)
  .addRelative(topHalf, 1, true)
  .addRelative(bottomHalf, 1, true);

const topLeft = new Vertical();
const topCenter = new Vertical();
const topRight = new Vertical();

topHalf
  .addSized(topLeft, 250, true, 100)
  .addRelative(topCenter, 1)
  .addSized(topRight, 250, true, 100);
