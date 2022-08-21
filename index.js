import PortfolioCover from './src/portfolioCover.js';
import RotaryCover from './src/rotaryCover.js';
import './lib/typography-dot.min.js';
import './lib/duplication.min.js';
import './lib/sheep.min.js';
import './lib/dotting.min.js';

window.onload = () => {
  const imageList = [];
  let imageCount = 0;
  const imageUrls = [
    './imgs/gogh1.jpg',
    './imgs/gogh2.jpg',
    './imgs/gogh3.jpg',
  ];

  imageUrls.forEach((imageUrl) => {
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      imageList.push(img);
      imageCount++;

      if (imageCount === imageUrls.length) {
        createApp();
      }
    };
  });

  function createApp() {
    new AppBuilder()
      .addProject(
        'Dotting',
        { month: 'July', year: '2022' },
        new Dotting('./imgs/gogh1.jpg'),
        'https://github.com/TokenKim92/Dotting'
      )
      .addProject(
        'Type-Dot',
        { month: 'JULY', year: '2022' },
        new typography.Dot('Arial', 'JS'),
        'https://github.com/TokenKim92/TypographyDot'
      )
      .addProject(
        'Duplication',
        { month: 'JULY', year: '2022' },
        new DuplicateDraw(imageList),
        'https://github.com/TokenKim92/Duplication'
      )
      .addProject(
        'Sheep',
        { month: 'August', year: '2022' },
        new Sheep(),
        'https://github.com/TokenKim92'
      )
      .build();
  }
};

class AppBuilder {
  static BRIGHTNESS_INTERVAL = 10;
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
      cover: new PortfolioCover(
        title,
        `0${this.#count + 1}`,
        date,
        `rgb(
          ${color.r + AppBuilder.BRIGHTNESS_INTERVAL * brightnessIndex}, 
          ${color.g + AppBuilder.BRIGHTNESS_INTERVAL * brightnessIndex}, 
          ${color.b + AppBuilder.BRIGHTNESS_INTERVAL * brightnessIndex})`
      ),
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
