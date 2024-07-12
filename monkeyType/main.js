const $time = document.querySelector('time');
const $paragraph = document.querySelector('p');
const $input = document.querySelector('input');

const INITIAL_TIME = 30;

const TEXT = 'the quick brown fox jumps over the lazy dog and luis is trying to clone monkey type for fun and profit using js for the typing test speed'

let words = [];
let currentTime = INITIAL_TIME;

initGame();
initEvent();

function initGame() { 

    // PRINT GENERAL PARAGRAPH
    words = TEXT.split(' ').slice(0, 32);
    currentTime = INITIAL_TIME;
    $time.textContent = currentTime;
    $paragraph.innerHTML = words.map((word, index) => {
        const letters = word.split('');
        return `<word>
            ${letters.map(letter => `<letter>${letter}</letter>`)
                .join('')}
        </word>`
    }).join('');

    const $firstWord = $paragraph.querySelector('word');
    $firstWord.classList.add('active')
    $firstWord.querySelector('letter').classList.add('active')


    const intervalId = setInterval(() => { 
        currentTime--;
        $time.textContent = currentTime;

        if (currentTime === 0) {
            clearInterval(intervalId)
            console.log('Game Over');
        }

    }, 1000);

}

function initEvent() { 
    document.addEventListener('keydown', () => {
        $input.focus();
    });

    $input.addEventListener('keydown', onkeydown);
    $input.addEventListener('keyup', onkeyup);
}

function onkeydown() { 

}

function onkeyup() { 
    const $currentWord = $paragraph.querySelector('word.active');
    const $currentLetter = $currentWord.querySelector('letter.active');

    const currentWord = $currentWord.innerText.trim();
    $input.maxLength = currentWord.length;
    console.log({ value: $input.value, currentWord });
    
    const $allLetters = $currentWord.querySelectorAll('letter');
    $allLetters.forEach($letter => $letter.classList.remove('correct', 'incorrect'));

    $input.value.split('').forEach((char, index) => { 
        const $letter = $allLetters[index];
        const letterToCheck = currentWord[index];

        const isCorrect = char === letterToCheck;
        const letterClass = isCorrect ? 'correct' : 'incorrect';
        $letter.classList.add(letterClass);

    });

    $currentLetter.classList.remove('active', 'is-last');
    const inputLength = $input.value.length;
    const $nextActiveLetter = $allLetters[inputLength];

    if ($nextActiveLetter) {
        $nextActiveLetter.classList.add('active');
    } else { 
        $currentLetter.classList.add('active', 'is-last');
        // TODO: game over
    }

    $allLetters[inputLength].classList.add('active');
}