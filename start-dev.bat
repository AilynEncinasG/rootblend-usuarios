@echo off
start cmd /k "cd services && cd usuarios-service && .venv\Scripts\activate && python manage.py runserver"
start cmd /k "cd frontend && npm run dev"