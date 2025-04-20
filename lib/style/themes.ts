import { DirectionalLayout } from "../ui/abstract/directional-layout";
import { KeyboardInput } from "../ui/abstract/keyboard-input";
import { Button } from "../ui/elements/basic/button";
import { Color } from "../utils/color";
import { ThemeBuilder } from "./theme-builder";

export const Themes = {
  light: ThemeBuilder.setDefault({
    padding: 0,
    fill: Color.TRANSPARENT,
    outline: Color.TRANSPARENT,
    textColor: Color.BLACK,
    rounding: 0,
    fontSize: 13,
    textCentered: false,
    lineSpacing: 1.1,
    scrollbarBackground: Color.gray(200),
    scrollbarColor: Color.gray(50),
    scrollbarOutline: Color.gray(144),
    sliderBackground: Color.gray(144),
    sliderDotFill: Color.gray(60),
  })
    .setStyleFor(DirectionalLayout, {
      fill: Color.gray(234),
      outline: Color.gray(144),
    })
    .setStyleFor(Button, {
      padding: 4,
      fill: Color.gray(211),
      outline: Color.gray(144),
      rounding: 3,
      textCentered: true,
    })
    .setStyleFor(KeyboardInput, {
      padding: 4,
      fill: Color.gray(211),
      outline: Color.gray(144),
    }),
  dark: ThemeBuilder.setIsDark(true)
    .setDefault({
      padding: 0,
      fill: Color.TRANSPARENT,
      outline: Color.TRANSPARENT,
      textColor: Color.WHITE,
      rounding: 0,
      fontSize: 13,
      textCentered: false,
      lineSpacing: 1.1,
      scrollbarBackground: Color.gray(0),
      scrollbarColor: Color.gray(100),
      scrollbarOutline: Color.gray(80),
      sliderBackground: Color.gray(144),
      sliderDotFill: Color.gray(60),
    })
    .setStyleFor(DirectionalLayout, {
      fill: Color.gray(30),
      outline: Color.gray(80),
    })
    .setStyleFor(Button, {
      padding: 4,
      fill: Color.gray(45),
      outline: Color.gray(80),
      rounding: 3,
      textCentered: true,
    })
    .setStyleFor(KeyboardInput, {
      padding: 4,
      fill: Color.gray(45),
      outline: Color.gray(80),
    }),
};
