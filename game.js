//инициализация DOM элементов
let Select = [
    '#start-btn',
    '#ScreenStart',
    '#ScreenLevelMod',
    '#ScreenLanguages',
    "#ScreenGame",
    "#lost-model-dialog",
    "#win-model-dialog",
    '.programmer-list',
    '.level-list',
    '.allGame',
    '#time',
    '#count',
    '#lives',
    ".game-container"
];

let variableSelect = {};

Select.forEach(element => {
    variableSelect[element] = document.querySelector(element);
});

// инициализация аудио элементов
let audios = [
    "audio/SoundOfBomb.mp3",
    "audio/Click.mp3",
    "audio/EasyMod.mp3",
    "audio/Middle.mp3",
    "audio/hardLevel.mp3",
    "audio/Extreme.mp3",
    "audio/Win.mp3",
    "audio/Lose.mp3"
]

let audioName = {}

audios.forEach((audioItems) => {
    audioName[audioItems] = new Audio(audioItems);
})

//Обьект в виде json для Proxy
let o = {
    exit: 1,
    lives: 3,
    count: 0
}

let level;
let seconds = 0;
let pathLanguage = '';
let pathLevel = '';

let handleLevelAndLanguage = function (level, audioSrc, languageInterval, bombInterval, createBomb, createLanguage) {
    audioName[audioSrc].play();
    setInterval(TimeAndCheck, 1000);
    CreateElements(languageInterval, bombInterval, createBomb, createLanguage);
    return level;
};

//запуск игры, от нажатии на первую кнопку
let handler = function (e) {
    let chosenElement = e.target.closest('.choose-level, .choose-language, #start-btn');

    if (!chosenElement) {
        return;
    }

    let isLevel = chosenElement.classList.contains('choose-level');
    let isLanguage = chosenElement.classList.contains('choose-language');
    let isStart = chosenElement.classList.contains('btn');

    if (isStart) {
        showScreen(variableSelect['#ScreenLevelMod'], variableSelect['#ScreenStart'])
    } else if (isLevel) {
        let imgLevel = e.target.closest('.choose-level').querySelector('img');
        pathLevel = imgLevel.getAttribute('src');
        showScreen(variableSelect['#ScreenLanguages'], variableSelect['#ScreenLevelMod']);
    } else if (isLanguage) {
        let imgLanguage = e.target.closest('.choose-language').querySelector('img');
        pathLanguage = imgLanguage.getAttribute('src');
        showScreen(variableSelect["#ScreenGame"], variableSelect['#ScreenLanguages']);
        switch (pathLevel) {
            case 'images/easyLevel.png':
                level = handleLevelAndLanguage('easy', "audio/EasyMod.mp3", 1900, 2999, 1000, 2000);
                break;
            case "images/middleLevel.png":
                level = handleLevelAndLanguage('middle', "audio/Middle.mp3", 1900, 2999, 500, 750);
                break;
            case 'images/hardLevel.png':
                level = handleLevelAndLanguage('hard', "audio/hardLevel.mp3", 1900, 5000, 300, 750);
                break;
            case 'images/ExtremeLevel.png':
                level = handleLevelAndLanguage('extreme', "audio/Extreme.mp3", 1900, 7000, 500, 750);
                break;
        }
    }
}

document.addEventListener("click", handler);

//Начало создания элементов
let getRandomLocation = function () {
    let width = window.innerWidth - 200; // Учитываем ширину элемента
    let height = window.innerHeight - 200; // Учитываем высоту элемента

    let left = Math.random() * width;
    let top = Math.random() * height;

    return {left, top};
};

let createElement = function (src, top, left, onClick, timeout) {
    let element = document.createElement('img');
    element.src = src;
    element.style.cssText = `
        position: absolute;
        width: 75px;
        height: 75px;
        top: ${top}px;
        left: ${left}px;`;
    variableSelect['.game-container'].appendChild(element);

    element.addEventListener('click', onClick);

    setTimeout(() => {
        if (element && element.parentNode) element.parentNode.removeChild(element);
    }, timeout);
};

let createRandomElement = function (src, onClick, timeout) {
    let { left, top } = getRandomLocation();
    createElement(src, top, left, onClick, timeout);
};

let CreateElements = function (languageInterval, bombInterval, createBomb, createLanguage) {
    setInterval(() => {
        createRandomElement("images/bomb.png", function () {
            check.count -= 10;
            variableSelect['#count'].textContent = `Счет ${check.count}`;
            audioName["audio/SoundOfBomb.mp3"].play();
            check.lives -= 1;
            variableSelect['#lives'].textContent = `Жизней ${check.lives}`;
            this.remove();
        }, createBomb);
    }, bombInterval);

    setInterval(() => {
        createRandomElement(pathLanguage, function () {
            audioName["audio/Click.mp3"].play();
            check.count += 1;
            variableSelect['#count'].textContent = `Счет ${check.count}`;
            this.remove();
        }, createLanguage);
    }, languageInterval);
};

// отслеживание выигрыша/проигрыша
let check = new Proxy(o, {
    set(target, property, value) {
        if (target.exit <= 0) return true;

        target[property] = value;

        if (target.lives <= 0) {
            audioName['audio/Lose.mp3'].play();
            alert('Проигрыш');
            location.reload();
            target.exit -= 1;
        }

        if (target.count >= 100) {
            audioName['audio/Win.mp3'].play();
            alert('Победа');
            location.reload();
            target.exit -= 1;
        }
        return true;
    }
});

let TimeAndCheck = function () {
    requestAnimationFrame(()=> {
        variableSelect['#time'].textContent = `Наиграно уже ${seconds} секунд`;
        seconds++;
    })
}

// функция, нужная для того, чтобы не прописывать по многу раз одну и ту же строку ( скрывает и раскрывает экраны)
let showScreen = function (screenToShow, screenToHide) {
    screenToHide.style.display = "none"

    if (screenToShow) {
        screenToShow.style.display = 'flex';
    };
}