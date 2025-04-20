import { HFrame } from "../lib/hframe";
import { Themes } from "../lib/style/themes";
import { Button } from "../lib/ui/elements/basic/button";
import { Image } from "../lib/ui/elements/basic/image";
import { Slider } from "../lib/ui/elements/basic/slider";
import { Text } from "../lib/ui/elements/basic/text";
import { Menu } from "../lib/ui/elements/compound/menu";
import { Freeform } from "../lib/ui/layout/freeform";
import { Horizontal } from "../lib/ui/layout/horizontal";
import { Vertical } from "../lib/ui/layout/vertical";
import { VerticalScroll } from "../lib/ui/layout/vertical-scroll";
import { Color } from "../lib/utils/color";
import { URIImageSource } from "../lib/utils/image/uri-image-source";

const canvas = document.getElementById("app") as HTMLCanvasElement;
const hframe = new HFrame(canvas);
const app = new Vertical();
hframe.setBaseLayout(app);

const menuBar = new Horizontal();

const topHalf = new Horizontal();
const bottomHalf = new Horizontal();

const topLeft = new VerticalScroll();
const topCenter = new Vertical();
const topRight = new Vertical();

app.addSized(menuBar, 20, false);
const fileButton = new Button("File");
const editButton = new Button("Edit");
const viewButton = new Button("View");
menuBar.add(fileButton).add(editButton).add(viewButton);
menuBar.styleChildren({
  outline: Color.TRANSPARENT,
  fill: Color.TRANSPARENT,
});

app.addRelative(topHalf, 1, true, 0).addRelative(bottomHalf, 1, true, 0);
topHalf
  .addSized(topLeft, 200, true, 100)
  .addRelative(topCenter, 1, true)
  .addSized(topRight, 200, true, 100);

topLeft.style.padding = 4;
topLeft
  .add(
    new Button("text", () => {
      if (hframe.getCurrentTheme().isDark) {
        hframe.setTheme(Themes.light);
      } else {
        hframe.setTheme(Themes.dark);
      }
    }),
  )
  .gap(4);

const text = new Text(
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut pretium, nunc sagittis facilisis auctor, metus tortor interdum augue, id rhoncus nunc nibh ut magna. Donec et varius elit, non luctus erat. Aliquam sit amet vehicula risus, et ornare lectus. Mauris sed mi eu mi blandit varius. Nullam non pretium lorem, quis mattis ante. Duis posuere sodales euismod. Quisque eget nisl imperdiet, aliquam sapien nec, rutrum magna. Aliquam erat volutpat. In suscipit non velit sed condimentum. Sed in erat pellentesque, sodales nisi vel, tristique tortor.",
);
topLeft.add(text);
const button = new Button("text", () => {
  if (hframe.getCurrentTheme().isDark) {
    hframe.setTheme(Themes.light);
  } else {
    hframe.setTheme(Themes.dark);
  }
});
topLeft.gap(4).add(button);

const freeform = new Freeform();
freeform.allowPassthrough = true;
hframe.addLayer(freeform);

const menu = new Menu(freeform, [
  new Button("Save"),
  new Button("Settings"),
  new Button("Quit"),
]);

fileButton.onClick = () => {
  const buttonPos = menuBar.getRect(fileButton).bottomLeft;
  menu.openAt(buttonPos.x, buttonPos.y);
};
editButton.onClick = () => {
  const buttonPos = menuBar.getRect(editButton).bottomLeft;
  menu.openAt(buttonPos.x, buttonPos.y);
};

const image = new URIImageSource(
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTc9APxkj0xClmrU3PpMZglHQkx446nQPG6lA&s",
);
topCenter.add(new Image(image));

const cslider = new Horizontal();
cslider.style.outline = Color.TRANSPARENT;
cslider.style.fill = Color.TRANSPARENT;
const label = new Text("0", 14);
cslider
  .add(
    new Slider(-10, 10, 0, 0.1, (value) => {
      label.text = value.toString();
    }),
  )
  .addSized(label, 24)
  .gap(6);
topRight.addSized(cslider, 20);
topRight.style.padding = 4;
topRight.add(new Text("test"));

label.style.textCentered = true;

// topRight.style.padding = 4;
// topRight.add(new Slider());
// topRight.gap(4);
// topRight.add(new Button("asdf"));
