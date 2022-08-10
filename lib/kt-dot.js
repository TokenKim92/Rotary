/*!
 * Kinetic Typography Dot Edition
 * @version 1.0.0 | Wed Aug 10 2022
 * @author Token Kim
 * @license ISC
 */
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["kt"] = factory();
	else
		root["kt"] = root["kt"] || {}, root["kt"]["Dot"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./lib/baseCanvas.js":
/*!***************************!*\
  !*** ./lib/baseCanvas.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ BaseCanvas)\n/* harmony export */ });\nclass BaseCanvas {\r\n  #canvas;\r\n  #ctx;\r\n  #pixelRatio;\r\n  #stageWidth;\r\n  #stageHeight;\r\n  #isFull;\r\n\r\n  constructor(isFull = false) {\r\n    this.#canvas = document.createElement('canvas');\r\n    this.#ctx = this.#canvas.getContext('2d');\r\n    document.body.append(this.#canvas);\r\n\r\n    this.#pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;\r\n    this.#isFull = isFull;\r\n    this.#isFull && this.#canvas.classList.add('canvas-full');\r\n  }\r\n\r\n  destroy() {\r\n    this.clearCanvas();\r\n    document.body.removeChild(this.#canvas);\r\n  }\r\n\r\n  resize(width = 0, height = 0) {\r\n    this.#stageWidth = width === 0 ? document.body.clientWidth : width;\r\n    this.#stageHeight = height === 0 ? document.body.clientHeight : height;\r\n\r\n    this.#canvas.width = this.#stageWidth * this.#pixelRatio;\r\n    this.#canvas.height = this.#stageHeight * this.#pixelRatio;\r\n    this.#ctx.scale(this.#pixelRatio, this.#pixelRatio);\r\n  }\r\n\r\n  clearCanvas() {\r\n    this.#ctx.clearRect(0, 0, this.#stageWidth, this.#stageHeight);\r\n  }\r\n\r\n  animateTarget(target) {\r\n    target.animate(this.#ctx);\r\n  }\r\n\r\n  saveCanvas() {\r\n    this.#ctx.save();\r\n  }\r\n\r\n  restoreCanvas() {\r\n    this.#ctx.restore();\r\n  }\r\n\r\n  addEventToCanvas(type, listener) {\r\n    this.#canvas.addEventListener(type, listener);\r\n  }\r\n\r\n  removeEventToCanvas(type, listener) {\r\n    this.#canvas.removeEventListener(type, listener);\r\n  }\r\n\r\n  fillRect(x, y, w, h) {\r\n    this.#ctx.fillRect(x, y, w, h);\r\n  }\r\n\r\n  translate(x, y) {\r\n    this.#ctx.translate(x, y);\r\n  }\r\n\r\n  scale(x, y) {\r\n    this.#ctx.scale(x, y);\r\n  }\r\n\r\n  rotate(radian) {\r\n    this.#ctx.rotate(radian);\r\n  }\r\n\r\n  beginPath() {\r\n    this.#ctx.beginPath();\r\n  }\r\n\r\n  stroke() {\r\n    this.#ctx.stroke();\r\n  }\r\n\r\n  arc(x, y, radius, startAngle, endAngle, counterclockwise = false) {\r\n    this.#ctx.arc(x, y, radius, startAngle, endAngle, counterclockwise);\r\n  }\r\n\r\n  fillText(text, x, y, maxWidth = undefined) {\r\n    this.#ctx.fillText(text, x, y, maxWidth);\r\n  }\r\n\r\n  setPosition(x, y) {\r\n    if (this.#isFull) {\r\n      throw new Error('Positioning is not possible in full screen mode.');\r\n    }\r\n\r\n    this.#canvas.style.left = `${x}px`;\r\n    this.#canvas.style.top = `${y}px`;\r\n  }\r\n\r\n  getFont() {\r\n    return this.#ctx.font;\r\n  }\r\n\r\n  setFont(font) {\r\n    return (this.#ctx.font = font);\r\n  }\r\n\r\n  getFillStyle() {\r\n    return this.#ctx.fillStyle;\r\n  }\r\n\r\n  setFillStyle(fillStyle) {\r\n    this.#ctx.fillStyle = fillStyle;\r\n  }\r\n\r\n  getStrokeStyle() {\r\n    return this.#ctx.strokeStyle;\r\n  }\r\n\r\n  setStrokeStyle(strokeStyle) {\r\n    this.#ctx.strokeStyle = strokeStyle;\r\n  }\r\n\r\n  getLineWidth() {\r\n    return this.#ctx.lineWidth;\r\n  }\r\n\r\n  setLineWidth(lineWidth) {\r\n    this.#ctx.lineWidth = lineWidth;\r\n  }\r\n\r\n  getTextAlign() {\r\n    return this.#ctx.textAlign;\r\n  }\r\n\r\n  setTextAlign(textAlign) {\r\n    return (this.#ctx.textAlign = textAlign);\r\n  }\r\n\r\n  bringToFront() {\r\n    document.body.removeChild(this.#canvas);\r\n    document.body.append(this.#canvas);\r\n    console.log('hi');\r\n  }\r\n\r\n  get stageWidth() {\r\n    return this.#stageWidth;\r\n  }\r\n\r\n  get stageHeight() {\r\n    return this.#stageHeight;\r\n  }\r\n\r\n  get pixelRatio() {\r\n    return this.#pixelRatio;\r\n  }\r\n\r\n  get ctx() {\r\n    return this.#ctx;\r\n  }\r\n}\r\n\n\n//# sourceURL=webpack://kt.Dot/./lib/baseCanvas.js?");

/***/ }),

