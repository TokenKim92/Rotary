export default class ProjectCover {
  static COVER_RECT = {
    x: -110,
    y: -150,
    w: 220,
    h: 300,
  };
  static FONT_NAME = 'Abril Fatface';
  static FONT_COLOR = 'rgb(255, 255, 255)';
  static TEXT_PADDING = 20;
  static MAIN_FONT_WIDTH = 20;
  static MAIN_FONT_SIZE = 30;
  static SECONDARY_FONT_WIDTH = 8;
  static SECONDARY_FONT_SIZE = 8;
  static SUBTITLE = ['A', 'COLLECTION OF', 'INTERACTIVE', 'HTML 5', 'PROJECT'];
  static CONTACT_LINK = 'github.com/TokenKim92';
  static AUTHOR = 'Token Kim';

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

  animate = (ctx) => {
    this.#drawBackground(ctx);
    this.#drawContents(ctx);
  };

  #drawBackground(ctx) {
    ctx.fillStyle = this.#backgroundColor;
    ctx.fillRect(
      ProjectCover.COVER_RECT.x,
      ProjectCover.COVER_RECT.y,
      ProjectCover.COVER_RECT.w,
      ProjectCover.COVER_RECT.h
    );
  }

  #drawContents(ctx) {
    ctx.fillStyle = ProjectCover.FONT_COLOR;

    this.#drawTitle(ctx);
    this.#drawSequenceNumber(ctx);
    this.#drawCreatedDate(ctx);
    this.#drawSubtitle(ctx);
  }

  #drawTitle(ctx) {
    ctx.font = `
    ${ProjectCover.MAIN_FONT_WIDTH} 
    ${ProjectCover.MAIN_FONT_SIZE}px 
    ${ProjectCover.FONT_NAME}`;

    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';

    ctx.fillText(
      this.#title,
      ProjectCover.COVER_RECT.x + ProjectCover.TEXT_PADDING,
      ProjectCover.COVER_RECT.y + ProjectCover.TEXT_PADDING * 2
    );
  }

  #drawSequenceNumber(ctx) {
    ctx.font = `
    ${ProjectCover.MAIN_FONT_WIDTH} 
    ${ProjectCover.MAIN_FONT_SIZE}px 
    ${ProjectCover.FONT_NAME}`;

    ctx.textBaseline = 'bottom';
    ctx.textAlign = 'left';

    ctx.fillText(
      this.#sequenceNumber,
      ProjectCover.COVER_RECT.x + ProjectCover.TEXT_PADDING, 
      ProjectCover.COVER_RECT.y + ProjectCover.COVER_RECT.h - ProjectCover.TEXT_PADDING
    ); // prettier-ignore
  }

  #drawCreatedDate(ctx) {
    ctx.font = `
    ${ProjectCover.SECONDARY_FONT_WIDTH} 
    ${ProjectCover.SECONDARY_FONT_SIZE}px 
    ${ProjectCover.FONT_NAME}`;

    ctx.textBaseline = `top`;
    ctx.textAlign = 'right';

    ctx.fillText(
      this.#createdDate.month,
      ProjectCover.COVER_RECT.x + ProjectCover.COVER_RECT.w - ProjectCover.TEXT_PADDING,
      ProjectCover.COVER_RECT.y + ProjectCover.TEXT_PADDING
    ); // prettier-ignore

    ctx.fillText(
      this.#createdDate.year,
      ProjectCover.COVER_RECT.x + ProjectCover.COVER_RECT.w - ProjectCover.TEXT_PADDING,
      ProjectCover.COVER_RECT.y + ProjectCover.TEXT_PADDING + ProjectCover.SECONDARY_FONT_SIZE
    ); // prettier-ignore
  }

  #drawSubtitle(ctx) {
    ctx.font = `
    ${ProjectCover.SECONDARY_FONT_WIDTH} 
    ${ProjectCover.SECONDARY_FONT_SIZE}px 
    ${ProjectCover.FONT_NAME}`;

    ctx.textBaseline = `bottom`;
    ctx.textAlign = 'right';

    const totalLineCount = ProjectCover.SUBTITLE.length + 3;

    ProjectCover.SUBTITLE.forEach((text, index) => {
      ctx.fillText(
        text,
        ProjectCover.COVER_RECT.x + ProjectCover.COVER_RECT.w - ProjectCover.TEXT_PADDING,
        ProjectCover.COVER_RECT.y + ProjectCover.COVER_RECT.h - ProjectCover.TEXT_PADDING 
          - ProjectCover.SECONDARY_FONT_SIZE * (totalLineCount - index)
      ); // prettier-ignore
    });

    ctx.fillText(
      ProjectCover.CONTACT_LINK,
      ProjectCover.COVER_RECT.x + ProjectCover.COVER_RECT.w - ProjectCover.TEXT_PADDING,
      ProjectCover.COVER_RECT.y + ProjectCover.COVER_RECT.h - ProjectCover.TEXT_PADDING 
        - ProjectCover.SECONDARY_FONT_SIZE * (totalLineCount - ProjectCover.SUBTITLE.length - 1)
    ); // prettier-ignore

    ctx.fillText(
      ProjectCover.AUTHOR,
      ProjectCover.COVER_RECT.x + ProjectCover.COVER_RECT.w - ProjectCover.TEXT_PADDING,
      ProjectCover.COVER_RECT.y + ProjectCover.COVER_RECT.h - ProjectCover.TEXT_PADDING
    ); // prettier-ignore
  }

  get title() {
    return this.#title;
  }

  get createdDate() {
    return this.#createdDate;
  }
}
