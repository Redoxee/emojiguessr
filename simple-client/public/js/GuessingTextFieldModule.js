"use strict";
var CharType;
(function (CharType) {
    CharType[CharType["Letter"] = 0] = "Letter";
    CharType[CharType["Filler"] = 1] = "Filler";
    CharType[CharType["FillerChar"] = 2] = "FillerChar";
})(CharType || (CharType = {}));
function create_guessing_field_element() {
    const guessingField = document.createElement("div");
    guessingField.className = "guessing-field";
    guessingField.letterPool = [];
    guessingField.wordContainers = [];
    guessingField.cursor = 0;
    guessingField.length = 0;
    const allowedChars = /[a-z]|[éè]/gi;
    const fieldHorizontalShakeClassName = "horizontal-shake";
    const letterClassName = "guessing-letter letter";
    const letterFilledClassName = "guessing-letter letter filled";
    const fillerClassName = "guessing-letter filler";
    const fillerCharClassName = "guessing-letter filler-char";
    const letterCorrectAnswerClassName = "letter-correct-answer";
    const letterCorrectAnswerAnimationClassName = "letter-correct-answer-animation";
    const letterWrongAnswerClassName = "letter-wrong-answer";
    const letterWrongAnswerAnimationClassName = "letter-wrong-answer-animation";
    const letterMoveAnswerClassName = "letter-move-answer";
    const letterMoveAnswerAnimationClassName = "letter-move-answer-animation";
    const shakeDuration = .5;
    guessingField.addEventListener("animationend", () => {
        guessingField.classList.remove(fieldHorizontalShakeClassName);
    });
    for (let index = 0; index < 200; ++index) {
        const letter = document.createElement("div");
        const letterContent = document.createElement("div");
        letterContent.className = "content";
        letter.content = letterContent;
        letter.appendChild(letterContent);
        guessingField.letterPool.push(letter);
        const wordContainer = document.createElement("div");
        wordContainer.className = "guessing-word";
        guessingField.wordContainers.push(wordContainer);
        letter.addEventListener("animationend", (ev) => {
            if (ev.animationName === letterWrongAnswerClassName) {
                letter.classList.remove(letterWrongAnswerAnimationClassName);
                letter.classList.add(letterWrongAnswerClassName);
            }
            else if (ev.animationName === letterMoveAnswerAnimationClassName) {
                letter.classList.remove(letterMoveAnswerAnimationClassName);
                letter.classList.add(letterMoveAnswerClassName);
            }
            else if (ev.animationName === letterCorrectAnswerAnimationClassName) {
                letter.classList.remove(letterCorrectAnswerAnimationClassName);
                letter.classList.add(letterCorrectAnswerClassName);
            }
        });
        letter.style.animationDelay = `${shakeDuration * .9 + index * 0.025}s`;
    }
    guessingField.Configure = function (pattern, forceDisplay) {
        this.replaceChildren();
        this.cursor = 0;
        this.length = pattern.length;
        this.pattern = pattern;
        let wordCount = 0;
        let currentWord = this.wordContainers[wordCount];
        currentWord.replaceChildren();
        if (this.length >= this.letterPool.length) {
            console.log("pattern is too long");
            return;
        }
        for (let index = 0; index < this.length; ++index) {
            const char = pattern[index];
            let found = char.match(allowedChars);
            const letter = this.letterPool[index];
            if (found && !forceDisplay) {
                letter.className = letterClassName;
                letter.charType = CharType.Letter;
                letter.content.textContent = "_";
                currentWord.appendChild(letter);
            }
            else if (char === ' ') {
                this.appendChild(currentWord);
                letter.charType = CharType.Filler;
                letter.className = fillerClassName;
                this.appendChild(letter);
                letter.content.textContent = char;
                wordCount++;
                currentWord = this.wordContainers[wordCount];
                currentWord.replaceChildren();
            }
            else {
                letter.charType = CharType.FillerChar;
                letter.className = fillerCharClassName;
                letter.content.textContent = char;
                currentWord.appendChild(letter);
            }
            ;
        }
        this.append(currentWord);
        while (this.cursor < this.letterPool.length && this.letterPool[this.cursor].charType !== CharType.Letter) {
            this.cursor++;
        }
    };
    guessingField.GetCurrentValue = function () {
        let result = "";
        for (let index = 0; index < this.cursor; ++index) {
            result += this.letterPool[index].content.textContent;
        }
        return result;
    };
    guessingField.Input = function (input) {
        if (input === "enter") {
            let value = this.GetCurrentValue();
            this.dispatchEvent(new CustomEvent("submit", { detail: { value } }));
            return;
        }
        else if (input === "backspace") {
            if (this.cursor > 0) {
                const lastCharIndex = this.cursor;
                this.cursor--;
                let letter = this.letterPool[this.cursor];
                while (letter.charType !== CharType.Letter && this.cursor > 0) {
                    this.cursor--;
                    letter = this.letterPool[this.cursor];
                }
                if (letter.charType === CharType.Letter) {
                    letter.content.textContent = "_";
                    letter.className = letterClassName;
                }
                else {
                    this.cursor = lastCharIndex;
                }
            }
            return;
        }
        else if ((input === null || input === void 0 ? void 0 : input.length) !== 1) {
            console.log(`wrong input "${input}"`);
            return;
        }
        if (this.cursor >= this.length) {
            return;
        }
        let found = input.match(allowedChars);
        if (!found) {
            console.log(`wrong input "${input}"`);
            return;
        }
        {
            let letter = this.letterPool[this.cursor];
            letter.content.textContent = input;
            letter.className = letterFilledClassName;
            this.cursor++;
            letter = this.letterPool[this.cursor];
            while (this.cursor < this.letterPool.length && letter.charType !== CharType.Letter) {
                this.cursor++;
                letter = this.letterPool[this.cursor];
            }
        }
    };
    guessingField.FeedbackAnswer = function (pattern, isCorrect) {
        if (!isCorrect) {
            guessingField.classList.add(fieldHorizontalShakeClassName);
        }
        for (let index = 0; index < this.cursor; ++index) {
            if (index >= pattern.length || pattern[index] === 'X') {
                this.letterPool[index].classList.add(letterWrongAnswerAnimationClassName);
            }
            else if (pattern[index] === 'M') {
                this.letterPool[index].classList.add(letterMoveAnswerAnimationClassName);
            }
            else {
                this.letterPool[index].classList.add(letterCorrectAnswerAnimationClassName);
            }
        }
    };
    return guessingField;
}
