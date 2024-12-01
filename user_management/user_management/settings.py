import os
from dotenv import load_dotenv
from pathlib import Path


load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv('USER_MANAGEMENT_SECRET_KEY')

# DEBUG ayarı (bool olarak okuma)
DEBUG = os.getenv("DEBUG", "False").lower() == "true"

# ALLOWED_HOSTS ayarı (virgül ile ayrılan stringi listeye çevir)
ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS", "").split(",")

INTRA_CLIENT_ID = os.getenv('INTRA_CLIENT_ID')
INTRA_CLIENT_SECRET = os.getenv('INTRA_CLIENT_SECRET')
INTRA_REDIRECT_URI = os.getenv('INTRA_REDIRECT_URI')
# Application definition

INSTALLED_APPS = [
    'src',
    'rest_framework',
    'corsheaders',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'corsheaders.middleware.CorsMiddleware'
]

ROOT_URLCONF = 'user_management.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'user_management.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.1/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('USER_MANAGEMENT_DATABASE_NAME'),
        'USER': os.getenv('USER_MANAGEMENT_DATABASE_USER'),
        'PASSWORD': os.getenv('USER_MANAGEMENT_DATABASE_PASSWORD'),
        'HOST': os.getenv('USER_MANAGEMENT_DATABASE_HOST'),
        'PORT': os.getenv('USER_MANAGEMENT_DATABASE_PORT'),
    }
}

CORS_ALLOW_ALL_ORIGINS = True

CORS_ALLOW_CREDENTIALS = True

CORS_ALLOW_HEADERS = [
    'Content-Type',
    'Authorization',
    'id',
]


# Password validation
# https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.1/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = os.getenv('EMAIL_HOST')  # Gmail için
EMAIL_PORT = os.getenv('EMAIL_PORT')  # Gmail için
EMAIL_USE_TLS = os.getenv('EMAIL_USE_TLS')  # Gmail için
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER')  # E-posta adresiniz
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD')  # E-posta adresinizin şifresi
