---
toc: True
layout: post
data: tools
title: How Spring Works
description: What Spring Boot is, how a request flows through it, and where the Spring backend fits into this app.
categories: ['Backend']
permalink: /tools/spring
breadcrumb: True
---

<div class="api-docs migration-runbook">

  <div class="api-header">
    <h2>How Spring Works</h2>
    <p>Spring (Boot) is the Java backend behind this app's <code>javaURI</code> — it's what runs login and the password reset flow on the <a href="{{site.baseurl}}/navigation/support">Support</a> page. Here's what it is, and what happens between a request leaving your browser and a response coming back.</p>
  </div>

  <div class="api-content">

    <div class="runbook-toc">
      <div class="toc-title">Contents</div>
      <ol>
        <li><span class="toc-num">—</span><a href="#what-is-spring">What is Spring Boot?</a></li>
        <li><span class="toc-num">01</span><a href="#anatomy">Anatomy of a controller</a></li>
        <li><span class="toc-num">02</span><a href="#lifecycle">Request lifecycle</a></li>
        <li><span class="toc-num">03</span><a href="#where">Where it lives here</a></li>
        <li><span class="toc-num">—</span><a href="#try-it">Try it yourself</a></li>
      </ol>
    </div>

    <div class="info-box info">
      <strong>Who this is for.</strong>
      <span>Anyone working on this app's Java side, or just curious what happens when the frontend calls <code>javaURI</code>.</span>
    </div>

    <!-- ============================================================ -->
    <!-- WHAT IS SPRING                                                -->
    <!-- ============================================================ -->
    <section id="what-is-spring">
      <p class="phase-label">Background</p>
      <h3 class="accent">What is Spring Boot?</h3>
      <p>Spring Boot is a full Java framework built around <strong>dependency injection</strong> and annotations. Instead of wiring objects together by hand, you annotate classes with what role they play — <code>@RestController</code>, <code>@Service</code>, <code>@Repository</code> — and Spring builds and connects them for you at startup.</p>
      <p>That's more structure than Flask gives you up front (see <a href="{{site.baseurl}}/tools/flask">How Flask Works</a>), but it means every Spring codebase tends to follow the same layered shape once you know the pattern.</p>
    </section>

    <hr class="runbook-div">

    <!-- ============================================================ -->
    <!-- ANATOMY                                                       -->
    <!-- ============================================================ -->
    <section id="anatomy">
      <p class="phase-label">01 — The building block</p>
      <h3 class="teal">Anatomy of a controller</h3>
      <p>Every Spring API endpoint starts with a controller method annotated with the path it should handle:</p>
      <pre><code>@RestController
@RequestMapping("/api/example")
public class ExampleController {

    @GetMapping("/hello")
    public ResponseEntity&lt;Object&gt; hello() {
        return ResponseEntity.ok(Map.of("message", "hello"));
    }
}</code></pre>
      <p><code>@RestController</code> marks the class as an API endpoint provider; <code>@GetMapping("/hello")</code> maps <code>GET /api/example/hello</code> to this method. The <code>ResponseEntity</code> it returns becomes the HTTP response, body and status code included.</p>
    </section>

    <hr class="runbook-div">

    <!-- ============================================================ -->
    <!-- LIFECYCLE                                                     -->
    <!-- ============================================================ -->
    <section id="lifecycle">
      <p class="phase-label">02 — What happens on every request</p>
      <h3 class="green">Request lifecycle</h3>

      <div class="integration-guide">
        <div class="integration-steps">
          <div class="step">
            <div class="step-header">
              <div class="step-number step-1">1</div>
              <strong class="step-1">Request arrives</strong>
            </div>
            <p>A <code>fetch()</code> call from the frontend hits the embedded Tomcat server that Spring Boot starts up.</p>
          </div>

          <div class="step">
            <div class="step-header">
              <div class="step-number step-2">2</div>
              <strong class="step-2">Routing</strong>
            </div>
            <p>Spring's <code>DispatcherServlet</code> matches the URL and method against every <code>@RequestMapping</code>/<code>@GetMapping</code>/<code>@PostMapping</code> in the app to find the right controller method.</p>
          </div>

          <div class="step">
            <div class="step-header">
              <div class="step-number step-3">3</div>
              <strong class="step-3">Controller → Service → Repository</strong>
            </div>
            <p>The controller delegates the actual work to a <code>@Service</code>, which calls a <code>@Repository</code> to read or write the database — keeping HTTP concerns separate from business logic and data access.</p>
          </div>

          <div class="step">
            <div class="step-header">
              <div class="step-number step-4">4</div>
              <strong class="step-4">Response returned</strong>
            </div>
            <p>The controller wraps the result in a <code>ResponseEntity</code>, Spring serializes it to JSON, and it's sent back with a status code.</p>
          </div>
        </div>
      </div>
    </section>

    <hr class="runbook-div">

    <!-- ============================================================ -->
    <!-- WHERE                                                         -->
    <!-- ============================================================ -->
    <section id="where">
      <p class="phase-label">03 — In this app, specifically</p>
      <h3 class="orange">Where it lives here</h3>
      <div class="panel border-left orange">
        <div class="panel-title orange">javaURI</div>
        <p>This frontend talks to Spring through <code>javaURI</code>, defined in <code>assets/js/api/config.js</code>. Locally that's <code>http://localhost:8585</code>; in production it's <code>https://spring.opencodingsociety.com</code>. It's what the <a href="{{site.baseurl}}/navigation/support">Support</a> page's password reset flow calls under the hood — <code>/mvc/person/reset/oauth/verify</code> and <code>/mvc/person/reset/oauth/complete</code> both live here.</p>
      </div>
    </section>

    <hr class="runbook-div">

    <!-- ============================================================ -->
    <!-- TRY IT                                                        -->
    <!-- ============================================================ -->
    <section id="try-it">
      <p class="phase-label">Hands-on</p>
      <h3 class="accent">Try it yourself</h3>
      <div class="panel border-left accent">
        <div class="panel-title accent">Trace a real endpoint</div>
        <ul>
          <li>Open <code>assets/js/api/config.js</code> and note the current value of <code>javaURI</code>.</li>
          <li>In the Spring repo, search for <code>@RestController</code> to find every controller, then <code>@RequestMapping</code> for its base path.</li>
          <li>Follow one call from controller to <code>@Service</code> to <code>@Repository</code> to see the full path a request takes.</li>
        </ul>
      </div>

      <div class="info-box info">
        <strong>Still stuck?</strong>
        <span>Open a support ticket from the <a href="{{site.baseurl}}/navigation/support">Support</a> page and an admin can walk you through it.</span>
      </div>
    </section>

  </div>
</div>
