import os
from pathlib import Path

from dotenv import load_dotenv


BASE_DIR = Path(__file__).resolve().parent.parent

load_dotenv(BASE_DIR / ".env")


SECRET_KEY = os.getenv("SECRET_KEY", "dev-rootblend-pagos-secret-key")

DEBUG = os.getenv("DEBUG", "True").lower() in ("true", "1", "yes")

ALLOWED_HOSTS = [
    host.strip()
    for host in os.getenv("ALLOWED_HOSTS", "*").split(",")
    if host.strip()
]

if "*" not in ALLOWED_HOSTS:
    ALLOWED_HOSTS.extend(["localhost", "127.0.0.1", "pagos-service"])


INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "corsheaders",
    "apps.payments",
]


MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]


ROOT_URLCONF = "pagos_service.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    }
]


WSGI_APPLICATION = "pagos_service.wsgi.application"


DATABASES = {
    "default": {
        "ENGINE": os.getenv("DB_ENGINE", "django.db.backends.mysql"),
        "NAME": os.getenv("DB_NAME", "rootblend_pagos"),
        "USER": os.getenv("DB_USER", "root"),
        "PASSWORD": os.getenv("DB_PASSWORD", "root"),
        "HOST": os.getenv("DB_HOST", "mysql-local"),
        "PORT": os.getenv("DB_PORT", "3306"),
        "OPTIONS": {
            "charset": "utf8mb4",
        },
    }
}


LANGUAGE_CODE = "es-bo"
TIME_ZONE = "America/La_Paz"
USE_I18N = True
USE_TZ = True


STATIC_URL = "static/"


DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


CORS_ALLOWED_ORIGINS = [
    os.getenv("FRONTEND_URL", "http://localhost:5173"),
    "http://127.0.0.1:5173",
    "http://localhost:5173",
]

CORS_ALLOW_CREDENTIALS = True


PAYMENT_PROVIDER = os.getenv("PAYMENT_PROVIDER", "mock")
PAYMENT_CURRENCY = os.getenv("PAYMENT_CURRENCY", "BOB")
PAYMENT_MIN_AMOUNT = int(os.getenv("PAYMENT_MIN_AMOUNT", "1"))
PAYMENT_MAX_AMOUNT = int(os.getenv("PAYMENT_MAX_AMOUNT", "150"))

PUBLIC_API_BASE_URL = os.getenv("PUBLIC_API_BASE_URL", "http://localhost:8080/api")


RABBITMQ_ENABLED = os.getenv("RABBITMQ_ENABLED", "true").lower() in (
    "true",
    "1",
    "yes",
)
RABBITMQ_HOST = os.getenv("RABBITMQ_HOST", "rabbitmq")
RABBITMQ_PORT = int(os.getenv("RABBITMQ_PORT", "5672"))
RABBITMQ_USER = os.getenv("RABBITMQ_USER", "rootblend")
RABBITMQ_PASSWORD = os.getenv("RABBITMQ_PASSWORD", "rootblend123")
RABBITMQ_VHOST = os.getenv("RABBITMQ_VHOST", "/")
RABBITMQ_EXCHANGE = os.getenv("RABBITMQ_EXCHANGE", "rootblend.events")


BCP_API_URL = os.getenv("BCP_API_URL", "")
BCP_CLIENT_ID = os.getenv("BCP_CLIENT_ID", "")
BCP_CLIENT_SECRET = os.getenv("BCP_CLIENT_SECRET", "")
BCP_COMMERCE_ID = os.getenv("BCP_COMMERCE_ID", "")
BCP_WEBHOOK_SECRET = os.getenv("BCP_WEBHOOK_SECRET", "")