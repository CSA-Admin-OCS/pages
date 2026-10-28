---
layout: post
title: Account Administration
description: Teachers and Admins review accounts, activate or deactivate them, and filter by role and active status.
permalink: /admin/accounts/
show_reading_time: false
---

<p id="accounts-status" role="alert" hidden></p>

<div id="accounts-content" hidden>
  <div class="ocs__links" id="accounts-status-filters">
    <button type="button" class="ocs__btn small accent fill" data-status="all" aria-pressed="true">All</button>
    <button type="button" class="ocs__btn small accent" data-status="active" aria-pressed="false">Active</button>
    <button type="button" class="ocs__btn small accent" data-status="inactive" aria-pressed="false">Inactive</button>
  </div>

  <label for="accounts-role-filter">Role</label>
  <select id="accounts-role-filter"></select>

  <div class="ocs__table-wrap">
    <table class="ocs__table">
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Email</th>
          <th scope="col">Role</th>
          <th scope="col">Active</th>
          <th scope="col">Verification</th>
          <th scope="col">Action</th>
        </tr>
      </thead>
      <tbody id="accounts-body"></tbody>
    </table>
  </div>
  <p id="accounts-empty" hidden>No accounts match these filters.</p>
</div>

<script type="module">
import { pythonURI, fetchOptions } from '{{ site.baseurl }}/assets/js/api/config.js';
import { initAccountsPage } from '{{ site.baseurl }}/assets/js/accounts/accounts-page.js';

initAccountsPage({ pythonURI, fetchOptions });
</script>
