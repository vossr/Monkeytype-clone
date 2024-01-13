async function fetchWordList() {
    const response = await fetch('/wordlist.txt');
    let text = await response.text();
    let words = text.split('\n').filter(word => word.trim() !== '');
    words = words.map(word => word.replace(/\r$/, ''));
    return words
}

async function getRandomWords() {
    const words = await fetchWordList();
    const randomWords = new Set();

    while (randomWords.size < 1000 && words.length > randomWords.size) {
        const randomIndex = Math.floor(Math.random() * words.length);
        randomWords.add(words[randomIndex]);
    }

    return Array.from(randomWords);
}

var textElem = document.getElementById("keyLogger");
let userInput = ""
let goalText = ""

textElem.textContent = "Click here"
textElem.style.whiteSpace = "nowrap";

function startGame() {
    getRandomWords().then(randomWords => {
        let words = randomWords.slice(0, 50);
        goalText = words.join(' ');
        userInput = "";
        updateTextElem();
    });
    textElem.style.whiteSpace = "";
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
    startGame();
});

textElem.addEventListener('keydown', function(event) {
    if (event.key == 'Backspace') {
        userInput = userInput.slice(0, -1);
    } else {
        userInput += event.key
    }
    updateTextElem();
});