/***/ "./src/dot.js":
/*!********************!*\
  !*** ./src/dot.js ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Dot)\n/* harmony export */ });\n/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ \"./src/utils.js\");\n\r\n\r\nclass Dot {\r\n  static BOUNCE = 0.82;\r\n  static FPS = 15;\r\n  static FPS_TIME = 1000 / Dot.FPS;\r\n  static FRICTION = 0.86;\r\n  static RADIUS_OFFSET = 0.85;\r\n  static INVALID = -1;\r\n\r\n  #orgPos;\r\n  #targetRadius;\r\n  #prevTime;\r\n  #rotateRatios;\r\n\r\n  #backgroundRGB;\r\n  #orgDotRGB;\r\n  #dotRGB;\r\n  #pos;\r\n  #posVelocity;\r\n  #rotateRadius;\r\n  #radius;\r\n  #radiusVelocity;\r\n  #toBeIncreased;\r\n  #toBeChangedColorCount;\r\n\r\n  constructor(orgPos, targetRadius, dotColor, bgColor) {\r\n    this.#orgPos = orgPos;\r\n    this.#targetRadius = targetRadius * Dot.RADIUS_OFFSET;\r\n    this.#orgDotRGB = dotColor;\r\n    this.#backgroundRGB = bgColor;\r\n    this.#prevTime = 0;\r\n    this.#rotateRatios = [(this.#targetRadius / Dot.FPS) * -1, this.#targetRadius / Dot.FPS]; // prettier-ignore\r\n\r\n    this.init();\r\n  }\r\n\r\n  init() {\r\n    this.#dotRGB = this.#orgDotRGB;\r\n    this.#pos = {\r\n      x: this.#orgPos.x,\r\n      y: this.#orgPos.y,\r\n    };\r\n    this.#posVelocity = {\r\n      vx: 0,\r\n      vy: 0,\r\n    };\r\n    this.#radius = 0;\r\n    this.#radiusVelocity = 0;\r\n    this.#toBeIncreased = 0;\r\n    this.#rotateRadius = this.#targetRadius + this.#rotateRatios[this.#toBeIncreased]; // prettier-ignore\r\n    this.#toBeChangedColorCount = Dot.INVALID;\r\n  }\r\n\r\n  pluckAnimate(ctx) {\r\n    ctx.save();\r\n\r\n    ctx.fillStyle = `rgba(\r\n      ${this.#backgroundRGB.r}, \r\n      ${this.#backgroundRGB.g}, \r\n      ${this.#backgroundRGB.b}, \r\n      0.8)`; // prettier-ignore\r\n\r\n    ctx.fillRect(\r\n      this.#orgPos.x - this.#radius,\r\n      this.#orgPos.y - this.#radius,\r\n      this.#radius * 2,\r\n      this.#radius * 2\r\n    );\r\n\r\n    const accel = (this.#targetRadius - this.#radius) / 2;\r\n    this.#radiusVelocity = (this.#radiusVelocity + accel) * Dot.BOUNCE;\r\n    this.#radius += this.#radiusVelocity;\r\n\r\n    ctx.beginPath();\r\n    ctx.fillStyle = `rgb(\r\n      ${this.#dotRGB.r}, \r\n      ${this.#dotRGB.g}, \r\n      ${this.#dotRGB.b})`;\r\n\r\n    ctx.arc(\r\n      this.#orgPos.x, this.#orgPos.y,\r\n      this.#radius * Dot.RADIUS_OFFSET, \r\n      0, _utils_js__WEBPACK_IMPORTED_MODULE_0__.PI2, false); // prettier-ignore\r\n    ctx.fill();\r\n\r\n    ctx.restore();\r\n  }\r\n\r\n  kineticAnimate(ctx, curTime) {\r\n    this.#checkFPSTime(curTime);\r\n\r\n    this.#posVelocity.vx *= Dot.FRICTION;\r\n    this.#posVelocity.vy *= Dot.FRICTION;\r\n\r\n    this.#pos.x += this.#posVelocity.vx;\r\n    this.#pos.y += this.#posVelocity.vy;\r\n\r\n    ctx.beginPath();\r\n    ctx.fillStyle = `rgb(\r\n      ${this.#dotRGB.r}, \r\n      ${this.#dotRGB.g}, \r\n      ${this.#dotRGB.b})`;\r\n\r\n    ctx.ellipse(\r\n      this.#pos.x, this.#pos.y, \r\n      this.#rotateRadius, this.#radius * Dot.RADIUS_OFFSET, \r\n      0, 0, _utils_js__WEBPACK_IMPORTED_MODULE_0__.PI2); // prettier-ignore\r\n    ctx.fill();\r\n  }\r\n\r\n  #checkFPSTime(curTime) {\r\n    if (!this.#prevTime) {\r\n      this.#prevTime = curTime;\r\n    }\r\n\r\n    if (curTime - this.#prevTime > Dot.FPS_TIME) {\r\n      this.#prevTime = curTime;\r\n\r\n      this.#onFPSTime();\r\n    }\r\n  }\r\n\r\n  #onFPSTime() {\r\n    if (this.#toBeChangedColorCount > 0) {\r\n      const randomColor = Math.round(Math.random() * 0xffffff);\r\n      this.#dotRGB = {\r\n        r: (randomColor >> 16) & 0xff,\r\n        g: (randomColor >> 8) & 0xff,\r\n        b: randomColor & 0xff,\r\n      };\r\n\r\n      this.#toBeChangedColorCount--;\r\n    } else if (this.#toBeChangedColorCount !== Dot.INVALID) {\r\n      this.#dotRGB = this.#orgDotRGB;\r\n      this.#toBeChangedColorCount = Dot.INVALID;\r\n    }\r\n\r\n    if (this.#rotateRadius < 1) {\r\n      this.#toBeIncreased = 1;\r\n    } else if (this.#rotateRadius >= this.#radius * Dot.RADIUS_OFFSET) {\r\n      this.#toBeIncreased = 0;\r\n    }\r\n\r\n    this.#rotateRadius += this.#rotateRatios[this.#toBeIncreased];\r\n  }\r\n\r\n  collide() {\r\n    this.#toBeChangedColorCount = Dot.FPS;\r\n  }\r\n\r\n  get posVelocity() {\r\n    return this.#posVelocity;\r\n  }\r\n\r\n  set posVelocity(posVelocity) {\r\n    this.#posVelocity = posVelocity;\r\n  }\r\n\r\n  get pos() {\r\n    return this.#pos;\r\n  }\r\n}\r\n\n\n//# sourceURL=webpack://kt.Dot/./src/dot.js?");

