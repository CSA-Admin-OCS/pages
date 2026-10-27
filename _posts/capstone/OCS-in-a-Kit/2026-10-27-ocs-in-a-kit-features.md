---
microblog: true
toc: false
layout: post
title: OCS-in-a-Kit, Feature Catalog
description: Every feature OCS-in-a-Kit ships or plans to ship, grouped by category and tagged with the labels that drive install-time behavior.
permalink: /capstone/ocs-in-a-kit/features/
year: "2026-2027"
oik_active: features
---

{% assign data = site.data.ocs_in_a_kit_infograph %}
<div class="ocs__container">
<div class="ocs__badge">Feature Catalog</div>
<h1>Every Feature, Tagged and Bundled</h1>
<p class="ocs__description">OCS-in-a-Kit has no fixed feature set. A kit preset is just an explicit list of features, each carrying a category and a set of labels that the installer and admin dashboard read to decide what to show, what needs a key, and what to warn about.</p>

{% include ocs-in-a-kit-nav.html %}

<div class="ocs__card">
  <h3 class="ocs__section-title">The Tagging System</h3>
  <div class="ocs__stats">
    <div class="ocs__stat"><span class="ocs__stat-value">core</span><span class="ocs__stat-label">Category</span></div>
    <div class="ocs__stat"><span class="ocs__stat-value">general</span><span class="ocs__stat-label">Category</span></div>
    <div class="ocs__stat"><span class="ocs__stat-value">education</span><span class="ocs__stat-label">Category</span></div>
  </div>
  <p style="margin-top:1rem;">Every feature also carries zero or more <strong>labels</strong> that flag install-time behavior, independent of category:</p>
  <div class="ocs__table-wrap">
    <table class="ocs__table">
      <thead><tr><th>Label</th><th>What it means for install/admin</th></tr></thead>
      <tbody>
        <tr><td><code>needs-api-key</code></td><td>Installer prompts for a per-feature API key during setup; admin dashboard flags it if the key is missing.</td></tr>
        <tr><td><code>privacy-sensitive</code></td><td>Touches PII (rosters, student records, chat logs) — held to the same scrub-gate standard as upstream imports.</td></tr>
        <tr><td><code>runs-code</code></td><td>Executes user-submitted code in a sandbox (Spring or Flask code runner) — isolation and resource limits apply.</td></tr>
      </tbody>
    </table>
  </div>
</div>

<div class="ocs__card">
  <h3 class="ocs__section-title">Kit Presets</h3>
  <div class="ocs__table-wrap">
    <table class="ocs__table">
      <thead><tr><th>Kit</th><th>What's in it</th></tr></thead>
      <tbody>
        <tr><td><strong>Vanilla</strong></td><td>General-purpose base feature set: core platform only.</td></tr>
        <tr><td><strong>Education</strong></td><td>Vanilla, plus classroom features: lessons, grading, hall passes, courses/periods.</td></tr>
        <tr><td><strong>Business</strong></td><td>Vanilla, plus general-purpose organization features — no classroom-specific stuff.</td></tr>
      </tbody>
    </table>
  </div>
  <p>A preset is nothing more than an explicit feature list in <code>kits/catalog.json</code>. Admins override it per install (<code>+finance-sim,-hallpass</code>) or later from the admin dashboard — there is no code fork per kit, only a different feature list read at runtime via <code>KIT=</code> + <code>FEATURES=</code>.</p>
</div>

