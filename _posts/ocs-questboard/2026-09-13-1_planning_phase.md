---
layout: post
title: OCS Quest Board [1] - Planning Phase
permalink: /questboard/planning
author: Jacob Chou
comments: false
---

# Project: OCS Quest Board

> **Architecture:** Option A | Spring Boot REST API + Github Pages
> **Database:** SQLite
> **Primary Data Object:** Challenge/Quest

## What is it

For my Trimester 1 final project, I am developing a full-stack application called **OCS Quest Board**. The purpose of this application is to turn team tasks, learning goals, and development challenges into "quests" that users can complete.

Instead of having a basic list of tasks or challenges, this web app will display all the tasks in a quest format that shows relevant information such as title, description, difficulty, category, status, deadline, and reward.

The project will use a Spring Boot backend, a SQLite database, a REST API, and a separate GitHub Pages frontend.

## Why this

Using a quest board could help build engagment and help both gamify and simplify approaching tasks. 

Traditionally, instruction comes in long lists, but by switching to a task board we can add a bit of extra motivation.

An example of the display could look like:
```
          OCS Quest Board

------------------------------------

📝 Create a Plan
Difficulty: HARD
Reward: +250 XP

------------------------------------

⚔️ Build the REST API
Difficulty: MEDIUM
Reward: +150 XP

------------------------------------

🧙 Create a JPA Entity
Difficulty: MEDIUM
Reward: +150 XP
```
This approach hopefully allows for more engagement while also clearly outlining what minor tasks needs to be done and attacked in order to complete a larger project, allowing for better organization and communication among groups.

## Implementation

**Step 1:** Design the Quest Object
First, we create a Java class to represent the quests. The fields include: 
- id
- title
- description
- difficulty
- xp
- status
- deadline

**Step 2:** Create Database Persistence
We can map the Quest entity to a SQLite database using JPA, and Spring Boot could create a database table based on this entity.

By using a database, we can allow the quest to persist across application runs.

**Step 3:** Built the REST API
We can then create a JpaRepository and a REST controller.

Through this controller, we can provide the neccessary operations, which are:
- Create
- Read
- Update
- Delete

**Step 4:** Create the Frontend
We can design the frontend to communicate to the spring backend in order to get the persisting information about the quests.

The interface will be designed to show blocks of the quests instead of just having a plain list.

**Step 5:** Documentation
I will create various blog posts (such as this one!) showing what the purpose of what I have built.