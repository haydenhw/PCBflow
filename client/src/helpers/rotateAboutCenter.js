export default function rotateAboutCenter(boundToSideIndex, rotation, x, y, width, height) {
  if (Number.isInteger(boundToSideIndex)) {
    boundToSideIndex = boundToSideIndex === 3 ? 0 : boundToSideIndex + 1;
  }

  rotation = rotation === 360 ? 0 : rotation;
  switch (rotation) {
    case 0:
      x += 0.5 * (width + height);
      y += 0.5 * (height - width);
      
    case 90:
      x += 0.5 * (width - height);
      y += 0.5 * (width + height);
      
    case 180:
      x -= 0.5 * (width + height);
      y += 0.5 * (width - height);
      
    case 270:
      x -= 0.5 * (width - height);
      y -= 0.5 * (width + height);
      
  }

  rotation += 90;

  return { boundToSideIndex, rotation, x, y };
}
