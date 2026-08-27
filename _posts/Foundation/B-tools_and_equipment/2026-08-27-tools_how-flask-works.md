---
toc: True
layout: post
data: tools
title: How Flask Works
description: What Flask is, how a request flows through it, and where the Flask backend fits into this app.
categories: ['Backend']
permalink: /tools/flask
breadcrumb: True
---

<div class="api-docs migration-runbook">

  <div class="api-header">
    <h2>How Flask Works</h2>
    <p>Flask is the Python backend behind this app's <code>pythonURI</code>. Here's what it is, and what actually happens between a request leaving your browser and a response coming back.</p>
  </div>

  <div class="api-content">

    <div class="runbook-toc">
      <div class="toc-title">Contents</div>
      <ol>
        <li><span class="toc-num">—</span><a href="#what-is-flask">What is Flask?</a></li>
        <li><span class="toc-num">01</span><a href="#anatomy">Anatomy of a route</a></li>
        <li><span class="toc-num">02</span><a href="#lifecycle">Request lifecycle</a></li>
        <li><span class="toc-num">03</span><a href="#where">Where it lives here</a></li>
        <li><span class="toc-num">—</span><a href="#try-it">Try it yourself</a></li>
      </ol>
    </div>

    <div class="info-box info">
      <strong>Who this is for.</strong>
      <span>Anyone working on this app's Python side, or just curious what happens when the frontend calls <code>pythonURI</code>.</span>
    </div>

    <!-- ============================================================ -->
    <!-- WHAT IS FLASK                                                 -->
    <!-- ============================================================ -->
    <section id="what-is-flask">
      <p class="phase-label">Background</p>
      <h3 class="accent">What is Flask?</h3>
      <p>Flask is a <strong>micro</strong> web framework for Python. "Micro" doesn't mean small-scale — it means Flask itself only gives you routing and request/response handling, and stays out of the way of everything else. Database access, authentication, serialization — you add exactly the pieces you need, usually as small extensions.</p>
      <p>That's the opposite tradeoff from Spring (see <a href="{{site.baseurl}}/tools/spring">How Spring Works</a>), which bundles far more out of the box but expects you to follow its conventions.</p>
    </section>

    <hr class="runbook-div">

    <!-- ============================================================ -->
    <!-- ANATOMY                                                       -->
    <!-- ============================================================ -->
    <section id="anatomy">
      <p class="phase-label">01 — The building block</p>
      <h3 class="teal">Anatomy of a route</h3>
      <p>Everything in a Flask API comes down to a Python function decorated with a URL and an HTTP method:</p>
      <pre><code>from flask import Blueprint, jsonify

api = Blueprint('api', __name__)

@api.route('/api/example', methods=['GET'])
def example():
    return jsonify({"message": "hello"})</code></pre>
      <p><code>@api.route(...)</code> tells Flask which URL and method should trigger <code>example()</code>. Whatever the function returns becomes the HTTP response body — Flask handles turning a Python dict into a JSON response for you.</p>
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
            <p>A <code>fetch()</code> call from the frontend (or curl, or a browser) hits the Flask app's WSGI server over HTTP.</p>
          </div>

          <div class="step">
            <div class="step-header">
              <div class="step-number step-2">2</div>
              <strong class="step-2">Routing</strong>
            </div>
            <p>Flask matches the request's URL and method against every registered <code>@route</code> across the app's Blueprints to find the one view function that should handle it.</p>
          </div>

          <div class="step">
            <div class="step-header">
              <div class="step-number step-3">3</div>
              <strong class="step-3">View function runs</strong>
            </div>
            <p>Your Python code executes: it reads the request body/JSON, does whatever work is needed — often a database query — and builds the data to send back.</p>
          </div>

          <div class="step">
            <div class="step-header">
              <div class="step-number step-4">4</div>
              <strong class="step-4">Response returned</strong>
            </div>
            <p>Flask serializes the return value to JSON, attaches a status code, and sends it back to the caller.</p>
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
        <div class="panel-title orange">pythonURI</div>
        <p>This frontend talks to Flask through <code>pythonURI</code>, defined in <code>assets/js/api/config.js</code>. Locally that's <code>http://localhost:8587</code>; in production it's <code>https://flask.opencodingsociety.com</code>.</p>
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
          <li>Open <code>assets/js/api/config.js</code> and note the current value of <code>pythonURI</code>.</li>
          <li>In the Flask repo, search for <code>@app.route</code> or <code>@<em>blueprint</em>.route</code> to find real endpoints.</li>
          <li>Hit one directly with <code>curl</code> or your browser and compare the response to what the frontend expects.</li>
        </ul>
      </div>

      <div class="info-box info">
        <strong>Still stuck?</strong>
        <span>Open a support ticket from the <a href="{{site.baseurl}}/support">Support</a> page and an admin can walk you through it.</span>
      </div>
    </section>

  </div>
</div>
