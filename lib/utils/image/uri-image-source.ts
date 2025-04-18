import { ImageSource } from "./image-source";

export class URIImageSource extends ImageSource {
  private static _fallbackImage: HTMLImageElement | null = null;
  private image: HTMLImageElement;

  constructor(uri: string) {
    super();
    this.image = URIImageSource.fallbackImage;
    const image = new Image();
    image.src = uri;
    image.onload = () => {
      this.image = image;
    };
    image.onerror = () => {
      console.error(`Failed to load image from ${uri}`);
    };
  }

  getImage(): HTMLImageElement {
    return this.image;
  }

  get width() {
    return this.image.width;
  }

  get height() {
    return this.image.height;
  }

  static get fallbackImage(): HTMLImageElement {
    if (!this._fallbackImage) {
      // create transparent 1x1 placeholder fallback image
      const canvas = document.createElement("canvas");
      canvas.width = 1;
      canvas.height = 1;
      const ctx = canvas.getContext("2d")!;
      ctx.clearRect(0, 0, 1, 1);
      const dataUrl = canvas.toDataURL("image/png");
      this._fallbackImage = new Image();
      this._fallbackImage.src = dataUrl;
    }

    return this._fallbackImage;
  }
}
