import test from 'node:test';
import assert from 'node:assert/strict';
import {
    roleLabel, stateLabel, filterAccounts, roleOptions, accountAction, canAdminister,
} from '../assets/js/accounts/accounts-model.js';

const alice = { uid: 'alice', role: 'Mentor', active: false, verification_state: 'inactive' };
const bob = { uid: 'bob', role: 'User', active: true, verification_state: 'active_verified' };
const carol = { uid: 'carol', role: 'Mentor', active: true, verification_state: 'active_verification_required' };
const dan = { uid: 'dan', role: 'Teacher', active: true, verification_state: 'active_verified' };
const accounts = [alice, bob, carol, dan];

test('students are shown as Student, not by their stored role', () => {
    assert.equal(roleLabel(bob), 'Student');
    assert.equal(roleLabel(alice), 'Mentor');
});

test('the three verification states have readable labels', () => {
    assert.equal(stateLabel(alice), 'Inactive');
    assert.equal(stateLabel(carol), 'Active / Verification required');
    assert.equal(stateLabel(bob), 'Active / Verified');
});

test('status filter keeps active (including verification required) or inactive accounts', () => {
    assert.deepEqual(filterAccounts(accounts, { status: 'inactive' }), [alice]);
    assert.deepEqual(filterAccounts(accounts, { status: 'active' }), [bob, carol, dan]);
    assert.equal(filterAccounts(accounts, { status: 'all' }).length, 4);
});

test('role and status filters narrow each other', () => {
    assert.deepEqual(filterAccounts(accounts, { status: 'active', role: 'Mentor' }), [carol]);
    assert.deepEqual(filterAccounts(accounts, { role: 'Student' }), [bob]);
});

test('an unknown status filter fails loudly', () => {
    assert.throws(() => filterAccounts(accounts, { status: 'pending' }), /Unknown status filter/);
});

test('role options are unique and sorted', () => {
    assert.deepEqual(roleOptions(accounts), ['Mentor', 'Student', 'Teacher']);
});

test('active accounts can be deactivated; inactive non-students activated; inactive students neither', () => {
    assert.equal(accountAction(carol), 'deactivate');
    assert.equal(accountAction(alice), 'activate');
    assert.equal(accountAction({ role: 'User', active: false }), null);
});

test('only Teachers and Admins may administer accounts', () => {
    assert.equal(canAdminister(dan), true);
    assert.equal(canAdminister({ role: 'Admin' }), true);
    assert.equal(canAdminister(alice), false);
    assert.equal(canAdminister(null), false);
});
