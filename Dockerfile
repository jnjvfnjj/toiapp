FROM node:20-slim AS frontend
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM python:3.12-slim AS backend
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app/backend

# System deps for psycopg2 and build tools
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
  && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ ./

# Copy built frontend assets into the expected frontend folder
COPY --from=frontend /app/frontend/build /app/frontend/build

# Default envs for container
ENV DEBUG=0 \
    ALLOWED_HOSTS=127.0.0.1,localhost,0.0.0.0

EXPOSE 8000

# Collect static at build-time (safe even without DB)
RUN python manage.py collectstatic --noinput || true

CMD python manage.py migrate && gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 2 --threads 4

