let model;

async function loadModel() {
    model = await tf.loadLayersModel('./mnist_tfjs_model/model.json');
    console.log("Модель загружена!");
}

async function predictImage() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    // Получаем данные изображения
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let tensor = tf.browser.fromPixels(imageData, 1)
        .resizeNearestNeighbor([28, 28])
        .toFloat()
        .div(tf.scalar(255.0))
        .expandDims(0);

    // Предсказание
    let predictions = model.predict(tensor);
    let predictedLabel = predictions.argMax(1).dataSync()[0];

    document.getElementById("predictionResult").innerText = "Предсказанный класс: " + predictedLabel;
}

document.getElementById('predictButton').addEventListener('click', predictImage);

window.onload = loadModel;
