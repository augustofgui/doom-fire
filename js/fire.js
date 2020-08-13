const firePixelArray = [];
const fireWidth = 100;
const fireHeight = 100;
const fireColorsPalette = [{ "r": 7, "g": 7, "b": 7 }, { "r": 31, "g": 7, "b": 7 }, { "r": 47, "g": 15, "b": 7 }, { "r": 71, "g": 15, "b": 7 }, { "r": 87, "g": 23, "b": 7 }, { "r": 103, "g": 31, "b": 7 }, { "r": 119, "g": 31, "b": 7 }, { "r": 143, "g": 39, "b": 7 }, { "r": 159, "g": 47, "b": 7 }, { "r": 175, "g": 63, "b": 7 }, { "r": 191, "g": 71, "b": 7 }, { "r": 199, "g": 71, "b": 7 }, { "r": 223, "g": 79, "b": 7 }, { "r": 223, "g": 87, "b": 7 }, { "r": 223, "g": 87, "b": 7 }, { "r": 215, "g": 95, "b": 7 }, { "r": 215, "g": 95, "b": 7 }, { "r": 215, "g": 103, "b": 15 }, { "r": 207, "g": 111, "b": 15 }, { "r": 207, "g": 119, "b": 15 }, { "r": 207, "g": 127, "b": 15 }, { "r": 207, "g": 135, "b": 23 }, { "r": 199, "g": 135, "b": 23 }, { "r": 199, "g": 143, "b": 23 }, { "r": 199, "g": 151, "b": 31 }, { "r": 191, "g": 159, "b": 31 }, { "r": 191, "g": 159, "b": 31 }, { "r": 191, "g": 167, "b": 39 }, { "r": 191, "g": 167, "b": 39 }, { "r": 191, "g": 175, "b": 47 }, { "r": 183, "g": 175, "b": 47 }, { "r": 183, "g": 183, "b": 47 }, { "r": 183, "g": 183, "b": 55 }, { "r": 207, "g": 207, "b": 111 }, { "r": 223, "g": 223, "b": 159 }, { "r": 239, "g": 239, "b": 199 }, { "r": 255, "g": 255, "b": 255 }];

const screen = document.getElementById('doom-fire-screen');
const context = screen.getContext('2d');

function start() {
  createFireDataStructure();
  createFireSource();
  renderFire();

  setInterval(calculateFirePropagation, 50)
}

function createFireDataStructure() {
  const numberOfPixels = fireWidth * fireHeight;

  for (let i = 0; i < numberOfPixels; i++) {
    firePixelArray[i] = 0;
  }
}

function createFireSource() {
  for (let column = 0; column < fireWidth; column++) {
    const overflowCanvasPixel = fireWidth * fireHeight;
    const pixelIndex = (overflowCanvasPixel - fireWidth) + column;

    firePixelArray[pixelIndex] = 36;
  }
}

function calculateFirePropagation() {
  for (let column = 0; column < fireWidth; column++) {
    for (let row = 0; row < fireHeight; row++) {
      const pixelIndex = column + (fireWidth * row)

      updateFireIntensityPerPixel(pixelIndex)
    }
  }

}

function updateFireIntensityPerPixel(currentPixelIndex) {
  const belowCurrentPixel = currentPixelIndex + fireWidth;

  if (belowCurrentPixel >= fireWidth * fireHeight) {
    return
  }

  const decay = 1;
  const belowPixelFireIntensity = firePixelArray[belowCurrentPixel];
  const newFireIntensity =
    belowPixelFireIntensity - decay >= 0 ? belowPixelFireIntensity - decay : 0;

  firePixelArray[currentPixelIndex] = newFireIntensity;

  return
}

function renderFire() {
  for (let row = 0; row < fireHeight; row++) {
    for (let column = 0; column < fireWidth; column++) {
      const realIndex = column + (row * fireWidth);
      const fireIntensity = firePixelArray[realIndex];
      const color = fireColorsPalette[fireIntensity];
      const colorStringRGB = `${color.r},${color.g},${color.b}`;

      context.fillStyle = `rgb(${colorStringRGB})`;
      context.fillRect(column, row, 1, 1);
    }
  }

  requestAnimationFrame(renderFire);
}

start();