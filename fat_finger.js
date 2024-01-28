let cachedWordList = null;

window.onload = async function() {
    const response = await fetch('wordlist.txt');
    let text = await response.text();
    cachedWordList = text.split('\n').filter(word => word.trim() !== '').map(word => word.replace(/\r$/, ''));
};

async function fetchWordList() {
    if (cachedWordList !== null) {
        return cachedWordList;
    }

    const response = await fetch('wordlist.txt');
    let text = await response.text();
    cachedWordList = text.split('\n').filter(word => word.trim() !== '').map(word => word.replace(/\r$/, ''));
    return cachedWordList;
}

async function getRandomWords() {
    const words = await fetchWordList();
    const randomWords = [];

    while (randomWords.length < 1000) {
        const randomIndex = Math.floor(Math.random() * words.length);
        randomWords.push(words[randomIndex]);
    }

    return Array.from(randomWords);
}

var containElem = document.getElementById("contain");
var textElem = document.getElementById("keyLogger");
var timerElem =  document.createElement("div");
timerElem.id = "timer";
timerElem.textContent = "30";
let userInput = ""
let goalText = ""
let startTime = 0

textElem.textContent = "Click here"
textElem.style.whiteSpace = "nowrap";

function updateTimer() {
    time = Date.now();
    let progress = Math.floor((time - startTime) / 1000)
    let gameDurationS = 30
    let timeLeft = gameDurationS - progress
    timerElem.textContent = timeLeft
    if (timeLeft < 1) {
        endGame();
    } else {
        requestAnimationFrame(updateTimer);
    }
}

function endGame() {
    // wpm = keystrokes / 5 / 0.5 minutes
    let wpm = userInput.length / 5 / 0.5
    textElem.innerHTML = '';
    var span = document.createElement('span');
    span.textContent = "wpm = " + wpm
    textElem.appendChild(span);
    textElem.style.whiteSpace = "nowrap";

    var element = document.getElementById("timer");
    element.remove();
    userInput = ""
    goalText = ""
    startTime = 0
}

function initGame() {
    getRandomWords().then(randomWords => {
        let words = randomWords.slice(0, 50);
        goalText = words.join(' ');
        userInput = "";
        updateTextElem();
    });
    textElem.style.whiteSpace = "";
    containElem.prepend(timerElem)
    timerElem.textContent = "30";
}

function startGame() {
    startTime = Date.now();
    requestAnimationFrame(updateTimer);
}

function updateTextElem() {
    textElem.innerHTML = '';
    for (var i = 0; i < goalText.length; i++) {
        if (i == userInput.length) {
            var cursor = document.createElement("span");
            cursor.id = "cursor";
            textElem.appendChild(cursor);
        }

        var span = document.createElement('span');
        span.textContent = goalText[i];
        if (i < userInput.length) {
            if (userInput[i] == goalText[i]) {
                span.style.color = '#d1d0c5';
            } else {
                span.style.color = '#ca4854';
            }
        } else {
            span.style.color = 'grey';
        }
        textElem.appendChild(span);
    }
}

textElem.addEventListener('click', function(event) {
    if (startTime == 0) {
        initGame();
    } else {
        endGame();
    }
});

textElem.addEventListener('keydown', function(event) {
    if (goalText == "") {
        return
    }
    if (startTime == 0) {
        startGame()
    }
    if (event.key == 'Backspace') {
        userInput = userInput.slice(0, -1);
    } else {
        if (event.key.length == 1) {
            userInput += event.key
        }
    }
    updateTextElem();
});