/***/ }),

/***/ "./src/dotKineticText.js":
/*!*******************************!*\
  !*** ./src/dotKineticText.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ DotKineticText)\n/* harmony export */ });\n/* harmony import */ var _textFrame_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./textFrame.js */ \"./src/textFrame.js\");\n/* harmony import */ var _ripple_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ripple.js */ \"./src/ripple.js\");\n/* harmony import */ var _dot_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./dot.js */ \"./src/dot.js\");\n/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils.js */ \"./src/utils.js\");\n/* harmony import */ var _lib_baseCanvas_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../lib/baseCanvas.js */ \"./lib/baseCanvas.js\");\n\r\n\r\n\r\n // prettier-ignore\r\n\r\n\r\nclass DotKineticText extends _lib_baseCanvas_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\r\n  static DOT_RADIUS = 10;\r\n  static RADIUS = 10;\r\n  static MATCH_MEDIA = window.matchMedia('(max-width: 768px)').matches;\r\n  static BG_COLOR = 'rgba(0, 0, 0)';\r\n  static DOT_COLOR = 'rgb(255, 255, 255)';\r\n\r\n  #dotRadius;\r\n  #pixelSize;\r\n  #rippleSpeed;\r\n  #dots = [];\r\n  #pluckCount = 0;\r\n  #maxPluckCount;\r\n  #clickedPos = { x: 0, y: 0 };\r\n  #text;\r\n  #toBeDrawText;\r\n  #textField;\r\n  #isKineticActivated = false;\r\n  #mouse = {\r\n    x: 0,\r\n    y: 0,\r\n    radius: 100,\r\n  };\r\n  #isRandomTextMode;\r\n\r\n  constructor(fontFormat, text, rippleSpeed = 10, isRandomTextMode = false) {\r\n    super();\r\n\r\n    this.#dotRadius = DotKineticText.DOT_RADIUS;\r\n    this.#pixelSize = this.#dotRadius * 2;\r\n    this.#rippleSpeed = rippleSpeed;\r\n    this.#text = text;\r\n    this.#isRandomTextMode = isRandomTextMode;\r\n\r\n    this.textFrame = new _textFrame_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"](fontFormat, this.#pixelSize, DotKineticText.BG_COLOR); // prettier-ignore\r\n    this.ripple = new _ripple_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"](this.#rippleSpeed);\r\n\r\n    this.addEventToCanvas('click', this.onClick);\r\n    document.addEventListener('pointermove', this.onMouseMove);\r\n  }\r\n\r\n  destroy() {\r\n    this.removeEventToCanvas('click', this.onClick);\r\n    document.removeEventListener('pointermove', this.onMouseMove);\r\n\r\n    super.destroy();\r\n  }\r\n\r\n  resize = () => {\r\n    super.resize();\r\n\r\n    this.addDotItemOnTextField();\r\n    DotKineticText.MATCH_MEDIA ? this.onClick({ offsetX: 0, offsetY: 0 })\r\n                               : this.onClick((0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.randomClickInRect)(this.#textField)); // prettier-ignore\r\n  };\r\n\r\n  animate = (curTime) => {\r\n    this.#isKineticActivated ? this.KineticAnimate(curTime) : this.pluckAnimate(); // prettier-ignore\r\n    console.log('Dot Animate');\r\n  };\r\n\r\n  onClick = (event) => {\r\n    if (\r\n      DotKineticText.MATCH_MEDIA &&\r\n      (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.posInRect)({ x: event.offsetX, y: event.offsetY }, this.#textField)\r\n    ) {\r\n      return;\r\n    }\r\n\r\n    this.#dots.forEach((dot) => dot.init());\r\n    this.#pluckCount = 0;\r\n    this.#clickedPos = { x: event.offsetX, y: event.offsetY };\r\n    this.#maxPluckCount = this.ripple.init(this.#clickedPos.x, this.#clickedPos.y, this.#textField); // prettier-ignore\r\n\r\n    this.clearCanvas();\r\n    this.textFrame.drawTextFrame(this.ctx, this.#toBeDrawText, this.stageWidth, this.stageHeight); // prettier-ignore\r\n    this.#isKineticActivated = false;\r\n  };\r\n\r\n  onMouseMove = (event) => {\r\n    this.#mouse.x = event.clientX;\r\n    this.#mouse.y = event.clientY;\r\n  };\r\n\r\n  pluckAnimate() {\r\n    this.ripple.animate();\r\n\r\n    this.#dots\r\n      .filter((dot) => (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.collide)(dot.pos, this.#clickedPos, this.ripple.radius))\r\n      .forEach((dot) => dot.pluckAnimate(this.ctx));\r\n\r\n    const isDonePluckAnimate = this.#pluckCount >= this.#maxPluckCount;\r\n    isDonePluckAnimate ? (this.#isKineticActivated = true) : this.#pluckCount++;\r\n  }\r\n\r\n  KineticAnimate(curTime) {\r\n    this.clearCanvas();\r\n\r\n    let dx, dy, dist, minDist;\r\n    let angle, tx, ty, ax, ay;\r\n\r\n    this.#dots.forEach((dot) => {\r\n      dx = this.#mouse.x - dot.pos.x;\r\n      dy = this.#mouse.y - dot.pos.y;\r\n      dist = Math.sqrt(dx * dx + dy * dy);\r\n      minDist = DotKineticText.RADIUS + this.#mouse.radius;\r\n\r\n      if (dist < minDist) {\r\n        angle = Math.atan2(dy, dx);\r\n        tx = dot.pos.x + Math.cos(angle) * minDist;\r\n        ty = dot.pos.y + Math.sin(angle) * minDist;\r\n        ax = tx - this.#mouse.x;\r\n        ay = ty - this.#mouse.y;\r\n\r\n        dot.posVelocity.vx -= ax;\r\n        dot.posVelocity.vy -= ay;\r\n        dot.collide();\r\n      }\r\n\r\n      dot.kineticAnimate(this.ctx, curTime);\r\n    });\r\n  }\r\n\r\n  addDotItemOnTextField() {\r\n    this.#dots = [];\r\n\r\n    this.#toBeDrawText = this.#isRandomTextMode ? (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.getRandomCharFromText)(this.#text)\r\n                                                : this.#text; // prettier-ignore\r\n\r\n    this.clearCanvas();\r\n    const textData = this.textFrame.drawTextFrame(\r\n      this.ctx,\r\n      this.#toBeDrawText,\r\n      this.stageWidth,\r\n      this.stageHeight\r\n    );\r\n\r\n    const dots = textData.dots;\r\n    this.#textField = textData.textField;\r\n\r\n    dots.forEach((dot) => {\r\n      this.#dots.push(\r\n        new _dot_js__WEBPACK_IMPORTED_MODULE_4__[\"default\"](\r\n          dot,\r\n          this.#dotRadius,\r\n          (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.colorToRGB)(DotKineticText.DOT_COLOR),\r\n          (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.colorToRGB)(DotKineticText.BG_COLOR)\r\n        )\r\n      );\r\n    });\r\n  }\r\n}\r\n\n\n//# sourceURL=webpack://kt.Dot/./src/dotKineticText.js?");

/***/ }),

