#!/bin/bash
set -e

curl -L --silent -H "User-Agent: ScottLogic/BitFlux" https://api.github.com/repos/ScottLogic/BitFlux/releases/latest \
    | jq -c -r '.name'
