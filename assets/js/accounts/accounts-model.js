// Pure rules for the Account Administration page. No DOM and no network, so they can be
// tested on their own. An account is the user object from Flask's GET /api/users:
// { uid, name, email, role, active, last_verified, verification_state }.

export const STATUS_FILTERS = ['all', 'active', 'inactive'];

// Flask stores students as role "User".
export function roleLabel(account) {
    return account.role === 'User' ? 'Student' : account.role;
}

const STATE_LABELS = {
    inactive: 'Inactive',
    active_verification_required: 'Active / Verification required',
    active_verified: 'Active / Verified',
};

export function stateLabel(account) {
    return STATE_LABELS[account.verification_state] || (account.active ? 'Active' : 'Inactive');
}

export function filterAccounts(accounts, { status = 'all', role = 'all' } = {}) {
    if (!STATUS_FILTERS.includes(status)) throw new Error(`Unknown status filter: ${status}`);
    return accounts.filter(account => {
        if (status === 'active' && !account.active) return false;
        if (status === 'inactive' && account.active) return false;
        return role === 'all' || roleLabel(account) === role;
    });
}

export function roleOptions(accounts) {
    return [...new Set(accounts.map(roleLabel))].sort();
}

// What a Teacher/Admin can do to an account. Flask refuses to verify a student by hand:
// students become active through Google school sign-in, so an inactive student has none.
export function accountAction(account) {
    if (account.active) return 'deactivate';
    return account.role === 'User' ? null : 'activate';
}

export function canAdminister(person) {
    return person?.role === 'Teacher' || person?.role === 'Admin';
}
