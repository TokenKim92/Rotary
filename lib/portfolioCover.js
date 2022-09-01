export default class PortfolioCover {
  static COVER_RECT = {
    x: -110,
    y: -150,
    w: 220,
    h: 300,
  };
  static FONT_NAME = 'Abril Fatface';
  static FONT_COLOR = 'rgb(255, 255, 255)';
  static TEXT_PADDING = 10;
  static MAIN_FONT_WIDTH = 20;
  static MAIN_FONT_SIZE = 30;
  static SUB_FONT_WIDTH = 8;
  static SUB_FONT_SIZE = 8;
  static SUBTITLE = ['A', 'COLLECTION OF', 'INTERACTIVE', 'HTML 5', 'PROJECT'];
  static CONTACT_LINK = 'github.com/TokenKim92';
  static AUTHOR = 'Token Kim';
  static SHADOW_SIZE = 6;
  static BRIGHTNESS_OFFSET = 30;

  #title;
  #sequenceNumber;
  #createdDate;
  #backgroundColor;

  constructor(title, sequenceNumber, createdDate, backgroundColor) {
    this.#title = title;
    this.#sequenceNumber = sequenceNumber;
    this.#createdDate = createdDate;
    this.#backgroundColor = backgroundColor;
  }

  animate = (ctx, isMouseOnCover = false) => {
    this.#drawShadow(ctx);
    this.#drawBackground(ctx, isMouseOnCover);
    this.#drawContents(ctx);
  };

  #drawShadow(ctx) {
    ctx.fillStyle = 'rgba(100, 100, 100, 0.05)';
    ctx.fillRect(
      PortfolioCover.COVER_RECT.x + PortfolioCover.SHADOW_SIZE,
      PortfolioCover.COVER_RECT.y + PortfolioCover.SHADOW_SIZE,
      PortfolioCover.COVER_RECT.w + PortfolioCover.SHADOW_SIZE,
      PortfolioCover.COVER_RECT.h + PortfolioCover.SHADOW_SIZE
    );
  }

  #drawBackground(ctx, isMouseOnCover) {
    const color = isMouseOnCover
      ? `rgb(
      ${this.#backgroundColor.r + PortfolioCover.BRIGHTNESS_OFFSET}, 
      ${this.#backgroundColor.g + PortfolioCover.BRIGHTNESS_OFFSET}, 
      ${this.#backgroundColor.b + PortfolioCover.BRIGHTNESS_OFFSET})`
      : `rgb(
        ${this.#backgroundColor.r}, 
        ${this.#backgroundColor.g}, 
        ${this.#backgroundColor.b})`;

    ctx.fillStyle = color;
    ctx.fillRect(
      PortfolioCover.COVER_RECT.x,
      PortfolioCover.COVER_RECT.y,
      PortfolioCover.COVER_RECT.w,
      PortfolioCover.COVER_RECT.h
    );
  }

  #drawContents(ctx) {
    ctx.fillStyle = PortfolioCover.FONT_COLOR;

    this.#drawTitle(ctx);
    this.#drawSequenceNumber(ctx);
    this.#drawCreatedDate(ctx);
    this.#drawSubtitle(ctx);
  }

  #drawTitle(ctx) {
    ctx.font = `
    ${PortfolioCover.MAIN_FONT_WIDTH} 
    ${PortfolioCover.MAIN_FONT_SIZE}px 
    ${PortfolioCover.FONT_NAME}`;

    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';

    ctx.fillText(
      this.#title,
      PortfolioCover.COVER_RECT.x + PortfolioCover.TEXT_PADDING,
      PortfolioCover.COVER_RECT.y + PortfolioCover.TEXT_PADDING * 2
    );
  }

  #drawSequenceNumber(ctx) {
    ctx.font = `
    ${PortfolioCover.MAIN_FONT_WIDTH} 
    ${PortfolioCover.MAIN_FONT_SIZE}px 
    ${PortfolioCover.FONT_NAME}`;

    ctx.textBaseline = 'bottom';
    ctx.textAlign = 'left';

    ctx.fillText(
      this.#sequenceNumber,
      PortfolioCover.COVER_RECT.x + PortfolioCover.TEXT_PADDING, 
      PortfolioCover.COVER_RECT.y + PortfolioCover.COVER_RECT.h - PortfolioCover.TEXT_PADDING
    ); // prettier-ignore
  }

  #drawCreatedDate(ctx) {
    ctx.font = `
    ${PortfolioCover.SUB_FONT_WIDTH} 
    ${PortfolioCover.SUB_FONT_SIZE}px 
    ${PortfolioCover.FONT_NAME}`;

    ctx.textBaseline = `top`;
    ctx.textAlign = 'right';

    ctx.fillText(
      this.#createdDate.month,
      PortfolioCover.COVER_RECT.x + PortfolioCover.COVER_RECT.w - PortfolioCover.TEXT_PADDING,
      PortfolioCover.COVER_RECT.y + PortfolioCover.TEXT_PADDING
    ); // prettier-ignore

    ctx.fillText(
      this.#createdDate.year,
      PortfolioCover.COVER_RECT.x + PortfolioCover.COVER_RECT.w - PortfolioCover.TEXT_PADDING,
      PortfolioCover.COVER_RECT.y + PortfolioCover.TEXT_PADDING + PortfolioCover.SUB_FONT_SIZE
    ); // prettier-ignore
  }

  #drawSubtitle(ctx) {
    ctx.font = `
    ${PortfolioCover.SUB_FONT_WIDTH} 
    ${PortfolioCover.SUB_FONT_SIZE}px 
    ${PortfolioCover.FONT_NAME}`;

    ctx.textBaseline = `bottom`;
    ctx.textAlign = 'right';

    const totalLineCount = PortfolioCover.SUBTITLE.length + 3;

    PortfolioCover.SUBTITLE.forEach((text, index) => {
      ctx.fillText(
        text,
        PortfolioCover.COVER_RECT.x + PortfolioCover.COVER_RECT.w - PortfolioCover.TEXT_PADDING,
        PortfolioCover.COVER_RECT.y + PortfolioCover.COVER_RECT.h - PortfolioCover.TEXT_PADDING 
          - PortfolioCover.SUB_FONT_SIZE * (totalLineCount - index)
      ); // prettier-ignore
    });

    ctx.fillText(
      PortfolioCover.CONTACT_LINK,
      PortfolioCover.COVER_RECT.x + PortfolioCover.COVER_RECT.w - PortfolioCover.TEXT_PADDING,
      PortfolioCover.COVER_RECT.y + PortfolioCover.COVER_RECT.h - PortfolioCover.TEXT_PADDING 
        - PortfolioCover.SUB_FONT_SIZE * (totalLineCount - PortfolioCover.SUBTITLE.length - 1)
    ); // prettier-ignore

    ctx.fillText(
      PortfolioCover.AUTHOR,
      PortfolioCover.COVER_RECT.x + PortfolioCover.COVER_RECT.w - PortfolioCover.TEXT_PADDING,
      PortfolioCover.COVER_RECT.y + PortfolioCover.COVER_RECT.h - PortfolioCover.TEXT_PADDING
    ); // prettier-ignore
  }

  get title() {
    return this.#title;
  }

  get createdDate() {
    return this.#createdDate;
  }
}
