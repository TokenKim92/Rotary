export default class BaseCanvas {
  static INIT_MODE = -1;
  static SMALL_MODE = 0;
  static REGULAR_MODE = 1;
  static MEDIUM_MODE = 2;
  static LARGE_MODE = 3;

  #canvas;
  #ctx;
  #stageWidth;
  #stageHeight;
  #isFull;

  constructor(isFull = false) {
    this.#canvas = document.createElement('canvas');
    this.#ctx = this.#canvas.getContext('2d');
    document.body.append(this.#canvas);

    this.#isFull = isFull;
    this.#isFull && this.#canvas.classList.add('canvas-full');
  }

  resize(width = 0, height = 0) {
    this.#stageWidth = width === 0 ? document.body.clientWidth : width;
    this.#stageHeight = height === 0 ? document.body.clientHeight : height;

    this.#canvas.width = this.#stageWidth;
    this.#canvas.height = this.#stageHeight;
  }

  getSizeMode() {
    const canvasSizeModes = [
      { mode: BaseCanvas.SMALL_MODE, size: 500 },
      { mode: BaseCanvas.REGULAR_MODE, size: 1000 },
      { mode: BaseCanvas.MEDIUM_MODE, size: 1980 },
      { mode: BaseCanvas.LARGE_MODE, size: 3840 },
    ];

    const sizeModeIndex = 
      canvasSizeModes
        .filter((sizeMode) => !window.matchMedia(`(max-width: ${sizeMode.size}px)`).matches)
        .length; // prettier-ignore

    return canvasSizeModes[sizeModeIndex].mode;
  }

  clearCanvas() {
    this.#ctx.clearRect(0, 0, this.#stageWidth, this.#stageHeight);
  }

  animateTarget(handler, ...arg) {
    return handler(this.#ctx, ...arg);
  }

  saveCanvas() {
    this.#ctx.save();
  }

  restoreCanvas() {
    this.#ctx.restore();
  }

  addEventToCanvas(type, listener) {
    this.#canvas.addEventListener(type, listener);
  }

  removeEventFromCanvas(type, listener) {
    this.#canvas.removeEventListener(type, listener);
  }

  bringToStage() {
    document.body.append(this.#canvas);
  }

  removeFromStage() {
    this.clearCanvas();
    document.body.removeChild(this.#canvas);
  }

  fill() {
    this.#ctx.fill();
  }

  fillRect(x, y, w, h) {
    this.#ctx.fillRect(x, y, w, h);
  }

  fillText(text, x, y, maxWidth = undefined) {
    this.#ctx.fillText(text, x, y, maxWidth);
  }

  measureText(text) {
    return this.#ctx.measureText(text);
  }

  translate(x, y) {
    this.#ctx.translate(x, y);
  }

  scale(x, y) {
    this.#ctx.scale(x, y);
  }

  rotate(radian) {
    this.#ctx.rotate(radian);
  }

  beginPath() {
    this.#ctx.beginPath();
  }

  stroke() {
    this.#ctx.stroke();
  }

  arc(x, y, radius, startAngle, endAngle, counterclockwise = false) {
    this.#ctx.arc(x, y, radius, startAngle, endAngle, counterclockwise);
  }

  moveTo(x, y) {
    this.#ctx.moveTo(x, y);
  }

  lineTo(x, y) {
    this.#ctx.lineTo(x, y);
  }

  drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh) {
    this.#ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
  }

  getImageData(sx, sy, sw, sh, settings = undefined) {
    return this.#ctx.getImageData(sx, sy, sw, sh, settings);
  }

  setPosition(x, y) {
    if (this.#isFull) {
      throw new Error('Positioning is not possible in full screen mode.');
    }

    this.#canvas.style.left = `${x}px`;
    this.#canvas.style.top = `${y}px`;
  }

  getFont() {
    return this.#ctx.font;
  }

  setFont(font) {
    return (this.#ctx.font = font);
  }

  getFillStyle() {
    return this.#ctx.fillStyle;
  }

  setFillStyle(fillStyle) {
    this.#ctx.fillStyle = fillStyle;
  }

  getStrokeStyle() {
    return this.#ctx.strokeStyle;
  }

  setStrokeStyle(strokeStyle) {
    this.#ctx.strokeStyle = strokeStyle;
  }

  getLineWidth() {
    return this.#ctx.lineWidth;
  }

  setLineWidth(lineWidth) {
    this.#ctx.lineWidth = lineWidth;
  }

  getTextAlign() {
    return this.#ctx.textAlign;
  }

  setTextAlign(textAlign) {
    return (this.#ctx.textAlign = textAlign);
  }

  getTextBaseline() {
    return this.#ctx.textBaseline;
  }

  setTextBaseline(textBaseline) {
    this.#ctx.textBaseline = textBaseline;
  }

  get stageWidth() {
    return this.#stageWidth;
  }

  get stageHeight() {
    return this.#stageHeight;
  }

  get isMatchMedia() {
    return this.getSizeMode() === BaseCanvas.SMALL_MODE;
  }
}
