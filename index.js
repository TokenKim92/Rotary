import PortfolioCover from './lib/portfolioCover.js';
import Date from './lib/date.js';
import './lib/typography-dot.min.js';
import './lib/duplication.min.js';
import './lib/sheep.min.js';
import './lib/dotting.min.js';
import './lib/rotary.min.js';

window.onload = () => {
  const fontList = ['Abril Fatface', 'Fjalla One'];
  const fontCount = fontList.length;
  let currentLoadedFontCount = 0;
  const imageUrls = [
    './imgs/gogh1.jpg',
    './imgs/gogh2.jpg',
    './imgs/gogh3.jpg',
  ];

  WebFont.load({
    google: { families: fontList },
    fontactive: () => {
      currentLoadedFontCount++;

      fontCount === currentLoadedFontCount && createApp();
    },
  });

  function createApp() {
    new AppBuilder()
      .addProject(
        'Dotting',
        new Date('10', 'July', '2022'),
        new Dotting('./imgs/yeji.png', 'Fjalla One'),
        'https://github.com/TokenKim92/Dotting'
      )
      .addProject(
        'Type-Dot',
        new Date('17', 'July', '2022'),
        new typography.Dot('Fjalla One', 'JS'),
        'https://github.com/TokenKim92/TypographyDot'
      )
      .addProject(
        'Duplication',
        new Date('22', 'July', '2022'),
        new DuplicateDraw(imageUrls),
        'https://github.com/TokenKim92/Duplication'
      )
      .addProject(
        'Sheep',
        new Date('22', 'August', '2022'),
        new Sheep('Fjalla One'),
        'https://github.com/TokenKim92/Sheep'
      )
      .build();
  }
};

class AppBuilder {
  static BRIGHTNESS_INTERVAL = 15;
  static BRIGHTNESS_COUNT = 2;
  static COLOR_LIST = [
    { r: 162, g: 36, b: 30 },
    { r: 53, g: 46, b: 132 },
    { r: 25, g: 109, b: 129 },
    { r: 111, g: 157, b: 48 },
    { r: 23, g: 23, b: 23 },
    { r: 165, g: 124, b: 1 },
  ];
  static FPS = 120;
  static FPS_TIME = 1000 / AppBuilder.FPS;

  #app = null;
  #count = 0;
  #projectCovers = [];
  #instances = [];
  #prevTime = 0;

  addProject(title, date, instance, url) {
    const colorListCount = AppBuilder.COLOR_LIST.length;
    const colorIndex =
      Math.floor(this.#count / AppBuilder.BRIGHTNESS_COUNT) % colorListCount;
    const brightnessIndex =
      Math.floor(this.#count % AppBuilder.BRIGHTNESS_COUNT) % colorListCount;
    const color = AppBuilder.COLOR_LIST[colorIndex];

    this.#projectCovers.push({
      cover: new PortfolioCover(title, `0${this.#count + 1}`, date, {
        r: color.r + AppBuilder.BRIGHTNESS_INTERVAL * brightnessIndex,
        g: color.g + AppBuilder.BRIGHTNESS_INTERVAL * brightnessIndex,
        b: color.b + AppBuilder.BRIGHTNESS_INTERVAL * brightnessIndex,
      }),
      url: url,
    });

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
    const isOnFPSTime = AppBuilder.FPS_TIME < curTime - this.#prevTime;
    if (isOnFPSTime) {
      this.#app && this.#app.animate(curTime);
      this.#prevTime = curTime;
    }

    window.requestAnimationFrame(this.animate);
  };
}
