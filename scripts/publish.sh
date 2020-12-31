#!/bin/bash

npm --no-git-tag-version version patch --force
#npm --no-git-tag-version version prerelease --preid=canary --force
npm run build
cd dist || exit 1
npm publish
#npm publish --tag canary
echo -e '\033[38;2;255;0;02m Npx package has been published!\033[m'
exit 0