<div class="ocs__card">
  <h3 class="ocs__section-title">Core Platform Features</h3>
  <p>Present in every kit, regardless of preset — category <code>core</code>:</p>
  <div class="ocs__table-wrap">
    <table class="ocs__table">
      <thead><tr><th>Feature</th><th>Repo</th><th>Labels</th></tr></thead>
      <tbody>
        <tr><td>Jekyll frontend (lessons, blog, admin dashboards, course content, notebooks)</td><td>Pages</td><td>—</td></tr>
        <tr><td>REST API + JWT authentication</td><td>Spring, Flask</td><td>privacy-sensitive</td></tr>
        <tr><td>Admin UI (Thymeleaf)</td><td>Spring</td><td>—</td></tr>
        <tr><td>Group-chat websocket</td><td>Spring</td><td>privacy-sensitive</td></tr>
        <tr><td>Sandboxed code runner</td><td>Spring, Flask</td><td>runs-code</td></tr>
        <tr><td>Socket server</td><td>Flask</td><td>—</td></tr>
        <tr><td>Account &amp; password management</td><td>Flask</td><td>privacy-sensitive</td></tr>
      </tbody>
    </table>
  </div>
</div>

<div class="ocs__card">
  <h3 class="ocs__section-title">General-Purpose Features</h3>
  <p>Available to any kit, not tied to a classroom — category <code>general</code>:</p>
  <div class="ocs__keypoints">
    <div class="ocs__keypoint"><span class="ocs__check">✓</span><span><strong>Finance simulation</strong> — a general-purpose finance/budgeting sim, opt-out by default via <code>-finance-sim</code></span></div>
    <div class="ocs__keypoint"><span class="ocs__check">✓</span><span><strong>Arcade games</strong> — general engagement features, no classroom dependency</span></div>
    <div class="ocs__keypoint"><span class="ocs__check">✓</span><span><strong>Code runner</strong> (shared with core, exposed as a standalone general-purpose tool outside classroom contexts) — <code>runs-code</code></span></div>
  </div>
</div>

<div class="ocs__card">
  <h3 class="ocs__section-title">Education-Only Features</h3>
  <p>Only in the Education preset (or added with <code>+</code>) — category <code>education</code>:</p>
  <div class="ocs__keypoints">
    <div class="ocs__keypoint"><span class="ocs__check">✓</span><span><strong>Lessons</strong> — structured course content delivery</span></div>
    <div class="ocs__keypoint"><span class="ocs__check">✓</span><span><strong>Grading</strong> — <code>privacy-sensitive</code></span></div>
    <div class="ocs__keypoint"><span class="ocs__check">✓</span><span><strong>Hall pass</strong> — <code>privacy-sensitive</code> (tracks student movement/location in time)</span></div>
    <div class="ocs__keypoint"><span class="ocs__check">✓</span><span><strong>Courses / periods</strong> — scheduling structure the other education features hang off of</span></div>
  </div>
</div>

<div class="ocs__card">
  <h3 class="ocs__section-title">Platform / Tooling Features</h3>
  <p>These aren't installable kit features themselves — they're what makes the kit system work:</p>
  <div class="ocs__table-wrap">
    <table class="ocs__table">
      <thead><tr><th>Component</th><th>What it is</th></tr></thead>
      <tbody>
        <tr><td><code>ocs_kit_installer.py</code></td><td>~160&nbsp;KB installer script, web-wizard and terminal/unattended modes</td></tr>
        <tr><td><code>kits/catalog.json</code></td><td>Canonical feature/kit/role definitions</td></tr>
        <tr><td><code>sync/ocs_kit_sync.py</code></td><td><code>scan</code> / <code>import --feature</code> / <code>update --feature</code> / <code>check</code> — migrates features from upstream into kit repos</td></tr>
        <tr><td>Scrub gate</td><td>Denylist, secret detection, PII detection, oversized-file blocking, protected paths, log/report redaction</td></tr>
        <tr><td><code>upstream-scan.yml</code></td><td>Weekly CI scan of upstream for new content, posts to a tracking issue</td></tr>
        <tr><td><code>kit-tests.yml</code></td><td>CI test suite run on every PR</td></tr>
      </tbody>
    </table>
  </div>
</div>

<div class="ocs__capstone-footer">
  <div class="ocs__team"><span class="ocs__team-label">Project Team</span><span class="ocs__team-name">{{ data.Team | join: ", " }}</span></div>
  <div class="ocs__status">In Development</div>
</div>
</div>
