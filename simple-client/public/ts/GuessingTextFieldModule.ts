interface GuessingField extends HTMLDivElement {
	letterPool:HTMLElement[];
	wordContainers : HTMLDivElement[];
	cursor : number;
	length : number;
	value : String;
	pattern : String;
	configure(pattern : string, forceDisplay: boolean):void;
	input(ch : string):void;
}

function create_guessing_field_element() : GuessingField {
	const guessingField = <GuessingField> document.createElement("div");
	guessingField.className = "guessing-field";
	guessingField.letterPool = [];
	guessingField.wordContainers = [];
	guessingField.cursor = 0;
	guessingField.value = "";
	guessingField.length = 0; 

	var allowedChars = /[a-z]|[éè]/gi;

	for (let index = 0; index < 200; ++index) {
		const letter = document.createElement("div");
		letter.className = "guessing-letter";
		guessingField.letterPool.push(letter);

		const wordContainer = document.createElement("div");
		wordContainer.id = "guessingWord";
		guessingField.wordContainers.push(wordContainer);
	}

	guessingField.configure = function (pattern: string, forceDisplay: boolean):void {
		this.replaceChildren();
		
		this.cursor = 0;
		this.value = "";
		this.length = pattern.length;
		this.pattern = pattern;
		let wordCount : number = 0;
		let currentWord : HTMLDivElement = this.wordContainers[wordCount];

		if(this.length >= this.letterPool.length)
		{
			console.log("pattern is too long");
			return;
		}

		for (let index = 0; index < this.length; ++index) {
			const char = pattern[index];
			let found = char.match(allowedChars);
			const letter = this.letterPool[index];
			if (found && !forceDisplay) {
				letter.id = "letter";
				letter.textContent = "_";
				currentWord.appendChild(letter);
			}
			else if(char === ' '){
				letter.id = "filler";
				this.appendChild(currentWord);
				wordCount++;
				currentWord = this.wordContainers[wordCount];
				this.appendChild(letter);
			}
			else {
				letter.id = "fillerChar";
				letter.textContent = char;
				currentWord.appendChild(letter);
			};
		}

		this.append(currentWord);
	};

	guessingField.input = function(input : string): void {
		if (input === "enter") {
            this.dispatchEvent(new CustomEvent("submit"));
			return;
		} else if (input === "backspace") {
			if (this.cursor > 0)
			{
				this.value = this.value.substring(0, this.value.length - 1);
				this.cursor--;
				while( this.letterPool[this.cursor].id !== "letter" && this.cursor > 0){
					this.value = this.value.substring(0, this.value.length - 1);
					this.cursor--;
				}

				this.letterPool[this.cursor].textContent = "_";
			}

			return;
		}
		else if (input?.length !== 1) {
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
		while(this.cursor < this.letterPool.length && this.letterPool[this.cursor].id !== "letter") {
			this.value += " ";
			this.cursor++;
		}
	}

	return guessingField;
}