/***/ "./src/ripple.js":
/*!***********************!*\
  !*** ./src/ripple.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Ripple)\n/* harmony export */ });\n/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ \"./src/utils.js\");\n\r\n\r\nclass Ripple {\r\n  static PLUCK_COUNT_OFFSET = 1.5;\r\n\r\n  #speed;\r\n  #radius;\r\n  #maxRadius;\r\n\r\n  constructor(speed) {\r\n    this.#speed = speed;\r\n  }\r\n\r\n  init(x, y, textField) {\r\n    this.#radius = 0;\r\n    this.#maxRadius = this.#getMaxDistance(x, y, textField);\r\n\r\n    return Math.ceil(this.#maxRadius / this.#speed) * Ripple.PLUCK_COUNT_OFFSET;\r\n  }\r\n\r\n  animate() {\r\n    this.#radius += this.#speed * (this.#radius < this.#maxRadius);\r\n  }\r\n\r\n  #getMaxDistance(x, y, textField) {\r\n    const fromLeftTop = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.distance)(textField.left, textField.top, x, y);\r\n    const fromRightTop = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.distance)(textField.left + textField.width - 1, textField.top, x, y); // prettier-ignore\r\n    const fromLeftBottom = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.distance)(textField.left, textField.top + textField.height - 1, x, y); // prettier-ignore\r\n    const fromRightBottom = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.distance)(textField.left + textField.width - 1, textField.top + textField.height - 1, x, y); // prettier-ignore\r\n\r\n    return Math.max(fromLeftTop, fromRightTop, fromLeftBottom, fromRightBottom);\r\n  }\r\n\r\n  get radius() {\r\n    return this.#radius;\r\n  }\r\n\r\n  set radius(radius) {\r\n    this.#radius = radius;\r\n  }\r\n}\r\n\n\n//# sourceURL=webpack://kt.Dot/./src/ripple.js?");

