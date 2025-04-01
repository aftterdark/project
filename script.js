let model;
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const fileInput = document.getElementById('file-input');
const resultElement = document.getElementById('result');

// Загрузка модели
async function loadModel() {
    model = await tf.loadGraphModel('./mnist_tfjs_model/model.json');
    console.log('Модель загружена');
}

// Обработка изображения с холста
function preprocessImage() {
    // Считываем изображение с холста и конвертируем в тензор
    let image = tf.browser.fromPixels(canvas);
    image = image.mean(2).toFloat().expandDims(0).expandDims(-1).div(tf.scalar(255));
    return image;
}

// Отображение изображения на холсте
fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    const img = new Image();
    img.onload = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
        predict();  // Начинаем предсказание сразу после загрузки изображения
    };
    img.src = URL.createObjectURL(file);
});

// Выполнение предсказания
async function predict() {
    const image = preprocessImage();
    const predictions = await model.predict(image).data();
    const predictedClass = predictions.indexOf(Math.max(...predictions));
    resultElement.innerText = `Предсказанный класс: ${predictedClass}`;
}

// Загружаем модель при запуске страницы
window.onload = loadModel;
