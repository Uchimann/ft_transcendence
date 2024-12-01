FROM python:3-slim

COPY . /app

WORKDIR /app

RUN apt-get update && apt-get install -y \
    python3-pip
    
RUN pip3 install --upgrade pip

RUN pip3 install -r requirements.txt

EXPOSE 8007

ENTRYPOINT ["sh", "./start.sh"]

CMD ["python3", "manage.py", "runserver", "0.0.0.0:8007"]
