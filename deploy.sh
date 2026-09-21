#!/bin/bash -l
set -euo pipefail

# matmatch frontend 배포 스크립트 (로컬 빌드 → msm VM standalone 배포)
# public/, .next/static/ 을 --delete 로 전체 동기화. .env는 서버 전용이라 제외.
#
# ⚠️ standalone 동기화 시 public/·.next/static/ 반드시 제외할 것 — .next/standalone/에는
# 이 두 디렉토리가 아예 없어서, 제외 안 하면 --delete가 서버의 public/(런타임 업로드 포함)과
# .next/static/ 을 통째로 지운다. 2026-09-11 plants에서 이 패턴으로 사용자 업로드 사진이
# 전부 삭제되는 사고가 나서 여기도 함께 점검·수정함(현재는 서버 public/에 커밋 안 된 실제
# 런타임 파일이 없어 아직 피해는 없었음).

cd "$(dirname "$0")"

SSH_KEY="$HOME/.ssh/msm_ci"
SSH_TARGET="ubuntu@34.64.111.65"
REMOTE_DIR="/home/ubuntu/apps/matmatch_frontend"

# rss.xml(revalidate 기반 Route Handler)과 generateStaticParams를 쓰는 페이지들
# (/special/[id], /posts/[id], /category/[slug] 등)은 빌드 시점에 실제로 백엔드를
# fetch한다. 로컬엔 backend(8080)가 안 떠 있어서 이 fetch가 실패하면 빈 결과가
# 그대로 정적 산출물에 구워져 배포된다 — 특히 rss.xml은 빌드 시점 스냅샷이 그대로
# 서빙되는 Route Handler라 일반 캐시 비우기·재시작으로도 안 풀린다(2026-09-21,
# item 0개로 배포돼 재빌드 전까진 복구 불가였음 — now_front deploy.sh의 터널 패턴을
# 그대로 이식해 재발 방지).
echo "▶ 백엔드 SSH 터널 연결 (빌드 시점 데이터 fetch용)"
pkill -f "ssh -i $SSH_KEY -L 8080:127.0.0.1:8080" 2>/dev/null || true
sleep 1
ssh -i "$SSH_KEY" -L 8080:127.0.0.1:8080 -N "$SSH_TARGET" &
TUNNEL_PID=$!
trap "kill $TUNNEL_PID 2>/dev/null || true" EXIT

for i in $(seq 1 15); do
  if curl -s -o /dev/null -w "" --max-time 1 "http://127.0.0.1:8080/posts?limit=1" 2>/dev/null; then
    echo "  터널 준비 완료 (${i}초)"
    break
  fi
  if [ "$i" = "15" ]; then
    echo "  ⚠️ 터널이 15초 내에 안 열림 — 백엔드 fetch 실패 데이터로 빌드될 수 있음"
  fi
  sleep 1
done

echo "▶ 빌드"
npm run build

kill $TUNNEL_PID 2>/dev/null || true

echo "▶ standalone 서버 코드 동기화 (.env 제외)"
rsync -az --delete --exclude='.env' --exclude='.env.production' \
  --exclude='public/' --exclude='.next/static/' --exclude='.next/cache/' \
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
