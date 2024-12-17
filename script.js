let model, webcam, resultElement;

async function init() {
  resultElement = document.getElementById("result");
  // Load the model
  model = await tf.loadGraphModel('model/model.json');

  // Set up the webcam
  webcam = await setupWebcam();

  while (true) {
    const img = tf.browser.fromPixels(webcam);
    const predictions = await model.predict(img.expandDims(0));
    resultElement.innerText = predictions;
    img.dispose();
    await tf.nextFrame();
  }
}

async function setupWebcam() {
  const webcam = document.getElementById("webcam");
  webcam.width = 224; webcam.height = 224;

  return new Promise((resolve, reject) => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        webcam.srcObject = stream;
        webcam.addEventListener('loadeddata', () => resolve(webcam));
      })
      .catch(err => reject(err));
  });
}

init();
