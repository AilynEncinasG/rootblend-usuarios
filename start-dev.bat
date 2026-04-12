@echo off
start cmd /k "cd backend && .venv\Scripts\activate && python manage.py runserver"
start cmd /k "cd frontend && npm run dev"