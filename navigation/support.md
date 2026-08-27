---
layout: page
title: Support
permalink: /navigation/support
search_exclude: true
show_reading_time: false
---
<br>

<script src="https://accounts.google.com/gsi/client" async defer></script>

<style>
    .support-topic-list {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 0.6rem;
    }
    .support-topic-item {
        padding: 1rem 1.25rem;
        cursor: pointer;
        border: 1px solid rgba(255, 255, 255, 0.15);
        background-color: rgba(255, 255, 255, 0.04);
        border-radius: 6px;
        transition: background-color 0.2s ease, border-color 0.2s ease;
    }
    .support-topic-item:hover {
        background-color: rgba(255, 255, 255, 0.09);
        border-color: rgba(255, 255, 255, 0.3);
    }

    .support-groups {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }
    .support-group {
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 6px;
        overflow: hidden;
    }
    .support-group-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
        padding: 0.85rem 1.1rem;
        cursor: pointer;
        user-select: none;
        transition: background-color 0.2s ease;
    }
    .support-group-header:hover {
        background-color: rgba(255, 255, 255, 0.04);
    }
    .support-group-label {
        font-family: 'Courier New', monospace;
        font-size: 0.72rem;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: rgba(255, 255, 255, 0.6);
    }
    .support-group-arrow {
        color: rgba(255, 255, 255, 0.4);
        font-size: 0.65rem;
        transition: transform 0.2s ease;
        flex-shrink: 0;
    }
    .support-group.open .support-group-arrow {
        transform: rotate(90deg);
    }
    .support-group-content {
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.25s ease;
    }
    .support-group.open .support-group-content {
        max-height: 700px;
    }
    .support-group-content .support-topic-list {
        padding: 0 1.1rem 1.1rem 1.1rem;
    }
    .support-group-content .support-topic-item {
        border-color: rgba(255, 255, 255, 0.1);
    }

    .support-back-row {
        display: flex;
        justify-content: flex-end;
        margin-top: 2rem;
    }

    #support-reset-wizard {
        display: none;
        width: 100%;
        min-height: 100vh;
        box-sizing: border-box;
        padding: 3rem 1.5rem;
        justify-content: center;
    }
    #support-reset-wizard.active {
        display: flex;
        animation: supportFadeIn 0.4s ease;
    }
    .support-wizard-inner {
        width: 100%;
        max-width: 480px;
    }

    .support-step { display: none; opacity: 0; }
    .support-step.active { display: block; animation: supportStepIn 0.4s ease forwards; }
    .support-step.leaving { display: block; animation: supportStepOut 0.25s ease forwards; }

    @keyframes supportFadeIn {
        from { opacity: 0; transform: translateY(8px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes supportStepIn {
        from { opacity: 0; transform: translateY(16px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes supportStepOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-16px); }
    }
</style>

<!-- Landing view: list of support topics -->
<div id="support-topics-container" style="max-width: 700px; margin: 0 auto; padding: 0 1.5rem;">
    <div class="support-groups">

        <div class="support-group">
            <div class="support-group-header" onclick="toggleSupportGroup(this)">
                <span class="support-group-label">Account &amp; Access</span>
                <span class="support-group-arrow">&#9654;</span>
            </div>
            <div class="support-group-content">
                <ul class="support-topic-list">
                    <li class="support-topic-item" onclick="openSupportTopic('reset')">Password Reset</li>
                    <li class="support-topic-item" onclick="location.href='{{site.baseurl}}/tools/old/accounts'">Account Creation</li>
                </ul>
            </div>
        </div>

        <div class="support-group">
            <div class="support-group-header" onclick="toggleSupportGroup(this)">
                <span class="support-group-label">Environment &amp; Tools Setup</span>
                <span class="support-group-arrow">&#9654;</span>
            </div>
            <div class="support-group-content">
                <ul class="support-topic-list">
                    <li class="support-topic-item" onclick="location.href='{{site.baseurl}}/tools/os'">Operating System and Tools Setup</li>
                    <li class="support-topic-item" onclick="location.href='{{site.baseurl}}/tools/os/windows'">Windows (WSL) Setup</li>
                    <li class="support-topic-item" onclick="location.href='{{site.baseurl}}/tools/os/linux'">Linux Setup</li>
                    <li class="support-topic-item" onclick="location.href='{{site.baseurl}}/tools/os/macos'">MacOS Setup</li>
                    <li class="support-topic-item" onclick="location.href='{{site.baseurl}}/tools/os/kasm'">KASM Workspace Setup</li>
                    <li class="support-topic-item" onclick="location.href='{{site.baseurl}}/tools/github'">GitHub Setup</li>
                    <li class="support-topic-item" onclick="location.href='{{site.baseurl}}/tools/vscode'">VSCode Setup</li>
                </ul>
            </div>
        </div>

        <div class="support-group">
            <div class="support-group-header" onclick="toggleSupportGroup(this)">
                <span class="support-group-label">Network &amp; Security</span>
                <span class="support-group-arrow">&#9654;</span>
            </div>
            <div class="support-group-content">
                <ul class="support-topic-list">
                    <li class="support-topic-item" onclick="location.href='{{site.baseurl}}/tools/doh'">DNS over HTTPS (DoH) Setup Guide</li>
                </ul>
            </div>
        </div>

        <div class="support-group">
            <div class="support-group-header" onclick="toggleSupportGroup(this)">
                <span class="support-group-label">Troubleshooting</span>
                <span class="support-group-arrow">&#9654;</span>
            </div>
            <div class="support-group-content">
                <ul class="support-topic-list">
                    <li class="support-topic-item" onclick="location.href='{{site.baseurl}}/tools/trouble'">Troubleshooting Guide</li>
                </ul>
            </div>
        </div>

        <div class="support-group">
            <div class="support-group-header" onclick="toggleSupportGroup(this)">
                <span class="support-group-label">About the Project</span>
                <span class="support-group-arrow">&#9654;</span>
            </div>
            <div class="support-group-content">
                <ul class="support-topic-list">
                    <li class="support-topic-item" onclick="location.href='{{site.baseurl}}/tools/about-ocs'">About Open Coding Society</li>
                    <li class="support-topic-item" onclick="location.href='{{site.baseurl}}/tools/flask'">How Flask Works</li>
                    <li class="support-topic-item" onclick="location.href='{{site.baseurl}}/tools/spring'">How Spring Works</li>
                </ul>
            </div>
        </div>

    </div>
    <div class="support-back-row">
        <a href="{{site.baseurl}}/login">← Back to Login</a>
    </div>
</div>

<!-- OAuth + Student ID Verified Password Reset: takes over the full page when opened -->
<div id="support-reset-wizard">
    <div class="support-wizard-inner">
        <h1>Let's Reset Your Password</h1>
        <hr>
        <div id="reset-step-uid" class="support-step active">
            <div class="form-group">
                <input type="text" id="resetUid" placeholder="GitHub ID" required>
            </div>
            <p>
                <button type="button" class="large primary submit-button" onclick="startOAuthReset()">Verify with School Account</button>
            </p>
        </div>
        <div id="reset-step-oauth" class="support-step" style="text-align: center; margin-bottom: 1.5rem;">
            <p style="margin-bottom: 1rem; color: #d1d5db;">
                Sign in with your <strong>@stu.powayusd.com</strong> school Google account to verify it's you.
            </p>
            <div id="reset-g_id_signin_container" style="display: flex; justify-content: center; margin-bottom: 1rem;"></div>
            <div id="reset-oauth-status" style="margin-top: 1rem;"></div>
            <p id="reset-ticket-row" style="display: none; margin-top: 1rem;">
                <button type="button" class="large secondary submit-button" onclick="requestResetTicket(this)">Request a Ticket Instead</button>
            </p>
        </div>
        <div id="reset-step-password" class="support-step">
            <div class="form-group">
                <input type="password" id="resetNewPassword" placeholder="New Password" minlength="8" required>
            </div>
            <div class="form-group">
                <input type="password" id="resetConfirmPassword" placeholder="Confirm New Password" minlength="8" required>
            </div>
            <p id="reset-password-validation-message"></p>
            <p>
                <button type="button" class="large primary submit-button" onclick="submitOAuthResetPassword()">Set New Password</button>
            </p>
        </div>
        <p id="reset-message" style="color: red;"></p>
        <div class="support-back-row">
            <a href="#" onclick="backToSupportTopics(); return false;">← Back</a>
        </div>
    </div>
</div>

<script type="module">
    import { javaURI, fetchOptions, GOOGLE_CLIENT_ID } from '{{site.baseurl}}/assets/js/api/config.js';

    // ---- Support topic navigation ----
    window.toggleSupportGroup = function(headerEl) {
        headerEl.closest('.support-group').classList.toggle('open');
    }

    window.openSupportTopic = function(topic) {
        if (topic !== 'reset') return;
        document.getElementById('support-topics-container').style.display = 'none';
        document.getElementById('support-reset-wizard').classList.add('active');
    }

    window.backToSupportTopics = function() {
        document.getElementById('support-reset-wizard').classList.remove('active');
        document.getElementById('support-topics-container').style.display = '';
        resetWizardState();
    }

    function resetWizardState() {
        resetUidValue = null;
        resetTokenValue = null;
        document.getElementById('resetUid').value = '';
        document.getElementById('resetNewPassword').value = '';
        document.getElementById('resetConfirmPassword').value = '';
        document.getElementById('reset-message').textContent = '';
        document.getElementById('reset-oauth-status').innerHTML = '';
        document.getElementById('reset-ticket-row').style.display = 'none';
        goToResetStep('reset-step-uid');
    }

    // Animates between the reset wizard's steps: the outgoing step fades/slides out,
    // then the incoming step fades/slides in (see supportStepIn/Out keyframes above).
    function goToResetStep(stepId) {
        document.querySelectorAll('.support-step').forEach(step => {
            if (step.id === stepId) {
                step.classList.remove('leaving');
                step.classList.add('active');
            } else if (step.classList.contains('active')) {
                step.classList.remove('active');
                step.classList.add('leaving');
                setTimeout(() => step.classList.remove('leaving'), 300);
            }
        });
    }

    // ---- OAuth + Student ID Verified Password Reset ----
    // The digit-match check is re-verified server-side against a server-verified Google ID
    // token (see /mvc/person/reset/oauth/verify) — this client code only relays the raw
    // credential and renders the UI states the backend tells it about.
    let resetUidValue = null;
    let resetTokenValue = null;

    function showResetOAuthStatus(message, isError = false) {
        const statusDiv = document.getElementById('reset-oauth-status');
        statusDiv.innerHTML = `<div class="${isError ? 'oauth-error' : 'oauth-success'}">${message}</div>`;
    }

    window.startOAuthReset = function() {
        const uid = document.getElementById('resetUid').value.trim();
        if (!uid) {
            document.getElementById('reset-message').textContent = 'Please enter your GitHub ID.';
            return;
        }
        resetUidValue = uid;
        document.getElementById('reset-message').textContent = '';

        goToResetStep('reset-step-oauth');

        if (window.google && window.google.accounts) {
            window.google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: handleGoogleResetSignIn
            });
            window.google.accounts.id.renderButton(
                document.getElementById('reset-g_id_signin_container'),
                { type: 'standard', size: 'large', theme: 'filled_blue', text: 'signin_with', shape: 'rectangular' }
            );
        }
    }

    window.handleGoogleResetSignIn = function(response) {
        showResetOAuthStatus('Verifying your school account...');

        fetch(`${javaURI}/mvc/person/reset/oauth/verify`, {
            ...fetchOptions,
            method: 'POST',
            body: JSON.stringify({ uid: resetUidValue, idToken: response.credential }),
        })
        .then(res => {
            if (res.status === 429) {
                showResetOAuthStatus('❌ Too many reset attempts. Please try again later, or request a ticket below.', true);
                document.getElementById('reset-ticket-row').style.display = 'block';
                return null;
            }
            if (!res.ok) {
                showResetOAuthStatus('❌ We could not verify that this school account belongs to this user. Please check your GitHub ID and try again with your own school account.', true);
                return null;
            }
            return res.json();
        })
        .then(data => {
            if (!data || !data.verified) return;
            resetTokenValue = data.resetToken;
            showResetOAuthStatus('✅ School account verified!');
            setTimeout(() => {
                goToResetStep('reset-step-password');
            }, 1000);
        })
        .catch(error => {
            console.error('Reset verification failed:', error);
            showResetOAuthStatus('❌ Something went wrong verifying your account. Please try again.', true);
        });
    }

    // Fires when a rate-limited user asks for admin help instead of waiting out the
    // window. Creates (or reuses, if one's already open) a ResetTicket for this uid; an
    // admin resolves it from the Spring person/read portal, granting a batch of 5 extra
    // attempts. Doesn't require the OAuth step to have succeeded, since the whole point
    // is to cover the case where the user can't get through it right now.
    window.requestResetTicket = function(btn) {
        if (!resetUidValue) return;
        btn.disabled = true;

        fetch(`${javaURI}/mvc/person/reset/ticket`, {
            ...fetchOptions,
            method: 'POST',
            body: JSON.stringify({ uid: resetUidValue }),
        })
        .then(res => {
            if (!res.ok) throw new Error('ticket-failed');
            showResetOAuthStatus('✅ Ticket submitted! An admin will grant you more attempts soon.');
            btn.style.display = 'none';
        })
        .catch(error => {
            console.error('Reset ticket request failed:', error);
            showResetOAuthStatus('❌ Could not submit a ticket. Please try again.', true);
            btn.disabled = false;
        });
    }

    // Complexity rule shared across the whole password-reset pipeline (this
    // function, spring's Person.checkPassword, and flask's validate_password) --
    // keep the required special-character set identical across all three so a
    // password accepted here is never rejected once it reaches the backend.
    function getPasswordStrength(password) {
        const missing = [];

        if (password.length < 8) missing.push('at least 8 characters');
        if (!/[A-Z]/.test(password)) missing.push('an uppercase letter');
        if (!/[a-z]/.test(password)) missing.push('a lowercase letter');
        if (!/[0-9]/.test(password)) missing.push('a number');
        if (!/[`~!@#$%^&*()]/.test(password)) {
            missing.push('one of these special characters: `~!@#$%^&*()');
        }

        return {
            valid: missing.length === 0,
            message: missing.length > 0 ? `Password needs ${missing.join(', ')}.` : 'Strong password.'
        };
    }

    function validateResetForm() {
        const password = document.getElementById('resetNewPassword').value;
        const confirmPassword = document.getElementById('resetConfirmPassword').value;
        const confirmField = document.getElementById('resetConfirmPassword');
        const messageDiv = document.getElementById('reset-password-validation-message');

        confirmField.classList.remove('password-match', 'password-mismatch', 'password-length');
        messageDiv.classList.remove('success', 'error');

        if (confirmPassword === '') {
            messageDiv.textContent = '';
            return true;
        }

        const passwordStrength = getPasswordStrength(password);
        if (!passwordStrength.valid) {
            confirmField.classList.add('password-length');
            messageDiv.classList.add('error');
            messageDiv.textContent = passwordStrength.message;
            return false;
        }

        if (password === confirmPassword) {
            confirmField.classList.add('password-match');
            messageDiv.classList.add('success');
            messageDiv.textContent = 'Passwords match. Strong password.';
            return true;
        } else {
            confirmField.classList.add('password-mismatch');
            messageDiv.classList.add('error');
            messageDiv.textContent = '✗ Passwords do not match';
            return false;
        }
    }

    window.submitOAuthResetPassword = function() {
        const password = document.getElementById('resetNewPassword').value;
        const confirmPassword = document.getElementById('resetConfirmPassword').value;

        const passwordStrength = getPasswordStrength(password);
        if (!passwordStrength.valid) {
            alert(passwordStrength.message);
            return;
        }
        if (password !== confirmPassword) {
            alert('Passwords do not match. Please try again.');
            return;
        }
        if (!resetUidValue || !resetTokenValue) {
            document.getElementById('reset-message').style.color = 'red';
            document.getElementById('reset-message').textContent = 'Your verification expired. Please start over.';
            return;
        }

        fetch(`${javaURI}/mvc/person/reset/oauth/complete`, {
            ...fetchOptions,
            method: 'POST',
            body: JSON.stringify({ uid: resetUidValue, resetToken: resetTokenValue, newPassword: password }),
        })
        .then(res => {
            if (!res.ok) {
                throw new Error('reset-failed');
            }
            document.getElementById('reset-message').style.color = 'green';
            document.getElementById('reset-message').textContent = '✅ Password updated! Redirecting to login...';
            resetUidValue = null;
            resetTokenValue = null;
            setTimeout(() => {
                window.location.href = '{{site.baseurl}}/login';
            }, 1500);
        })
        .catch(error => {
            console.error('Reset completion failed:', error);
            document.getElementById('reset-message').style.color = 'red';
            document.getElementById('reset-message').textContent = 'Could not update your password. Your verification may have expired — please start over.';
        });
    }

    window.addEventListener('load', function() {
        const resetPasswordField = document.getElementById('resetNewPassword');
        const resetConfirmPasswordField = document.getElementById('resetConfirmPassword');
        if (resetPasswordField && resetConfirmPasswordField) {
            resetPasswordField.addEventListener('input', validateResetForm);
            resetConfirmPasswordField.addEventListener('input', validateResetForm);
        }

        // Deep-link support: ?topic=reset skips the topic list and jumps straight
        // into the password reset wizard (used by the "Forgot your password?" link
        // elsewhere on the site, so it doesn't force an extra click once /support
        // grows to cover more than just password reset).
        const params = new URLSearchParams(window.location.search);
        if (params.get('topic') === 'reset') {
            openSupportTopic('reset');
        }
    });
</script>
