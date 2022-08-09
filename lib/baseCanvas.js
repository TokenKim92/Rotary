export default class BaseCanvas {
  #canvas;
  #ctx;
  #pixelRatio;
  #stageWidth;
  #stageHeight;
  #isFull;

  constructor(isFull = false) {
    this.#canvas = document.createElement('canvas');
    this.#ctx = this.#canvas.getContext('2d');
    document.body.append(this.#canvas);

    this.#pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;
    this.#isFull = isFull;
    this.#isFull && this.#canvas.classList.add('canvas-full');
  }

  destroy() {
    this.clearCanvas();
    document.body.removeChild(this.#canvas);
  }

  resize(width = 0, height = 0) {
    this.#stageWidth = width === 0 ? document.body.clientWidth : width;
    this.#stageHeight = height === 0 ? document.body.clientHeight : height;

    this.#canvas.width = this.#stageWidth * this.#pixelRatio;
    this.#canvas.height = this.#stageHeight * this.#pixelRatio;
    this.#ctx.scale(this.#pixelRatio, this.#pixelRatio);
  }

  clearCanvas() {
    this.#ctx.clearRect(0, 0, this.#stageWidth, this.#stageHeight);
  }

  animateTarget(target) {
    target.animate(this.#ctx);
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

  removeEventToCanvas(type, listener) {
    this.#canvas.removeEventListener(type, listener);
  }

  fillRect(x, y, w, h) {
    this.#ctx.fillRect(x, y, w, h);
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

  fillText(text, x, y, maxWidth = undefined) {
    this.#ctx.fillText(text, x, y, maxWidth);
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

  get stageWidth() {
    return this.#stageWidth;
  }

  get stageHeight() {
    return this.#stageHeight;
  }

  get pixelRatio() {
    return this.#pixelRatio;
  }
}
