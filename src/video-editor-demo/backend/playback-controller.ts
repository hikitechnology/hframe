import { MathHelpers } from "@/lib/main";

export class PlaybackController {
  private _timestamp: number;
  private _duration: number;
  private _playingState: "paused" | "forwards" | "backwards";
  private prevTime: number;

  constructor(timestamp: number, duration: number) {
    this._timestamp = timestamp;
    this._duration = duration;
    this._playingState = "paused";
    this.prevTime = performance.now();
  }

  loop() {
    if (this._playingState === "forwards") {
      this._timestamp += (performance.now() - this.prevTime) / 1000;
    } else if (this._playingState === "backwards") {
      this._timestamp -= (performance.now() - this.prevTime) / 1000;
    }
    this._timestamp = MathHelpers.clamp(this._timestamp, 0, this._duration);
    this.prevTime = performance.now();
  }

  play() {
    this._playingState = "forwards";
  }

  pause() {
    this._playingState = "paused";
  }

  playBackwards() {
    this._playingState = "backwards";
  }

  get timestamp() {
    return this._timestamp;
  }

  set timestamp(timestamp: number) {
    if (timestamp < 0) {
      console.error(
        `Provided timestamp ${timestamp} is less than 0, setting to 0 instead`,
      );
      timestamp = 0;
    } else if (timestamp > this._duration) {
      console.error(
        `Provided timestamp ${timestamp} is greater than duration ${this._duration}, setting to ${this._duration} instead`,
      );
      timestamp = this._duration;
    }

    this._timestamp = timestamp;
  }

  get duration() {
    return this._duration;
  }

  set duration(duration: number) {
    if (duration < 0) {
      throw new Error("Duration cannot be less than 0");
    }
    this._duration = duration;
  }

  get playingState() {
    return this._playingState;
  }
}
