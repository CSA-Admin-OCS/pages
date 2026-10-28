// Account Administration (Teacher/Admin): review accounts, activate or deactivate them,
// and filter by active status and role. Flask enforces who may do this; the role check
// here only decides whether to show the page. Rules live in accounts-model.js.
import {
    STATUS_FILTERS, roleLabel, stateLabel, filterAccounts, roleOptions, accountAction, canAdminister,
} from './accounts-model.js';

const ACTIONS = {
    activate: { label: 'Activate', path: 'verify', tone: 'accent fill' },
    deactivate: { label: 'Deactivate', path: 'deactivate', tone: 'alert-red' },
};

async function flaskJson(api, path, options = {}) {
    const response = await fetch(`${api.pythonURI}${path}`, { ...api.fetchOptions, ...options });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body.message || `Request failed (${response.status})`);
    return body;
}

export async function initAccountsPage(api) {
    const els = {
        status: document.getElementById('accounts-status'),
        content: document.getElementById('accounts-content'),
        statusFilters: document.getElementById('accounts-status-filters'),
        roleFilter: document.getElementById('accounts-role-filter'),
        body: document.getElementById('accounts-body'),
        empty: document.getElementById('accounts-empty'),
    };
    const state = { accounts: [], status: 'all', role: 'all' };

    const say = message => { els.status.textContent = message; els.status.hidden = !message; };

    function renderRoleFilter() {
        const options = ['all', ...roleOptions(state.accounts)];
        els.roleFilter.replaceChildren(...options.map(role => new Option(role === 'all' ? 'All' : role, role)));
        els.roleFilter.value = state.role;
    }

    function actionButton(account) {
        const action = ACTIONS[accountAction(account)];
        if (!action) return 'Google sign-in';
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `ocs__btn small ${action.tone}`;
        button.textContent = action.label;
        button.addEventListener('click', () => changeAccount(account, action, button));
        return button;
    }

    function row(account) {
        const tr = document.createElement('tr');
        [account.name, account.email || '', roleLabel(account), account.active ? 'Yes' : 'No', stateLabel(account)]
            .forEach(text => tr.append(Object.assign(document.createElement('td'), { textContent: text })));
        const actionCell = document.createElement('td');
        actionCell.append(actionButton(account));
        tr.append(actionCell);
        return tr;
    }

    function render() {
        const shown = filterAccounts(state.accounts, state);
        els.body.replaceChildren(...shown.map(row));
        els.empty.hidden = shown.length > 0;
        els.statusFilters.querySelectorAll('button').forEach(button => {
            const selected = button.dataset.status === state.status;
            button.classList.toggle('fill', selected);
            button.setAttribute('aria-pressed', String(selected));
        });
    }

    async function changeAccount(account, action, button) {
        button.disabled = true;
        try {
            const updated = await flaskJson(api, `/api/user/${encodeURIComponent(account.uid)}/${action.path}`, { method: 'POST' });
            Object.assign(account, updated);
            say('');
            render();
        } catch (error) {
            console.error(`Accounts: ${action.label} failed for ${account.uid}`, error);
            say(`Could not ${action.label.toLowerCase()} ${account.uid}: ${error.message}`);
            button.disabled = false;
        }
    }

    els.statusFilters.addEventListener('click', event => {
        const status = event.target.dataset?.status;
        if (!STATUS_FILTERS.includes(status)) return;
        state.status = status;
        render();
    });
    els.roleFilter.addEventListener('change', () => { state.role = els.roleFilter.value; render(); });

    try {
        const person = await flaskJson(api, '/api/id');
        if (!canAdminister(person)) {
            say('Account Administration is only available to Teachers and Admins.');
            return;
        }
        state.accounts = await flaskJson(api, '/api/users');
    } catch (error) {
        console.error('Accounts: could not load accounts', error);
        say(`Log in as a Teacher or Admin to manage accounts. (${error.message})`);
        return;
    }
    renderRoleFilter();
    render();
    els.content.hidden = false;
}
