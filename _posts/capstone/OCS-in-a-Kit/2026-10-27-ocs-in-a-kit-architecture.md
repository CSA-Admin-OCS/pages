---
microblog: true
toc: false
layout: post
title: OCS-in-a-Kit, Architecture & Repos
description: Seven repos, a scrub-gated sync pipeline, and a one-script installer.
permalink: /capstone/ocs-in-a-kit/architecture/
year: "2026-2027"
oik_active: architecture
---

{% assign data = site.data.ocs_in_a_kit_infograph %}
<div class="ocs__container">
<div class="ocs__badge">Architecture &amp; Repos</div>
<h1>From School Codebase to Shippable Kit</h1>

{% include ocs-in-a-kit-nav.html %}

<div class="ocs__card">
  <h3 class="ocs__section-title">Repos</h3>
  <div class="ocs__table-wrap">
    <table class="ocs__table">
      <thead><tr><th>Repo</th><th>Role</th></tr></thead>
      <tbody>
        <tr><td>pages, flask</td><td>Upstream — the original, school-specific OCS code</td></tr>
        <tr><td>OCS-Kit-Spring</td><td>Upstream — already being genericized</td></tr>
        <tr><td>OCS-Kit-Vanilla</td><td>Installer + catalog (32 commits)</td></tr>
        <tr><td>OCS-Kit-Pages / -Flask / -Spring</td><td>One codebase each, all 3 kits via feature flags</td></tr>
      </tbody>
    </table>
  </div>
</div>

<div class="ocs__card">
  <h3 class="ocs__section-title">Upstream → Kit</h3>
  <div class="ocs__diagram">
    <pre class="mermaid">flowchart LR
    U[Upstream repo] -->|scan| S[Suggest features]
    S -->|import| G{Scrub gate}
    G -->|pass| K[Kit repo
+ catalog.json]
    G -->|blocked| F[Fix & re-run]</pre>
  </div>
  <p>Scrub gate blocks: school names/domains, secrets (Google/Slack/AWS/GitHub/OpenAI), PII, oversized files. CI: weekly upstream scan + tests on every PR.</p>
  <div class="ocs__stats">
    <div class="ocs__stat"><span class="ocs__stat-value">1,124 / 3,994</span><span class="ocs__stat-label">Pages files migrated</span></div>
    <div class="ocs__stat"><span class="ocs__stat-value">0</span><span class="ocs__stat-label">Flask files scanned yet</span></div>
  </div>
</div>

<div class="ocs__card">
  <h3 class="ocs__section-title">Installer</h3>
  <div class="ocs__diagram">
    <pre class="mermaid">flowchart LR
    A[Pick kit] --> B[Customize
features]
    B --> C[School info
+ passwords]
    C --> D[Check
prereqs]
    D --> E[Install:
clone, .env,
docker compose]</pre>
  </div>
  <p>Python 3.8+, no deps. Web wizard, terminal, or unattended (<code>answers.json</code>). Re-running updates in place — secrets and data kept, no force-push to a published site.</p>
</div>

<div class="ocs__card">
  <h3 class="ocs__section-title">How We Got Here</h3>
  <p>Early plan: three repos (Vanilla/Education/Business) with merged pages+spring+flask history per repo — blocked by missing org-admin rights to create repos. Found <code>OCS-Kit-Vanilla</code> already built as the installer+catalog system instead. 32 commits and counting on that path; no new repos needed.</p>
</div>

<div class="ocs__capstone-footer">
  <div class="ocs__team"><span class="ocs__team-label">Project Team</span><span class="ocs__team-name">{{ data.Team | join: ", " }}</span></div>
  <div class="ocs__status">In Development</div>
</div>
</div>
