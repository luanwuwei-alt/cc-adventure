#!/bin/bash
GAME_DIR="/Users/theodore/mario-game"
NODE_BIN="/Users/theodore/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"
VITE_BIN="$GAME_DIR/node_modules/vite/bin/vite.js"
PORT=8800
URL="http://localhost:$PORT/"

if curl -s -o /dev/null --connect-timeout 2 "$URL" 2>/dev/null; then
  open "$URL"
  exit 0
fi

if [ ! -f "$GAME_DIR/dist/index.html" ]; then
  cd "$GAME_DIR" && "$NODE_BIN" "$VITE_BIN" build >/dev/null 2>&1
fi

cd "$GAME_DIR"
nohup "$NODE_BIN" "$VITE_BIN" --port $PORT > /tmp/cc-vite.log 2>&1 &
echo $! > /tmp/cc-vite.pid
disown

for i in 1 2 3 4 5 6 7 8 9 10; do
  if curl -s -o /dev/null --connect-timeout 1 "$URL" 2>/dev/null; then
    break
  fi
  sleep 0.5
done

open "$URL"
