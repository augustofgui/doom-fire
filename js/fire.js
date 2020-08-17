const fireColorsPalette = [{ "r": 7, "g": 7, "b": 7 }, { "r": 31, "g": 7, "b": 7 }, { "r": 47, "g": 15, "b": 7 }, { "r": 71, "g": 15, "b": 7 }, { "r": 87, "g": 23, "b": 7 }, { "r": 103, "g": 31, "b": 7 }, { "r": 119, "g": 31, "b": 7 }, { "r": 143, "g": 39, "b": 7 }, { "r": 159, "g": 47, "b": 7 }, { "r": 175, "g": 63, "b": 7 }, { "r": 191, "g": 71, "b": 7 }, { "r": 199, "g": 71, "b": 7 }, { "r": 223, "g": 79, "b": 7 }, { "r": 223, "g": 87, "b": 7 }, { "r": 223, "g": 87, "b": 7 }, { "r": 215, "g": 95, "b": 7 }, { "r": 215, "g": 95, "b": 7 }, { "r": 215, "g": 103, "b": 15 }, { "r": 207, "g": 111, "b": 15 }, { "r": 207, "g": 119, "b": 15 }, { "r": 207, "g": 127, "b": 15 }, { "r": 207, "g": 135, "b": 23 }, { "r": 199, "g": 135, "b": 23 }, { "r": 199, "g": 143, "b": 23 }, { "r": 199, "g": 151, "b": 31 }, { "r": 191, "g": 159, "b": 31 }, { "r": 191, "g": 159, "b": 31 }, { "r": 191, "g": 167, "b": 39 }, { "r": 191, "g": 167, "b": 39 }, { "r": 191, "g": 175, "b": 47 }, { "r": 183, "g": 175, "b": 47 }, { "r": 183, "g": 183, "b": 47 }, { "r": 183, "g": 183, "b": 55 }, { "r": 207, "g": 207, "b": 111 }, { "r": 223, "g": 223, "b": 159 }, { "r": 239, "g": 239, "b": 199 }, { "r": 255, "g": 255, "b": 255 }];
const boxLimits = [{}];

const canvasFooter = document.getElementById('doom-fire-footer');
const contextFooter = canvasFooter.getContext('2d');

const canvasBaseText = document.createElement('canvas');
const contextBaseText = canvasBaseText.getContext('2d');

const rectWindow = canvasFooter.parentNode.getBoundingClientRect();
const fireWidth = canvasFooter.width = Math.floor(rectWindow.width / 5);
const fireHeight = canvasFooter.height = Math.floor(rectWindow.height / 5);

contextBaseText.font = "30px VT323";
contextBaseText.fillStyle = "red";
contextBaseText.textAlign = "center";
contextBaseText.fillText("Hello World", 0, 0);

const imageData = contextBaseText.getImageData(0, 0, canvasBaseText.width, canvasBaseText.height);

contextFooter.drawImage(canvasBaseText, 0 , 0);

function start() {
  calculateBoxPosition(fireWidth, 40, 0, fireHeight - 40);
  createFireSource(boxLimits[0]);
  renderFire(boxLimits[0]);

  setInterval(calculateFirePropagation, 50, boxLimits[0]);
}

function calculateBoxPosition(width, height, positionX, positionY) {
  const initialPosition = positionY + (positionX * fireWidth);
  const fireIntensityArray = createFireDataStructure(width * height);
  boxLimits[0] = {
    id: "footer",
    width,
    height,
    initialPosition,
    fireIntensityArray,
  }
}

function createFireDataStructure(numberOfPixels) {
  const fireIntensityArray = [];
  for (let i = 0; i < numberOfPixels; i++) {
    fireIntensityArray[i] = 0;
  }
  return fireIntensityArray;
}

function createFireSource(boxObject) {
  for (let column = 0; column < boxObject.width; column++) {
    const overflowCanvasPixel = boxObject.width * boxObject.height;
    const pixelIndex = (overflowCanvasPixel - boxObject.width) + column;

    boxObject.fireIntensityArray[pixelIndex] = 36;
  }
}

function calculateFirePropagation(boxObject) {
  for (let column = 0; column < boxObject.width; column++) {
    for (let row = 0; row < boxObject.height; row++) {
      const currentPixelIndex = column + (boxObject.width * row);

      updateFireIntensityPerPixel(currentPixelIndex, boxObject);
    }
  }
}

function updateFireIntensityPerPixel(currentPixelIndex, boxObject) {
  const belowCurrentPixel = currentPixelIndex + boxObject.width;

  if (!(belowCurrentPixel >= boxObject.width * boxObject.height)) {
    const decay = Math.floor(Math.random() * 3);
    const belowPixelFireIntensity = boxObject.fireIntensityArray[belowCurrentPixel];
    const newFireIntensity = belowPixelFireIntensity - decay >= 0 ? belowPixelFireIntensity - decay : 0;

    boxObject.fireIntensityArray[currentPixelIndex - decay] = newFireIntensity;


    return
  }
}

function renderFire(boxObject) {
  const diffWidth = (fireWidth - boxObject.width);
  const diffHeight = (fireHeight - boxObject.height);
  for (let row = 0; row < boxObject.height; row++) {
    for (let column = 0; column < boxObject.width; column++) {

      const realIndex = column + (row * boxObject.width);
      const fireIntensity = boxObject.fireIntensityArray[realIndex];
      const color = fireColorsPalette[fireIntensity];
      const colorStringRGB = `${color.r},${color.g},${color.b}`;

      contextFooter.fillStyle = `rgb(${colorStringRGB})`;
      contextFooter.fillRect(diffWidth + column, diffHeight + row, 1, 1);
    }
  }
  requestAnimationFrame(() => renderFire(boxObject));
}

start();