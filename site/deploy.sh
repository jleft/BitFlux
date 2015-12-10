#!/bin/bash
set -e # exit with nonzero exit code if anything fails

rm -rf temp || exit 0;
mkdir temp;
cd temp

git clone --branch master --depth 1 https://github.com/ScottLogic/d3fc-showcase.git master
git clone --branch develop --depth 1 https://github.com/ScottLogic/d3fc-showcase.git develop

cd master
npm install
grunt ci

cd ../develop
npm install
grunt ci

cd ../..

# Fix this...
rm -rf master
mkdir master
rm -rf develop
mkdir develop
cp -r temp/master/dist/* master
cp -r temp/develop/dist/* develop
rm -rf temp || exit 0;
