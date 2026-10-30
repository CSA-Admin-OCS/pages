---
microblog: true
toc: false
layout: post
title: OCS-in-a-Kit, Future
description: What's left to migrate and harden.
permalink: /capstone/ocs-in-a-kit/future/
year: "2026-2027"
oik_active: future
---

{% assign data = site.data.ocs_in_a_kit_infograph %}
<div class="ocs__container">
<div class="ocs__badge">Future</div>
<h1>What's Left</h1>

{% include ocs-in-a-kit-nav.html %}

<div class="ocs__card">
  <div class="ocs__keypoints">
    <div class="ocs__keypoint"><span class="ocs__check">✓</span><span><strong>Finish the Pages migration</strong> — 3,018 of 3,994 upstream files are new, unimported content (208 suggested feature groups queued)</span></div>
    <div class="ocs__keypoint"><span class="ocs__check">✓</span><span><strong>Scan Flask and Spring upstream</strong> — only Pages has a scan report so far</span></div>
    <div class="ocs__keypoint"><span class="ocs__check">✓</span><span><strong>Feature parity</strong> across Pages/Flask/Spring for every imported feature</span></div>
    <div class="ocs__keypoint"><span class="ocs__check">✓</span><span><strong>Prove updates survive a real schema change</strong>, not just a file sync</span></div>
    <div class="ocs__keypoint"><span class="ocs__check">✓</span><span><strong>Hosted install option</strong> for schools that can't run Docker themselves</span></div>
    <div class="ocs__keypoint"><span class="ocs__check">✓</span><span><strong>Test live feature toggling</strong> from the admin dashboard, not just at install</span></div>
    <div class="ocs__keypoint"><span class="ocs__check">✓</span><span><strong>Per-preset e2e tests</strong>, not just catalog-consistency checks</span></div>
    <div class="ocs__keypoint"><span class="ocs__check">✓</span><span><strong>Governance</strong> — who approves imports, who maintains the denylist</span></div>
  </div>
</div>

<div class="ocs__capstone-footer">
  <div class="ocs__team"><span class="ocs__team-label">Project Team</span><span class="ocs__team-name">{{ data.Team | join: ", " }}</span></div>
  <div class="ocs__status">In Development</div>
</div>
</div>
