---
---

// ^^ Do not remove the above front matter, it is required for Jekyll processing

export const baseurl = "{{ site.baseurl }}";

export var pythonURI;
if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
    pythonURI = "http://localhost:8587";  // Same URI for localhost or 127.0.0.1
} else {
    pythonURI = "https://flask.opencodingsociety.com";

}

export var javaURI;
// 127.0.0.1:8585 does not work for some machines
if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
        javaURI = "http://localhost:8585";
} else {
    javaURI = "https://spring.opencodingsociety.com";
}

// Shared across the signup, login, and password-reset OAuth flows (login.md,
// support.md) so the client_id only needs updating in one place.
export const GOOGLE_CLIENT_ID = "{{ site.google_client_id }}";

export var javaWebSocketURI;
if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
    javaWebSocketURI = "http://localhost:8589";
} else {
    javaWebSocketURI = "https://spring.opencodingsociety.com:8589";
}

export const fetchOptions = {
    method: 'GET',  // Default method is GET
    mode: 'cors', // Enable CORS (Cross-Origin Resource Sharing)
    cache: 'default', // Default caching behavior
    credentials: 'include', // Include credentials (cookies, etc.)
    headers: {
        'Content-Type': 'application/json',
        'X-Origin': 'client' // Custom header to identify source
    },
};

// User Login Function (allows both GET and POST)
export function login(options) {
    // Modify the options to use the correct method and include the request body
    const requestOptions  = {
        ...fetchOptions,  // Spread the existing fetchOptions object
        method: options.method || 'POST',  // Dynamically set the method (default to POST)
        body: options.method === 'POST' ? JSON.stringify(options.body) : undefined  // Only add body for POST requests
    };

    const messageEl = document.getElementById(options.message);

    // Clear the message area and any alert left from a previous attempt
    closeLoginAlert();
    messageEl.textContent = "";

    // Fetch JWT from the server
    fetch(options.URL, requestOptions)
    .then(async response => {
        // Trap error response from the Web API
        if (!response.ok) {
            // Show the server's explanation (wrong password, attempts left, lockout)
            // instead of a bare status code.
            const data = await response.json().catch(() => ({}));
            const lines = loginErrorLines(response.status, data);
            console.log(lines.join(' '));
            showLoginAlert(lines, response.status === 423 ? data : null);
            return response;  // Exit early if response is not OK
        }
        // Success: Proceed with callback
        options.callback();
    })
    .catch(error => {
        // Handle network errors
        console.log('Possible CORS or Service Down error: ' + error);
        document.getElementById(options.message).textContent = 'Possible CORS or service down error: ' + error;
    });
}

// 60 -> "1 minute", 180 -> "3 minutes"
function formatMinutes(seconds) {
    const minutes = Math.round(seconds / 60);
    return `${minutes} minute${minutes === 1 ? '' : 's'}`;
}

// Split a failed-login response into the lines shown under the form, e.g.
//   401 Error: Invalid user ID or Password
//   Failed attempts in a row: 1
//   2 more and your account will be locked for 1 minute
function loginErrorLines(status, data) {
    if (data.failed_attempts === undefined) {
        // Not a lockout-aware response (unknown user, other APIs): show it as-is.
        return [`${status} Error: ${data.message || 'Login failed'}`];
    }
    const lines = [
        `${status} Error: ${data.locked ? 'Account locked' : 'Invalid user ID or Password'}`,
        `Failed attempts in a row: ${data.failed_attempts}`,
    ];
    if (data.locked && data.admin_locked) {
        lines.push('Contact an admin to unlock your account');
    } else if (!data.locked) {
        const lockText = data.next_lock_seconds
            ? `locked for ${formatMinutes(data.next_lock_seconds)}`
            : 'locked until an admin unlocks it';
        lines.push(`${data.attempts_until_lock} more and your account will be ${lockText}`);
    }
    // Timed locks get a live countdown in the alert (startLockoutCountdown).
    return lines;
}

// Centered pop-up for a failed login (styles: _sass/open-coding/elements/forms/login-alert.scss).
// The first line is the title; a 423 with a timed lock gets a live countdown.
function showLoginAlert(lines, lockData) {
    closeLoginAlert();
    const backdrop = document.createElement('div');
    backdrop.className = 'login-alert-backdrop';
    const alertBox = document.createElement('div');
    alertBox.className = 'login-alert';
    alertBox.setAttribute('role', 'alertdialog');
    alertBox.setAttribute('aria-modal', 'true');

    const addEl = (tag, className, text) => {
        const el = document.createElement(tag);
        el.className = className;
        el.textContent = text;
        alertBox.appendChild(el);
        return el;
    };
    addEl('div', 'login-alert__icon', lockData ? '🔒' : '!').setAttribute('aria-hidden', 'true');
    alertBox.setAttribute('aria-labelledby', 'login-alert-title');
    addEl('p', 'login-alert__title', lines[0]).id = 'login-alert-title';
    lines.slice(1).forEach(line => addEl('p', 'login-alert__line', line));
    if (lockData && lockData.retry_after_seconds > 0) {
        backdrop._lockoutTimer = startLockoutCountdown(addEl('p', 'login-alert__countdown', ''), lockData.retry_after_seconds);
    }
    const okButton = addEl('button', 'login-alert__button', 'OK');
    okButton.type = 'button';
    okButton.addEventListener('click', closeLoginAlert);

    // Close on the backdrop or Escape, too
    backdrop.addEventListener('click', event => { if (event.target === backdrop) closeLoginAlert(); });
    document.addEventListener('keydown', onLoginAlertKeydown);

    backdrop.appendChild(alertBox);
    document.body.appendChild(backdrop);
    okButton.focus();
}

function onLoginAlertKeydown(event) {
    if (event.key === 'Escape') closeLoginAlert();
}

function closeLoginAlert() {
    const backdrop = document.querySelector('.login-alert-backdrop');
    if (!backdrop) return;
    clearInterval(backdrop._lockoutTimer);
    document.removeEventListener('keydown', onLoginAlertKeydown);
    backdrop.remove();
}

// Live "Try again in m:ss" countdown inside the alert.
// Returns the interval id so closeLoginAlert can stop it.
function startLockoutCountdown(countdownEl, seconds) {
    const unlockAt = Date.now() + seconds * 1000;
    const tick = () => {
        const left = Math.ceil((unlockAt - Date.now()) / 1000);
        if (left <= 0) {
            clearInterval(timer);
            countdownEl.textContent = 'Lockout over. You can try logging in again.';
            return;
        }
        const mins = Math.floor(left / 60);
        const secs = String(left % 60).padStart(2, '0');
        countdownEl.textContent = `Try again in ${mins}:${secs}`;
    };
    const timer = setInterval(tick, 1000);
    tick();
    return timer;
}
