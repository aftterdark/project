let model;

// Функция для загрузки модели
async function loadModel() {
    try {
        model = await tf.loadLayersModel('https://aftterdark.github.io/project/mnist_tfjs_model/model.json');
        console.log("Модель загружена!");
    } catch (error) {
        console.error("Ошибка при загрузке модели:", error);
    }
}

// Загружаем модель при старте
loadModel();

// Отображение изображения на canvas
const imageInput = document.getElementById('imageInput');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Когда изображение выбирается, рисуем его на canvas
imageInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const img = new Image();
        img.onload = () => {
            // Обрезаем изображение до квадратного формата 28x28 пикселей
            canvas.width = 28;
            canvas.height = 28;
            ctx.drawImage(img, 0, 0, 28, 28);
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
    let imageTensor = tf.browser.fromPixels(imageData, 1); // Используем 1 для черно-белого изображения
    imageTensor = tf.image.resizeBilinear(imageTensor, [28, 28]);
    imageTensor = imageTensor.expandDims(0).toFloat().div(tf.scalar(255));

    // Предсказание
    model.predict(imageTensor).data().then(prediction => {
        const predictedClass = prediction.indexOf(Math.max(...prediction));
        document.getElementById('predictionResult').innerText = `Предсказанная цифра: ${predictedClass}`;
    }).catch(err => {
        console.error("Ошибка при предсказании:", err);
    });
});
