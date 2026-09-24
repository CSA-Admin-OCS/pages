import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import test from 'node:test';

const page = await readFile(new URL('../navigation/capstone.md', import.meta.url), 'utf8');
const mentorScript = [...page.matchAll(/<script type="module">([\s\S]*?)<\/script>/g)]
    .map(match => match[1]).find(script => script.includes('mentor-interested-count'));
const roleSource = await readFile(new URL('../assets/js/api/role-view.js', import.meta.url), 'utf8');
const withoutImports = source => source.replace(/^import .*;\s*$/gm, '').replace(/^export /gm, '');

class Element {
    children = [];
    style = {};
    listeners = {};
    hidden = true;
    appendChild(child) { this.children.push(child); }
    setAttribute() {}
    addEventListener(event, callback) { this.listeners[event] = callback; }
}

async function openCapstones(roles, chosenRole) {
    const storage = new Map(chosenRole ? [['ocsLoginRole', chosenRole]] : []);
    const counter = new Element();
    const info = new Element();
    const card = new Element();
    card.dataset = { pageUrl: '/capstone/example/' };
    card.querySelector = () => ({ nextElementSibling: info });
    const grid = { querySelectorAll: () => [card] };
    const context = vm.createContext({
        URL, console,
        javaURI: 'https://backend.example', fetchOptions: {},
        location: { hostname: 'pages.example', origin: 'https://pages.example' },
        localStorage: { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) },
        fetch: async url => ({ ok: true, json: async () => url.endsWith('/api/person/get')
            ? { roles: roles.map(name => ({ name })) } : [] }),
        document: {
            readyState: 'complete',
            getElementById: id => {
                // Use the real page markup so a lost counter element disables this flow in the test too.
                if (!page.includes(`id="${id}"`)) return null;
                return id === 'capstone-grid' ? grid : counter;
            },
            createElement: () => new Element(),
        },
    });
    vm.runInContext(withoutImports(roleSource), context);
    await vm.runInContext(withoutImports(mentorScript), context);
    return { counter, info, storage };
}

test('approved mentors can mark interest and see the updated count', async () => {
    const { counter, info, storage } = await openCapstones(['ROLE_MENTOR'], 'mentor');
    assert.equal(counter.hidden, false);
    assert.equal(counter.textContent, 'Interested: 0');
    const buttons = info.children[0].children[0].children;
    assert.equal(buttons[0].textContent, 'Apply Now');
    buttons[2].listeners.click();
    assert.equal(counter.textContent, 'Interested: 1');
    assert.deepEqual(JSON.parse(storage.get('ocsMentorInterested')), ['/capstone/example/']);
    assert.equal(buttons[2].disabled, true);
});

for (const [label, roles, choice] of [
    ['student accounts', ['ROLE_USER'], 'mentor'],
    ['mentors who chose Student', ['ROLE_MENTOR'], 'student'],
]) {
    test(`${label} do not see mentor actions`, async () => {
        const { counter, info } = await openCapstones(roles, choice);
        assert.equal(counter.hidden, true);
        assert.equal(info.children.length, 0);
    });
}
