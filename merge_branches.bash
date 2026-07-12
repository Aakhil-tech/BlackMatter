#!/usr/bin/bash
git fetch origin
git checkout main
git pull origin main
git subtree merge --prefix=frontend origin/frontend --squash
git subtree merge --prefix=backend origin/backend --squash
git push origin main

