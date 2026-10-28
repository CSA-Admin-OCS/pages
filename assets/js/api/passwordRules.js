// Password rules shared by the signup form (login.md) and the reset form (support.md).
// Mirrors Person.checkPassword() in Spring. Flask only needs 8 characters, but both
// backends store the same password, so the stricter Spring rule is the one that counts.

export const PASSWORD_RULES = [
    { label: '8+ characters', test: (pw) => pw.length >= 8 },
    { label: 'Uppercase letter', test: (pw) => /[A-Z]/.test(pw) },
    { label: 'Lowercase letter', test: (pw) => /[a-z]/.test(pw) },
    { label: 'Number', test: (pw) => /[0-9]/.test(pw) },
    { label: 'One of ` ~ ! @ # $ % ^ & * ( )', test: (pw) => /[`~!@#$%^&*()]/.test(pw) },
];

export const SPRING_PASSWORD_RULES = 'Password needs 8+ characters with an uppercase letter, a lowercase letter, a number, and one of ` ~ ! @ # $ % ^ & * ( )';

export function meetsSpringPasswordRules(password) {
    return PASSWORD_RULES.every((rule) => rule.test(password));
}

// The password every seeded account starts with (Flask's DEFAULT_PASSWORD). It meets the rules
// above, so it has to be named: login forces a reset for it.
export const DEFAULT_PASSWORD = '123Qwerty!';

// Login forces a password reset for the default password or one that is too weak.
export function mustResetPassword(password) {
    return password === DEFAULT_PASSWORD || !meetsSpringPasswordRules(password);
}

// Renders the rules as a checklist under `input` that ticks off as the user types.
export function attachPasswordChecklist(input) {
    if (!input) return;

    // Plain <ul> styled by the shared OCS grammar (.ocs__checklist), no local CSS.
    const list = document.createElement('ul');
    list.className = 'ocs__checklist';
    list.setAttribute('aria-live', 'polite');

    const items = PASSWORD_RULES.map((rule) => {
        const item = document.createElement('li');
        const box = document.createElement('span');
        box.className = 'ocs__checklist-box';
        box.setAttribute('aria-hidden', 'true');
        item.append(box, rule.label);
        list.appendChild(item);
        return { rule, item };
    });

    const update = () => {
        const password = input.value;
        items.forEach(({ rule, item }) => item.classList.toggle('done', rule.test(password)));
    };

    input.insertAdjacentElement('afterend', list);
    input.addEventListener('input', update);
    update();
}
