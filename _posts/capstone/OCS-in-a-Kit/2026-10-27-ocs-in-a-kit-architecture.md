---
microblog: true
toc: false
layout: post
title: OCS-in-a-Kit, Architecture & Repos
description: The seven-repo landscape, how features migrate from the upstream classroom project into shippable kits, the scrub gate, and the install experience.
permalink: /capstone/ocs-in-a-kit/architecture/
year: "2026-2027"
oik_active: architecture
---

{% assign data = site.data.ocs_in_a_kit_infograph %}
<div class="ocs__container">
<div class="ocs__badge">Architecture &amp; Repos</div>
<h1>From One School's Codebase to a Shippable Kit</h1>
<p class="ocs__description">Seven repositories, two roles: the originals being genericized, and the products that actually ship.</p>

{% include ocs-in-a-kit-nav.html %}

<div class="ocs__card">
  <h3 class="ocs__section-title">The Repo Landscape</h3>
  <p><strong>Upstream source repos</strong> — the original, school-specific classroom project, what gets genericized <em>from</em>:</p>
  <div class="ocs__table-wrap">
    <table class="ocs__table">
      <thead><tr><th>Repo</th><th>Role</th></tr></thead>
      <tbody>
        <tr><td>pages</td><td>Original Open Coding Society frontend. Large history (1300+ commits).</td></tr>
        <tr><td>flask</td><td>Original Open Coding Society Flask backend. 178 commits.</td></tr>
        <tr><td>OCS-Kit-Spring</td><td>Already a genericized Spring backend, actively being cleaned of school-specific values.</td></tr>
      </tbody>
    </table>
  </div>
  <p style="margin-top:1.25rem;"><strong>Product repos</strong> — what actually ships, created in the last day of this capstone:</p>
  <div class="ocs__table-wrap">
    <table class="ocs__table">
      <thead><tr><th>Repo</th><th>Role</th></tr></thead>
      <tbody>
        <tr><td>OCS-Kit-Vanilla</td><td>Despite the name, not a per-variant repo. It's the single installer + canonical feature catalog: <code>ocs_kit_installer.py</code> (a ~160&nbsp;KB installer script with a web-wizard and terminal/unattended modes), <code>kits/catalog.json</code> (the canonical feature/kit/role definitions), and a <code>sync/</code> toolchain.</td></tr>
        <tr><td>OCS-Kit-Pages</td><td rowspan="3">One of the three technology-specific kit repos that actually run in production. Each supports all three kit presets (Vanilla/Education/Business) via a <code>KIT=</code> + <code>FEATURES=+x,-y</code> environment setting — not via separate code per variant.</td></tr>
        <tr><td>OCS-Kit-Flask</td></tr>
        <tr><td>OCS-Kit-Spring</td></tr>
      </tbody>
    </table>
  </div>
  <div class="ocs__callout">One codebase per technology, three feature-flag presets — not three codebases per audience. No <code>OCS-Kit-Education</code> or <code>OCS-Kit-Business</code> repos exist, and under this design none are needed.</div>
</div>

