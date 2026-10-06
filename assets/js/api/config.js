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
            const errorMsg = `${response.status} Error: ${data.message || 'Login failed'}`;
            console.log(errorMsg);
            messageEl.textContent = errorMsg;
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

// Live "try again in m:ss" countdown under a 423 Locked login message.
function showLockoutCountdown(messageEl, data) {
    const unlockAt = Date.now() + data.retry_after_seconds * 1000;
    const countdown = document.createElement('span');
    countdown.style.display = 'block';
    messageEl.appendChild(countdown);
    const tick = () => {
        const left = Math.ceil((unlockAt - Date.now()) / 1000);
        if (left <= 0) {
            clearInterval(messageEl._lockoutTimer);
            messageEl.textContent = 'Lockout over. You can try logging in again.';
            return;
        }
        const mins = Math.floor(left / 60);
        const secs = String(left % 60).padStart(2, '0');
        countdown.textContent = `Time remaining: ${mins}:${secs}`;
    };
    tick();
    messageEl._lockoutTimer = setInterval(tick, 1000);
}
