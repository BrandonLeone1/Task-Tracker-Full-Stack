# Task Tracker (Kanban Board)

A full-stack Kanban-style task management application built with React, Express, MongoDB, and drag-and-drop interactions powered by @dnd-kit.

Users can create boards, manage tasks across workflow columns, and reorder tasks with persisten ordering stored in the database.

## Features
- User authentication with JWT
- Create, edit, and delete boards
- Create and delete tasks
- Drag-and-drop task management
- Reorder tasks within columns
- Move tasks across columns
- Persistent task ordering stored in MongoDB
- Optimistic UI updates for smooth interactions
- Protected frontend routes
- Responsive layout with Tailwind CSS

## Tech Stack
- Frontend 
    - React
    - React Router
    - Tailwind CSS
    - @dnd-kit
    - Vite
- Backend
    - Node.js
    - Express
    - MongoDB
    - Mongoose
    - JWT Authentications
    - bcrypt

## What This Project Demonstrates
- Complex drag-and-drop UI interactions
- Persisting UI state to a backend
- Bulk database updates with MongoDB
- Optimistic UI updates with rollback handling
- Protected authentication flows
- Managing normalized application state
- Synchronizing frontend ordering logic with backend persistence
- Full-stack CRUD operations

## Challenges
- Maintaining Stable Task Ordering
    - One of the biggest challenges was preventing unrelated columns from changing order during cross-column movements.
    - This was solved by:
        - Updating only affected columns
        - Recaulculating order values per affected column
        - Avoiding unneccessary remapping of unrelated tasks by combining after making changes to affected columns
- Synchronizing UI With Database State
    - The app performs optimistic UI updates before the database request finishes and needing to run a refetch, particularly in the case of reordering/cross column movements
    - If the request fails:
        - Previous state is restored
        - UI remains consisten

## Future Improvements
- Edit tasks
- Searching/filtering for boards
- Due dates and reminders
- Task priority levels
- Activity history
- Collaborative boards
- Real-time multi-user syncing via WebSockets
- Optimize drag and dropping for Mobile


## Setup Locally
1. Clone the repo: 
```bash
git clone https://github.com/BrandonLeone1/Task-Tracker-Full-Stack.git
```
2. Navigate to the project folder:
```bash
cd task-tracker-full-stack
```
3. Install all frontend dependencies: 
```bash
cd frontend
npm install
```
4. Install all backend dependencies: 
```bash
cd backend
npm install
```
4. Create a .env file: 
```bash
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
```

5. Start the project:
- Frontend
```bash
npm run dev
```
- Backend
```bash
node server.js
```

6. Usage:
navigate to http://localhost:5173 in your browser