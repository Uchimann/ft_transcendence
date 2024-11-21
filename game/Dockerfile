FROM python:3-slim

COPY . /app

WORKDIR /app

RUN apt-get update && apt-get install -y \
python3-pip \
postgresql-client \
libpq-dev \
postgresql-server-dev-all \
&& apt-get clean

RUN pip3 install --upgrade pip

# Gerekli bağımlılıkları yükle
RUN pip3 install --no-cache-dir -r requirements.txt

EXPOSE 8005

ENTRYPOINT ["sh", "./start.sh"]

CMD ["python3", "manage.py", "runserver","0.0.0.0:8005"]
