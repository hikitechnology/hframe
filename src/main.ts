import { HFrame } from "../lib/hframe";
import { Themes } from "../lib/style/themes";
import { Button } from "../lib/ui/elements/button";
import { Text } from "../lib/ui/elements/text";
import { Horizontal } from "../lib/ui/layout/horizontal";
import { Vertical } from "../lib/ui/layout/vertical";
import { Color } from "../lib/utils/color";

const canvas = document.getElementById("app") as HTMLCanvasElement;
const hframe = new HFrame(canvas);
const app = new Vertical();
hframe.setBaseLayout(app);

const menuBar = new Horizontal();

const topHalf = new Horizontal();
const bottomHalf = new Horizontal();

const topLeft = new Vertical();
const topCenter = new Vertical();
const topRight = new Vertical();

app.addSized(menuBar, 20, false);
menuBar.add(new Button("File")).add(new Button("Edit")).add(new Button("View"));
menuBar.styleChildren({
  outline: Color.TRANSPARENT,
  fill: Color.TRANSPARENT,
});

app.addRelative(topHalf, 1, true).addRelative(bottomHalf, 1, true);
topHalf
  .addSized(topLeft, 200, true, 100)
  .addRelative(topCenter, 1, true)
  .addSized(topRight, 200, true, 100);

topLeft.style.padding = 4;
topLeft.add(
  new Text(
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut pretium, nunc sagittis facilisis auctor, metus tortor interdum augue, id rhoncus nunc nibh ut magna. Donec et varius elit, non luctus erat. Aliquam sit amet vehicula risus, et ornare lectus. Mauris sed mi eu mi blandit varius. Nullam non pretium lorem, quis mattis ante. Duis posuere sodales euismod. Quisque eget nisl imperdiet, aliquam sapien nec, rutrum magna. Aliquam erat volutpat. In suscipit non velit sed condimentum. Sed in erat pellentesque, sodales nisi vel, tristique tortor.",
  ),
);
topLeft.add(
  new Button("text", () => {
    if (hframe.getCurrentTheme().isDark) {
      hframe.setTheme(Themes.light);
    } else {
      hframe.setTheme(Themes.dark);
    }
  }),
);