<div class="ocs__card">
  <h3 class="ocs__section-title">How Features Move From Upstream to Shippable Kit</h3>
  <p><code>sync/ocs_kit_sync.py</code> migrates features from the upstream pages/flask/spring repos into the three kit repos one feature at a time, each on its own branch:</p>
  <div class="ocs__diagram">
    <pre class="mermaid">flowchart LR
    U["Upstream repo
pages / flask / OCS-Kit-Spring"] -->|scan| S["Diff upstream vs. kit,
group new content into
suggested features"]
    S -->|import --feature X| I["Pull files + referenced
layouts/includes/assets,
rewrite hard-coded URLs to config"]
    I --> G{Scrub gate}
    G -->|pass| R["Register in catalog.json,
run tests, commit on its
own branch"]
    G -->|blocked| F["Denylist / secret / PII /
oversized-file hit — fix
and re-run"]
    R -->|update --feature X| U2["Re-pull upstream changes
for files the feature owns"]
    R -->|check| C["Catalog consistency,
no double-claimed paths"]</pre>
  </div>
  <p>Every import passes the scrub gate first. It blocks on:</p>
  <div class="ocs__keypoints">
    <div class="ocs__keypoint"><span class="ocs__check">✓</span><span>School names/domains/teacher names (denylist)</span></div>
    <div class="ocs__keypoint"><span class="ocs__check">✓</span><span>API keys/secrets — Google, Slack, AWS, GitHub, OpenAI-shaped tokens</span></div>
    <div class="ocs__keypoint"><span class="ocs__check">✓</span><span>PII — rosters, bulk emails</span></div>
    <div class="ocs__keypoint"><span class="ocs__check">✓</span><span>Oversized files</span></div>
  </div>
  <p style="margin-top:1rem;">There's also URL/credential redaction for anything that gets logged or posted (so scan reports and commit messages never leak secrets), protected paths that can never be overwritten (<code>_config.yml</code>, <code>kits/**</code>), and CI workflows: <code>upstream-scan.yml</code> runs weekly and posts findings to a tracking issue, <code>kit-tests.yml</code> runs on every PR.</p>
</div>

<div class="ocs__card">
  <h3 class="ocs__section-title">Installer Experience</h3>
  <p>For end users — schools installing this — <code>./install.sh</code> opens a local web wizard (or terminal fallback) that walks through:</p>
  <div class="ocs__diagram">
    <pre class="mermaid">flowchart LR
    A[Choose kit:
Vanilla / Education / Business] --> B[Customize features]
    B --> C[Backend/website
install mode:
local vs. production + domain]
    C --> D[School name,
admin email]
    D --> E[Account passwords]
    E --> F[Per-feature API keys]
    F --> G[Prerequisite checks]
    G --> H[Live install log]
    H --> I[Clone 3 kit repos,
write .env files,
docker compose up -d --build]
    I --> J[Optional: publish Pages
to GitHub Pages via gh]</pre>
  </div>
  <p>Re-running updates in place or changes the kit/features without losing data or secrets.</p>
</div>

<div class="ocs__card">
  <h3 class="ocs__section-title">Decision Log: Two Architectures on the Table</h3>
  <p>Worth being honest about this, since it shows real engineering decision-making rather than a straight line from idea to finished product.</p>
  <div class="ocs__table-wrap">
    <table class="ocs__table">
      <thead><tr><th></th><th>Installer + catalog (built)</th><th>Three repos with subfolders (planned first)</th></tr></thead>
      <tbody>
        <tr><td>Shape</td><td>One codebase per technology (Pages/Spring/Flask), three feature-flag presets via <code>KIT=</code> + <code>FEATURES=</code></td><td>Three repos named OCS-Kit-Vanilla/Education/Business, each with pages/spring/flask as subfolders with merged git history</td></tr>
        <tr><td>Status</td><td>Already built: installer, catalog, sync toolchain, tests, CI</td><td>Got as far as installing git-filter-repo and verifying branch histories</td></tr>
        <tr><td>Blocker</td><td>None found</td><td>Creating org repos requires org-admin rights the Claude GitHub App doesn't have</td></tr>
        <tr><td>Maintenance</td><td>One place to fix bugs, write tests, review PRs per technology</td><td>Three codebases to patch/test/review per technology; a core-platform fix needs cherry-picking three times</td></tr>
        <tr><td>Customization</td><td>Admins can mix features (<code>+finance-sim,-hallpass</code>) without a new repo per combination</td><td>Fixed per repo; a new combination needs a new repo</td></tr>
      </tbody>
    </table>
  </div>
  <div class="ocs__callout">Early in this capstone, the subfolder-merge plan was the working assumption. When it came time to create those repos, <code>OCS-Kit-Vanilla</code> already existed — built out as the installer+catalog system, alongside <code>OCS-Kit-Pages</code> and <code>OCS-Kit-Flask</code>, created the same day. The two plans were flagged as being "on the table" simultaneously, with nothing merged, moved, or deleted, and the question of which direction is correct was put back to the project owner rather than decided unilaterally. See <a href="/capstone/ocs-in-a-kit/considerations/">Considerations</a> for where that decision stands.</div>
</div>

<div class="ocs__capstone-footer">
  <div class="ocs__team"><span class="ocs__team-label">Project Team</span><span class="ocs__team-name">{{ data.Team | join: ", " }}</span></div>
  <div class="ocs__status">In Development</div>
</div>
</div>
