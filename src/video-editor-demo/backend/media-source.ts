export class MediaSource {
  constructor(
    public name: string,
    public fullDuration: number,
  ) {}

  static fromFile(file: File) {
    return new MediaSource(file.name, 30);
  }
}
