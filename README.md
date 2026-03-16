# Orbit Task 🚀

Orbit Task is a modern Kanban-style project management platform inspired by tools like Trello and Jira.  
It allows teams to manage workflows, collaborate on tasks, and organize projects efficiently.

This project focuses on **clean backend architecture, secure authentication, and scalable task workflow management**.

---

## ✨ Features

### 🔐 Authentication

- JWT based authentication
- Refresh token flow for secure session handling
- Profile view and update

### 🏢 Workspace Management

- Create and manage workspaces
- Add or remove members
- Role based access for members

### 📁 Project Management

- Create and manage projects within a workspace
- Project level workflow control
- Project deletion flow with proper access checks

### 🧩 Workflow & Status Management

- Custom workflow statuses
- Reorder statuses
- Smart deletion logic
  - If status has tasks → mark inactive
  - If empty → delete permanently

### 📝 Task Management

- Create, update, and delete tasks
- Assign users to tasks
- Set priority and due dates
- Move tasks across statuses (Kanban board style)

### 💬 Comments

- Add comments on tasks
- Edit and delete comments

### 🎯 Kanban Board

- Visual workflow using status columns
- Drag and drop task movement
- Modal-based task editing

---

## 🏗️ Architecture

The backend follows a **Controller → Service → Database** architecture.


Route
↓
Controller
↓
Service
↓
Prisma ORM
↓
PostgreSQL Database


