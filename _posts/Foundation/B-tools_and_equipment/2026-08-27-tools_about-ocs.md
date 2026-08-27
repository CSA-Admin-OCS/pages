---
toc: True
layout: post
data: tools
title: About Open Coding Society
description: What Open Coding Society is, the full-stack app members build together, and how to get involved.
categories: ['Community']
permalink: /tools/about-ocs
breadcrumb: True
---

<div class="api-docs migration-runbook">

  <div class="api-header">
    <h2>About Open Coding Society</h2>
    <p>A student-run community that learns full-stack engineering by building and maintaining a real, live application — the one you're using right now.</p>
  </div>

  <div class="api-content">

    <div class="runbook-toc">
      <div class="toc-title">Contents</div>
      <ol>
        <li><span class="toc-num">—</span><a href="#what-is-ocs">What is Open Coding Society?</a></li>
        <li><span class="toc-num">01</span><a href="#the-stack">The stack you're using right now</a></li>
        <li><span class="toc-num">02</span><a href="#how-it-runs">How it runs</a></li>
        <li><span class="toc-num">—</span><a href="#get-involved">Get involved</a></li>
      </ol>
    </div>

    <div class="info-box info">
      <strong>Who this is for.</strong>
      <span>Anyone curious what Open Coding Society actually is beyond "the club that made this site" — members, prospective members, or anyone poking around the Support pages.</span>
    </div>

    <!-- ============================================================ -->
    <!-- WHAT IS OCS                                                   -->
    <!-- ============================================================ -->
    <section id="what-is-ocs">
      <p class="phase-label">Background</p>
      <h3 class="accent">What is Open Coding Society?</h3>
      <p>Open Coding Society (OCS) is a student coding community built around one idea: the best way to learn software engineering is to build and ship something real, not just complete exercises. Members work directly on a live, production full-stack application — the same one serving this page — instead of a disposable classroom project.</p>
      <p>That means real git history, real code review, real bugs, and a real support system for the people using what gets built.</p>
    </section>

    <hr class="runbook-div">

    <!-- ============================================================ -->
    <!-- THE STACK                                                     -->
    <!-- ============================================================ -->
    <section id="the-stack">
      <p class="phase-label">01 — Three repos, one app</p>
      <h3 class="teal">The stack you're using right now</h3>
      <p>The app is split into three repositories, each maintained by members and deployed independently:</p>

      <div class="integration-guide">
        <div class="integration-steps">
          <div class="step">
            <div class="step-header">
              <div class="step-number step-1">1</div>
              <strong class="step-1">pages</strong>
            </div>
            <p>This site. A Jekyll frontend — every page you're reading, including this one, is a Markdown file rendered through it.</p>
          </div>

          <div class="step">
            <div class="step-header">
              <div class="step-number step-2">2</div>
              <strong class="step-2">spring</strong>
            </div>
            <p>The Java/Spring Boot backend. Handles accounts, login, and password reset — see <a href="{{site.baseurl}}/tools/spring">How Spring Works</a>.</p>
          </div>

          <div class="step">
            <div class="step-header">
              <div class="step-number step-3">3</div>
              <strong class="step-3">flask</strong>
            </div>
            <p>The Python/Flask backend. See <a href="{{site.baseurl}}/tools/flask">How Flask Works</a> for how it fits in.</p>
          </div>
        </div>
      </div>
    </section>

    <hr class="runbook-div">

    <!-- ============================================================ -->
    <!-- HOW IT RUNS                                                   -->
    <!-- ============================================================ -->
    <section id="how-it-runs">
      <p class="phase-label">02 — Run like a real engineering org</p>
      <h3 class="green">How it runs</h3>
      <div class="panel border-left green">
        <div class="panel-title green">No separate "student" workflow</div>
        <p>Work is tracked in GitHub issues, shipped through pull requests, and reviewed before it merges. When something breaks for a user, it shows up as a support ticket in this same app's <a href="{{site.baseurl}}/navigation/support">Support</a> page — the same page you likely came here from — and gets picked up by a member, not a generic help desk.</p>
      </div>
    </section>

    <hr class="runbook-div">

    <!-- ============================================================ -->
    <!-- GET INVOLVED                                                  -->
    <!-- ============================================================ -->
    <section id="get-involved">
      <p class="phase-label">Get started</p>
      <h3 class="orange">Get involved</h3>
      <div class="panel border-left orange">
        <div class="panel-title orange">Find us</div>
        <ul>
          <li><strong>GitHub:</strong> <a href="https://github.com/open-coding-society" target="_blank" rel="noopener">github.com/open-coding-society</a> — browse the repos, open an issue, or send a pull request.</li>
          <li><strong>YouTube:</strong> <a href="https://www.youtube.com/@OpenCodingSociety" target="_blank" rel="noopener">@OpenCodingSociety</a></li>
          <li><strong>X:</strong> <a href="https://x.com/Open_Coding" target="_blank" rel="noopener">@Open_Coding</a></li>
        </ul>
      </div>

      <div class="info-box info">
        <strong>Have questions?</strong>
        <span>Open a support ticket from the <a href="{{site.baseurl}}/navigation/support">Support</a> page and an admin can point you in the right direction.</span>
      </div>
    </section>

  </div>
</div>
