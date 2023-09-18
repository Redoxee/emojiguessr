"use strict";
const layouts = {
    azerty: [
        ["a", "z", "e", "r", "t", "y", "u", "i", "o", "p", "⌫"],
        ["q", "s", "d", "f", "g", "h", "j", "k", "l", "m", "↵"],
        ["w", "x", "c", "v", "b", "n", "é", "è"]
    ],
    qwerty: [
        ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "⌫"],
        ["a", "s", "d", "f", "g", "h", "j", "k", "l", "↵"],
        ["z", "x", "c", "v", "b", "n", "m", "é", "è"]
    ]
};
class KeyboardElement {
    constructor(layoutName) {
        const keyPressedFeedbackClass = "keyboard-key-pressed-feedback";
        const input_event_name = "OnCustomKeyBoardInput";
        layoutName = layoutName || "qwerty";
        const layout = layouts[layoutName] || layouts.qwerty;
        const keys = {};
        this.root = document.createElement('div');
        this.root.className = 'keyboard-element';
        layout.forEach(row => {
            const rowElement = document.createElement("div");
            rowElement.className = "keyboard-row";
            this.root.appendChild(rowElement);
            row.forEach(key => {
                const btn = document.createElement("button");
                btn.textContent = key;
                btn.className = "keyboard-key";
                btn.setAttribute('part', 'keyboard-key');
                rowElement.appendChild(btn);
                const keyName = key === "⌫" ? "backspace" : key === "↵" ? "enter" : key;
                btn.onclick = _ => {
                    this.root.dispatchEvent(new CustomEvent(input_event_name, { detail: keyName }));
                };
                keys[keyName] = btn;
            });
        });
        const handleKeyboardEvent = (e) => {
            if (e.isComposing || e.ctrlKey) {
                return;
            }
            let pressedKey = String(e.key).toLowerCase();
            const button = keys[pressedKey];
            if (button && !button.classList.contains(keyPressedFeedbackClass)) {
                keys[pressedKey].classList.add(keyPressedFeedbackClass);
            }
            if (pressedKey === "backspace") {
                this.root.dispatchEvent(new CustomEvent(input_event_name, { detail: pressedKey }));
                return;
            }
            if (pressedKey === "enter") {
                this.root.dispatchEvent(new CustomEvent(input_event_name, { detail: pressedKey }));
                return;
            }
            let found = pressedKey.match(/[a-z]|[éè]/gi);
            if (found && found.length === 1) {
                this.root.dispatchEvent(new CustomEvent(input_event_name, { detail: pressedKey }));
                return;
            }
        };
        document.addEventListener("keydown", (e) => {
            handleKeyboardEvent(e);
        });
        document.addEventListener("keyup", (e) => {
            let pressedKey = String(e.key).toLowerCase();
            const button = keys[pressedKey];
            if (button && button.classList.contains(keyPressedFeedbackClass)) {
                button.classList.remove(keyPressedFeedbackClass);
            }
        });
    }
}
