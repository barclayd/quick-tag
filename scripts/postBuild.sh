#!/bin/bash

cp -r ./src/scripts ./dist/scripts &>/dev/null
cp ./PACKAGE_README.md ./dist/README.md
ts-node ./scripts/productionPackageJson.ts
