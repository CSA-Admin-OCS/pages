---
layout: page
title: Delete Account
permalink: /delete-account
search_exclude: true
show_reading_time: false
---
<br>

<div class="support-wizard-inner">
    <h1>Delete Your Account</h1>
    <hr>
    <p class="support-oauth-hint">
        This permanently deletes your account and everything tied to it. This cannot be undone.
    </p>
    <p class="support-oauth-hint">
        To confirm, type your GitHub ID (<strong id="delete-expected-uid">…</strong>) below exactly, then enter your password.
    </p>

    <div class="form-group">
        <input type="text" id="deleteConfirmUid" placeholder="Type your GitHub ID to confirm"
            aria-label="Type your GitHub ID to confirm" required autocomplete="off">
    </div>
    <div class="form-group">
        <input type="password" id="deletePassword" placeholder="Current Password" aria-label="Current Password" required>
    </div>
    <p id="delete-message" class="support-reset-message"></p>
    <p>
        <button type="button" id="deleteAccountBtn" class="large primary submit-button" onclick="submitAccountDeletion()" disabled>Permanently Delete My Account</button>
    </p>
    <div class="support-back-row">
        <a href="{{site.baseurl}}/profile">← Back to Profile</a>
    </div>
</div>

<script type="module">
    import { javaURI, pythonURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';

    let expectedUid = null;

    const confirmInput = document.getElementById('deleteConfirmUid');
    const passwordInput = document.getElementById('deletePassword');
    const deleteBtn = document.getElementById('deleteAccountBtn');
    const messageEl = document.getElementById('delete-message');

    // The confirm-phrase is the account's own uid, not a fixed word -- typing your own
    // identifier (GitHub-repo-deletion style) is a stronger safety check than a generic
    // static phrase would be, since it can't be pre-filled or pasted without reading it.
    async function loadExpectedUid() {
        try {
            const res = await fetch(`${javaURI}/api/person/get`, fetchOptions);
            if (!res.ok) { window.location.href = '{{site.baseurl}}/login'; return; }
            const person = await res.json();
            expectedUid = person.uid;
            document.getElementById('delete-expected-uid').textContent = expectedUid;
        } catch (err) {
            console.error('Delete account: identity lookup failed', err);
            messageEl.style.color = 'red';
            messageEl.textContent = 'Could not load your account. Please refresh and try again.';
        }
    }

    function checkFormReady() {
        deleteBtn.disabled = !(expectedUid && confirmInput.value === expectedUid && passwordInput.value.length > 0);
    }

    confirmInput.addEventListener('input', checkFormReady);
    passwordInput.addEventListener('input', checkFormReady);

    window.submitAccountDeletion = async function () {
        const confirmUid = confirmInput.value;
        const currentPassword = passwordInput.value;

        deleteBtn.disabled = true;
        messageEl.style.color = '';
        messageEl.textContent = 'Deleting your account…';

        try {
            // Flask is the authoritative delete here, called directly by the frontend --
            // not by Spring -- same frontend-mediated pattern already established for
            // password reset (see spring/docs/forgot-password-pipeline.md, "Architecture:
            // no backend-to-backend sync"). Spring is only synced after Flask confirms.
            const flaskRes = await fetch(`${pythonURI}/api/user/delete-self`, {
                ...fetchOptions,
                method: 'POST',
                body: JSON.stringify({ confirmUid, currentPassword }),
            });
            const flaskData = await flaskRes.json().catch(() => ({}));
            if (!flaskRes.ok) {
                messageEl.style.color = 'red';
                messageEl.textContent = flaskData.message || 'Could not delete your account.';
                deleteBtn.disabled = false;
                return;
            }

            const springRes = await fetch(`${javaURI}/mvc/person/delete/self`, {
                ...fetchOptions,
                method: 'POST',
                body: JSON.stringify({ confirmUid, currentPassword }),
            });
            if (!springRes.ok) {
                // Flask (the authoritative side) already succeeded -- this is a sync gap,
                // not a failed deletion. Nothing left for the user to do about it.
                console.error('Spring account deletion failed after a successful Flask deletion');
            }

            messageEl.style.color = 'green';
            messageEl.textContent = 'Your account has been deleted. Redirecting…';

            await Promise.all([
                fetch(`${pythonURI}/logout`, { ...fetchOptions }).catch(() => {}),
                fetch(`${javaURI}/logout`, { ...fetchOptions, method: 'POST' }).catch(() => {}),
            ]);

            setTimeout(() => {
                window.location.href = '{{site.baseurl}}/';
            }, 1500);
        } catch (err) {
            console.error('Account deletion failed:', err);
            messageEl.style.color = 'red';
            messageEl.textContent = 'Something went wrong. Please try again.';
            deleteBtn.disabled = false;
        }
    };

    loadExpectedUid();
</script>
