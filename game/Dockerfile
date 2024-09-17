FROM python:3-slim

COPY . /app

WORKDIR /app


# PostgreSQL client ve pip'i yükle
RUN apt-get update && apt-get install -y \
    python3-pip \
    postgresql-client

RUN pip3 install --upgrade pip

# Gerekli bağımlılıkları yükle
RUN pip3 install -r requirements.txt

EXPOSE 8005

CMD ["python3", "manage.py", "runserver","0.0.0.0:8005"]
