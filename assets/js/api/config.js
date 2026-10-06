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

    // Clear the message area and any lockout countdown from a previous attempt
    clearInterval(messageEl._lockoutTimer);
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
            messageEl.textContent = "";
            lines.forEach(line => addMessageLine(messageEl, line));
            if (response.status === 423 && data.retry_after_seconds > 0) {
                showLockoutCountdown(messageEl, data);
            }
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

// One line of a login error, with a blank gap below it so the lines don't run together.
function addMessageLine(messageEl, text) {
    const line = document.createElement('span');
    line.style.display = 'block';
    line.style.marginBottom = '1em';
    line.textContent = text;
    messageEl.appendChild(line);
    return line;
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
    // Timed locks get a live countdown line from showLockoutCountdown.
    return lines;
}

// Live "Try again in m:ss" countdown under a 423 Locked login message.
function showLockoutCountdown(messageEl, data) {
    const unlockAt = Date.now() + data.retry_after_seconds * 1000;
    const countdown = addMessageLine(messageEl, '');
    const tick = () => {
        const left = Math.ceil((unlockAt - Date.now()) / 1000);
        if (left <= 0) {
            clearInterval(messageEl._lockoutTimer);
            messageEl.textContent = '';
            addMessageLine(messageEl, 'Lockout over. You can try logging in again.');
            return;
        }
        const mins = Math.floor(left / 60);
        const secs = String(left % 60).padStart(2, '0');
        countdown.textContent = `Try again in ${mins}:${secs}`;
    };
    tick();
    messageEl._lockoutTimer = setInterval(tick, 1000);
}
