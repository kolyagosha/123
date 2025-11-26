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

// === БЛОК: ФУНКЦИИ ДЛЯ СТРАНИЦЫ 'student_ultimate_quest.html' ===

// 1. ФУНКЦИЯ ГЕНЕРАЦИИ КОНТРОЛЬНОГО СЛОВА
function generateControlWord() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    const codeLength = 6; 

    for (let i = 0; i < codeLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters.charAt(randomIndex);
    }
    return code;
}

// 2. ФУНКЦИЯ ОТОБРАЖЕНИЯ СЛОВА (вызывается при загрузке страницы)
function displayControlWord() {
    const word = generateControlWord();
    const displayElement = document.getElementById('controlWordDisplay');
    
    if (displayElement) {
        displayElement.textContent = word;
    }
}

// 3. ФУНКЦИЯ ОБРАБОТКИ ОТПРАВКИ КВЕСТА
function submitQuest(event) {
    event.preventDefault(); // Предотвращаем перезагрузку страницы
    
    // 1. Сбор данных
    const studentId = localStorage.getItem('currentStudentId') || 'S_UNKNOWN'; // ID студента из локального хранилища
    const controlWord = document.getElementById('controlWordDisplay').textContent;
    const pulseP1 = document.getElementById('pulseP1').value;
    const pulseP2 = document.getElementById('pulseP2').value;
    const pulseP3 = document.getElementById('pulseP3').value;
    const videoFile = document.getElementById('videoUpload').files[0];
    const isConfirmed = document.getElementById('confirmCheckbox').checked;

    // 2. БАЗОВАЯ ПРОВЕРКА
    if (!pulseP1 || !pulseP2 || !pulseP3 || !videoFile || !isConfirmed) {
        document.getElementById('submissionMessage').innerHTML = '<span class="text-danger">Пожалуйста, заполните все поля, загрузите видео и подтвердите выполнение.</span>';
        return;
    }

    // 3. СИМУЛЯЦИЯ ЗАГРУЗКИ ВИДЕО В FIREBASE STORAGE
    // В реальном коде здесь происходит загрузка файла и получение URL.
    const videoURL = `https://firebasestorage.com/videos/${studentId}_${Date.now()}.mp4`; 
    
    // 4. ФОРМИРОВАНИЕ ОБЪЕКТА ДАННЫХ ДЛЯ FIRESTORE
    const questResult = {
        studentId: studentId,
        dateSubmitted: new Date().toISOString(),
        controlWordUsed: controlWord,
        videoURL: videoURL,
        pulseP1: parseInt(pulseP1),
        pulseP2: parseInt(pulseP2),
        pulseP3: parseInt(pulseP3),
        status: 'Ожидает Проверки Преподавателем',
        checkDeadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // Дедлайн проверки: 14 дней
    };

    // 5. СИМУЛЯЦИЯ ЗАПИСИ В FIRESTORE
    // В MVP мы записываем результат в локальное хранилище, чтобы показать его на следующей странице
    localStorage.setItem('lastQuestResult', JSON.stringify(questResult));
    
    document.getElementById('submissionMessage').innerHTML = '<span class="text-success">🎉 Тест отправлен! Переход на страницу статуса...</span>';
    
    setTimeout(() => {
        window.location.href = 'student_dashboard.html'; // Переход на страницу статуса
    }, 1500); 
}


// === ПРИВЯЗКА СОБЫТИЙ ДЛЯ QUEST-СТРАНИЦЫ ===
if (document.getElementById('questSubmissionForm')) {
    document.addEventListener('DOMContentLoaded', () => {
        // Генерируем контрольное слово при загрузке
        displayControlWord(); 
        
        // Привязываем функцию отправки к кнопке
        document.getElementById('questSubmissionForm').addEventListener('submit', submitQuest);
    });
}

// === НОВЫЙ БЛОК: ФУНКЦИИ ДЛЯ СТРАНИЦЫ 'student_dashboard.html' ===

function renderStudentDashboard() {
    const statusContainer = document.getElementById('statusContainer');
    if (!statusContainer) return; // Проверка, что мы на нужной странице

    // 1. Получаем данные последнего квеста
    const resultString = localStorage.getItem('lastQuestResult');
    if (!resultString) {
        statusContainer.innerHTML = '<div class="alert alert-info">Тест еще не сдан. Пожалуйста, сдайте тест на предыдущей странице.</div>';
        return;
    }
    
    const result = JSON.parse(resultString);
    const deadline = new Date(result.checkDeadline);
    const now = new Date();
    
    // СВОДКА ДАННЫХ ВНИЗУ СТРАНИЦЫ
    document.getElementById('controlWordSummary').textContent = result.controlWordUsed;
    document.getElementById('submissionDateSummary').textContent = new Date(result.dateSubmitted).toLocaleDateString('ru-RU');
    document.getElementById('pulseP3Summary').textContent = result.pulseP3;

    // 2. ОПРЕДЕЛЕНИЕ ТЕКУЩЕГО СТАТУСА (СИМУЛЯЦИЯ)
    let statusClass = 'status-on-review';
    let statusText = 'Ожидает Проверки Преподавателем';
    let details = `Крайний срок для проверки: ${deadline.toLocaleDateString('ru-RU')}.`;
    let appealButton = '';

    if (result.status === 'Зачет') {
        statusClass = 'status-passed';
        statusText = '✅ ЗАЧЕТ ПОЛУЧЕН!';
        details = 'Ваш результат был успешно верифицирован.';
    } else if (result.status === 'Не зачет') {
        statusClass = 'status-failed';
        statusText = '❌ НЕ ЗАЧЕТ';
        
        // Логика апелляции: 14 дней + 3 дня буфера
        const appealEndDate = new Date(deadline.getTime() + (3 * 24 * 60 * 60 * 1000));
        const appealEndDateStr = appealEndDate.toLocaleDateString('ru-RU');
        
        details = `Необходимо пересдать тест. Причина: ${result.instructorNotes || 'Форма не соблюдена или читинг.'} 
                   <br>Срок для оспаривания результата: до ${appealEndDateStr} (3 дня).`;
        
        if (now < appealEndDate) {
            appealButton = `<div class="appeal-section">
                                <p class="text-primary fw-bold">Хотите оспорить результат?</p>
                                <button class="btn btn-primary btn-sm" onclick="alert('Заявка на оспаривание отправлена Заведующему Кафедрой!')">
                                    Оспорить результат (До ${appealEndDateStr})
                                </button>
                            </div>`;
        }
    } else if (now > deadline && result.status === 'Ожидает Проверки Преподавателем') {
         // Просрочка, эскалация
        statusClass = 'status-failed';
        statusText = '⚠️ ПРОСРОЧЕН СРОК ПРОВЕРКИ';
        details = `Проверка просрочена. Ваше задание автоматически передано на контроль Заведующему Кафедрой.`;
    }

    // 3. РЕНДЕРИНГ
    statusContainer.innerHTML = `
        <div class="status-box ${statusClass} mb-4">
            <h2>${statusText}</h2>
            <p class="lead">${details}</p>
        </div>
        ${appealButton}
    `;
}

// Привязываем функцию к загрузке страницы, если мы на student_dashboard.html
if (document.getElementById('statusContainer')) {
    document.addEventListener('DOMContentLoaded', renderStudentDashboard);
}
