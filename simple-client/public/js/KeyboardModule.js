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
function create_keyboard_element(layout_name) {
    const layout = layouts[layout_name] || layouts.qwerty;
    const input_event_name = "OnCustomKeyBoardInput";
    const kb = document.createElement("div");
    kb.className = "keyboard";
    const keyPressedFeedbackClass = "keyboard-key-pressed-feedback";
    const keys = {};
    layout.forEach(row => {
        const rowElement = document.createElement("div");
        rowElement.className = "keyboard-row";
        kb.appendChild(rowElement);
        row.forEach(key => {
            const btn = document.createElement("button");
            btn.textContent = key;
            btn.className = "keyboard-key";
            rowElement.appendChild(btn);
            const keyName = key === "⌫" ? "backspace" : key === "↵" ? "enter" : key;
            btn.onclick = _ => {
                kb.dispatchEvent(new CustomEvent(input_event_name, { detail: keyName }));
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
            kb.dispatchEvent(new CustomEvent(input_event_name, { detail: pressedKey }));
            return;
        }
        if (pressedKey === "enter") {
            kb.dispatchEvent(new CustomEvent(input_event_name, { detail: pressedKey }));
            return;
        }
        let found = pressedKey.match(/[a-z]|[éè]/gi);
        if (found && found.length === 1) {
            kb.dispatchEvent(new CustomEvent(input_event_name, { detail: pressedKey }));
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
    return kb;
}
