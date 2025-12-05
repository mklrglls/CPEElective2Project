# Hospital Room Management System

This project is a full-stack application for managing hospital rooms, patients, and admissions.

## Tech Stack
- **Frontend:** React + Vite + TypeScript  
- **Backend:** Node.js + Express + TypeORM  
- **Database:** PostgreSQL  
- **Containerization:** Docker + Docker Compose  
- **Version Control:** Git

## Features
- Create and manage hospital rooms
- Track room occupancy
- Admit and discharge patients
- Prevent room overbooking
- REST API with validations

## Getting Started
1. Copy `.env.example` to `.env`
2. Run `docker compose up -d` to start PostgreSQL
3. Start backend: `cd backend && npm run dev`
4. Start frontend: `cd frontend && npm run dev`

## Project Structure
hospital-room-mgmt/
backend/
frontend/
docker-compose.yml
README.md
.env.example