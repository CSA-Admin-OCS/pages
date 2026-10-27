---
microblog: true
toc: false
layout: post
title: OCS-in-a-Kit Capstone
description: Turning Open Coding Society's in-use classroom platform into a school-neutral, installable product.
permalink: /capstone/ocs-in-a-kit/
sticky_rank: 1
year: "2026-2027"
oik_active: hub
---

{% assign data = site.data.ocs_in_a_kit_infograph %}
<div class="ocs__container">
<div class="ocs__badge">Design-Based Research Capstone</div>
<h1>{{ data.Title }}</h1>
<p class="ocs__description">{{ data.Description }}</p>

{% include ocs-in-a-kit-nav.html %}

<div class="ocs__card">
  <h3 class="ocs__section-title">The Problem</h3>
  <p>Open Coding Society's classroom platform — Pages, Spring, and Flask — is real, in-use software, but it is wired to one school: names, domains, staff emails, rosters, and secrets are baked into the code. Any other school, classroom, or small organization that wanted the same tooling would have to fork it and hand-edit out everything school-specific, then keep re-doing that every time upstream changed. <strong>OCS-in-a-Kit</strong> asks whether that genericization can be automated well enough that a non-technical admin can install the result with one script.</p>
</div>

<div class="ocs__card">
  <h3 class="ocs__section-title">Three-Part Application</h3>
  <div class="ocs__table-wrap">
    <table class="ocs__table">
      <thead><tr><th>Part</th><th>Tech</th><th>What it does</th></tr></thead>
      <tbody>
        <tr><td>Pages</td><td>Jekyll static site (Ruby)</td><td>The frontend students and staff open — lessons, blog, admin dashboards, course content, notebooks</td></tr>
        <tr><td>Spring</td><td>Java 21 / Spring Boot</td><td>One backend: REST API, JWT auth, admin UI (Thymeleaf), group-chat websocket, sandboxed code runner</td></tr>
        <tr><td>Flask</td><td>Python</td><td>The other backend: REST API, admin pages, socket server, its own code runner, account/password management</td></tr>
      </tbody>
    </table>
  </div>
  <p>Both backends run side by side (ports 8585/8589 for Spring, 8587/8500 for Flask) behind the Pages frontend, with nginx/Docker for production deployment.</p>
</div>

<div class="ocs__card">
  <h3 class="ocs__section-title">The "Kit" Concept</h3>
  <p>Rather than one fixed feature set, the product ships as <strong>kits</strong> — named bundles of features for different buyer types:</p>
  <div class="ocs__keypoints">
    <div class="ocs__keypoint"><span class="ocs__check">✓</span><span><strong>Vanilla</strong> — general-purpose base feature set</span></div>
    <div class="ocs__keypoint"><span class="ocs__check">✓</span><span><strong>Education</strong> — classroom features on top: lessons, grading, hall passes, courses/periods</span></div>
    <div class="ocs__keypoint"><span class="ocs__check">✓</span><span><strong>Business</strong> — general-purpose features aimed at organizations (no classroom-specific stuff)</span></div>
  </div>
  <p style="margin-top:1rem;">Every feature is tagged with a <strong>category</strong> (core/general/education) and <strong>labels</strong> (needs-api-key, privacy-sensitive, runs-code). A kit preset is just an explicit feature list — admins can customize further (<code>+finance-sim,-hallpass</code>) at install time or later from the admin dashboard. See the <a href="/capstone/ocs-in-a-kit/features/">Feature Catalog</a> for the full list.</p>
</div>

<div class="ocs__card">
  <h3 class="ocs__section-title">Explore the Project</h3>
  <div class="ocs__hub-grid">
    <a href="/capstone/ocs-in-a-kit/architecture/" class="ocs__hub-card">
      <span class="ocs__hub-card-title">Architecture &amp; Repos</span>
      <p>The seven-repo landscape, how features migrate from the upstream classroom project into shippable kits, the scrub gate, and the install experience.</p>
    </a>
    <a href="/capstone/ocs-in-a-kit/features/" class="ocs__hub-card">
      <span class="ocs__hub-card-title">Feature Catalog</span>
      <p>Every feature OCS-in-a-Kit ships or plans to ship, grouped by category and tagged with the labels that drive install-time behavior.</p>
    </a>
    <a href="/capstone/ocs-in-a-kit/future/" class="ocs__hub-card">
      <span class="ocs__hub-card-title">Future</span>
      <p>What's still ahead: migrating the rest of upstream, finishing the scrub pass, and hardening the installer and catalog.</p>
    </a>
    <a href="/capstone/ocs-in-a-kit/considerations/" class="ocs__hub-card">
      <span class="ocs__hub-card-title">Considerations</span>
      <p>The open risks and decisions — privacy, secrets handling, sustainability, and the architecture question that hasn't been closed yet.</p>
    </a>
  </div>
</div>

<div class="ocs__capstone-footer">
  <div class="ocs__team"><span class="ocs__team-label">Project Team</span><span class="ocs__team-name">{{ data.Team | join: ", " }}</span></div>
  <div class="ocs__status">In Development</div>
</div>
</div>
