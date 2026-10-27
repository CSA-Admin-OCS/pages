---
microblog: true
toc: false
layout: post
title: OCS-in-a-Kit, Considerations
description: The open risks and decisions behind OCS-in-a-Kit — privacy, secrets handling, sustainability, and the architecture question that hasn't been closed yet.
permalink: /capstone/ocs-in-a-kit/considerations/
year: "2026-2027"
oik_active: considerations
---

{% assign data = site.data.ocs_in_a_kit_infograph %}
<div class="ocs__container">
<div class="ocs__badge">Considerations</div>
<h1>What to Weigh Before Going Further</h1>
<p class="ocs__description">None of this is a straight line from idea to finished product. These are the open decisions and risks worth resolving deliberately rather than discovering under pressure.</p>

{% include ocs-in-a-kit-nav.html %}

<div class="ocs__card">
  <h3 class="ocs__section-title">The Unresolved Architecture Decision</h3>
  <p>Two designs are "on the table" at once: the installer+catalog system (one codebase per technology, three feature-flag presets — already built, tested, in CI) and the three-repo-with-subfolders plan (OCS-Kit-Vanilla/Education/Business, each a merged-history repo — blocked on missing org-admin rights to create repos). Nothing has been merged, moved, or deleted while this stays open. See <a href="/capstone/ocs-in-a-kit/architecture/">Architecture &amp; Repos</a> for the full comparison.</p>
  <div class="ocs__callout">Committing to a direction before the other direction's cost is understood risks real rework. The installer+catalog system is further along and has no outstanding blocker; the subfolder-repo plan would discard that work and still needs a human with org-admin rights to even start.</div>
</div>

<div class="ocs__card">
  <h3 class="ocs__section-title">Shared Code Means Shared Blast Radius</h3>
  <p>One codebase per technology across three presets means a bug in shared code affects Vanilla, Education, and Business simultaneously — there's no variant isolation to contain it. <code>kit-tests.yml</code> mitigates this, but needs to assert behavior per preset, not just that the code compiles.</p>
</div>

<div class="ocs__card">
  <h3 class="ocs__section-title">Privacy &amp; Compliance</h3>
  <p>The scrub gate's PII detection (rosters, bulk emails) and <code>privacy-sensitive</code> feature labels are necessary but not sufficient on their own. Hall pass, grading, group chat, and auth all handle real student data once a school installs this. Before any real school's data goes near this pipeline, the privacy design needs a pass that isn't just "does the scrub gate catch it" — closer to a FERPA-style compliance review for a classroom product.</p>
</div>

<div class="ocs__card">
  <h3 class="ocs__section-title">Secrets Handling at Install Time</h3>
  <p>The installer collects per-feature API keys and account passwords and writes them into <code>.env</code> files on the admin's machine. For a non-technical school admin, the storage, rotation, and access control around those files matters as much as collecting them correctly in the first place — a leaked <code>.env</code> is a leaked set of credentials for every API-key-gated feature at once.</p>
</div>

<div class="ocs__card">
  <h3 class="ocs__section-title">The Org-Admin Rights Gap</h3>
  <p>This capstone ran directly into a structural constraint: the Claude GitHub App lacks org-admin rights, so it cannot create organization repositories. Any plan that depends on repo creation (like the subfolder-repo architecture) needs a human with those rights in the loop at that step — automation can prepare everything up to that point and no further.</p>
</div>

<div class="ocs__card">
  <h3 class="ocs__section-title">Self-Hosting Burden</h3>
  <p><code>docker compose up -d --build</code> on a school's own infrastructure assumes a baseline of technical capacity that not every "non-technical admin" the product targets will have. A hosted or managed install path (see <a href="/capstone/ocs-in-a-kit/future/">Future</a>) may be necessary to actually reach the least technical end of the target audience, not just a nice-to-have.</p>
</div>

<div class="ocs__card">
  <h3 class="ocs__section-title">Licensing &amp; Attribution</h3>
  <p>OCS-in-a-Kit genericizes a product built from Open Coding Society's specific, in-use classroom codebase. If the resulting kits are distributed or used commercially by other schools or organizations, the licensing and attribution terms relative to the original OCS project need to be explicit before that happens — not assumed.</p>
</div>

<div class="ocs__card">
  <h3 class="ocs__section-title">Long-Term Maintenance</h3>
  <p>Upstream pages and flask keep evolving independently of the kit repos. The sync toolchain (<code>scan</code>/<code>import</code>/<code>update</code>/<code>check</code>) and the weekly <code>upstream-scan.yml</code> job exist to manage that drift, but someone has to actually own triaging the weekly findings — a tool that surfaces drift is not the same as a process that resolves it.</p>
</div>

<div class="ocs__capstone-footer">
  <div class="ocs__team"><span class="ocs__team-label">Project Team</span><span class="ocs__team-name">{{ data.Team | join: ", " }}</span></div>
  <div class="ocs__status">In Development</div>
</div>
</div>
