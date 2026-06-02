#!/bin/sh
set -e

for port in 5173 8080; do
  pids="$(lsof -ti tcp:"$port" 2>/dev/null || true)"
  if [ -n "$pids" ]; then
    kill $pids
  fi
done

pnpm run dev
