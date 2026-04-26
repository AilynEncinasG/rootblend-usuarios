@echo off
title ROOTBLEND - START DEV

echo ==========================================
echo Iniciando entorno ROOTBLEND...
echo ==========================================

REM ---- usuarios-service ----
start "usuarios-service" cmd /k "cd /d C:\Users\denil\OneDrive\Desktop\rootblend\services\usuarios-service && docker run --rm -p 8000:8000 --env-file .env rootblend-usuarios-service"

REM ---- canales-streaming-service ----
start "canales-streaming-service" cmd /k "cd /d C:\Users\denil\OneDrive\Desktop\rootblend\services\canales-streaming-service && docker run --rm -p 8001:8001 --env-file .env rootblend-canales-streaming-service"

REM ---- estadisticas-service ----
start "estadisticas-service" cmd /k "cd /d C:\Users\denil\OneDrive\Desktop\rootblend\services\estadisticas-service && docker run --rm -p 8002:8002 --env-file .env rootblend-estadisticas-service"

REM ---- podcasts-service ----
start "podcasts-service" cmd /k "cd /d C:\Users\denil\OneDrive\Desktop\rootblend\services\podcasts-service && docker run --rm -p 8003:8003 --env-file .env rootblend-podcasts-service"

REM ---- interacciones-service ----
start "interacciones-service" cmd /k "cd /d C:\Users\denil\OneDrive\Desktop\rootblend\services\interacciones-service && docker run --rm -p 8004:8004 --env-file .env rootblend-interacciones-service"

REM ---- gateway nginx ----
start "gateway-nginx" cmd /k "cd /d C:\Users\denil\OneDrive\Desktop\rootblend\gateway && docker run --rm -p 8080:80 rootblend-gateway"

REM ---- frontend vite ----
start "frontend" cmd /k "cd /d C:\Users\denil\OneDrive\Desktop\rootblend\frontend && npm run dev"

echo ==========================================
echo Todos los servicios fueron lanzados.
echo ==========================================
echo Frontend: http://localhost:5173
echo Gateway:  http://localhost:8080
echo ==========================================
pause