#!/usr/bin/ sh
set -e
npm run build

cd dist
git init
git config user.name "hlitpxu"
git config user.email "potter622409@gmail.com"
git add -A
git commit -m "New Deployment"
git push -f git@github-potter622409:hlitpxu/scte35_generator.git main:gh-pages

cd -