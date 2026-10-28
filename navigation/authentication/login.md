---
layout: page
title: Login
permalink: /login
search_exclude: true
show_reading_time: false
---
<br>

<script src="https://accounts.google.com/gsi/client" async defer></script>

<!-- Student/Mentor selector: switches the signup form and wording. Where an account goes after
     login (student, pending mentor, verified mentor) is always decided by Spring's roles. -->
<section class="login-role">
    <h3 class="login-role__title">Create an Account</h3>
    <div class="ocs__links login-role__options" role="group" aria-label="Account type" aria-describedby="accountRoleHint">
        <button type="button" class="ocs__btn pill accent fill" data-account-role="student" aria-pressed="true">Student</button>
        <button type="button" class="ocs__btn pill" data-account-role="mentor" aria-pressed="false">Mentor</button>
    </div>
    <div id="accountRoleHint" class="login-role__hint">Students sign up with their school information and Google account.</div>
</section>

<div class="login-container">
    <!-- Python Login Form -->
    <div class="login-card">
        <h1 id="pythonTitle">User Login</h1>
        <hr>
        <div id="loginPending" class="login-notice login-notice--pending" role="status" hidden>
            <h3>Verification Pending</h3>
            <p>Your account is not active yet. A Teacher or Admin must verify and activate it before you can log in.</p>
            <p>Your account and signup information are saved, so you won't need to register again.</p>
        </div>
        <form id="pythonForm" onsubmit="loginBoth(); return false;">
            <div class="form-group">
                <input type="text" id="uid" placeholder="GitHub ID" required>
            </div>
            <div class="form-group">
                <input type="password" id="password" placeholder="Password" required>
            </div>
            <p>
                <button type="submit" class="large primary submit-button">Login</button>
            </p>
            <div id="message" class="login-message" role="alert"></div>
            <!-- Shown after login when a student's verification has lapsed -->
            <div id="reverify" style="display: none; text-align: center;">
                <h3>School Email Verification</h3>
                <p>Your verification has lapsed. Sign in with your school Google account to continue.</p>
                <div class="g_id_signin"
                     data-type="standard"
                     data-size="large"
                     data-theme="filled_blue"
                     data-text="signin_with"
                     data-shape="rectangular"
                     data-logo_alignment="left"></div>
                <p id="reverify-status"></p>
            </div>
            <p>
                <a href="{{site.baseurl}}/support?topic=reset">Forgot your password?</a>
            </p>
        </form>
    </div>
    <div class="signup-card">
        <h1 id="signupTitle">Sign Up</h1>
        <hr>
        <div id="signupMentorPending" class="login-notice login-notice--pending" role="status" hidden>
            <h3>Mentor Verification Pending</h3>
            <p>Your mentor account has been created. A Teacher or Admin must verify and activate it before you can log in.</p>
            <p>You will be able to log in normally once your account has been verified.</p>
        </div>
        <!-- Google OAuth Section (initially hidden) -->
        <div id="oauth-verification" hidden>
            <h3>School Email Verification</h3>
            <p id="oauth-copy-student">
                Please sign in with your school Google account to verify you're a Poway USD student or teacher.
                <br><strong>You must use an email ending in @stu.powayusd.com or @powayusd.com</strong>
            </p>
            <div id="g_id_onload"
                 data-client_id="{{ site.google_client_id }}"
                 data-callback="handleGoogleSignIn"
                 data-auto_prompt="false">
            </div>
            <div class="g_id_signin" 
                 data-type="standard"
                 data-size="large"
                 data-theme="filled_blue"
                 data-text="signin_with"
                 data-shape="rectangular"
                 data-logo_alignment="left">
            </div>
            <button type="button" class="large secondary" onclick="showSignupForm()">
                ← Back to Form
            </button>
            <div id="oauth-status"></div>
        </div>
        <!-- Signup Form -->
        <form id="signupForm" onsubmit="handleSignupSubmit(event);">
            <p id="mentorSignupNote" class="login-notice" hidden>
                You are creating a <strong>mentor account</strong>. Mentor accounts require administrator verification before access to the mentor portal is granted.
            </p>
            <div class="form-group">
                <select id="signupRole">
                    <option value="student" selected>I am a Student</option>
                    <option value="mentor">I am a Mentor</option>
                    <option value="guest" id="guestOption" hidden disabled>I am a guest</option>
                </select>
                <p id="guest-note" hidden>
                    A guest can view pages, comment on the microblog and react to posts. It needs no GitHub or school
                    account, and it lasts only a few hours. Guest sign-up is open until <span id="guest-closes"></span>:
                    log in with the same account during a later guest window to come back.
                </p>
            </div>
            <div class="form-group">
                <input type="text" id="name" placeholder="Name" required>
            </div>
            <div class="form-group">
                <input type="text" id="signupUid" placeholder="GitHub ID" aria-describedby="github-id-validation-message" required>
                <div id="github-id-validation-message" class="validation-message error" aria-live="polite"></div>
            </div>
            <div class="form-group" id="signupSidGroup">
                <input type="text" id="signupSid" placeholder="Student ID" required>
            </div>
            <div class="form-group" id="signupSchoolGroup">
                <select id="signupSchool" required>
                    <option value="" disabled selected>Select Your High School</option>
                    <option value="Abraxas High School">Abraxas</option>
                    <option value="Del Norte High School">Del Norte</option>
                    <option value="Mt Carmel High School">Mt Carmel</option>
                    <option value="Poway High School">Poway</option>
                    <option value="Poway to Palomar">Poway to Palomar</option>
                    <option value="Rancho Bernardo High School">Rancho Bernardo</option>
                    <option value="Westview High School">Westview</option>
                </select>
            </div>
            <div class="form-group">
                <input type="email" id="signupEmail" placeholder="Personal (not school) Email" required>
            </div>
            <div class="form-group">
                <input type="password" id="signupPassword" placeholder="Password" required>
            </div>
            <!-- Confirm Password Field -->
            <div class="form-group">
                <input type="password" id="confirmPassword" placeholder="Confirm Password" required>
                <div id="password-validation-message" class="validation-message"></div>
            </div>
            <p>
                <button type="submit" class="large primary submit-button">Sign Up</button>
            </p>
            <!-- Backend Status Display -->
            <div class="backend-status">
                <div id="flaskStatus" class="status-item">
                    <span class="status-icon">⏳</span>
                    <span class="status-text">Flask</span>
                </div>
                <div id="springStatus" class="status-item">
                    <span class="status-icon">⏳</span>
                    <span class="status-text">Spring</span>
                </div>
            </div>
            <div id="overallStatus" class="overall-status hidden"></div>
        </form>
    </div>
