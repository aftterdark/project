// Обработчик загрузки изображения
async function loadImage(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Преобразуем изображение в объект Image
    const img = new Image();
    const reader = new FileReader();
    
    reader.onload = function(e) {
        img.src = e.target.result;
        img.onload = () => {
            const canvas = document.getElementById('canvas');
            const ctx = canvas.getContext('2d');

            // Отображаем изображение на canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        }
    };
    
    reader.readAsDataURL(file);
}

// Функция предсказания
async function predictImage() {
    const canvas = document.getElementById('canvas');
    const imageData = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
    let image = tf.browser.fromPixels(imageData);
    image = image.mean(2).expandDims(-1).toFloat().div(tf.scalar(255)); // Преобразование изображения

    // Преобразуем изображение, чтобы оно подходило для входа в модель
    image = image.expandDims(0);

    // Загружаем модель TensorFlow.js
    const model = await tf.loadLayersModel('mnist_tfjs_model/model.json');

    // Предсказание
    const prediction = model.predict(image);
    const predictedClass = prediction.argMax(-1).dataSync()[0];

    // Выводим результат
    document.getElementById('predictionResult').textContent = `Предсказанный класс: ${predictedClass}`;
}
