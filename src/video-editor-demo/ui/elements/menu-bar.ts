import {
  Button,
  Color,
  CompoundElement,
  Freeform,
  Horizontal,
  Menu,
} from "@/lib/main";

export class MenuBar extends CompoundElement {
  constructor(
    menuLayer: Freeform,
    entries: Record<string, Record<string, (menu: Menu) => void>>,
  ) {
    super(new Horizontal());

    const menu = new Menu(menuLayer);
    for (const [label, items] of Object.entries(entries)) {
      const contents: Button[] = [];
      for (const [itemLabel, operation] of Object.entries(items)) {
        contents.push(
          new Button(itemLabel, () => {
            operation(menu);
          }),
        );
      }
      const button = new Button(label, () => {
        menu.setContents(contents);
        menu.openAt(this.innerLayout.getRect(button).bottomLeft);
      });
      this.innerLayout.add(button);
      button.style.outline = Color.TRANSPARENT;
      button.style.fill = Color.TRANSPARENT;
    }
  }
}
