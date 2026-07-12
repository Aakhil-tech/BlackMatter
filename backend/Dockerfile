FROM python:3.11-slim

# Astral ships uv as a static binary — copy it straight from their image
# instead of pip-installing uv itself (that would defeat the point).
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /app

# Install straight into the system interpreter — this is a container,
# there's no reason for a venv inside a venv-like isolation layer.
ENV UV_SYSTEM_PYTHON=1 \
    UV_COMPILE_BYTECODE=1

# Copy only requirements.txt first so this layer caches — code changes
# won't force a dependency reinstall.
COPY requirements.txt .
RUN uv pip install --system --no-cache -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
