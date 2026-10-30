---
microblog: true
toc: false
layout: post
title: OCS-in-a-Kit Capstone
description: Turning Open Coding Society's classroom platform into a school-neutral, installable product.
permalink: /capstone/ocs-in-a-kit/
sticky_rank: 1
year: "2026-2027"
oik_active: hub
---

{% assign data = site.data.ocs_in_a_kit_infograph %}
<div class="ocs__container">
<div class="ocs__badge">Design-Based Research Capstone</div>
<h1>{{ data.Title }}</h1>
<p class="ocs__description">One school's classroom platform, turned into a kit any school can install with one script.</p>

{% include ocs-in-a-kit-nav.html %}

<div class="ocs__card">
  <div class="ocs__stats">
    <div class="ocs__stat"><span class="ocs__stat-value">4</span><span class="ocs__stat-label">Repos</span></div>
    <div class="ocs__stat"><span class="ocs__stat-value">3</span><span class="ocs__stat-label">Kits</span></div>
    <div class="ocs__stat"><span class="ocs__stat-value">16</span><span class="ocs__stat-label">Features</span></div>
    <div class="ocs__stat"><span class="ocs__stat-value">32</span><span class="ocs__stat-label">Commits so far</span></div>
  </div>
</div>

<div class="ocs__card">
  <h3 class="ocs__section-title">The App</h3>
  <div class="ocs__table-wrap">
    <table class="ocs__table">
      <tbody>
        <tr><td><strong>Pages</strong></td><td>Jekyll frontend</td></tr>
        <tr><td><strong>Spring</strong></td><td>Java backend: API, auth, code runner</td></tr>
        <tr><td><strong>Flask</strong></td><td>Python backend: API, code runner, accounts</td></tr>
      </tbody>
    </table>
  </div>
</div>

<div class="ocs__card">
  <h3 class="ocs__section-title">One Codebase, Three Kits</h3>
  <div class="ocs__diagram">
    <pre class="mermaid">flowchart LR
    C[Feature catalog
16 features] --> V[Vanilla
core only]
    C --> E[Education
+lessons, grading,
hall pass]
    C --> B[Business
+org add-ons]</pre>
  </div>
  <p>No forks. One <code>KIT=</code> + <code>FEATURES=+x,-y</code> setting decides what ships. See <a href="/capstone/ocs-in-a-kit/features/">Feature Catalog</a>.</p>
</div>

<div class="ocs__card">
  <div class="ocs__hub-grid">
    <a href="/capstone/ocs-in-a-kit/architecture/" class="ocs__hub-card"><span class="ocs__hub-card-title">Architecture &amp; Repos</span><p>7 repos, the sync pipeline, the installer.</p></a>
    <a href="/capstone/ocs-in-a-kit/features/" class="ocs__hub-card"><span class="ocs__hub-card-title">Feature Catalog</span><p>All 16 features, by kit and category.</p></a>
    <a href="/capstone/ocs-in-a-kit/future/" class="ocs__hub-card"><span class="ocs__hub-card-title">Future</span><p>What's left to migrate and harden.</p></a>
    <a href="/capstone/ocs-in-a-kit/considerations/" class="ocs__hub-card"><span class="ocs__hub-card-title">Considerations</span><p>Open risks worth weighing.</p></a>
  </div>
</div>

<div class="ocs__capstone-footer">
  <div class="ocs__team"><span class="ocs__team-label">Project Team</span><span class="ocs__team-name">{{ data.Team | join: ", " }}</span></div>
  <div class="ocs__status">In Development</div>
</div>
</div>
