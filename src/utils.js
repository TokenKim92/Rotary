export const PI = Math.PI;
export const PI2 = Math.PI * 2;
export const INVALID_ID = -1;
export const DONE = true;
export const SMALL_MODE_RATIO = 0.7;

export function posInRect(pos, rect) {
  if (
    rect.x <= pos.x &&
    pos.x <= rect.x + rect.w &&
    rect.y <= pos.y &&
    pos.y <= rect.y + rect.h
  )
    return true;

  return false;
}

export function isDone(status) {
  return status === DONE;
}

export function isInvalidID(id) {
  return id === INVALID_ID;
}

export function colorToRGB(color) {
  const colorName = color.toLowerCase();

  if (colorName.includes('rgb')) {
    const openBracketIndex = colorName.indexOf('(');
    const closeBracketIndex = colorName.indexOf(')');

    const colorList = colorName
      .substring(openBracketIndex + 1, closeBracketIndex)
      .split(', ');

    return {
      r: colorList[0],
      g: colorList[1],
      b: colorList[2],
    };
  }
}
