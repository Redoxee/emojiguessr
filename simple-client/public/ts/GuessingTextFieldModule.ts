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
	pattern : String;
	Configure(pattern : string, forceDisplay: boolean):void;
	Input(ch : string) : void;
	GetCurrentValue() : string;
}

function create_guessing_field_element() : GuessingField {
	const guessingField = <GuessingField> document.createElement("div");
	guessingField.className = "guessing-field";
	guessingField.letterPool = [];
	guessingField.wordContainers = [];
	guessingField.cursor = 0;
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

	guessingField.Configure = function (pattern: string, forceDisplay: boolean):void {
		this.replaceChildren();
		
		this.cursor = 0;
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
			};
		}

		this.append(currentWord);

		while(this.cursor < this.letterPool.length && this.letterPool[this.cursor].charType !== CharType.Letter) {
			this.cursor++;
		}
	};

	guessingField.GetCurrentValue = function() : string {
		let result = "";
		for (let index = 0; index < this.cursor; ++index) {
			result += this.letterPool[index].content.textContent;
		}

		return result;
	}

	guessingField.Input = function(input : string): void {
		if (input === "enter") {
			let value = this.GetCurrentValue();
            this.dispatchEvent(new CustomEvent("submit",{detail:{value}}));
			return;
		} else if (input === "backspace") {
			if (this.cursor > 0)
			{
				this.cursor--;
				let letter = this.letterPool[this.cursor];
				while( letter.charType !== CharType.Letter && this.cursor > 0){
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
			let letter = this.letterPool[this.cursor];
			letter.content.textContent = input;
			letter.className = letterFilledClassName;
			this.cursor++;
			letter = this.letterPool[this.cursor];
			while(this.cursor < this.letterPool.length && letter.charType !== CharType.Letter) {
				this.cursor++;
				letter = this.letterPool[this.cursor];
			}
		}
	}

	return guessingField;
}