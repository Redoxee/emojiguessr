"use strict";
function create_pseudonyme_picker() {
    const selectionEventName = 'OnPseudoPicked';
    const numberOfProposition = 3;
    const pseudoPicker = document.createElement('div');
    pseudoPicker.className = 'pseudo-picker';
    const introductionLabel = document.createElement('p');
    introductionLabel.className = 'introduction-label';
    introductionLabel.textContent = 'Who are you ?';
    pseudoPicker.appendChild(introductionLabel);
    const range = (start, stop) => Array.from({ length: (stop - start) + 1 }, (_, i) => start + i);
    pseudoPicker.selectedOptions = Array(pseudonimous_data.length);
    pseudoPicker.optionButtons = Array(pseudonimous_data.length);
    const namePresentation = document.createElement('div');
    namePresentation.className = 'pseudo-picker-name-presentation';
    const label = document.createElement('p');
    label.textContent = 'The ';
    namePresentation.appendChild(label);
    const namePresentationName = document.createElement('div');
    namePresentationName.className = 'pseudo-picker-name-presentation-name';
    namePresentation.appendChild(namePresentationName);
    const finalNameParts = Array(pseudonimous_data.length);
    for (let index = 0; index < pseudonimous_data.length; ++index) {
        const namePart = document.createElement('div');
        namePart.className = 'pseudo-picker-name-part';
        namePresentationName.appendChild(namePart);
        const namePartInner = document.createElement('div');
        namePart.appendChild(namePartInner);
        finalNameParts[index] = namePartInner;
        namePartInner.addEventListener('animationend', () => {
            namePartInner.classList.remove('pseudo-picker-part-selected');
        });
    }
    const onOptionSelected = function (wordIndex, selectedIndex) {
        pseudoPicker.selectedOptions[wordIndex] = selectedIndex;
        for (let jdx = 0; jdx < numberOfProposition; ++jdx) {
            const btn = pseudoPicker.optionButtons[wordIndex][jdx];
            if (btn.propalIndex === pseudoPicker.selectedOptions[wordIndex]) {
                btn.className = 'pseudo-picker-button selected';
            }
            else {
                btn.className = 'pseudo-picker-button';
            }
        }
        const namePartNode = finalNameParts[wordIndex];
        namePartNode.textContent = pseudonimous_data[wordIndex][selectedIndex];
        if (!namePartNode.classList.contains('pseudo-picker-part-selected')) {
            namePartNode.classList.add('pseudo-picker-part-selected');
        }
        for (let index = 0; index < pseudoPicker.selectedOptions.length; ++index) {
            if (pseudoPicker.selectedOptions[index] < 0) {
                return;
            }
        }
        pseudoPicker.confirmationButton.style.display = '';
    };
    const nameOptionsNode = document.createElement('div');
    nameOptionsNode.className = 'pseudo-picker-content';
    pseudoPicker.appendChild(nameOptionsNode);
    for (let wordIndex = 0; wordIndex < pseudonimous_data.length; ++wordIndex) {
        const group = document.createElement('div');
        group.className = 'pseudo-picker-group';
        nameOptionsNode.appendChild(group);
        let availableIndexes = range(0, pseudonimous_data[wordIndex].length);
        pseudoPicker.selectedOptions[wordIndex] = -1;
        pseudoPicker.optionButtons[wordIndex] = Array(numberOfProposition);
        for (let propositionIndex = 0; propositionIndex < numberOfProposition; ++propositionIndex) {
            const idx = Math.floor(Math.random() * availableIndexes.length);
            const propalIndex = availableIndexes[idx];
            availableIndexes = availableIndexes.filter((_, i) => i !== idx);
            const propositionButton = document.createElement('button');
            propositionButton.className = 'pseudo-picker-button';
            propositionButton.textContent = pseudonimous_data[wordIndex][propalIndex];
            propositionButton.propalIndex = propalIndex;
            propositionButton.addEventListener('click', (_) => { onOptionSelected(wordIndex, propalIndex); });
            group.appendChild(propositionButton);
            pseudoPicker.optionButtons[wordIndex][propositionIndex] = propositionButton;
        }
    }
    const confirmationButton = document.createElement('button');
    confirmationButton.textContent = "That's me!";
    confirmationButton.className = 'pseudo-picker-confirmation';
    confirmationButton.addEventListener('click', () => {
        const id = GetSeedFromIndexes(pseudoPicker.selectedOptions[0], pseudoPicker.selectedOptions[1], pseudoPicker.selectedOptions[2]);
        const name = GetNameFromId(id);
        pseudoPicker.dispatchEvent(new CustomEvent(selectionEventName, { detail: {
                name,
                id
            } }));
    });
    confirmationButton.style.display = 'none';
    namePresentation.appendChild(confirmationButton);
    pseudoPicker.appendChild(namePresentation);
    pseudoPicker.confirmationButton = confirmationButton;
    return pseudoPicker;
}
