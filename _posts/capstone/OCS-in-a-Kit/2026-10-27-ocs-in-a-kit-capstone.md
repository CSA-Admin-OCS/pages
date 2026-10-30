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
<p class="ocs__description">Open Coding Society's classroom platform, packaged so any school or organization can run their own copy.</p>

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
  <p>Open Coding Society built a full classroom platform: lessons, a code runner, grading, chat, hall passes. It's wired to one school, with names, logins, and settings hard-coded in. Other schools had no easy way to use it.</p>
  <p><strong>OCS-in-a-Kit</strong> turns that into a product. Pick what you want, answer a few questions, and get your own working copy. No coding required.</p>
</div>

<div class="ocs__card" id="who">
  <h3 class="ocs__section-title">Who It's For</h3>
  <div class="ocs__table-wrap">
    <table class="ocs__table">
      <thead><tr><th>Kit</th><th>Who picks it</th></tr></thead>
      <tbody>
        <tr><td><strong>Vanilla</strong></td><td>Anyone who wants a basic site for users: accounts, profiles, a blog. Add features later.</td></tr>
        <tr><td><strong>Education</strong></td><td>A teacher or school running a CS classroom: lessons, code runner, assignments, grading, AI tutor, hall pass.</td></tr>
        <tr><td><strong>Business</strong></td><td>A company serving its own members. No classroom features, just chat, calendar, AI chatbot, profiles.</td></tr>
      </tbody>
    </table>
  </div>
</div>

<div class="ocs__card" id="features">
  <h3 class="ocs__section-title">What You Get</h3>
  <p>16 features total. Every kit starts with the same core (login, accounts, blog) and adds from there.</p>
  <div class="ocs__keypoints">
    <div class="ocs__keypoint"><span class="ocs__check">✓</span><span><strong>Lessons &amp; code runner:</strong> students run Python/JS/Java in the browser</span></div>
    <div class="ocs__keypoint"><span class="ocs__check">✓</span><span><strong>Assignments &amp; grading:</strong> submissions, grades, quizzes, AI feedback</span></div>
    <div class="ocs__keypoint"><span class="ocs__check">✓</span><span><strong>AI chatbot &amp; tutor:</strong> keys stay on the server</span></div>
    <div class="ocs__keypoint"><span class="ocs__check">✓</span><span><strong>Games:</strong> a built-in game engine, leaderboards, multiplayer</span></div>
    <div class="ocs__keypoint"><span class="ocs__check">✓</span><span><strong>Chat, calendar, hall pass:</strong> the day-to-day classroom tools</span></div>
    <div class="ocs__keypoint"><span class="ocs__check">✓</span><span><strong>Extras:</strong> finance simulation, resumes, face login, more</span></div>
  </div>
  <p>Admins can turn any feature on or off later. No reinstall needed.</p>
</div>

<div class="ocs__card" id="future">
  <h3 class="ocs__section-title">Future</h3>
  <div class="ocs__keypoints">
    <div class="ocs__keypoint"><span class="ocs__check">✓</span><span>Move the rest of OCS's old site content into the kit</span></div>
    <div class="ocs__keypoint"><span class="ocs__check">✓</span><span>Add a hosted option for schools without their own server</span></div>
    <div class="ocs__keypoint"><span class="ocs__check">✓</span><span>Test turning features on and off live</span></div>
    <div class="ocs__keypoint"><span class="ocs__check">✓</span><span>Get a real school to pilot it end to end</span></div>
  </div>
</div>

<div class="ocs__card" id="considerations">
  <h3 class="ocs__section-title">Considerations</h3>
  <div class="ocs__table-wrap">
    <table class="ocs__table">
      <tbody>
        <tr><td>Privacy</td><td>Grading, hall pass, and chat handle real student data</td></tr>
        <tr><td>Self hosting</td><td>Needs Docker. Not every admin can run that</td></tr>
        <tr><td>Staying in sync</td><td>OCS's own site keeps changing; someone has to keep the kit updated</td></tr>
      </tbody>
    </table>
  </div>
</div>

<div class="ocs__card" id="how-its-built">
  <h3 class="ocs__section-title">How It's Built</h3>
  <p>Each kit bundles 3 codebases: a Portfolio frontend, and Flask and Spring backends. Flask mainly handles login.</p>
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
  <p>Content comes from OCS's original site through an automated scrub step that strips anything school specific (names, logins, secrets) before it's added in.</p>
  <div class="ocs__diagram">
    <pre class="mermaid">flowchart LR
    U[OCS's original site] -->|scan| Sg[Suggest features]
    Sg -->|import| G{Scrub gate}
    G -->|pass| Kt[Kit codebase]
    G -->|blocked| Fx[Fix & re-run]</pre>
  </div>
  <p>Installing is one script, <code>./install.sh</code>, which clones the 3 codebases, sets them up, and starts the site.</p>
</div>

<div class="ocs__capstone-footer">
  <div class="ocs__team"><span class="ocs__team-label">Project Team</span><span class="ocs__team-name">{{ data.Team | join: ", " }}</span></div>
  <div class="ocs__status">In Development</div>
</div>
</div>
