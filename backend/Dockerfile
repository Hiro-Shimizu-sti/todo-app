FROM python:3.11-slim

WORKDIR /workspaces/backend

ENV TZ=Asia/Tokyo
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# 必要なOSライブラリのインストール
RUN apt-get update && apt-get install -y --no-install-recommends \
    default-libmysqlclient-dev \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# --- ここから追加 ---
# requirements.txtをコンテナにコピー
COPY requirements.txt .

# requirements.txtに基づいてPythonライブラリをインストール
RUN pip install --no-cache-dir -r requirements.txt
# --- ここまで追加 ---

# ソースコードはdocker-compose.ymlのvolumesでマウントされるため、
# Dockerfile内でのCOPYは不要です。