import { posInRect } from './utils.js';

export default class RotationProjectCover {
  static DEGREE_INTERVAL = 10;
  static FPS = 60;
  static FPS_TIME = 1000 / RotationProjectCover.FPS;
  static WHEEL_UP = -1;
  static WHEEL_DOWN = 1;
  static INIT_ROTATE_SPEED = 0.05;
  static MAX_ROTATE_SPEED_RATIO = 3;

  #canvas;
  #ctx;
  #stageWidth;
  #stageHeight;
  #pixelRatio;
  #rotationAxisRadius;
  #rotationAxisPos;
  #projectCovers = [];
  #currentDegree = 0;
  #targetDegree = this.#currentDegree;
  #maxDegree;
  #rotateDirection = 0;
  #rotateSpeed = RotationProjectCover.INIT_ROTATE_SPEED;
  #prevTime = 0;

  #filledBackgroundWidth = 0;
  #fillBackgroundSpeed;

  #fullscreenBtn;
  #selectedIndex = -1;
  #coverRects = [];

  constructor(projectCovers) {
    this.#canvas = document.createElement('canvas');
    this.#ctx = this.#canvas.getContext('2d');
    document.body.append(this.#canvas);

    this.#pixelRatio = 1; // window.devicePixelRatio > 1 ? 2 : 1;

    this.#fullscreenBtn = document.querySelector('.fullscreen');

    window.addEventListener('resize', this.resize);

    WebFont.load({
      google: {
        families: ['Abril Fatface'],
      },
      fontactive: () => {
        this.#projectCovers = projectCovers;

        const coverCount = this.#projectCovers.length;
        this.#currentDegree = Math.floor(coverCount / 2) * RotationProjectCover.DEGREE_INTERVAL; // prettier-ignore
        this.#maxDegree = coverCount * RotationProjectCover.DEGREE_INTERVAL;

        this.resize();
      },
    });

    window.addEventListener('wheel', (e) => {
      const direction = e.deltaY > 0 ? RotationProjectCover.WHEEL_DOWN
                                     : RotationProjectCover.WHEEL_UP; // prettier-ignore

      this.initDegreeAndDirection(direction);
    });

    //this.#fullscreenBtn.addEventListener('click', this.onClick);
    window.addEventListener('click', this.onClick);
  }

  onClick = (e) => {
    this.#coverRects.forEach((rect, index) => {
      if (posInRect({ x: e.offsetX, y: e.offsetY }, rect)) {
        if (this.#selectedIndex > index) {
          this.#rotateDirection = RotationProjectCover.WHEEL_UP;
        } else {
          this.#rotateDirection = RotationProjectCover.WHEEL_DOWN;
        }

        this.#selectedIndex = index;
        this.#targetDegree = index * RotationProjectCover.DEGREE_INTERVAL;
      }
    });

