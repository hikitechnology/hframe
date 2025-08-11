import { Button, Color, HFrame, Horizontal, Text, Vertical } from "@/lib/main";
import { App } from "./video-editor-demo/app";

const canvas = document.getElementById("app") as HTMLCanvasElement;

const hframe = new HFrame(canvas);
new App(hframe);

const overlay = new Vertical();
overlay.style.fill = new Color(0, 0, 0, 0.2);
overlay.style.outline = Color.TRANSPARENT;

const overlayInner = new Horizontal();
overlayInner.style.fill = Color.TRANSPARENT;
overlayInner.style.outline = Color.TRANSPARENT;
overlay.gap().addSized(overlayInner, 330).gap();
const textPopup = new Vertical();
textPopup.style.rounding = 10;
textPopup.style.padding = 10;
overlayInner.gap().addSized(textPopup, 300).gap();

textPopup
  .add(new Text("Welcome to the HFrame demo!", 24))
  .gap(6)
  .add(
    new Text(
      "HFrame is an experimental JS/TS framework that renders to a canvas instead of the DOM.",
      13,
    ),
  )
  .gap(6)
  .add(
    new Text(
      "Interactive webapps are often limited by the browser's HTML tree parsing - for deeply nested structures, the browser may recalculate the size and position of hundreds of elements at a time. HFrame avoids intensive DOM manipulation by rendering to a canvas instead of HTML elements.",
      13,
    ),
  )
  .gap(6)
  .add(
    new Text(
      "As an example of what's possible in HFrame, check out this video editor interface. Remember, everything you see is rendered without the DOM, in a single canavs element!",
      13,
    ),
  );

const bottomButtons = new Horizontal(false);
bottomButtons
  .addRelative(
    new Button("View on GitHub", () => {
      window.open("https://google.com", "_blank")?.focus();
    }),
    1,
  )
  .gap(6)
  .addRelative(
    new Button("Close overlay", () => {
      hframe.removeLayer(overlay);
    }),
    1,
  );

textPopup.gap().addSized(bottomButtons, 30);

hframe.addLayer(overlay);
