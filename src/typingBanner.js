import Typing from '../lib/typing.js';
import FontFormat from '../lib/fontFormat.js';

export default class TypingBanner {
  #typing;
  #stageWidth;
  #stageHeight;
  #fontName;
  #fontColor;
  #backgroundColor;
  #isTyping = false;

  constructor(fontName, fontColor = '#ffffff', backgroundColor = '#000000cc') {
    this.#fontName = fontName;
    this.#fontColor = fontColor;
    this.#backgroundColor = backgroundColor;

    this.#typing = new Typing(
      new FontFormat(400, 50, this.#fontName, this.#fontColor)
    );
  }

  resize() {
    let borderRadius = 15;
    switch (this.#typing.sizeMode) {
      case Typing.LARGE_MODE:
      case Typing.MEDIUM_MODE:
        this.#stageWidth = 1300;
        this.#stageHeight = 500;
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
  }

  animate(curTime) {
    this.#typing.animate(curTime);
  }

  show(millisecond = 0, mode = 'ease') {
    this.#isTyping = true;
    this.#typing.hide();
    this.#typing.show(millisecond, mode);

    if (!this.#typing.isMatchMedia) {
      this.#typing
        .delay(1500)
        .type('Hi', 150)
        .move(-1, 25)
        .delete(1, 25)
        .type('ello,', 150)
        .type(' I am Token Kim.', 150)
        .move(-10, 50)
        .delete(5, 50)
        .type('Deokgeun', 50)
        .moveEnd(150)
        .type(['', 'A Software Engineer of C/C++'], 150)
        .move(-8, 50)
        .delete(8, 50)
        .type('currently residing in Germany.', 150)
        .move(-8, 150)
        .type('Dresden, ', 150)
        .moveEnd(150)
        .type(['', "It's my portfolio of HTML5"], 150)
        .move(-5, 50)
        .type('interactive ', 150)
        .moveEnd(1500)
        .type(' without library.', 200)
        .type(['', 'Please enjoy this. '], 50)
        .start();
    } else {
      this.#typing
        .delay(1500)
        .type('Hi', 150)
        .move(-1, 25)
        .delete(1, 25)
        .type('ello,', 150)
        .type(' I am Token Kim.', 150)
        .move(-10, 50)
        .delete(5, 50)
        .type('Deokgeun', 50)
        .moveEnd(150)
        .type(['', '', 'A Software Engineer of C/C++'], 150)
        .move(-8, 50)
        .delete(8, 50)
        .type(['', 'currently residing in', 'Germany.'], 150)
        .move(-8, 50)
        .type('Dresden, ', 150)
        .moveEnd(150)
        .type(['', '', "It's my portfolio of HTML5"], 150)
        .move(-5, 50)
        .delete(5)
        .type('interactive')
        .moveEnd()
        .type(['', 'HTML5'], 1500)
        .type(' without library.', 200)
        .type(['', '', 'Please enjoy this. '], 50)
        .start();
    }
  }

  hide(millisecond = 0, mode = 'ease') {
    this.#typing.stop();
    this.#typing.hide(millisecond, mode);
  }

  get isTyping() {
    return this.#isTyping;
  }
}
