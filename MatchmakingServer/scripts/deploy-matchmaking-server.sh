#!/bin/bash
set -euo pipefail

# 0. 빌드 컨텍스트로 이동
cd ../

# 1. buildx 빌더 준비(있으면 통과)
docker buildx create --use --name multi >/dev/null 2>&1 || true
docker buildx inspect --bootstrap >/dev/null 2>&1

# 2. 멀티 아키텍처 빌드 및 푸시
docker buildx build --platform linux/amd64,linux/arm64 -t re5nardo/matchmaking-server:latest --push .

# 3. Deployment 갱신 및 재시작
kubectl apply -f k8s/local-k8s/matchmaking-server-deployment.yaml
kubectl rollout restart deployment/matchmaking-server

echo "Deployment updated and restarted successfully!"