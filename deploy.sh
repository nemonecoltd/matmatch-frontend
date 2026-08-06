#!/bin/bash -l
set -euo pipefail

# matmatch frontend 배포 스크립트 (로컬 빌드 → msm VM standalone 배포)
# public/, .next/static/ 을 --delete 로 전체 동기화. .env는 서버 전용이라 제외.

cd "$(dirname "$0")"

SSH_KEY="$HOME/.ssh/msm_ci"
SSH_TARGET="ubuntu@34.64.111.65"
REMOTE_DIR="/home/ubuntu/apps/matmatch_frontend"

echo "▶ 빌드"
npm run build

echo "▶ standalone 서버 코드 동기화 (.env 제외)"
rsync -az --delete --exclude='.env' --exclude='.env.production' \
  -e "ssh -i $SSH_KEY" \
  .next/standalone/ "$SSH_TARGET:$REMOTE_DIR/"

echo "▶ 정적 자산 동기화"
rsync -az --delete -e "ssh -i $SSH_KEY" \
  .next/static/ "$SSH_TARGET:$REMOTE_DIR/.next/static/"

echo "▶ public 폴더 동기화"
rsync -az --delete -e "ssh -i $SSH_KEY" \
  public/ "$SSH_TARGET:$REMOTE_DIR/public/"

echo "▶ PM2 재시작"
ssh -i "$SSH_KEY" "$SSH_TARGET" "pm2 restart frontend"

echo "✅ matmatch frontend 배포 완료: $(date)"
