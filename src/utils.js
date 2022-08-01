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
