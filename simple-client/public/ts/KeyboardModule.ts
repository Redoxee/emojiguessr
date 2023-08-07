interface KeyboardElement extends HTMLDivElement {
}

interface LayoutCollection {
	[name: string]: string[][]
}

const layouts : LayoutCollection = {
	azerty : [
		["a","z","e","r","t","y","u","i","o","p","⌫"],
		["q","s","d","f","g","h","j","k","l","m","↵"],
		["w","x","c","v","b","n","é","è"]
	],

	qwerty : [
		["q","w","e","r","t","y","u","i","o","p","⌫"],
		["a","s","d","f","g","h","j","k","l","↵"],
		["z","x","c","v","b","n","m","é","è"]
	]
}

function create_keyboard_element(layout_name : string) : KeyboardElement {
	const layout = layouts[layout_name] || layouts.qwerty;

	const input_event_name = "OnCustomKeyBoardInput";
	const kb = <KeyboardElement>document.createElement("div");
	kb.className = "keyboard";
	layout.forEach(row => {
		const rowElement = document.createElement("div");
		rowElement.className="keyboard-row";
		kb.appendChild(rowElement);
		row.forEach(key => {
			const btn = document.createElement("button");
			btn.textContent = key;
			btn.className = "keyboard-key";
			rowElement.appendChild(btn);

			btn.onclick=_=>{
				let value = key;
				if (key === "⌫") {
					value = "backspace";
				} else if (key === "↵") {
					value = "enter";
				}

				kb.dispatchEvent(new CustomEvent(input_event_name,{detail:value}));
			};
			
		});
	});

	document.addEventListener("keyup", (e) => {
		if(e.isComposing || e.ctrlKey) {
			return;
		}

		let pressedKey = String(e.key).toLowerCase()
		if (pressedKey === "backspace") {
			kb.dispatchEvent(new CustomEvent(input_event_name,{detail:pressedKey}));
			return;
		}
	
		if (pressedKey === "enter") {
			kb.dispatchEvent(new CustomEvent(input_event_name,{detail:pressedKey}));
			return;
		}
	
		let found = pressedKey.match(/[a-z]|[éè]/gi)
		if (found && found.length === 1) {
			kb.dispatchEvent(new CustomEvent(input_event_name,{detail:pressedKey}));
			return;
		}
	});
	
	return kb;
}