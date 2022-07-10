FROM tensorflow/tensorflow:2.9.1

WORKDIR /server

COPY requirements.txt requirements.txt

RUN pip install -r requirements.txt

COPY src src

WORKDIR /server/src

EXPOSE 8000

ENTRYPOINT [ "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]