    //this.#filledBackgroundWidth = 1;
    //this.#fullscreenBtn.style.display = 'none';
  };

  resize = () => {
    this.#stageWidth = document.body.clientWidth;
    this.#stageHeight = document.body.clientHeight;

    this.#canvas.width = this.#stageWidth * this.#pixelRatio;
    this.#canvas.height = this.#stageHeight * this.#pixelRatio;
    this.#ctx.scale(this.#pixelRatio, this.#pixelRatio);

    this.#fillBackgroundSpeed =
      this.#stageHeight / RotationProjectCover.FPS_TIME;

    this.#rotationAxisRadius = this.#stageHeight;
    this.#rotationAxisPos = {
      x: this.#stageWidth / 2,
      y: (this.#stageHeight / 2) * 3,
    };

    this.drawCoverItems();

    window.requestAnimationFrame(this.animate);
  };

  initDegreeAndDirection(direction) {
    if (this.#rotateDirection == direction) {
      const temp = (this.#targetDegree + (RotationProjectCover.DEGREE_INTERVAL * direction)) % 361; // prettier-ignore
      if (0 < temp && temp < this.#maxDegree) {
        this.#targetDegree = temp;
      }

      if (
        this.#rotateSpeed <
        RotationProjectCover.INIT_ROTATE_SPEED *
          RotationProjectCover.MAX_ROTATE_SPEED_RATIO
      ) {
        this.#rotateSpeed *= 1.2;
      }

      return;
    }

    this.#rotateSpeed = RotationProjectCover.INIT_ROTATE_SPEED;
    this.#rotateDirection = direction;
    this.#targetDegree = Math.round(this.#currentDegree / 10 + direction) * 10;
  }

  drawCoverItems() {
    this.#coverRects = [];

    this.#projectCovers.forEach((cover, index) => {
      //TODO:: check this logic
      this.#currentDegree =
        (this.#currentDegree + this.#rotateSpeed * this.#rotateDirection) % 361;
      if (this.#currentDegree < 0) {
        this.#currentDegree += 360;
      }

      const degree =
        RotationProjectCover.DEGREE_INTERVAL * index - this.#currentDegree;
      const radian = (degree * Math.PI) / 180;

      const rotationPos = {
        x: this.#rotationAxisPos.x + this.#rotationAxisRadius * Math.sin(radian),
        y: this.#rotationAxisPos.y - this.#rotationAxisRadius * Math.cos(radian)  
      } // prettier-ignore

      this.drawCover(cover, rotationPos, radian);
      this.drawTitle(cover, rotationPos, radian);

      this.#ctx.save();
      this.#coverRects.push({
        x: rotationPos.x - 40,
        y: rotationPos.y - 40,
        w: 80,
        h: 80,
      });

      this.#ctx.fillStyle = 'black';
      this.#ctx.fillRect(rotationPos.x - 40, rotationPos.y - 40, 80, 80);
      this.#ctx.restore();
    });
  }

  drawCover(cover, rotationPos, radian = 0) {
    this.#ctx.save();

    this.#ctx.translate(rotationPos.x, rotationPos.y);
    this.#ctx.rotate(radian);
    cover.animate(this.#ctx);

    this.#ctx.restore();
  }

  drawTitle(cover, rotationPos, radian = 0) {
    this.#ctx.save();

    const textRadian = (270 * Math.PI) / 180;
    this.#ctx.translate(rotationPos.x, rotationPos.y);
    this.#ctx.rotate(radian + textRadian);

    this.#ctx.font = '10 20px Arial';
    this.#ctx.textAlign = 'left';
    this.#ctx.fillStyle = '#BEBCBE';
    this.#ctx.fillText(cover.title, 200, 0);

    this.#ctx.fillStyle = '#D0CED0';
    this.#ctx.fillText(`${cover.createdDate.month}, 11`, 200, 20);

    this.#ctx.restore();
  }

  animate = (curTime) => {
    this.#checkFPSTime(curTime);

    window.requestAnimationFrame(this.animate);
  };

  #checkFPSTime(curTime) {
    if (!this.#prevTime) {
      this.#prevTime = curTime;
    }

    if (curTime - this.#prevTime > RotationProjectCover.FPS_TIME) {
      this.#prevTime = curTime;

      this.#onFPSTime();
    }
  }

  #onFPSTime() {
    // TODO:: This is not right, if the wheel speed is fast
    if (Math.round(this.#currentDegree) != this.#targetDegree) {
      this.#ctx.clearRect(0, 0, this.#stageWidth, this.#stageHeight);
      this.drawCoverItems();
    }

    // if (this.#filledBackgroundWidth) {
    //   this.#filledBackgroundWidth += this.#fillBackgroundSpeed;

    //   this.#ctx.fillStyle = 'black';
    //   this.#ctx.fillRect(0, 0, this.#filledBackgroundWidth, this.#stageHeight);

    //   if (this.#filledBackgroundWidth >= this.#stageWidth) {
    //     const cover = this.#projectCovers[0];
    //     const rotationPos = {
    //       x: this.#rotationAxisPos.x,
    //       y: this.#rotationAxisPos.y - this.#rotationAxisRadius,
    //     };

    //     this.drawCover(cover, rotationPos);

    //     this.#filledBackgroundWidth = 0;
    //   }
    // }
  }
}
