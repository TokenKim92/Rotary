import PortfolioCover from './portfolioCover.js';
import RotaryCover from './rotaryCover.js';

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

  #app = null;
  #count = 0;
  #projectCovers = [];
  #instances = [];

  addProject(title, date, instance) {
    const colorListCount = AppBuilder.COLOR_LIST.length;
    const colorIndex =
      Math.floor(this.#count / AppBuilder.BRIGHTNESS_COUNT) % colorListCount;
    const brightnessIndex =
      Math.floor(this.#count % AppBuilder.BRIGHTNESS_COUNT) % colorListCount;
    const color = AppBuilder.COLOR_LIST[colorIndex];

    this.#projectCovers.push(
      new PortfolioCover(
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

    this.#instances.push(instance);

    return this;
  }

  build() {
    this.#app = new RotaryCover(this.#projectCovers, this.#instances);
    window.requestAnimationFrame(this.animate);
    return this.#app;
  }

  animate = (curTime) => {
    this.#app && this.#app.animate(curTime);
    window.requestAnimationFrame(this.animate);
  };
}
