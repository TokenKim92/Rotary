export const PI = Math.PI;
export const PI2 = Math.PI * 2;
export const INVALID_ID = -1;
export const DONE = true;

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