/***/ }),

/***/ "./src/textFrame.js":
/*!**************************!*\
  !*** ./src/textFrame.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ TextFrame)\n/* harmony export */ });\nclass TextFrame {\r\n  static EVEN_ODD_OFFSET = 6;\r\n\r\n  #fontFormat;\r\n  #pixelSize;\r\n  #bgColor;\r\n\r\n  constructor(fontFormat, pixelSize, bgColor) {\r\n    this.#fontFormat = fontFormat;\r\n    this.#pixelSize = pixelSize;\r\n    this.#bgColor = bgColor;\r\n  }\r\n\r\n  drawTextFrame(ctx, text, stageWidth, stageHeight) {\r\n    ctx.save();\r\n\r\n    ctx.font = this.#fontFormat.font;\r\n    ctx.fillStyle = this.#bgColor;\r\n    ctx.textBaseline = 'middle';\r\n    const fontPos = ctx.measureText(text);\r\n\r\n    ctx.fillText(\r\n      text,\r\n      (stageWidth - fontPos.width) / 2,\r\n      (stageHeight + fontPos.actualBoundingBoxAscent - fontPos.actualBoundingBoxDescent) / 2\r\n    ); // prettier-ignore\r\n\r\n    ctx.restore();\r\n\r\n    const textField = {\r\n      left:(stageWidth - fontPos.width) / 2,\r\n      top: (stageHeight - fontPos.actualBoundingBoxAscent - fontPos.actualBoundingBoxDescent) / 2,\r\n      width: fontPos.width,\r\n      height: fontPos.actualBoundingBoxAscent + fontPos.actualBoundingBoxDescent ,\r\n    }; // prettier-ignore\r\n\r\n    return {\r\n      textField: textField,\r\n      dots: this.#getDotPos(ctx, stageWidth, stageHeight),\r\n    };\r\n  }\r\n\r\n  #getDotPos(ctx, stageWidth, stageHeight) {\r\n    const imageData = ctx.getImageData(0, 0, stageWidth, stageHeight).data; // prettier-ignore\r\n\r\n    const dots = [];\r\n    let alphaValue;\r\n    let x = 0;\r\n    let i = 0;\r\n\r\n    for (let y = 0; y < stageHeight; y += this.#pixelSize) {\r\n      x = (i++ % 2) * TextFrame.EVEN_ODD_OFFSET;\r\n      for (x; x < stageWidth; x += this.#pixelSize) {\r\n        alphaValue = imageData[(x + y * stageWidth) * 4 + 3];\r\n\r\n        if (alphaValue) {\r\n          dots.push({\r\n            x: x,\r\n            y: y,\r\n          });\r\n        }\r\n      }\r\n    }\r\n\r\n    return dots;\r\n  }\r\n}\r\n\n\n//# sourceURL=webpack://kt.Dot/./src/textFrame.js?");

/***/ }),

