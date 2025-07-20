# Calender Project

This repository contains a **fullstack** application with:

- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express + TypeScript

Both frontend and backend live in separate folders and can be run together from the root folder.

---

## Folder Structure

calender/
├── frontend/ # React + TS + Vite frontend
├── backend/ # Node + Express + TS backend
├── package.json # Root package.json with scripts to run both
└── README.md # This file

---

## Prerequisites

- Node.js version **>= 20.19.0** (important for Vite compatibility)
- npm (comes with Node.js)

---

## Setup

### 1. Install dependencies

```bash
# Root folder
npm install

# Frontend dependencies
cd frontend
npm install
cd ..

# Backend dependencies
cd backend
npm install
cd ..
```

## Environment Variables

Sample environment configuration files are provided as `.env.example` in both `frontend` and `backend` folders.

Copy them to `.env` and adjust values if needed before running:

````bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

## To start

```bash
npm run dev
```
````
