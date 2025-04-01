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

            // Можно добавить код для предсказания модели здесь
            predictImage();
        }
    };
    
    reader.readAsDataURL(file);
}

// Функция для
