# Skill Execution Tracker

A web application that helps users build skills through **daily execution**, **weekly goals**, and **progress tracking**.  
The focus is on *doing consistently*, not just planning.

---

## Problem Statement
Many learners set goals but fail to execute them daily.  
This application tracks real execution data and converts it into meaningful weekly progress reports.

---

## Features
- Create, edit, and delete skills
- Set weekly execution goals per skill
- Log daily execution with date tracking
- Prevent duplicate execution entries for the same day
- Weekly report (Monday–Sunday):
  - Goal vs achieved
  - Progress percentage
  - Clear week range display
- Persistent data storage using localStorage

---

## Tech Stack
- React
- TypeScript
- Vite
- Tailwind CSS
- Browser localStorage

---

## Data Model
**Skills**
```ts
{
  id: string,
  name: string,
  weeklyGoal: number,
  createdAt: number
}

