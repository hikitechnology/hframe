import { CompoundElement } from "@/lib/main";

export abstract class Widget extends CompoundElement {
  abstract get name(): string;
}
