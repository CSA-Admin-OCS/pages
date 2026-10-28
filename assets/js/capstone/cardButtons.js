// Button helpers for the /capstone cards. Buttons are plain OCS `ocs__btn` text buttons; the
// label is the button's own text, never a <span>: the theme presets force every span to the
// theme text colour, which can make a label unreadable on a `fill` button.

// Sets (or replaces) a button's label, keeping its colour classes.
export function setLabel(button, label) {
    button.textContent = label;
}

// A new card button with a label.
export function labelButton(className, label) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = className;
    setLabel(button, label);
    return button;
}
