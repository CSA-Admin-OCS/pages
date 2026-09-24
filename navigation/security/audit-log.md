---
layout: page
title: Security Audit Log
permalink: /security/audit-log
search_exclude: true
show_reading_time: false
---

<div id="loading" style="padding: 2rem; text-align: center; color: var(--text, #ccc);">Loading...</div>

<div id="access-denied" style="display:none; padding: 2rem; text-align: center;">
  <h2 style="color: #e55;">Access Denied</h2>
  <p>This page is only accessible to Admin, Mentor, and Teacher roles.</p>
  <a href="{{site.baseurl}}/login">Log in</a>
</div>

<div id="audit-ui" style="display:none;">
  <h2>Security Audit Log</h2>

  <div style="margin-bottom: 1rem; display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center;">
    <select id="eventFilter" onchange="applyFilter()" style="padding: 0.4rem 0.6rem; border-radius: 4px; border: 1px solid #555; background: var(--surface, #222); color: var(--text, #eee);">
      <option value="">All event types</option>
      <option value="LOGIN_SUCCESS">LOGIN_SUCCESS</option>
      <option value="LOGIN_FAIL">LOGIN_FAIL</option>
      <option value="LOGOUT">LOGOUT</option>
      <option value="TOKEN_MISSING">TOKEN_MISSING</option>
      <option value="TOKEN_INVALID">TOKEN_INVALID</option>
      <option value="TOKEN_EXPIRED">TOKEN_EXPIRED</option>
      <option value="TOKEN_REVOKED">TOKEN_REVOKED</option>
      <option value="FORBIDDEN">FORBIDDEN</option>
    </select>
    <select id="sourceFilter" onchange="applyFilter()" style="padding: 0.4rem 0.6rem; border-radius: 4px; border: 1px solid #555; background: var(--surface, #222); color: var(--text, #eee);">
      <option value="">All sources</option>
      <option value="flask">Flask</option>
      <option value="spring">Spring</option>
    </select>
    <button onclick="loadLogs()" style="padding: 0.4rem 0.8rem; border-radius: 4px; cursor: pointer;">Refresh</button>
    <span id="log-count" style="color: var(--muted, #aaa); font-size: 0.9rem;"></span>
  </div>

  <div style="overflow-x: auto;">
    <table id="log-table" style="width: 100%; border-collapse: collapse; font-size: 0.88rem;">
      <thead>
        <tr style="background: var(--surface-raised, #1b1b1b); text-align: left;">
          <th style="padding: 0.5rem 0.75rem; border-bottom: 2px solid #444;">Timestamp</th>
          <th style="padding: 0.5rem 0.75rem; border-bottom: 2px solid #444;">Event</th>
          <th style="padding: 0.5rem 0.75rem; border-bottom: 2px solid #444;">UID</th>
          <th style="padding: 0.5rem 0.75rem; border-bottom: 2px solid #444;">IP</th>
          <th style="padding: 0.5rem 0.75rem; border-bottom: 2px solid #444;">Source</th>
          <th style="padding: 0.5rem 0.75rem; border-bottom: 2px solid #444;">Details</th>
        </tr>
      </thead>
      <tbody id="log-body">
        <tr><td colspan="6" style="padding: 1rem; text-align: center; color: #888;">Loading logs...</td></tr>
      </tbody>
    </table>
  </div>
</div>

<script type="module">
  import { pythonURI, javaURI, fetchOptions } from '{{site.baseurl}}/assets/js/api/config.js';

  const ALLOWED_ROLES = ['Admin', 'Mentor', 'Teacher'];
  let allLogs = [];

  async function checkAccess() {
    try {
      const res = await fetch(`${pythonURI}/api/id`, fetchOptions);
      if (!res.ok) { showDenied(); return; }
      const user = await res.json();
      if (!ALLOWED_ROLES.includes(user.role)) { showDenied(); return; }
    } catch (e) {
      showDenied();
      return;
    }
    document.getElementById('loading').style.display = 'none';
    document.getElementById('audit-ui').style.display = 'block';
    loadLogs();
  }

  function showDenied() {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('access-denied').style.display = 'block';
  }

  window.loadLogs = async function() {
    const tbody = document.getElementById('log-body');
    tbody.innerHTML = '<tr><td colspan="6" style="padding:1rem;text-align:center;color:#888">Loading...</td></tr>';
    allLogs = [];

    const [flaskLogs, springLogs] = await Promise.allSettled([
      fetchLogs(pythonURI),
      fetchLogs(javaURI),
    ]);

    if (flaskLogs.status === 'fulfilled') allLogs.push(...flaskLogs.value);
    if (springLogs.status === 'fulfilled') allLogs.push(...springLogs.value);

    allLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    applyFilter();
  };

  async function fetchLogs(baseURI) {
    const res = await fetch(`${baseURI}/api/audit/logs?limit=500`, fetchOptions);
    if (!res.ok) throw new Error(`${res.status}`);
    return res.json();
  }

  window.applyFilter = function() {
    const eventVal = document.getElementById('eventFilter').value;
    const sourceVal = document.getElementById('sourceFilter').value;

    const filtered = allLogs.filter(log => {
      if (eventVal && log.event_type !== eventVal) return false;
      if (sourceVal && log.source !== sourceVal) return false;
      return true;
    });

    renderLogs(filtered);
  };

  const EVENT_COLORS = {
    LOGIN_SUCCESS: '#4caf50',
    LOGIN_FAIL: '#e53935',
    LOGOUT: '#90a4ae',
    TOKEN_MISSING: '#fb8c00',
    TOKEN_INVALID: '#e53935',
    TOKEN_EXPIRED: '#fb8c00',
    TOKEN_REVOKED: '#e53935',
    FORBIDDEN: '#e53935',
  };

  function renderLogs(logs) {
    const tbody = document.getElementById('log-body');
    document.getElementById('log-count').textContent = `${logs.length} event${logs.length !== 1 ? 's' : ''}`;

    if (logs.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="padding:1rem;text-align:center;color:#888">No events found.</td></tr>';
      return;
    }

    tbody.innerHTML = logs.map(log => {
      const color = EVENT_COLORS[log.event_type] || '#ccc';
      const ts = log.timestamp ? new Date(log.timestamp).toLocaleString() : '—';
      const uid = esc(log.uid || '—');
      const ip = esc(log.ip_address || '—');
      const src = log.source === 'spring'
        ? '<span style="color:#42a5f5">spring</span>'
        : '<span style="color:#66bb6a">flask</span>';
      const details = esc(log.details || '');
      return `<tr style="border-bottom: 1px solid #2a2a2a;">
        <td style="padding:0.45rem 0.75rem;white-space:nowrap;color:#aaa">${ts}</td>
        <td style="padding:0.45rem 0.75rem;white-space:nowrap;font-weight:600;color:${color}">${esc(log.event_type)}</td>
        <td style="padding:0.45rem 0.75rem">${uid}</td>
        <td style="padding:0.45rem 0.75rem;font-family:monospace;font-size:0.82rem">${ip}</td>
        <td style="padding:0.45rem 0.75rem">${src}</td>
        <td style="padding:0.45rem 0.75rem;color:#aaa;font-size:0.82rem">${details}</td>
      </tr>`;
    }).join('');
  }

  function esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  checkAccess();
</script>
