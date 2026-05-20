import os
from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent

load_dotenv(BASE_DIR / ".env")


def parse_csv_env(value: str, default: list[str] | None = None) -> list[str]:
    if not value:
        return default or []

    return [item.strip() for item in value.split(",") if item.strip()]


SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "changeme")
DEBUG = os.getenv("DJANGO_DEBUG", "False").lower() == "true"

ALLOWED_HOSTS = parse_csv_env(
    os.getenv("DJANGO_ALLOWED_HOSTS", ""),
    default=[
        "localhost",
        "127.0.0.1",
        "0.0.0.0",
        "gateway",
        "usuarios-service",
        "canales-streaming-service",
        "estadisticas-service",
        "192.168.1.207",
    ],
)

CSRF_TRUSTED_ORIGINS = parse_csv_env(
    os.getenv("DJANGO_CSRF_TRUSTED_ORIGINS", ""),
    default=[
        "http://localhost:5173",
        "http://localhost:8080",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:8080",
        "http://192.168.1.207:5173",
        "http://192.168.1.207:8080",
    ],
)

CORS_ALLOWED_ORIGINS = parse_csv_env(
    os.getenv("CORS_ALLOWED_ORIGINS", ""),
    default=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://192.168.1.207:5173",
    ],
)

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "corsheaders",
    "core",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

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
    },
]

WSGI_APPLICATION = "config.wsgi.application"

DATABASES = {
    "default": {
        "ENGINE": os.getenv("DB_ENGINE", "django.db.backends.mysql"),
        "NAME": os.getenv("DB_NAME", "rootblend_estadisticas"),
        "USER": os.getenv("DB_USER"),
        "PASSWORD": os.getenv("DB_PASSWORD"),
        "HOST": os.getenv("DB_HOST"),
        "PORT": os.getenv("DB_PORT", "3306"),
        "OPTIONS": {
            "connect_timeout": 20,
            "read_timeout": 20,
            "write_timeout": 20,
            "charset": "utf8mb4",
            "ssl": {"ssl": {}},
        },
        "CONN_MAX_AGE": 0,
    }
}

AUTH_PASSWORD_VALIDATORS = []

LANGUAGE_CODE = "es-bo"
TIME_ZONE = "America/La_Paz"
USE_I18N = True
USE_TZ = True

STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"