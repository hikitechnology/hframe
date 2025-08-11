import {
  Button,
  CompoundElement,
  Horizontal,
  Text,
  Vertical,
} from "@/lib/main";
import { Icons } from "../../icons";
import {
  ICON_FONT,
  MIN_SIDEBAR_WIDTH,
  SIDEBAR_HEADER_FONT_SIZE,
  SIDEBAR_HEADER_HEIGHT,
  SIDEBAR_HEADER_PADDING,
} from "../../constants";
import { Widget } from "../abstract/widget";

export class Sidebar extends CompoundElement {
  private widgets: Widget[] = [];
  private widgetHeaders: Text[] = [];

  constructor(
    private collapsedLayout: Horizontal,
    private expandedLayout: Horizontal,
    private isLeft: boolean,
    private isExpanded: boolean,
  ) {
    super(new Vertical());

    const topHeader = new Horizontal();
    topHeader.style.padding = SIDEBAR_HEADER_PADDING;
    const headerLabel = new Text();
    headerLabel.style = {
      textCenteredV: true,
      fontSize: SIDEBAR_HEADER_FONT_SIZE,
      textWrap: false,
    };

    this.widgetHeaders.push(headerLabel);

    const contractedIcon = isLeft ? Icons.ChevronRight : Icons.ChevronLeft;
    const layoutButton = new Button(
      isExpanded ? Icons.ChevronDown : contractedIcon,
      () => {
        this.toggleLayout();
        layoutButton.text = this.isExpanded
          ? Icons.ChevronDown
          : contractedIcon;
      },
    );
    layoutButton.style.font = ICON_FONT;
    layoutButton.style.fontSize = 16;

    if (isLeft) {
      topHeader
        .addSized(
          layoutButton,
          SIDEBAR_HEADER_HEIGHT - 2 * SIDEBAR_HEADER_PADDING,
        )
        .gap(SIDEBAR_HEADER_PADDING * 2)
        .add(headerLabel);
    } else {
      topHeader
        .gap(SIDEBAR_HEADER_PADDING)
        .add(headerLabel)
        .gap()
        .addSized(
          layoutButton,
          SIDEBAR_HEADER_HEIGHT - 2 * SIDEBAR_HEADER_PADDING,
        );
    }

    this.innerLayout.addSized(topHeader, SIDEBAR_HEADER_HEIGHT);
  }

  toggleLayout() {
    if (this.isExpanded) {
      const size = this.expandedLayout.getRect(this).width;
      this.expandedLayout.remove(this);
      if (this.isLeft) {
        this.collapsedLayout.insertSized(
          0,
          this,
          size,
          true,
          MIN_SIDEBAR_WIDTH,
        );
      } else {
        this.collapsedLayout.addSized(this, size, true, MIN_SIDEBAR_WIDTH);
      }
    } else {
      const size = this.collapsedLayout.getRect(this).width;
      this.collapsedLayout.remove(this);
      if (this.isLeft) {
        this.expandedLayout.insertSized(0, this, size, true, MIN_SIDEBAR_WIDTH);
      } else {
        this.expandedLayout.addSized(this, size, true, MIN_SIDEBAR_WIDTH);
      }
    }

    this.isExpanded = !this.isExpanded;
  }

  addWidget(widget: Widget) {
    this.widgets.push(widget);
    const existingHeader = this.widgetHeaders[this.widgets.indexOf(widget)];

    const resizeContainer = new Vertical();

    if (existingHeader) {
      existingHeader.text = widget.name;
    } else {
      const newHeader = new Text(widget.name);
      newHeader.style = {
        textCenteredV: true,
        fontSize: SIDEBAR_HEADER_FONT_SIZE,
        textWrap: false,
      };
      this.widgetHeaders.push(newHeader);

      const headerContainer = new Horizontal();
      headerContainer.style.padding = SIDEBAR_HEADER_PADDING;
      headerContainer.gap(SIDEBAR_HEADER_PADDING).add(newHeader);

      resizeContainer.addSized(headerContainer, SIDEBAR_HEADER_HEIGHT);
    }

    resizeContainer.add(widget);
    this.innerLayout.addRelative(resizeContainer, 1, true);
  }
}
