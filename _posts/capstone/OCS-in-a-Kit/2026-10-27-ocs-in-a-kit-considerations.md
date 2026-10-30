---
microblog: true
toc: false
layout: post
title: OCS-in-a-Kit, Considerations
description: Open risks worth weighing.
permalink: /capstone/ocs-in-a-kit/considerations/
year: "2026-2027"
oik_active: considerations
---

{% assign data = site.data.ocs_in_a_kit_infograph %}
<div class="ocs__container">
<div class="ocs__badge">Considerations</div>
<h1>Risks to Weigh</h1>

{% include ocs-in-a-kit-nav.html %}

<div class="ocs__card">
  <div class="ocs__table-wrap">
    <table class="ocs__table">
      <thead><tr><th>Risk</th><th>Why it matters</th></tr></thead>
      <tbody>
        <tr><td>Shared codebase</td><td>One bug in shared code hits all 3 kits at once — per-preset tests needed</td></tr>
        <tr><td>Privacy &amp; compliance</td><td>Grading, hall pass, chat handle real student data — scrub gate ≠ compliance review</td></tr>
        <tr><td>Secrets at install</td><td>API keys + passwords land in a plain <code>.env</code> on the admin's machine</td></tr>
        <tr><td>Org-admin gap</td><td>Claude's GitHub App can't create org repos — any plan needing new repos needs a human</td></tr>
        <tr><td>Self-hosting burden</td><td><code>docker compose</code> assumes technical capacity some admins won't have</td></tr>
        <tr><td>Licensing</td><td>Genericizes OCS's own codebase — attribution terms if kits spread commercially</td></tr>
        <tr><td>Maintenance</td><td>Upstream keeps moving; someone has to triage the weekly scan, not just run it</td></tr>
      </tbody>
    </table>
  </div>
</div>

<div class="ocs__capstone-footer">
  <div class="ocs__team"><span class="ocs__team-label">Project Team</span><span class="ocs__team-name">{{ data.Team | join: ", " }}</span></div>
  <div class="ocs__status">In Development</div>
</div>
</div>
