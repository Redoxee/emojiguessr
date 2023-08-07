"use strict";
function create_guessing_field_element() {
    const guessingField = document.createElement("div");
    guessingField.className = "guessing-field";
    guessingField.letterPool = [];
    guessingField.cursor = 0;
    guessingField.value = "";
    guessingField.length = 0;
    var allowedChars = /[a-z]|[éè]/gi;
    for (let index = 0; index < 200; ++index) {
        const letter = document.createElement("div");
        letter.className = "guessing-letter";
        guessingField.letterPool.push(letter);
    }
    guessingField.configure = function (pattern) {
        this.replaceChildren();
        this.cursor = 0;
        this.value = "";
        this.length = pattern.length;
        if (this.length >= this.letterPool.length) {
            console.log("pattern is too long");
            return;
        }
        for (let index = 0; index < this.length; ++index) {
            const char = pattern[index];
            let found = char.match(allowedChars);
            const letter = this.letterPool[index];
            if (found) {
                letter.id = "letter";
            }
            else {
                letter.id = "filler";
            }
            ;
            letter.textContent = "_";
            this.appendChild(letter);
        }
    };
    guessingField.input = function (input) {
        if (input === "enter") {
            this.dispatchEvent(new CustomEvent("submit"));
            return;
        }
        else if (input === "backspace") {
            if (this.cursor > 0) {
                this.value = this.value.substring(0, this.value.length - 1);
                this.cursor--;
                while (this.letterPool[this.cursor].id !== "letter" && this.cursor > 0) {
                    this.value = this.value.substring(0, this.value.length - 1);
                    this.cursor--;
                }
                this.letterPool[this.cursor].textContent = "_";
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
        this.value += input;
        this.letterPool[this.cursor].textContent = input;
        this.cursor++;
        while (this.cursor < this.letterPool.length && this.letterPool[this.cursor].id !== "letter") {
            this.value += " ";
            this.cursor++;
        }
    };
    return guessingField;
}
