import { words as INITIAL_WORDS} from './data.js'

const $time = document.querySelector('time');
const $paragraph = document.querySelector('p');
const $input = document.querySelector('input');
const $game = document.querySelector('#game');
const $result = document.querySelector('#results');
const $wpm = $result.querySelector('#results-wpm');
const $accuracy = $result.querySelector('#results-accuracy');
const $button = document.querySelector('#reload-button');


const INITIAL_TIME = 10;

const TEXT = 'the quick brown fox jumps over the lazy dog and luis is trying to clone monkey type for fun and profit using js for the typing test speed'

let words = [];
let currentTime = INITIAL_TIME;

initGame();
initEvent();

function initGame() { 
    $game.style.display = 'flex';
    $result.style.display = 'none';
    $input.value = '';
    // PRINT GENERAL PARAGRAPH
    words = INITIAL_WORDS.toSorted(
        () => Math.random() - 0.5
    ).slice(0, 50);
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
            clearInterval(intervalId);
            gameOver();
        }

    }, 1000);

}

function initEvent() { 
    document.addEventListener('keydown', () => {
        $input.focus();
    });

    $input.addEventListener('keydown', onkeydown);
    $input.addEventListener('keyup', onkeyup);
    $button.addEventListener('click', initGame);
}

function onkeydown(event) { 
    const $currentWord = $paragraph.querySelector('word.active')
    const $currentLetter = $currentWord.querySelector('letter.active')
    const { key } = event;
    if (key === ' ') { 
        // evita reacción ante el espacio
        event.preventDefault();

        //pasar a la siguiente palabra
        const $nextWord = $currentWord.nextElementSibling;
        const $nextLetter = $nextWord.querySelector('letter')

        $currentWord.classList.remove('active', 'marked');
        $currentLetter.classList.remove('active');

        $nextWord.classList.add('active');
        $nextLetter.classList.add('active');

        $input.value = '';

        const hasMissedLetter = $currentWord
            .querySelectorAll('letter:not(.correct)').length > 0

        const classToAd = hasMissedLetter ? 'marked' : 'correct';
        $currentWord.classList.add(classToAd);
        return;
    }
    if (key === 'Backspace') { 
        const $prevWord = $currentWord.previousElementSibling;
        const $prevLetter = $currentLetter.previousElementSibling;
        if (!$prevWord && !$prevLetter) { 
            event.preventDefault();
            return;
        }

        const $wordMarked = $paragraph.querySelector('word.marked');
        if ($wordMarked && !$prevLetter) { 
            event.preventDefault();
            $prevWord.classList.remove('marked');
            $prevWord.classList.add('active');

            const $letterToGo = $prevWord.querySelector('letter:last-child');

            $currentLetter.classList.remove('active');
            $letterToGo.classList.add('active');

            $input.value = [
                ...$prevWord.querySelectorAll('letter.correct')
            ].map($el => $el.innerText).join('');

        }

    }
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

    //$allLetters[inputLength].classList.add('active');
}

function gameOver() { 
    $game.style.display = 'none';
    $result.style.display = 'flex';

    const correctWords = $paragraph.querySelectorAll('word.correct').length;
    const correctLetters = $paragraph.querySelectorAll('letter.correct').length;
    const incorrectLetters = $paragraph.querySelectorAll('letter.incorrect').length;

    const totalLetters = correctLetters + incorrectLetters
    const accuracy = totalLetters > 0
        ? (correctLetters / totalLetters) * 100
        : 0;
    
    const wpm = correctWords * 60 / INITIAL_TIME;
    $wpm.textContent = wpm;
    $accuracy.textContent = `${accuracy.toFixed(2)}%`;
}