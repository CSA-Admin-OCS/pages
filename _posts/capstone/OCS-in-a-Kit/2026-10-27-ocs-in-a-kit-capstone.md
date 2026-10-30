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
<p class="ocs__description">Open Coding Society's classroom platform, packaged so any school or organization can run their own copy of it.</p>

<nav class="ocs__capstone-nav">
  <div class="ocs__links ocs__links--wide">
    <a href="#problem" class="ocs__btn pill">The Problem</a>
    <a href="#who" class="ocs__btn pill">Who It's For</a>
    <a href="#features" class="ocs__btn pill">What You Get</a>
    <a href="#future" class="ocs__btn pill">Future</a>
    <a href="#considerations" class="ocs__btn pill">Considerations</a>
    <a href="#how-its-built" class="ocs__btn pill">How It's Built</a>
  </div>
</nav>

<div class="ocs__card" id="problem">
  <h3 class="ocs__section-title">The Problem</h3>
  <p>Open Coding Society built a full classroom web platform — lessons, a code runner, grading, chat, hall passes — but it's wired to <em>one</em> school. Names, logins, and settings are hard-coded in. Any other school or group that wanted the same tools had no way to get them except copying the code by hand and stripping out everything that didn't belong to them.</p>
  <p><strong>OCS-in-a-Kit</strong> turns that one-school codebase into a product: pick what you want, answer a few questions, and get your own working copy — no coding required.</p>
</div>

<div class="ocs__card" id="who">
  <h3 class="ocs__section-title">Who It's For</h3>
  <div class="ocs__table-wrap">
    <table class="ocs__table">
      <thead><tr><th>Kit</th><th>Who picks it</th></tr></thead>
      <tbody>
        <tr><td><strong>Vanilla</strong></td><td>Anyone who just wants a basic site to hand to users — accounts, profiles, a blog. Add features later.</td></tr>
        <tr><td><strong>Education</strong></td><td>A teacher or school running a CS classroom — lessons, code runner, assignments, grading, AI tutor, hall pass.</td></tr>
        <tr><td><strong>Business</strong></td><td>A company or organization serving its own members — no classroom features, just chat, calendar, AI chatbot, profiles.</td></tr>
      </tbody>
    </table>
  </div>
</div>

<div class="ocs__card" id="features">
  <h3 class="ocs__section-title">What You Get</h3>
  <p>16 features in total. Every kit starts with the same core (login, accounts, blog) and adds from there:</p>
  <div class="ocs__keypoints">
    <div class="ocs__keypoint"><span class="ocs__check">✓</span><span><strong>Lessons &amp; code runner</strong> — students run Python/JS/Java right in the browser</span></div>
    <div class="ocs__keypoint"><span class="ocs__check">✓</span><span><strong>Assignments &amp; grading</strong> — submissions, grades, quizzes, AI-assisted feedback</span></div>
    <div class="ocs__keypoint"><span class="ocs__check">✓</span><span><strong>AI chatbot &amp; tutor</strong> — answers questions through the site, keys stay on the server</span></div>
    <div class="ocs__keypoint"><span class="ocs__check">✓</span><span><strong>Games</strong> — a built-in game engine, leaderboards, multiplayer</span></div>
    <div class="ocs__keypoint"><span class="ocs__check">✓</span><span><strong>Chat, calendar, hall pass</strong> — the day-to-day classroom or team tools</span></div>
    <div class="ocs__keypoint"><span class="ocs__check">✓</span><span><strong>Extras</strong> — finance simulation, resumes, face-login, more</span></div>
  </div>
  <p>Admins can turn any feature on or off later — no reinstall needed.</p>
</div>

<div class="ocs__card" id="future">
  <h3 class="ocs__section-title">Future</h3>
  <div class="ocs__keypoints">
    <div class="ocs__keypoint"><span class="ocs__check">✓</span><span>Move the rest of OCS's old site content into the kit</span></div>
    <div class="ocs__keypoint"><span class="ocs__check">✓</span><span>Add a hosted option for schools that can't run their own server</span></div>
    <div class="ocs__keypoint"><span class="ocs__check">✓</span><span>Test turning features on/off live, not just at install</span></div>
    <div class="ocs__keypoint"><span class="ocs__check">✓</span><span>Get a real school to pilot it end-to-end</span></div>
  </div>
</div>

<div class="ocs__card" id="considerations">
  <h3 class="ocs__section-title">Considerations</h3>
  <div class="ocs__table-wrap">
    <table class="ocs__table">
      <tbody>
        <tr><td>Privacy</td><td>Grading, hall pass, and chat handle real student data</td></tr>
        <tr><td>Self-hosting</td><td>Needs Docker — not every admin can run that</td></tr>
        <tr><td>Staying in sync</td><td>OCS's own site keeps changing; someone has to keep the kit updated</td></tr>
      </tbody>
    </table>
  </div>
</div>

<div class="ocs__card" id="how-its-built">
  <h3 class="ocs__section-title">How It's Built</h3>
  <p>Each kit bundles 3 codebases: a Portfolio frontend, and Flask + Spring backends (Flask mainly handles login).</p>
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
  <p>Content comes from OCS's original site through an automated scrub step that strips out anything school-specific (names, logins, secrets) before it's added in.</p>
  <div class="ocs__diagram">
    <pre class="mermaid">flowchart LR
    U[OCS's original site] -->|scan| Sg[Suggest features]
    Sg -->|import| G{Scrub gate}
    G -->|pass| Kt[Kit codebase]
    G -->|blocked| Fx[Fix & re-run]</pre>
  </div>
  <p>Installing is one script: <code>./install.sh</code> clones the 3 codebases, sets them up, and starts the site.</p>
</div>

<div class="ocs__capstone-footer">
  <div class="ocs__team"><span class="ocs__team-label">Project Team</span><span class="ocs__team-name">{{ data.Team | join: ", " }}</span></div>
  <div class="ocs__status">In Development</div>
</div>
</div>
