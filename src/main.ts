import { HFrame } from "../lib/hframe";
import { Button } from "../lib/ui/elements/basic/button";
import { Text } from "../lib/ui/elements/basic/text";
import { Horizontal } from "../lib/ui/layout/horizontal";
import { Vertical } from "../lib/ui/layout/vertical";
import { VerticalScroll } from "../lib/ui/layout/vertical-scroll";

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

// TOP HALF
const topLeft = new Vertical();
const topCenter = new Vertical();
const topRight = new Vertical();

topHalf
  .addSized(topLeft, 250, true, 100)
  .add(topCenter)
  .addSized(topRight, 250, true, 100);

// TOP LEFT
const topLeftHeader = new Horizontal();
const topLeftBody = new VerticalScroll();
topLeft.addSized(topLeftHeader, 30).add(topLeftBody);

// TOP LEFT HEADER

const button = new Button("BUTTON");
topLeftBody.addSized(button, 50);
button.style.textCenteredV = true;
button.style.textCenteredH = true;
const text = new Text(
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin nec odio at nulla placerat tempor eu eget velit. Maecenas eget risus sed mauris aliquet egestas a eu justo. Phasellus a turpis at lorem dictum ultrices id sit amet justo. Nullam eleifend, libero sollicitudin fringilla interdum, tellus sem congue purus, quis luctus lorem magna id mi. Praesent placerat mi a augue luctus tempor. Nam quis hendrerit nulla. Mauris et eros in lectus sollicitudin vestibulum at eu urna. Morbi sit amet elit non elit ultrices semper. Etiam euismod egestas massa, nec ultricies mauris fermentum ut. Curabitur varius eu quam quis vehicula. Pellentesque mollis vulputate lorem ut bibendum. Suspendisse pharetra pharetra pharetra. Sed aliquam orci eu dui eleifend suscipit.",
);
topLeftBody.addSized(text, 500);
text.style.textCenteredH = true;
text.style.textCenteredV = true;

// const layoutButton = new Button("⬇️");
// layoutButton.style.fontSize = 20;

// const panelLabel = new Text("Media Pool");
// panelLabel.style.textCentered = true;
// panelLabel.style.fontSize = 16;
//
// topLeftHeader.addSized(layoutButton, 30).gap(4).addSized(panelLabel, 100);
