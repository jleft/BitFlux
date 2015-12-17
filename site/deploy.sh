#!/bin/bash
set -e # exit with nonzero exit code if anything fails

cd site
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

cd ../../dist

rm -rf master
mkdir master
rm -rf develop
mkdir develop
cp -r ../temp/master/dist/* master
cp -r ../temp/develop/dist/* develop
rm -rf ../temp || exit 0;

# create a *new* Git repo
git init

# inside this git repo we'll pretend to be a new user
git config user.name "Travis CI"
git config user.email "<you>@<your-email>"

# The first and only commit to this new Git repo contains all the
# files present with the commit message "Deploy to GitHub Pages".
git add .
git commit -m "Deploy to GitHub Pages"

# Force push from the current repo's master branch to the remote
# repo's gh-pages branch. (All previous history on the gh-pages branch
# will be lost, since we are overwriting it.) We redirect any output to
# /dev/null to hide any sensitive credential data that might otherwise be exposed.
git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" master:gh-pages > /dev/null 2>&1
