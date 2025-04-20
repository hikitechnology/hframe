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
const popoutContainer = new Horizontal();
const main = new Vertical();
const topHalf = new Horizontal();
const bottomHalf = new Horizontal();

app.addSized(menuBar, 20).add(popoutContainer);
popoutContainer.add(main);
main.addRelative(topHalf, 1, true).addRelative(bottomHalf, 1, true);

// TOP HALF
const leftSidebar = new Vertical();
const topCenter = new Vertical();
const topRight = new Vertical();

topHalf
  .addSized(leftSidebar, 250, true)
  .add(topCenter)
  .addSized(topRight, 250, true, 100);

// TOP LEFT
const topLeftHeader = new Horizontal();
const topLeftBody = new VerticalScroll();
leftSidebar.addSized(topLeftHeader, 30).add(topLeftBody);

// TOP LEFT HEADER
const layoutButton = new Button("➡️");
layoutButton.style.fontSize = 20;
layoutButton.onClick = () => {
  layoutButton.text = layoutButton.text === "⬇️" ? "➡️" : "⬇️";
  if (topHalf.includes(leftSidebar)) {
    const size = topHalf.getRect(leftSidebar).width;
    topHalf.remove(leftSidebar);
    popoutContainer.insertSized(0, leftSidebar, size, true, 100);
  } else {
    const size = popoutContainer.getRect(leftSidebar).width;
    popoutContainer.remove(leftSidebar);
    topHalf.insertSized(0, leftSidebar, size, true, 100);
  }
};

const panelLabel = new Text("Sidebar");
panelLabel.style = {
  textCenteredV: true,
  fontSize: 16,
  textWrap: false,
};

topLeftHeader.addSized(layoutButton, 30).gap(6).add(panelLabel);
