FROM python:3.12-slim-bookworm
WORKDIR /app
RUN python -m pip install --upgrade pip --default-timeout=1000
ENV  PIP_DEFAULT_TIMEOUT=100
ENV PIP_RETRIES=5
#RUN python -m pip install --upgrade pip --default-timeout=1000
COPY requirements.txt .
RUN pip install --no-cache-dir --default-timeout=1000 --retries 10 -r requirements.txt
COPY . .
# Gunicorn serves the app on port 8000
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "backend.wsgi:application"]