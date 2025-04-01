// Загружаем модель TensorFlow.js
let model;

async function loadModel() {
    model = await tf.loadLayersModel('https://aftterdark.github.io/project/mnist_tfjs_model/model.json');
    console.log("Модель загружена!");
}

loadModel(); // Загружаем модель при старте

// Отображение изображения на canvas
const imageInput = document.getElementById('imageInput');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

imageInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
        };
        img.src = URL.createObjectURL(file);
    }
});

// Функция для предсказания цифры
document.getElementById('predictButton').addEventListener('click', () => {
    if (!model) {
        alert('Модель еще не загружена');
        return;
    }

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let imageTensor = tf.browser.fromPixels(imageData, 1);
    imageTensor = tf.image.resizeBilinear(imageTensor, [28, 28]);
    imageTensor = imageTensor.expandDims(0).toFloat().div(tf.scalar(255));

    // Предсказание
    model.predict(imageTensor).data().then(prediction => {
        const predictedClass = prediction.indexOf(Math.max(...prediction));
        document.getElementById('predictionResult').innerText = `Предсказанная цифра: ${predictedClass}`;
    });
});
