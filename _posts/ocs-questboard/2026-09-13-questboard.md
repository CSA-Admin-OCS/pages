---
layout: page
title: Quest Board
permalink: /questboard/
---

<div id="questboard">
    <h1>Quest Board</h1>

    <button onclick="loadQuests()">Refresh Quests</button>

    <h2>Create Quest</h2>

    <form id="questForm">
        <input id="title" placeholder="Quest title" required>
        <input id="description" placeholder="Description" required>

        <select id="difficulty">
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
        </select>

        <input id="xp" type="number" placeholder="XP" required>

        <select id="status">
            <option value="OPEN">Open</option>
            <option value="DONE">Done</option>
        </select>

        <input id="deadline" type="date" required>

        <button type="submit">Create Quest</button>
    </form>

    <h2>Quests</h2>
    <div id="questList"></div>
    <p id="message"></p>
</div>

<script src="{{ '/assets/js/questboard/config.js' | relative_url }}"></script>
<script src="{{ '/assets/js/questboard/questboard.js' | relative_url }}"></script>