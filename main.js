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

// В MVP мы симулируем данные из Firestore. В реальном проекте это будет запрос к базе.
const mockStudentData = [
    { id: 'S001', name: 'Иванов Иван (ПМ-21)', code: 'ALPHA123', assignedInstructorId: 'I001' },
    { id: 'S002', name: 'Петрова Анна (ЮР-20)', code: 'BETA456', assignedInstructorId: 'I002' },
    { id: 'S003', name: 'Сидоров Олег (ЭК-22)', code: 'GAMMA789', assignedInstructorId: 'I001' }
];

// Функция для переключения поля ограничений
function toggleRestrictionField() {
    const isChecked = document.getElementById('healthRestriction').checked;
    document.getElementById('restrictionDetails').style.display = isChecked ? 'block' : 'none';
}

// === ОБРАБОТЧИК ВЕРИФИКАЦИИ КОДОМ (ШАГ 1) ===
function handleVerification(event) {
    event.preventDefault();
    const studentId = document.getElementById('studentSelect').value;
    const universityCode = document.getElementById('universityCode').value.toUpperCase().trim();
    const message = document.getElementById('verificationMessage');
    
    // 1. Поиск студента в моковой базе
    const selectedStudent = mockStudentData.find(s => s.id === studentId);

    if (!studentId) {
        message.innerHTML = '<span class="text-danger">Пожалуйста, выберите себя из списка.</span>';
        return;
    }

    if (selectedStudent && selectedStudent.code === universityCode) {
        // УСПЕХ!
        message.innerHTML = '<span class="text-success">✅ Код верен! Переходим к созданию аккаунта...</span>';
        
        // В реальном коде сохраняем ID студента в локальное хранилище
        localStorage.setItem('currentStudentId', studentId); 
        
        // 2. Скрываем первый этап и показываем второй
        document.getElementById('verificationSection').style.display = 'none';
        document.getElementById('setupSection').style.display = 'block';
        
    } else {
        // ОШИБКА
        message.innerHTML = '<span class="text-danger">❌ Неверный код или студент. Проверьте данные.</span>';
    }
}

// === ОБРАБОТЧИК СОЗДАНИЯ ПРОФИЛЯ (ШАГ 2) ===
function handleSetup(event) {
    event.preventDefault();
    const studentId = localStorage.getItem('currentStudentId');
    const email = document.getElementById('userEmail').value;
    const password = document.getElementById('userPassword').value;
    // ... (сбор остальных полей: age, height, weight, restrictionUpload) ...
    const message = document.getElementById('setupMessage');

    // 1. Здесь должен быть вызов Firebase Authentication для регистрации (email, password)
    // 2. Здесь должен быть вызов Firebase Storage для загрузки справки (если есть)
    // 3. Здесь должен быть вызов Firestore для записи данных профиля

    // В MVP мы симулируем успех:
    message.innerHTML = '<span class="text-success">🎉 Аккаунт создан! Переход к тесту...</span>';
    
    // После успешной записи в Firebase
    setTimeout(() => {
        window.location.href = 'student_ultimate_quest.html'; // Переход к тесту
    }, 1500); 
}

// Привязка обработчиков событий (Запускается на странице student_login.html)
if (document.getElementById('verificationForm')) {
    document.addEventListener('DOMContentLoaded', () => {
        document.getElementById('verificationForm').addEventListener('submit', handleVerification);
        document.getElementById('setupForm').addEventListener('submit', handleSetup);
        document.getElementById('healthRestriction').addEventListener('change', toggleRestrictionField);
        
        // Вставка функции toggleRestrictionField в глобальную область видимости, чтобы она работала с onchange в HTML
        window.toggleRestrictionField = toggleRestrictionField;
    });
}
