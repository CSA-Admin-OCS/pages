---
microblog: true
toc: false
layout: post
title: OCS-in-a-Kit, Future
description: What's still ahead for OCS-in-a-Kit — migrating the rest of upstream, finishing the scrub pass, and hardening the installer and catalog.
permalink: /capstone/ocs-in-a-kit/future/
year: "2026-2027"
oik_active: future
---

{% assign data = site.data.ocs_in_a_kit_infograph %}
<div class="ocs__container">
<div class="ocs__badge">Future</div>
<h1>What's Still Ahead</h1>
<p class="ocs__description">The installer, catalog, and sync toolchain exist and run — but the migration they enable is nowhere near finished, and several parts of the product still need to be proven under real use.</p>

{% include ocs-in-a-kit-nav.html %}

<div class="ocs__card">
  <h3 class="ocs__section-title">Close the Open Architecture Decision First</h3>
  <p>Everything downstream of this capstone depends on resolving which direction is correct: the installer+catalog system (already built, tested, in CI) or the three-repo-with-subfolders plan. Continuing to build features on top of an unresolved architecture risks throwing away work a second time. See <a href="/capstone/ocs-in-a-kit/considerations/">Considerations</a> for the tradeoffs.</p>
</div>

<div class="ocs__card">
  <h3 class="ocs__section-title">Finish the Upstream Migration</h3>
  <div class="ocs__keypoints">
    <div class="ocs__keypoint"><span class="ocs__check">✓</span><span>pages has 1300+ commits and flask has 178 — only a fraction of that content has been scanned, scrubbed, and imported into the kit repos so far.</span></div>
    <div class="ocs__keypoint"><span class="ocs__check">✓</span><span>OCS-Kit-Spring is still actively being cleaned of school-specific values; that pass needs to finish before Spring can be treated as a stable base for new feature imports.</span></div>
    <div class="ocs__keypoint"><span class="ocs__check">✓</span><span>Run <code>sync/ocs_kit_sync.py scan</code> against pages and flask regularly (the weekly <code>upstream-scan.yml</code> already does this) and work through the resulting suggested-feature queue deliberately, not in a rush.</span></div>
  </div>
</div>

<div class="ocs__card">
  <h3 class="ocs__section-title">Bring All Three Kit Repos to Feature Parity</h3>
  <p>OCS-Kit-Pages, OCS-Kit-Flask, and OCS-Kit-Spring each need to actually support all three presets end-to-end. A feature imported into one repo (say, hall pass into Spring) is incomplete until its Pages-side UI and any Flask-side dependency exist too — the catalog should refuse to advertise a feature as available until every repo it touches has shipped its half.</p>
</div>

<div class="ocs__card">
  <h3 class="ocs__section-title">Harden the Installer</h3>
  <div class="ocs__keypoints">
    <div class="ocs__keypoint"><span class="ocs__check">✓</span><span>More prerequisite checks (Docker version, port conflicts, disk space) before the live install log starts, so failures surface before anything is cloned.</span></div>
    <div class="ocs__keypoint"><span class="ocs__check">✓</span><span>Prove the "re-running updates in place without losing data or secrets" claim against a real schema change in Spring or Flask, not just a file sync — migrations are the part most likely to break this promise.</span></div>
    <div class="ocs__keypoint"><span class="ocs__check">✓</span><span>A hosted/managed install path for schools without the technical capacity to run <code>docker compose up -d --build</code> themselves.</span></div>
  </div>
</div>

<div class="ocs__card">
  <h3 class="ocs__section-title">Let Admins Manage Features Without Reinstalling</h3>
  <p>The admin dashboard already allows feature changes (<code>+finance-sim,-hallpass</code>) after install, per the design — that path needs real testing: does toggling a feature off hide it cleanly without orphaning its data, and does toggling it back on restore cleanly?</p>
</div>

<div class="ocs__card">
  <h3 class="ocs__section-title">Expand Test &amp; CI Coverage</h3>
  <p><code>kit-tests.yml</code> runs on every PR today; as the catalog grows, it should grow into end-to-end install tests across all three presets (Vanilla/Education/Business), not just unit-level catalog-consistency checks.</p>
</div>

<div class="ocs__card">
  <h3 class="ocs__section-title">Governance</h3>
  <p>As more schools and features get added, two questions need owners: who approves a new upstream import before it merges, and how does the scrub-gate denylist stay current as new schools — each with their own names, domains, and staff — start using the product?</p>
</div>

<div class="ocs__capstone-footer">
  <div class="ocs__team"><span class="ocs__team-label">Project Team</span><span class="ocs__team-name">{{ data.Team | join: ", " }}</span></div>
  <div class="ocs__status">In Development</div>
</div>
</div>
