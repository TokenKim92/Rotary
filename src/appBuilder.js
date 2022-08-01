import ProjectCover from './projectCover.js';
import RotationProjectCover from './rotationProjectCover.js';

export default class AppBuilder {
  static BRIGHTNESS_INTERVAL = 10;
  static BRIGHTNESS_COUNT = 3;
  static COLOR_LIST = [
    { r: 162, g: 36, b: 30 },
    { r: 53, g: 46, b: 132 },
    { r: 25, g: 109, b: 129 },
    { r: 111, g: 157, b: 48 },
    { r: 23, g: 23, b: 23 },
    { r: 165, g: 124, b: 1 },
  ];

  #count = 0;
  #projectCovers = [];

  addProject(title, date) {
    const colorListCount = AppBuilder.COLOR_LIST.length;
    const colorIndex =
      Math.floor(this.#count / AppBuilder.BRIGHTNESS_COUNT) % colorListCount;
    const brightnessIndex =
      Math.floor(this.#count % AppBuilder.BRIGHTNESS_COUNT) % colorListCount;
    const color = AppBuilder.COLOR_LIST[colorIndex];

    this.#projectCovers.push(
      new ProjectCover(
        title,
        `0${this.#count + 1}`,
        date,
        `rgb(
          ${color.r + AppBuilder.BRIGHTNESS_INTERVAL * brightnessIndex}, 
          ${color.g + AppBuilder.BRIGHTNESS_INTERVAL * brightnessIndex}, 
          ${color.b + AppBuilder.BRIGHTNESS_INTERVAL * brightnessIndex})`
      )
    ); // prettier-ignore

    this.#count++;

    return this;
  }

  build() {
    return new RotationProjectCover(this.#projectCovers);
  }
}
