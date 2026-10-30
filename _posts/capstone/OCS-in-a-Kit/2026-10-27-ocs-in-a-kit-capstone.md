---
microblog: true
toc: false
layout: post
title: OCS-in-a-Kit Capstone
description: Turning Open Coding Society's classroom platform into a school-neutral, installable kit.
permalink: /capstone/ocs-in-a-kit/
sticky_rank: 1
year: "2026-2027"
---

{% assign data = site.data.ocs_in_a_kit_infograph %}
<div class="ocs__container">
<div class="ocs__badge">Design-Based Research Capstone</div>
<h1>{{ data.Title }}</h1>
<p class="ocs__description">One school's classroom platform, turned into a kit any school can install with one script.</p>

<nav class="ocs__capstone-nav">
  <div class="ocs__links ocs__links--wide">
    <a href="#architecture" class="ocs__btn pill">Architecture</a>
    <a href="#features" class="ocs__btn pill">Features</a>
    <a href="#future" class="ocs__btn pill">Future</a>
    <a href="#considerations" class="ocs__btn pill">Considerations</a>
  </div>
</nav>

<div class="ocs__card" id="architecture">
  <h3 class="ocs__section-title">Architecture — 3 Kits, 3 Codebases Each</h3>
  <div class="ocs__diagram">
    <pre class="mermaid">flowchart TD
    K[Pick a kit:
Vanilla / Education / Business] --> P[Portfolio
frontend website]
    K --> F[Flask
backend, mainly login]
    K --> S[Spring
backend]</pre>
  </div>
  <div class="ocs__table-wrap">
    <table class="ocs__table">
      <tbody>
        <tr><td><strong>Portfolio</strong></td><td>Jekyll frontend students and staff open</td></tr>
        <tr><td><strong>Flask</strong></td><td>Backend — mainly login/accounts, code runner</td></tr>
        <tr><td><strong>Spring</strong></td><td>Backend — API, auth, code runner</td></tr>
      </tbody>
    </table>
  </div>

  <h3 class="ocs__section-title" style="margin-top:1.5rem;">Where It Comes From</h3>
  <div class="ocs__diagram">
    <pre class="mermaid">flowchart LR
    U[Upstream OCS repo] -->|scan| S[Suggest features]
    S -->|import| G{Scrub gate}
    G -->|pass| Kt[Kit codebase
+ catalog.json]
    G -->|blocked| Fx[Fix & re-run]</pre>
  </div>
  <p>Scrub gate blocks school names, secrets, and PII before anything is imported. A one-script installer (<code>./install.sh</code>) then clones the 3 codebases, sets them up, and starts the site.</p>
</div>

<div class="ocs__card" id="features">
  <h3 class="ocs__section-title">Features — 16 Total</h3>
  <div class="ocs__stats">
    <div class="ocs__stat"><span class="ocs__stat-value">1</span><span class="ocs__stat-label">Core</span></div>
    <div class="ocs__stat"><span class="ocs__stat-value">11</span><span class="ocs__stat-label">General</span></div>
    <div class="ocs__stat"><span class="ocs__stat-value">4</span><span class="ocs__stat-label">Education</span></div>
  </div>
  <div class="ocs__table-wrap" style="margin-top:1rem;">
    <table class="ocs__table">
      <thead><tr><th>Kit</th><th>Gets</th></tr></thead>
      <tbody>
        <tr><td><strong>Vanilla</strong></td><td>Core only — login, accounts, blog</td></tr>
        <tr><td><strong>Education</strong></td><td>+ lessons, code runner, assignments, games, AI chatbot &amp; grading, calendar, analytics, hall pass</td></tr>
        <tr><td><strong>Business</strong></td><td>+ AI chatbot, social, calendar, analytics, resume</td></tr>
      </tbody>
    </table>
  </div>
  <p>A kit is just a list of features — admins can turn any feature on/off later from the dashboard.</p>
</div>

<div class="ocs__card" id="future">
  <h3 class="ocs__section-title">Future</h3>
  <div class="ocs__keypoints">
    <div class="ocs__keypoint"><span class="ocs__check">✓</span><span>Finish migrating Portfolio content — most of the old site isn't moved over yet</span></div>
    <div class="ocs__keypoint"><span class="ocs__check">✓</span><span>Scan Flask and Spring for content to migrate too</span></div>
    <div class="ocs__keypoint"><span class="ocs__check">✓</span><span>Make sure every feature works the same across all 3 codebases</span></div>
    <div class="ocs__keypoint"><span class="ocs__check">✓</span><span>Add a hosted option for schools that can't run Docker</span></div>
    <div class="ocs__keypoint"><span class="ocs__check">✓</span><span>Test turning features on/off live, not just at install</span></div>
  </div>
</div>

<div class="ocs__card" id="considerations">
  <h3 class="ocs__section-title">Considerations</h3>
  <div class="ocs__table-wrap">
    <table class="ocs__table">
      <tbody>
        <tr><td>Privacy</td><td>Grading, hall pass, chat handle real student data</td></tr>
        <tr><td>Secrets</td><td>API keys and passwords sit in a plain file on the admin's computer</td></tr>
        <tr><td>Self-hosting</td><td>Needs Docker — not every admin can run that</td></tr>
        <tr><td>Maintenance</td><td>Upstream keeps changing; someone has to keep the kit in sync</td></tr>
      </tbody>
    </table>
  </div>
</div>

<div class="ocs__capstone-footer">
  <div class="ocs__team"><span class="ocs__team-label">Project Team</span><span class="ocs__team-name">{{ data.Team | join: ", " }}</span></div>
  <div class="ocs__status">In Development</div>
</div>
</div>
