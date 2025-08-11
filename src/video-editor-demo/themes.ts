import { Color, DirectionalLayout, ThemeBuilder, Themes } from "@/lib/main";
import { Track } from "./ui/panels/timeline/track/track";
import { Playhead } from "./ui/panels/timeline/playhead";
import { TrackContainer } from "./ui/panels/timeline/track-container";
import { Timeline } from "./ui/panels/timeline/timeline";
import { FileItem } from "./ui/widgets/media-pool/file-item";

export const HVThemes = {
  light: ThemeBuilder.extend(Themes.light)
    .setStyleFor(Track, {
      fill: Color.gray(220),
      outline: Color.gray(180),
    })
    .setStyleFor(Playhead, {
      fill: Color.gray(220),
      outline: Themes.light.getStyleFor(DirectionalLayout).outline,
      textColor: Color.gray(100),
    })
    .setStyleFor(TrackContainer, {
      outline: Themes.light.getStyleFor(DirectionalLayout).outline,
    })
    .setStyleFor(Timeline, {
      outline: Themes.light.getStyleFor(DirectionalLayout).outline,
    })
    .setStyleFor(FileItem, {
      fill: Themes.light.getStyleFor(DirectionalLayout).fill,
    }),
  dark: ThemeBuilder.extend(Themes.dark)
    .setStyleFor(Track, {
      fill: Color.gray(40),
      outline: Color.gray(60),
    })
    .setStyleFor(Playhead, {
      outline: Themes.dark.getStyleFor(DirectionalLayout).outline,
      fill: Color.gray(40),
      textColor: Color.gray(140),
    })
    .setStyleFor(TrackContainer, {
      outline: Themes.dark.getStyleFor(DirectionalLayout).outline,
    })
    .setStyleFor(Timeline, {
      outline: Themes.dark.getStyleFor(DirectionalLayout).outline,
    })
    .setStyleFor(FileItem, {
      fill: Themes.dark.getStyleFor(DirectionalLayout).fill,
    }),
};
