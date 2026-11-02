import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const loginSource = readFileSync(new URL('../assets/js/api/login.js', import.meta.url), 'utf8')
    .replace(/^import .*;\r?\n/gm, '');

function loadLogin({ springEnabled = false, fetch, document = {} } = {}) {
    const context = vm.createContext({
        springEnabled,
        pythonURI: 'https://flask.example',
        javaURI: 'https://spring.example',
        baseurl: '',
        fetchOptions: { credentials: 'include' },
        fetch,
        document: { addEventListener() {}, querySelectorAll: () => [], ...document },
        window: {},
        localStorage: { getItem: () => null },
        console: { log() {}, warn() {}, error() {} },
        setTimeout,
    });
    vm.runInContext(loginSource, context);
    return context;
}

test('Flask-only sites do not contact Spring when the visitor is signed out', async () => {
    const calls = [];
    const context = loadLogin({ fetch: async (url) => {
        calls.push(url);
        return { ok: false, status: 401 };
    } });
    assert.equal(await context.getCredentials(), null);
    assert.deepEqual(calls, ['https://flask.example/api/id']);
});

test('Flask-only sites do not contact Spring after a Flask network failure', async () => {
    const calls = [];
    const context = loadLogin({ fetch: async (url) => {
        calls.push(url);
        throw new TypeError('Network unavailable');
    } });
    assert.equal(await context.getCredentials(), null);
    assert.deepEqual(calls, ['https://flask.example/api/id']);
});

test('Spring-enabled sites retain the Spring-only account fallback', async () => {
    const calls = [];
    const context = loadLogin({ springEnabled: true, fetch: async (url) => {
        calls.push(url);
        return url.includes('flask')
            ? { ok: false, status: 401 }
            : { ok: true, json: async () => ({ uid: 'mentor' }) };
    } });
    const user = await context.getCredentials();
    assert.equal(user.uid, 'mentor');
    assert.equal(user.source, 'spring');
    assert.deepEqual(calls, ['https://flask.example/api/id', 'https://spring.example/api/person/get']);
});

test('an existing Flask session does not need a Spring fallback', async () => {
    const calls = [];
    const person = { uid: 'student' };
    const context = loadLogin({ springEnabled: true, fetch: async (url) => {
        calls.push(url);
        return { ok: true, json: async () => person };
    } });
    assert.equal(await context.getCredentials(), person);
    assert.deepEqual(calls, ['https://flask.example/api/id']);
});

test('unavailable Spring fallback leaves the visitor signed out', async () => {
    const context = loadLogin({ springEnabled: true, fetch: async (url) => {
        if (url.includes('spring')) throw new TypeError('Spring unavailable');
        return { ok: false, status: 401 };
    } });
    assert.equal(await context.getCredentials(), null);
});

test('the navbar renders account names and role labels as text', async () => {
    const name = '<img src=x onerror="alert(1)">';
    const role = '<svg onload="alert(2)">';
    const button = { addEventListener() {} };
    const roles = {};
    const menu = {};
    const area = {
        style: {},
        querySelector: (selector) => ({
            '.dropbtn': button, '.roles-list': roles, '.dropdown-content': menu,
        })[selector],
    };
    const trigger = { querySelectorAll: () => [] };
    let ready;
    const context = loadLogin({ document: {
        addEventListener(event, callback) { if (event === 'DOMContentLoaded') ready = callback; },
        querySelector: (selector) => selector === '#loginArea' ? area : trigger,
    } });
    context.roleNames = () => [];
    context.isMentorAccount = () => false;
    context.getCredentials = async () => ({ name, roles: [{ name: role }], source: 'spring' });
    ready();
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(button.textContent, name);
    assert.equal(roles.textContent, `Roles: ${role}`);
    assert.equal(area.innerHTML.includes(name), false);
    assert.equal(area.innerHTML.includes(role), false);
});

const signupSource = readFileSync(new URL('../navigation/authentication/login.md', import.meta.url), 'utf8');
// Evaluate the actual page handler without initializing Google or calling either backend.
const oauthHandler = signupSource.match(/    function showOAuthStatus\(message, isError = false\) \{[\s\S]*?\n    \}/)[0];

for (const isError of [false, true]) {
    test(`signup OAuth ${isError ? 'error' : 'success'} messages remain literal text`, () => {
        const status = {
            children: [],
            appendChild(child) { this.children.push(child); },
            set innerHTML(_) { throw new Error('OAuth messages must not be parsed as HTML'); },
        };
        const context = vm.createContext({ document: {
            getElementById: () => status,
            createElement: () => ({}),
        } });
        vm.runInContext(oauthHandler, context);
        const message = 'Verified: <img src=x onerror="alert(1)">';
        context.showOAuthStatus(message, isError);
        assert.equal(status.children.length, 1);
        assert.equal(status.children[0].textContent, message);
        assert.equal(status.children[0].className, isError ? 'oauth-error' : 'oauth-success');
    });
}
