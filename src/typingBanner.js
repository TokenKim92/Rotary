import Typing from '../lib/typing.js';
import FontFormat from '../lib/fontFormat.js';

export default class TypingBanner {
  #typing;
  #stageWidth;
  #stageHeight;
  #fontName;
  #fontColor;
  #backgroundColor;
  #isCalledWaitingHandler = false;

  constructor(fontName, speed = 50, fontColor = '#ffffff', backgroundColor = '#000000cc') {
    this.#fontName = fontName;
    this.#fontColor = fontColor;
    this.#backgroundColor = backgroundColor;

    this.#typing = new Typing(
      new FontFormat(400, 50, this.#fontName, this.#fontColor),
      speed
    );
    this.#typing.setWaitingHandler(this.hide, 300);
    this.#typing.hide();
  } // prettier-ignore

  resize() {
    let borderRadius = 15;
    switch (this.#typing.sizeMode) {
      case Typing.LARGE_MODE:
      case Typing.MEDIUM_MODE:
        this.#stageWidth = 1300;
        this.#stageHeight = 500;
        this.#typing.fontFormat = new FontFormat(400, 50, this.#fontName, this.#fontColor); // prettier-ignore
        this.#typing.setStartPos(55, 130);
        break;
      case Typing.REGULAR_MODE:
        this.#stageWidth = 750;
        this.#stageHeight = 350;
        this.#typing.fontFormat = new FontFormat(400, 30, this.#fontName, this.#fontColor); // prettier-ignore
        this.#typing.setStartPos(20, 100);
        break;
      case Typing.SMALL_MODE:
        this.#stageWidth = 340;
        this.#stageHeight = 460;
        this.#typing.fontFormat = new FontFormat(400, 26, this.#fontName, this.#fontColor); // prettier-ignore
        this.#typing.setStartPos(20, 60);
        borderRadius = 10;
        break;
      default:
        throw new Error('This size mode is not valid.');
    }

    this.#typing.resize(this.#stageWidth, this.#stageHeight);
    this.#typing.setPosition(
      (document.body.clientWidth - this.#stageWidth) / 2,
      (document.body.clientHeight - this.#stageHeight) / 2
    );
    this.#typing.borderRadius = borderRadius;
    this.#typing.backgroundColor = this.#backgroundColor;
    this.setMessage();
  }

  animate(curTime) {
    this.#typing.animate(curTime);
  }

  setMessage() {
    if (!this.#typing.isMatchMedia) {
      this.#typing
        .delay(1000)
        .type('Hello,', 100)
        .type(' I am Deokgeun Kim.', 100)
        .type(['', 'A Software Engineer of C/C++'], 100)
        .move(-8, 50)
        .delete(8, 50)
        .type('currently residing Dresden, in Germany.', 100)
        .type(['', "It's my portfolio of HTML5"], 100)
        .move(-5, 50)
        .type('interactive ', 100)
        .moveEnd(1000)
        .type(' without library.', 100)
        .type(['', 'Please enjoy this. '], 50)
        .start();
    } else {
      this.#typing
        .delay(1000)
        .type('Hello,', 100)
        .type(' I am Deokgeun Kim.', 100)
        .type(['', '', 'A Software Engineer of C/C++'], 100)
        .move(-8, 50)
        .delete(8, 50)
        .type(['currently', 'residing Dresden, in Germany.'], 100)
        .type(['', '', "It's my portfolio of HTML5"], 100)
        .move(-5, 50)
        .delete(5)
        .type('interactive')
        .moveEnd()
        .type(['', 'HTML5'], 1000)
        .type(' without library.', 100)
        .type(['', '', 'Please enjoy this. '], 50)
        .start();
    }
  }

  show(millisecond = 0, mode = 'ease') {
    this.#isCalledWaitingHandler = false;
    this.#typing.isOnStage || this.#typing.bringToStage();

    this.#typing.show(millisecond, mode);
  }

  hide = (millisecond = 0, mode = 'ease') => {
    if (this.#isCalledWaitingHandler) {
      return;
    }
    this.#isCalledWaitingHandler = true;

    this.#typing.hide(millisecond, mode);
    setTimeout(
      () => this.#typing.isOnStage && this.#typing.removeFromStage(),
      millisecond * 2
    );
  };

  initTyping() {
    this.#typing.clearCanvas();
    this.#typing.init();
  }
}
