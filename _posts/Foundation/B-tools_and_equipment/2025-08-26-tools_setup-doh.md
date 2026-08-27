---
toc: True
layout: post
data: tools
title: DNS over HTTPS (DoH) Setup Guide
description: How to enable encrypted DNS (DNS over HTTPS via Cloudflare 1.1.1.1) in your browser, on Windows, and on Mac.
categories: ['DevOps']
permalink: /tools/doh
breadcrumb: True
---

<div class="api-docs migration-runbook">

  <div class="api-header">
    <h2>DNS over HTTPS (DoH) Setup Guide</h2>
    <p>Encrypt your DNS lookups with Cloudflare's <code>1.1.1.1</code> resolver so they can't be read or tampered with on the network between you and the internet. Pick the section below for your setup — browser, Windows, or Mac.</p>
  </div>

  <div class="api-content">

    <div class="runbook-toc">
      <div class="toc-title">Contents</div>
      <ol>
        <li><span class="toc-num">—</span><a href="#what-is-doh">What is DoH?</a></li>
        <li><span class="toc-num">01</span><a href="#browser">Browser (Chrome / Edge / Firefox)</a></li>
        <li><span class="toc-num">02</span><a href="#windows">Windows</a></li>
        <li><span class="toc-num">03</span><a href="#mac">Mac</a></li>
        <li><span class="toc-num">—</span><a href="#verify">Verify it worked</a></li>
      </ol>
    </div>

    <div class="info-box info">
      <strong>Who this is for.</strong>
      <span>Anyone who wants their DNS queries — the "what site am I about to visit" lookups your device makes constantly — encrypted instead of sent in plain text. This guide uses Cloudflare's public resolver (<code>1.1.1.1</code>), which is free and doesn't require an account.</span>
    </div>

    <!-- ============================================================ -->
    <!-- WHAT IS DOH                                                   -->
    <!-- ============================================================ -->
    <section id="what-is-doh">
      <p class="phase-label">Background</p>
      <h3 class="accent">What is DoH, and why enable it?</h3>
      <p>Normally, when your device looks up a website's address, that request travels over the network in plain text — anyone on the same Wi-Fi, or your ISP, can see every domain you visit even if the page itself is encrypted. <strong>DNS over HTTPS (DoH)</strong> wraps that lookup in HTTPS, the same encryption your browser already uses for secure sites, so the request can't be read or altered in transit.</p>
      <p>You only need to set this up in <strong>one</strong> place below — your browser, your OS, or both if you want it covering everything (browser-level DoH only protects that browser; OS-level DoH covers every app on the device).</p>
    </section>

    <hr class="runbook-div">

    <!-- ============================================================ -->
    <!-- BROWSER                                                       -->
    <!-- ============================================================ -->
    <section id="browser">
      <p class="phase-label">01 — Works in any Chromium or Firefox-based browser</p>
      <h3 class="accent">Browser setup</h3>

      <div class="integration-guide">
        <div class="integration-steps">
          <div class="step">
            <div class="step-header">
              <div class="step-number step-1">1</div>
              <strong class="step-1">Open your browser's DNS settings</strong>
            </div>
            <p>Go to your browser's <strong>Settings</strong>, then search for or navigate to <strong>Privacy and security &rarr; Security &rarr; DNS</strong>.</p>
          </div>

          <div class="step">
            <div class="step-header">
              <div class="step-number step-2">2</div>
              <strong class="step-2">Turn on secure DNS</strong>
            </div>
            <p>Click <strong>Use secure DNS</strong> (sometimes labeled "Use secure DNS instead of your current service").</p>
          </div>

          <div class="step">
            <div class="step-header">
              <div class="step-number step-3">3</div>
              <strong class="step-3">Enter the Cloudflare resolver</strong>
            </div>
            <p>Choose the custom / "with" option and enter:</p>
            <pre><code>https://1.1.1.1/dns-query</code></pre>
          </div>
        </div>
      </div>

      <div class="info-box success">
        <strong>Done.</strong>
        <span>Secure DNS applies as soon as you leave the settings page — no restart needed.</span>
      </div>
    </section>

    <hr class="runbook-div">

    <!-- ============================================================ -->
    <!-- WINDOWS                                                       -->
    <!-- ============================================================ -->
    <section id="windows">
      <p class="phase-label">02 — Applies to every app on the machine</p>
      <h3 class="teal">Windows setup</h3>

      <div class="integration-guide">
        <div class="integration-steps">
          <div class="step">
            <div class="step-header">
              <div class="step-number step-2">1</div>
              <strong class="step-2">Open Wi-Fi settings</strong>
            </div>
            <p>Go to <strong>Settings &rarr; Network &amp; Internet &rarr; Wi-Fi</strong>, then click your network's name.</p>
          </div>

          <div class="step">
            <div class="step-header">
              <div class="step-number step-2">2</div>
              <strong class="step-2">Edit IP settings</strong>
            </div>
            <p>Click <strong>Edit</strong> next to <strong>IP assignment</strong>, and change it from Automatic (DHCP) to <strong>Manual</strong>.</p>
          </div>

          <div class="step">
            <div class="step-header">
              <div class="step-number step-2">3</div>
              <strong class="step-2">Set the preferred DNS</strong>
            </div>
            <p>Under <strong>IPv4</strong>, enter the preferred DNS as:</p>
            <pre><code>1.1.1.1</code></pre>
          </div>

          <div class="step">
            <div class="step-header">
              <div class="step-number step-2">4</div>
              <strong class="step-2">Enable DNS over HTTPS</strong>
            </div>
            <p>Set the <strong>DNS over HTTPS</strong> option to <strong>On (automatic template)</strong> — Windows will match it to the Cloudflare resolver automatically. Click <strong>Save</strong>.</p>
          </div>
        </div>
      </div>

      <div class="info-box success">
        <strong>Done.</strong>
        <span>Reconnect to Wi-Fi if the change doesn't take effect immediately.</span>
      </div>
    </section>

    <hr class="runbook-div">

    <!-- ============================================================ -->
    <!-- MAC                                                           -->
    <!-- ============================================================ -->
    <section id="mac">
      <p class="phase-label">03 — Uses a Cloudflare-signed configuration profile</p>
      <h3 class="green">Mac setup</h3>

      <div class="integration-guide">
        <div class="integration-steps">
          <div class="step">
            <div class="step-header">
              <div class="step-number step-3">1</div>
              <strong class="step-3">Download the Cloudflare DoH profile</strong>
            </div>
            <p>Download the Cloudflare DNS over HTTPS <strong>mobile configuration profile</strong> for macOS: <a href="https://drive.google.com/file/d/1qiFvaKofCYcjiqk_g0fa6CD2T1lgRmaj/view?usp=sharing" target="_blank" rel="noopener">Download DoH.mobileconfig</a></p>
          </div>

          <div class="step">
            <div class="step-header">
              <div class="step-number step-3">2</div>
              <strong class="step-3">Open the downloaded file</strong>
            </div>
            <p>Double-click the downloaded <code>.mobileconfig</code> file — this opens <strong>System Settings</strong> to the profile installer.</p>
          </div>

          <div class="step">
            <div class="step-header">
              <div class="step-number step-3">3</div>
              <strong class="step-3">Install the profile</strong>
            </div>
            <p>Click <strong>Install Profile</strong>.</p>
          </div>

          <div class="step">
            <div class="step-header">
              <div class="step-number step-3">4</div>
              <strong class="step-3">Confirm from Settings</strong>
            </div>
            <p>Go to <strong>System Settings &rarr; Privacy &amp; Security &rarr; Profiles</strong>, select the downloaded profile, and click <strong>Install</strong>. Click <strong>Install Profile</strong> again to confirm — you may need to enter your Mac password.</p>
          </div>
        </div>
      </div>

      <div class="info-box success">
        <strong>Done.</strong>
        <span>The profile applies system-wide, so every app's DNS lookups are encrypted, not just your browser's.</span>
      </div>
    </section>

    <hr class="runbook-div">

    <!-- ============================================================ -->
    <!-- VERIFY                                                        -->
    <!-- ============================================================ -->
    <section id="verify">
      <p class="phase-label">Sanity check</p>
      <h3 class="orange">Verify it worked</h3>
      <div class="panel border-left orange">
        <div class="panel-title orange">Check your connection</div>
        <p>Visit <code>https://1.1.1.1/help</code> in your browser. Look for <strong>"You are connected to Cloudflare"</strong> and <strong>"Using DNS over HTTPS (DoH): Yes"</strong>. If it says "No," double-check the setting matches the steps above for your platform.</p>
      </div>

      <div class="info-box info">
        <strong>Still stuck?</strong>
        <span>Open a support ticket from the <a href="{{site.baseurl}}/navigation/support">Support</a> page and an admin can walk you through it.</span>
      </div>
    </section>

  </div>
</div>
