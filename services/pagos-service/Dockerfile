FROM python:3.13-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    default-libmysqlclient-dev \
    pkg-config \
    default-mysql-client \
    curl \
    netcat-openbsd \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt /app/requirements.txt

RUN pip install --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

COPY . /app/

EXPOSE 8005

CMD ["python", "manage.py", "runserver", "0.0.0.0:8005"]