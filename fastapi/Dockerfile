FROM python:3.9-alpine

RUN addgroup -S worker && adduser -S worker -G worker

WORKDIR /usr/src/app

COPY Pipfile .
COPY Pipfile.lock .

EXPOSE 8000

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

RUN python -m pip install pipenv

RUN python -m pipenv lock --keep-outdated --requirements > requirements.txt

RUN python -m pip install --no-cache-dir -r requirements.txt

COPY ./ /usr/src/app/

RUN chown -R worker:worker /usr/src/app

CMD ["uvicorn", "main:app", "--reload", "--host", "fastapi", "--port", "8000"]