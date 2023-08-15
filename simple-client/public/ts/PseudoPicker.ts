interface PseudoPicker extends HTMLDivElement {
	optionButtons : PseudoPickerPropositionButton[][];
	selectedOptions : number[];
	confirmationButton : HTMLButtonElement;
}

interface PseudoPickerPropositionButton  extends HTMLButtonElement {
	propalIndex : number;
}

function create_pseudonyme_picker() : PseudoPicker {
	const selectionEventName = 'OnPseudoPicked';
	const numberOfProposition = 3;
	const pseudoPicker = document.createElement('div') as PseudoPicker;
	pseudoPicker.className = 'pseudo-picker';
	const range = (start:number, stop:number) => Array.from({ length: (stop - start) + 1 }, (_, i) => start + i);

	pseudoPicker.selectedOptions = Array(pseudonimous_data.length);
	pseudoPicker.optionButtons = Array(pseudonimous_data.length);

	const onOptionSelected = function(wordIndex: number, selectedIndex: number) : void {
		pseudoPicker.selectedOptions[wordIndex] = selectedIndex;
		for(let jdx = 0; jdx < numberOfProposition; ++jdx){
			const btn = pseudoPicker.optionButtons[wordIndex][jdx];
			if (btn.propalIndex === pseudoPicker.selectedOptions[wordIndex]){
				btn.className = 'pseudo-picker-button selected'
			}
			else {
				btn.className = 'pseudo-picker-button'
			}
		}

		for (let index = 0; index < pseudoPicker.selectedOptions.length; ++index) {
			if (pseudoPicker.selectedOptions[index] < 0)
			{
				return;
			}
		}

		pseudoPicker.confirmationButton.style.display = '';
	}

	for (let wordIndex = 0; wordIndex < pseudonimous_data.length; ++wordIndex) {
		const row = document.createElement('div');
		
		row.className = 'pseudo-picker-row';
		pseudoPicker.appendChild(row);
		let availableIndexes = range(0, pseudonimous_data[wordIndex].length);
		
		pseudoPicker.selectedOptions[wordIndex] = -1;
		pseudoPicker.optionButtons[wordIndex] = Array(numberOfProposition);

		for (let propositionIndex = 0; propositionIndex < numberOfProposition; ++propositionIndex) {
			const idx = Math.floor(Math.random() * availableIndexes.length);
			const propalIndex= availableIndexes[idx];
			availableIndexes = availableIndexes.filter((_,i)=>i!==idx);
			const propositionButton = document.createElement('button') as PseudoPickerPropositionButton;
			propositionButton.className = 'pseudo-picker-button';
			propositionButton.textContent = pseudonimous_data[wordIndex][propalIndex];
			propositionButton.propalIndex = propalIndex;
			propositionButton.addEventListener('click', (_)=> {onOptionSelected(wordIndex, propalIndex)});

			row.appendChild(propositionButton);
			pseudoPicker.optionButtons[wordIndex][propositionIndex] = propositionButton;
		}
	}

	const confirmationButton = document.createElement('button');
	confirmationButton.textContent = "That's me!";
	confirmationButton.className = 'pseudo-picker-confirmation';
	confirmationButton.addEventListener('click', ()=>{
		const id = GetSeedFromIndexes(pseudoPicker.selectedOptions[0], pseudoPicker.selectedOptions[1], pseudoPicker.selectedOptions[2]);
		const name = GetNameFromId(id);
		pseudoPicker.dispatchEvent(new CustomEvent(selectionEventName, {detail: {
			name,
			id
		}}));
	});

	confirmationButton.style.display = 'none';

	pseudoPicker.appendChild(confirmationButton);
	pseudoPicker.confirmationButton = confirmationButton;

	return pseudoPicker;
}