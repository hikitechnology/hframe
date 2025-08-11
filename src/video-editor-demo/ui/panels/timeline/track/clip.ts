import { MediaSource } from "../../../../backend/media-source";

export type Clip = {
  in: number;
  out: number;
  mediaSource: MediaSource;
};
