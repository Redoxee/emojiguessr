enum CharType {
	Letter,
	Filler,
	FillerChar
}

interface LetterHolder extends HTMLDivElement {
	content: HTMLElement;
	charType: CharType;
}

interface GuessingField extends HTMLDivElement {
	letterPool: LetterHolder[];
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
	
	const allowedChars = /[a-z]|[éè]/gi;
	const letterClassName = "guessing-letter letter";
	const letterFilledClassName = "guessing-letter letter filled";
	const fillerClassName = "guessing-letter filler";
	const fillerCharClassName = "guessing-letter filler-char";

	for (let index = 0; index < 200; ++index) {
		const letter = document.createElement("div") as LetterHolder;
		const letterContent = document.createElement("div");
		letterContent.className = "content";
		letter.content = letterContent;
		letter.appendChild(letterContent);

		guessingField.letterPool.push(letter);

		const wordContainer = document.createElement("div");
		wordContainer.className = "guessing-word";
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
		currentWord.replaceChildren();

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
				letter.className = letterClassName;
				letter.charType = CharType.Letter;
				letter.content.textContent = "_";
				currentWord.appendChild(letter);
			}
			else if(char === ' '){
				this.appendChild(currentWord);

				letter.charType = CharType.Filler;
				letter.className = fillerClassName;
				this.appendChild(letter);
				
				wordCount++;
				currentWord = this.wordContainers[wordCount];
				currentWord.replaceChildren();
			}
			else {
				letter.charType = CharType.FillerChar;
				letter.className = fillerCharClassName;
				letter.content.textContent = char;
				currentWord.appendChild(letter);
			};
		}

		this.append(currentWord);

		while(this.cursor < this.letterPool.length && this.letterPool[this.cursor].charType !== CharType.Letter) {
			this.value += " ";
			this.cursor++;
		}
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
				let letter = this.letterPool[this.cursor];
				while( letter.charType !== CharType.Letter && this.cursor > 0){
					this.value = this.value.substring(0, this.value.length - 1);
					this.cursor--;
					letter = this.letterPool[this.cursor];
				}

				if (letter.charType === CharType.Letter) {
					letter.content.textContent = "_";
					letter.className = letterClassName;
				}
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

		{
			this.value += input;
			let letter = this.letterPool[this.cursor];
			letter.content.textContent = input;
			letter.className = letterFilledClassName;
			this.cursor++;
			letter = this.letterPool[this.cursor];
			while(this.cursor < this.letterPool.length && letter.charType !== CharType.Letter) {
				this.value += " ";
				this.cursor++;
				letter = this.letterPool[this.cursor];
			}
		}
	}

	return guessingField;
}