import test from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_PASSWORD, mustResetPassword } from '../assets/js/api/passwordRules.js';

test('the default password must be reset even though it meets the rules', () => {
    assert.equal(mustResetPassword(DEFAULT_PASSWORD), true);
});

test('a weak password must be reset', () => {
    assert.equal(mustResetPassword('password'), true);
    assert.equal(mustResetPassword('Short1!'), true);
});

test('a strong, non-default password does not need a reset', () => {
    assert.equal(mustResetPassword('Mentor@1234'), false);
});
