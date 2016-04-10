#!/bin/bash
set -e

curl -L --silent -H "User-Agent: BitFlux" https://api.github.com/repos/ScottLogic/BitFlux/releases/latest \
    | jq -c -r '.assets | .[] | select(.name | contains("dist.tar.gz")) | .url' \
    | xargs -I URL curl -L -H "User-Agent: BitFlux" -H "Accept: application/octet-stream" -H "Media-Type: application/octet-stream" -o dist.tar.gz URL

# -o dist.tar.gz