</div>

<script type="module">
    import { login, pythonURI, javaURI, fetchOptions, GOOGLE_CLIENT_ID, springEnabled } from '{{site.baseurl}}/assets/js/api/config.js';
    import { fetchPerson, clearRoleViewCache } from '{{site.baseurl}}/assets/js/api/role-view.js';
    import { reverifyNeeded, staffMustVerify, reverify } from '{{site.baseurl}}/assets/js/api/reverify.js';
    import { SPRING_PASSWORD_RULES, meetsSpringPasswordRules, attachPasswordChecklist, mustResetPassword } from '{{site.baseurl}}/assets/js/api/passwordRules.js';

    let signupFormData = {};
    let verifiedSchoolEmail = null;
    let validationTimeout = null;

    const accountTypeSelect = document.getElementById('signupRole');

    function isMentorMode() {
        return accountTypeSelect.value === 'mentor';
    }

    // The pills just set the account type select, so there is one source of truth.
    function selectAccountRole(button) {
        accountTypeSelect.value = button.dataset.accountRole;
        accountTypeSelect.dispatchEvent(new Event('change'));
    }

    // Selected option uses the OCS "accent fill" pill; the other stays a plain pill.
    function showSelectedAccountRole() {
        document.querySelectorAll('[data-account-role]').forEach(option => {
            const selected = option.dataset.accountRole === accountTypeSelect.value;
            option.setAttribute('aria-pressed', String(selected));
            option.classList.toggle('accent', selected);
            option.classList.toggle('fill', selected);
        });
    }

    const STUDENT_ID_AS_GITHUB_ID_PATTERN = /^\d{7}$/;

    function validateGithubId() {
        const githubIdField = document.getElementById('signupUid');
        const messageDiv = document.getElementById('github-id-validation-message');

        const isStudentId = STUDENT_ID_AS_GITHUB_ID_PATTERN.test(githubIdField.value.trim());
        const message = isStudentId ? 'Enter your GitHub ID, not your 7-digit student ID.' : '';

        githubIdField.setCustomValidity(message);
        messageDiv.textContent = message;
        return !isStudentId;
    }

    document.getElementById('signupUid').addEventListener('input', validateGithubId);

    // Mentor signup has no Google step: Flask creates the account inactive until a Teacher/Admin
    // activates it in Account Administration. Student ID and school are hidden by the
    // signupRole change listener below.
    function updateSignupModeUI() {
        const isMentor = isMentorMode();
        document.getElementById('signupEmail').placeholder = isMentor ? 'Personal Email' : 'Personal (not school) Email';
        document.getElementById('mentorSignupNote').hidden = !isMentor;
        document.getElementById('signupMentorPending').hidden = true;
        document.getElementById('signupTitle').textContent = isMentor ? 'Mentor Sign Up' : 'Sign Up';
        document.getElementById('accountRoleHint').textContent = isMentor
            ? 'Mentor accounts require administrator verification before access to the mentor portal is granted.'
            : 'Students sign up with their school information and Google account.';
        document.getElementById('overallStatus').classList.add('hidden');
        window.showSignupForm();
        validateGithubId();
    }

    accountTypeSelect.addEventListener('change', () => {
        showSelectedAccountRole();
        updateSignupModeUI();
    });
    document.querySelectorAll('[data-account-role]').forEach(button => button.addEventListener('click', () => selectAccountRole(button)));

    // Password validation with debouncing (1.5 second delay)
    function validatePasswordsDebounced() {
        // Clear existing timeout
        if (validationTimeout) {
            clearTimeout(validationTimeout);
        }

        // Set new timeout for 1.5 seconds
        validationTimeout = setTimeout(() => {
            validateForm();
        }, 1500);
    }

    function validateForm() {
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const confirmField = document.getElementById('confirmPassword');
        const messageDiv = document.getElementById('password-validation-message');

        // Clear previous validation styles
        confirmField.classList.remove('password-match', 'password-mismatch', 'password-length');
        messageDiv.classList.remove('success', 'error');

        // Don't validate if confirm password is empty
        if (confirmPassword === '') {
            messageDiv.textContent = '';
            return true;
        }

        if (!meetsSpringPasswordRules(password)) {
            confirmField.classList.add('password-length');
            messageDiv.classList.add('error');
            messageDiv.textContent = `✗ ${SPRING_PASSWORD_RULES}`;
            return false;
        }

        if (password === confirmPassword) {
            confirmField.classList.add('password-match');
            messageDiv.classList.add('success');
            messageDiv.textContent = '✓ Passwords match';
            return true;
        } else {
            confirmField.classList.add('password-mismatch');
            messageDiv.classList.add('error');
            messageDiv.textContent = '✗ Passwords do not match';
            return false;
        }
    }

    // Form submission validation
    function validateSignupForm() {
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (!validateGithubId()) {
            document.getElementById('signupUid').reportValidity();
            document.getElementById('signupUid').focus();
            return false;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match. Please try again.');
            document.getElementById('confirmPassword').focus();
            return false;
        }

        if (!meetsSpringPasswordRules(password)) {
            alert(SPRING_PASSWORD_RULES);
            document.getElementById('signupPassword').focus();
            return false;
        }

        return true;
    }

    // Backend status management
    function updateBackendStatus(backend, status, message = '') {
        const element = document.getElementById(`${backend}Status`);
        const icon = element.querySelector('.status-icon');
        const text = element.querySelector('.status-text');

        // Remove existing status classes
        element.classList.remove('pending', 'success', 'error');

        switch(status) {
            case 'pending':
                element.classList.add('pending');
                icon.textContent = '⏳';
                text.textContent = backend.charAt(0).toUpperCase() + backend.slice(1);
                break;
            case 'success':
                element.classList.add('success');
                icon.textContent = '✅';
                text.textContent = `${backend.charAt(0).toUpperCase() + backend.slice(1)} ✓`;
                break;
            case 'error':
                element.classList.add('error');
                icon.textContent = '❌';
                text.textContent = `${backend.charAt(0).toUpperCase() + backend.slice(1)} ✗`;
                break;
        }
    }

    function updateOverallStatus(springErrorMessage = '', flaskErrorMessage = '') {
        const flaskEl = document.getElementById('flaskStatus');
        const springEl = document.getElementById('springStatus');
        const overallEl = document.getElementById('overallStatus');

        const flaskSuccess = flaskEl.classList.contains('success');
        const springSuccess = springEl.classList.contains('success');
        const flaskError = flaskEl.classList.contains('error');
        const springError = springEl.classList.contains('error');

        overallEl.classList.remove('hidden', 'success', 'partial', 'error');

        // A Flask-only site (spring: false in _config.yml), or a guest, creates the account in Flask alone.
        if (!usesSpring()) {
            overallEl.classList.add(flaskSuccess ? 'success' : 'error');
            overallEl.textContent = flaskSuccess
                ? '🎉 Account created! You can now login.'
                : `❌ Signup failed: ${flaskErrorMessage || 'the account could not be created.'} Please check your details and try again.`;
            return;
        }
        if (flaskSuccess && springSuccess) {
            overallEl.classList.add('success');
            overallEl.textContent = '🎉 Account created on both backends! You can now login.';
        } else if (flaskSuccess && springError) {
            overallEl.classList.add('partial');
            // Without a Spring account, DMs, calendar and announcements fail after login,
            // so say why Spring failed instead of implying everything works.
            overallEl.textContent = '⚠️ Flask account created, but Spring signup failed'
                + (springErrorMessage ? `: ${springErrorMessage}` : '.')
                + ' DMs, calendar and announcements need a working Spring account. Ask your teacher to fix it before logging in.';
        } else if (flaskError && springSuccess) {
            overallEl.classList.add('partial');
            overallEl.textContent = '⚠️ Spring account created! Flask failed - please try again.';
        } else if (flaskError) {
            // Flask is tried first and Spring only after Flask succeeds, so Spring was not tried
            overallEl.classList.add('error');
            overallEl.textContent = `❌ Signup failed: ${flaskErrorMessage || 'the account could not be created.'}`
                + ' Please check your details and try again.';
        }
    }

    // Spring is used when the site has it. A guest never gets a Spring account: it would be a full account.
    function usesSpring() {
        return springEnabled && signupFormData.accountType !== 'guest';
    }

    // A Flask-only site has no Spring account, so sign-up shows only Flask's status.
    if (!springEnabled) document.getElementById('springStatus').style.display = 'none';

    // A guest can sign up only while a Teacher or Admin has the Guest Window open, so the option is
    // offered only then. If Flask cannot be asked, it stays hidden.
    async function offerGuestOption() {
        try {
            const response = await fetch(`${pythonURI}/api/guest/window`, fetchOptions);
            const guestWindow = response.ok ? await response.json() : null;
            if (!guestWindow || guestWindow.open !== true) return;
            const option = document.getElementById('guestOption');
            option.hidden = false;
            option.disabled = false;
            // Flask gives UTC with no zone mark: say so, so the time shown is the visitor's own
            document.getElementById('guest-closes').textContent =
                new Date(guestWindow.closes_at + 'Z').toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
        } catch (_) {
            // no Guest Window to offer
        }
    }
    offerGuestOption();

    // A mentor or a guest has no student ID or school, so those fields are hidden and not required.
    // A guest is asked for an email only to keep one account, so it is optional for them.
    document.getElementById('signupRole').addEventListener('change', function () {
        const noSchool = this.value === 'mentor' || this.value === 'guest';
        const email = document.getElementById('signupEmail');
        email.required = this.value !== 'guest';
        email.placeholder = this.value === 'guest' ? 'Email (optional, helps you keep one account)' : 'Personal (not school) Email';
        document.getElementById('guest-note').hidden = this.value !== 'guest';
        if (springEnabled) document.getElementById('springStatus').style.display = noSchool ? 'none' : '';
        ['signupSid', 'signupSchool'].forEach(id => {
            const field = document.getElementById(id);
            field.required = !noSchool;
            field.closest('.form-group').style.display = noSchool ? 'none' : '';
        });
    });

    window.handleSignupSubmit = function(event) {
        event.preventDefault();

        // Validate form
        const form = document.getElementById('signupForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        // Check password confirmation
        if (!validateSignupForm()) {
            return;
        }

        // A mentor or a guest has no student ID or school: do not send what was typed before the role changed.
        const role = document.getElementById("signupRole").value;
        const hasSchool = role !== 'mentor' && role !== 'guest';

        // Store form data
        signupFormData = {
            role: 'student',
            name: document.getElementById("name").value,
            uid: document.getElementById("signupUid").value,
            sid: hasSchool ? document.getElementById("signupSid").value : '',
            school: hasSchool ? document.getElementById("signupSchool").value : '',
            email: document.getElementById("signupEmail").value,
            password: document.getElementById("signupPassword").value,
            accountType: document.getElementById("signupRole").value,
        };
        if (role === 'guest' && !signupFormData.email) delete signupFormData.email;  // optional for a guest

        // A mentor cannot use a school email, so they skip it and wait for a Teacher/Admin
        // to verify the account. A guest needs no verification at all. A student verifies with
        // Google first.
        if (signupFormData.accountType === 'mentor' || signupFormData.accountType === 'guest') {
            signup();
        } else {
            showOAuthVerification();
        }
    }

    function showOAuthVerification() {
        // Starting a signup drops any re-verification that was waiting on the same Google button
        reverifying = false;
        document.getElementById('reverify').style.display = 'none';
        document.getElementById('signupForm').hidden = true;
        document.getElementById('oauth-verification').hidden = false;
    }

    window.showSignupForm = function() {
        document.getElementById('oauth-verification').hidden = true;
        document.getElementById('signupForm').hidden = false;
        clearOAuthStatus();
    }

    function clearOAuthStatus() {
        document.getElementById('oauth-status').innerHTML = '';
    }

    function showOAuthStatus(message, isError = false) {
        const statusDiv = document.getElementById('oauth-status');
        statusDiv.innerHTML = `<div class="${isError ? 'oauth-error' : 'oauth-success'}">${message}</div>`;
    }

    // After login, a student whose verification has lapsed signs in with Google once more.
    // The same Google button callback serves signup and this, so it needs to know which.
    let reverifying = false;
    let afterReverify = null;

    async function finishReverify(idToken) {
        const status = document.getElementById('reverify-status');
        status.className = '';
        status.textContent = 'Checking with Google...';
        const result = await reverify(pythonURI, fetchOptions, idToken);
        if (!result.ok) {
            status.className = 'oauth-error';
            status.textContent = result.message;
            return;
        }
        reverifying = false;
        document.getElementById('reverify').style.display = 'none';
        afterReverify();
    }

    window.handleGoogleSignIn = function(response) {
        if (reverifying) {
            finishReverify(response.credential);
            return;
        }
        try {
            const userInfo = parseJwt(response.credential);
            const email = userInfo.email;
            // Students need no admin approval: a school email is the only check, and the
            // account is created as soon as it passes (same as Open-Coding-Society/pages).
            if (!email.endsWith('@stu.powayusd.com') && !email.endsWith('@powayusd.com')) {
                showOAuthStatus('❌ You must use your school email address ending with @stu.powayusd.com or @powayusd.com', true);
                return;
            }
            verifiedSchoolEmail = email;
            // Spring verifies this token itself, so it travels with the signup data.
            signupFormData.idToken = response.credential;
            showOAuthStatus(`✅ School email verified: ${email}`);

            setTimeout(() => {
                document.getElementById('oauth-verification').hidden = true;
                document.getElementById('signupForm').hidden = false;

                signup();
            }, 1500);

        } catch (error) {
            console.error("Error handling Google Sign-In:", error);
            showOAuthStatus('❌ Error processing Google Sign-In. Please try again.', true);
        }
    }

    function parseJwt(token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    }

    // Initialize password validation when page loads
    window.addEventListener('load', function() {
        updateSignupModeUI();

        const passwordField = document.getElementById('signupPassword');
        const confirmPasswordField = document.getElementById('confirmPassword');

        attachPasswordChecklist(passwordField);

        if (passwordField && confirmPasswordField) {
            // Add debounced validation listeners
            passwordField.addEventListener('input', validatePasswordsDebounced);
            confirmPasswordField.addEventListener('input', validatePasswordsDebounced);
        }

        if (window.google && window.google.accounts) {
            window.google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: handleGoogleSignIn
            });
        }
    });

    // Function to handle both Python and Java login simultaneously
    window.loginBoth = function () {
        // Wrap both logins in Promises and only redirect after both finish. A Flask-only site
        // (spring: false in _config.yml) signs in to Flask alone, so Spring counts as logged in.
        let javaPromise = springEnabled
            ? new Promise((resolve) => { window.javaLogin(resolve); })
            : Promise.resolve({ ok: true });
        let pythonPromise = new Promise((resolve) => {
            window.pythonLogin(resolve);
        });
        document.getElementById('loginPending').hidden = true;
        Promise.allSettled([javaPromise, pythonPromise]).then(async ([javaOutcome, pythonOutcome]) => {
            // pythonLogin resolves with Flask's login body, or false when Flask refused. A mentor
            // created before the Flask signup exists only in Spring, so a Flask failure alone does not stop the login.
            const flaskBody = pythonOutcome.value;
            // An inactive account (a mentor awaiting a Teacher/Admin) is not let in or asked to re-verify.
            if (flaskBody && flaskBody.user && flaskBody.user.active === false) {
                await clearFlaskSession();
                document.getElementById('message').textContent = '';
                document.getElementById('loginPending').hidden = false;
                return;
            }
            // The default or a weak password must be reset before anything else (see passwordRules.js).
            if (flaskBody && mustResetPassword(document.getElementById('password').value)) {
                await clearFlaskSession();
                logoutSpring();
                showPasswordResetRequired();
                return;
            }
            const finish = async () => {
                // A limited account (a guest) has no Spring account and no profile: it goes to the home page.
                if (flaskBody && flaskBody.user && flaskBody.user.limited) {
                    window.location.href = '{{site.baseurl}}/';
                    return;
                }
                // Spring decides the mentor/student view (see role-view.js).
                const person = springEnabled ? await fetchPerson() : null;
                if (person || (flaskBody && !springEnabled)) {
                    // A Spring-only account (a mentor) must not inherit an earlier Flask
                    // login: the navbar asks Flask first and would show that person instead.
                    if (!flaskBody) await clearFlaskSession();
                    // A new session starts in the account's own view (mentor for mentors).
                    clearRoleViewCache();
                    window.location.href = '{{site.baseurl}}/profile';
                    return;
                }
                if (flaskBody) {
                    showSpringLoginWarning();
                    return;
                }
                document.getElementById('message').textContent = springEnabled
                    ? await describeLoginFailure(javaOutcome.value)
                    : 'Invalid login.';
            };
            if (reverifyNeeded(flaskBody)) {
                reverifying = true;
                afterReverify = finish;
                document.getElementById('reverify').style.display = 'block';
                return;
            }
            if (staffMustVerify(flaskBody)) {
                showStaffVerifyNotice(finish);
                return;
            }
            finish();
        });
    };

    // Drops the Spring session too, so a forced reset does not leave the user half signed in.
    function logoutSpring() {
        fetch(`${javaURI}/api/logout`, { ...fetchOptions, method: 'POST' })
            .catch(error => console.warn('Spring logout after forced reset failed:', error.message));
    }

    function showPasswordResetRequired() {
        const messageEl = document.getElementById('message');
        messageEl.innerHTML = '';
        messageEl.append(
            'Your password is the default or too weak, so you must reset it before you log in. ',
            springLink('{{site.baseurl}}/support?topic=reset', 'Reset your password'),
        );
    }

    // Drops a Flask session left over from an earlier login on this browser.
    async function clearFlaskSession() {
        try {
            await fetch(`${pythonURI}/api/authenticate`, { ...fetchOptions, method: 'DELETE' });
        } catch (error) {
            console.warn('Could not clear the earlier Flask session:', error.message);
        }
    }

    // A Mentor's verification has lapsed. Only a Teacher or Admin can verify it, and the
    // account still works, so say so and let them carry on.
    function showStaffVerifyNotice(finish) {
        const messageEl = document.getElementById('message');
        const carryOn = springLink('{{site.baseurl}}/profile', 'Continue');
        carryOn.addEventListener('click', (event) => {
            event.preventDefault();
            finish();
        });
        messageEl.innerHTML = '';
        messageEl.append(
            'Your verification has lapsed. Ask your Teacher or Admin to verify your account. ',
            carryOn,
        );
    }
    // Flask accepted the login but Spring did not. The navbar would still show the
    // user as signed in, while every Spring feature returns 401, so say so here.
    function showSpringLoginWarning() {
        const messageEl = document.getElementById('message');
        messageEl.innerHTML = '';
        messageEl.append(
            'Signed in to Flask, but the Spring server rejected this login, so DMs, calendar and announcements will not work. '
            + 'Your Spring password may differ from your Flask password. ',
            springLink(`${javaURI}/mvc/person/reset`, 'Reset your Spring password'),
            ' or ask your teacher, then log in again. ',
            springLink('{{site.baseurl}}/profile', 'Continue anyway'),
        );
    }
    function springLink(href, label) {
        const link = document.createElement('a');
        link.href = href;
        link.textContent = label;
        return link;
    }

    // Explains why login did not reach a live Spring session. Mentor accounts live in
    // Spring only, so the Spring login result is what tells a bad password from a real
    // "not verified yet" account.
    async function describeLoginFailure(springLogin) {
        if (springLogin?.reason === 'rejected') {
            return `Invalid login (${springLogin.status}).`;
        }
        if (springLogin?.reason === 'unreachable') {
            return 'Could not reach the Spring server. Make sure it is running, then try again.';
        }
        return 'Spring accepted the login but the session was not kept. Open this site at http://localhost:4500 (not 127.0.0.1) and try again.';
    }
    // Function to handle Python login
    window.pythonLogin = function (done) {
        const options = {
            URL: `${pythonURI}/api/authenticate`,
            callback: function(body) {
                if (done) done(body);
            },
            message: "message",
            // Flask decides student logins (see loginBoth above). A Flask failure must
            // still let the flow finish, because a mentor account exists only in Spring;
            // loginBoth shows the error if neither backend accepted the login.
            onFailure: function() {
                document.getElementById("message").textContent = "";
                if (done) done(false);
            },
            method: "POST",
            cache: "no-cache",
            body: {
                uid: document.getElementById("uid").value,
                password: document.getElementById("password").value,
            }
        };
        login(options);
        // If login() is not async, call done() immediately
        // if (done) done();
    }
    // Function to handle Java login
    window.javaLogin = function (done) {
        const loginURL = `${javaURI}/authenticate`;
        const databaseURL = `${javaURI}/api/person/get`;
        const userCredentials = JSON.stringify({
            uid: document.getElementById("uid").value,
            password: document.getElementById("password").value,
        });
        const loginOptions = {
            ...fetchOptions,
            method: "POST",
            body: userCredentials,
        };
        console.log("Attempting Java login...");
        fetch(loginURL, loginOptions)
            .then(response => {
                if (!response.ok) {
                    const rejection = new Error("Invalid login");
                    rejection.outcome = { ok: false, reason: 'rejected', status: response.status };
                    throw rejection;
                }
                return response.text();
            })
            .then(data => {
                console.log("Login successful!", data);
                // Do not redirect here
                // Fetch database after login success using fetchOptions
                return fetch(databaseURL, fetchOptions);
            })
            .then(response => {
                if (!response.ok) {
                    const sessionError = new Error(`Spring server response: ${response.status}`);
                    sessionError.outcome = { ok: false, reason: 'session', status: response.status };
                    throw sessionError;
                }
                return response.json();
            })
            .then(data => {
                console.log("Java database response:", data);
                if (done) done({ ok: true });
            })
            .catch(error => {
                console.error("Spring login failed:", error.message);
                // mentor mode reads this outcome to explain the failure
                if (done) done(error.outcome || { ok: false, reason: 'unreachable' });
            });
    };
    window.signup = async function () {
        const signupButton = document.querySelector(".signup-card button");
        // Disable the button and change its color
        signupButton.disabled = true;
        signupButton.classList.add("disabled");
        // Reset status indicators
        updateBackendStatus('flask', 'pending');
        if (usesSpring()) updateBackendStatus('spring', 'pending');
        document.getElementById('overallStatus').classList.add('hidden');

        const data = signupFormData && Object.keys(signupFormData).length > 0 ? signupFormData : {
            role: 'student',
            name: document.getElementById("name").value,
            uid: document.getElementById("signupUid").value,
            sid: document.getElementById("signupSid").value,
            school: document.getElementById("signupSchool").value,
            email: document.getElementById("signupEmail").value,
            password: document.getElementById("signupPassword").value,
        };

        const signupDataJava = {
            uid: data.uid,
            sid: data.sid,
            email: data.email,
            dob: "11-01-2024",
            name: data.name,
            password: data.password,
            kasmServerNeeded: data.kasm_server_needed,
            idToken: data.idToken,
            accountType: data.role,
        };

        if (verifiedSchoolEmail) {
            console.log("Account created with verified school email:", verifiedSchoolEmail);
        }

        // Never log `data`: it holds the plaintext password and the Google ID token.

        const flaskRequest = {
            ...fetchOptions,
            method: "POST",
            body: JSON.stringify(data)
        };

        const springRequest = {
            ...fetchOptions,
            method: "POST",
            body: JSON.stringify(signupDataJava)
        };

        try {
            // Flask is the blocking source of truth for auth/signup.
            const flaskResponse = await fetch(`${pythonURI}/api/user`, flaskRequest);
            const flaskRaw = await flaskResponse.text();

            let flaskData;
            try {
                flaskData = flaskRaw ? JSON.parse(flaskRaw) : {};
            } catch (_) {
                flaskData = null;
            }
            // Not a JSON object (an error page from a proxy, or "null"): a failure, and do not show its text
            if (flaskData === null || typeof flaskData !== 'object') {
                flaskData = { success: false };
            }

            if (!flaskResponse.ok || flaskData.success === false) {
                const flaskMessage = flaskData.message || `Flask signup failed (${flaskResponse.status})`;
                throw new Error(flaskMessage);
            }

            updateBackendStatus('flask', 'success');
            // A mentor exists only in Flask until a Teacher/Admin activates the account, so there
            // is no Spring signup to make: tell them to wait for activation.
            if (data.accountType === 'mentor') {
                document.getElementById('signupForm').hidden = true;
                document.getElementById('signupMentorPending').hidden = false;
                return;
            }
            if (!usesSpring()) {
                setTimeout(updateOverallStatus, 500);
                return;
            }

            // Spring is best-effort; do not block signup success on this path.
            fetch(`${javaURI}/api/person/create`, springRequest)
                .then(async (springResponse) => {
                    const springRaw = await springResponse.text();
                    let springErrorMessage = '';
                    if (springResponse.ok) {
                        updateBackendStatus('spring', 'success');
                    } else {
                        console.warn("Spring signup failed:", springResponse.status, springRaw);
                        springErrorMessage = readSpringError(springRaw, springResponse.status);
                        updateBackendStatus('spring', 'error');
                    }
                    setTimeout(() => updateOverallStatus(springErrorMessage), 500);
                })
                .catch((springError) => {
                    console.warn("Spring signup error:", springError.message);
                    updateBackendStatus('spring', 'error');
                    setTimeout(() => updateOverallStatus('Spring server unreachable'), 500);
                });
        } catch (error) {
            console.error("Flask signup error:", error);
            updateBackendStatus('flask', 'error');
            setTimeout(() => updateOverallStatus('', flaskFailureMessage(error)), 500);
        } finally {
            signupButton.disabled = false;
            signupButton.classList.remove("disabled");
        }
    }
    // What to tell the user when Flask refused the signup. A TypeError means fetch() itself failed
    // (offline, CORS, server down), so there is no reply from Flask to quote.
    function flaskFailureMessage(error) {
        if (error instanceof TypeError) {
            return 'Could not reach the server. Check your connection and try again.';
        }
        return error.message;
    }
    // Spring's /api/person/create answers errors as {"error": "..."}, e.g. a uid conflict.
    function readSpringError(raw, status) {
        try {
            const body = JSON.parse(raw);
            if (body && body.error) return body.error;
        } catch (_) { /* not JSON */ }
        return `HTTP ${status}`;
    }
    function javaDatabase() {
        const URL = `${javaURI}/api/person/get`;
        fetch(URL, fetchOptions)
            .then(response => {
                if (!response.ok) {
                    const sessionError = new Error(`Spring server response: ${response.status}`);
                    sessionError.outcome = { ok: false, reason: 'session', status: response.status };
                    throw sessionError;
                }
                return response.json();
            })
            .catch(error => {
                console.error("Java Database Error:", error);
            });
    }
</script>

<script type="module" src="{{site.baseurl}}/assets/js/api/passwordFields.js"></script>
