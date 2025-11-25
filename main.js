// main.js

// Функция для генерации случайного контрольного слова/кода
function generateControlWord() {
    // Используем комбинацию цифр и случайных букв (например, из кириллицы/латиницы)
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    const codeLength = 6; // Длина кода: 6 символов

    for (let i = 0; i < codeLength; i++) {
        // Добавляем случайный символ из набора
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters.charAt(randomIndex);
    }
    return code;
}

// Функция, которая запускается при загрузке страницы
// Она генерирует код и вставляет его в нужное место на HTML-странице
function displayControlWord() {
    // Получаем сгенерированный код
    const word = generateControlWord();
    
    // Ищем на HTML-странице элемент с id="controlWordDisplay" (который мы создали)
    const displayElement = document.getElementById('controlWordDisplay');
    
    if (displayElement) {
        // Вставляем код, чтобы студент его увидел и произнес
        displayElement.textContent = word;
    }
}

// Запускаем функцию отображения кода, как только страница полностью загрузится
// Это гарантирует, что слово генерируется сразу, когда студент заходит на страницу
document.addEventListener('DOMContentLoaded', displayControlWord);