/***/ "./src/utils.js":
/*!**********************!*\
  !*** ./src/utils.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"PI2\": () => (/* binding */ PI2),\n/* harmony export */   \"collide\": () => (/* binding */ collide),\n/* harmony export */   \"colorToRGB\": () => (/* binding */ colorToRGB),\n/* harmony export */   \"distance\": () => (/* binding */ distance),\n/* harmony export */   \"getRandomCharFromText\": () => (/* binding */ getRandomCharFromText),\n/* harmony export */   \"posInRect\": () => (/* binding */ posInRect),\n/* harmony export */   \"randomClickInRect\": () => (/* binding */ randomClickInRect)\n/* harmony export */ });\nconst PI2 = Math.PI * 2;\r\n\r\nfunction distance(x1, y1, x2, y2) {\r\n  const x = x2 - x1;\r\n  const y = y2 - y1;\r\n\r\n  return Math.sqrt(x * x + y * y);\r\n}\r\n\r\nfunction collide(pos1, pos2, radius) {\r\n  if (distance(pos1.x, pos1.y, pos2.x, pos2.y) <= radius) {\r\n    return true;\r\n  } else {\r\n    return false;\r\n  }\r\n}\r\n\r\nfunction posInRect(pos, rect) {\r\n  if (\r\n    rect.left <= pos.x &&\r\n    pos.x <= rect.left + rect.width - 1 &&\r\n    rect.top <= pos.y &&\r\n    pos.y <= rect.top + rect.height - 1\r\n  ) {\r\n    return true;\r\n  } else {\r\n    return false;\r\n  }\r\n}\r\n\r\nfunction randomClickInRect(rect) {\r\n  const x = rect.left + Math.random() * rect.width;\r\n  const y = rect.top + Math.random() * rect.height;\r\n  return { offsetX: x, offsetY: y };\r\n}\r\n\r\nfunction colorToRGB(color) {\r\n  const colorName = color.toLowerCase();\r\n\r\n  if (colorName.includes('rgb')) {\r\n    const openBracketIndex = colorName.indexOf('(');\r\n    const closeBracketIndex = colorName.indexOf(')');\r\n\r\n    const colorList = colorName\r\n      .substring(openBracketIndex + 1, closeBracketIndex)\r\n      .split(', ');\r\n\r\n    return {\r\n      r: colorList[0],\r\n      g: colorList[1],\r\n      b: colorList[2],\r\n    };\r\n  }\r\n}\r\n\r\nfunction getRandomCharFromText(text) {\r\n  const charList = text.split('');\r\n  return charList[Math.round(Math.random() * (charList.length - 1))];\r\n}\r\n\n\n//# sourceURL=webpack://kt.Dot/./src/utils.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/dotKineticText.js");
/******/ 	__webpack_exports__ = __webpack_exports__["default"];
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});