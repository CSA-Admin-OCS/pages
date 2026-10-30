---
microblog: true
toc: false
layout: post
title: OCS-in-a-Kit, Feature Catalog
description: All 16 features, by category and kit.
permalink: /capstone/ocs-in-a-kit/features/
year: "2026-2027"
oik_active: features
---

{% assign data = site.data.ocs_in_a_kit_infograph %}
<div class="ocs__container">
<div class="ocs__badge">Feature Catalog</div>
<h1>16 Features, 3 Kits</h1>
<p class="ocs__description">Defined once in <code>kits/catalog.json</code>. A kit is just a feature list.</p>

{% include ocs-in-a-kit-nav.html %}

<div class="ocs__card">
  <div class="ocs__stats">
    <div class="ocs__stat"><span class="ocs__stat-value">1</span><span class="ocs__stat-label">Core</span></div>
    <div class="ocs__stat"><span class="ocs__stat-value">11</span><span class="ocs__stat-label">General</span></div>
    <div class="ocs__stat"><span class="ocs__stat-value">4</span><span class="ocs__stat-label">Education</span></div>
  </div>
</div>

<div class="ocs__card">
  <h3 class="ocs__section-title">Kits</h3>
  <div class="ocs__table-wrap">
    <table class="ocs__table">
      <thead><tr><th>Kit</th><th>Features</th></tr></thead>
      <tbody>
        <tr><td><strong>Vanilla</strong></td><td>core</td></tr>
        <tr><td><strong>Education</strong></td><td>+ lessons, code-runner, assignments, game-engine, ai-chatbot, ai-grading, calendar, analytics, hallpass, social, resume</td></tr>
        <tr><td><strong>Business</strong></td><td>+ ai-chatbot, social, calendar, analytics, resume</td></tr>
      </tbody>
    </table>
  </div>
  <p>Business kit says "Add anything else (code runner, game engine, finance sim, Kasm, face recognition) from the admin dashboard."</p>
</div>

<div class="ocs__card">
  <h3 class="ocs__section-title">All Features</h3>
  <div class="ocs__table-wrap">
    <table class="ocs__table">
      <thead><tr><th>Feature</th><th>Category</th><th>Labels</th></tr></thead>
      <tbody>
        <tr><td>core</td><td>core</td><td>student-safe, personal-data</td></tr>
        <tr><td>lessons</td><td>education</td><td>classroom, student-safe</td></tr>
        <tr><td>code-runner</td><td>general</td><td>runs-code, student-safe</td></tr>
        <tr><td>assignments</td><td>education</td><td>classroom, teacher-tools, personal-data</td></tr>
        <tr><td>game-engine</td><td>general</td><td>student-safe</td></tr>
        <tr><td>ai-chatbot</td><td>general</td><td>needs-api-key, third-party-data</td></tr>
        <tr><td>ai-grading</td><td>education</td><td>classroom, teacher-tools, needs-api-key, third-party-data</td></tr>
        <tr><td>social</td><td>general</td><td>user-content</td></tr>
        <tr><td>calendar</td><td>general</td><td>teacher-tools</td></tr>
        <tr><td>analytics</td><td>general</td><td>teacher-tools, personal-data</td></tr>
        <tr><td>hallpass</td><td>education</td><td>classroom, teacher-tools</td></tr>
        <tr><td>finance-sim</td><td>general</td><td>simulation, student-safe</td></tr>
        <tr><td>resume</td><td>general</td><td>personal-data</td></tr>
        <tr><td>kasm</td><td>general</td><td>needs-external-service</td></tr>
        <tr><td>face-recognition</td><td>general</td><td>privacy-sensitive, personal-data</td></tr>
        <tr><td>examples</td><td>general</td><td>demo, student-safe</td></tr>
      </tbody>
    </table>
  </div>
</div>

<div class="ocs__card">
  <h3 class="ocs__section-title">Roles</h3>
  <p>admin (manages features) · staff (teacher/manager — no feature access) · member (student/user)</p>
</div>

<div class="ocs__capstone-footer">
  <div class="ocs__team"><span class="ocs__team-label">Project Team</span><span class="ocs__team-name">{{ data.Team | join: ", " }}</span></div>
  <div class="ocs__status">In Development</div>
</div>
</div>
