#!/bin/bash
set -e

rm -rf github-release-downloads
mkdir github-release-downloads

echo "Downloading latest release download URL..."
asset_url=$(curl -L --progress-bar -H "User-Agent: ScottLogic/BitFlux" https://api.github.com/repos/ScottLogic/BitFlux/releases/latest \
    | jq -c -r '.assets | .[] | select(.name | contains("dist.tar.gz")) | .url')
echo "Done."

echo "Downloading latest release (${asset_url})..."
curl --progress-bar -L \
      -H "User-Agent: ScottLogic/BitFlux" \
      -H "Accept: application/octet-stream" \
      -H "Media-Type: application/octet-stream" \
      -o github-release-downloads/dist.tar.gz ${asset_url}

mkdir github-release-downloads/dist

echo "Extracting latest release..."
tar -xzf github-release-downloads/dist.tar.gz -C github-release-downloads/dist
echo "Latest release downloaded and extracted."
