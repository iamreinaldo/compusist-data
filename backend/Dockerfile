FROM python:3.10-buster

WORKDIR /app

COPY . /app

RUN pip3 install --no-cache-dir -r requirements.txt

EXPOSE 43940

CMD [ "python", "main.py" ]