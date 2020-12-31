#!/bin/bash

cp -r ./src/scripts ./dist/scripts
cp ./PACKAGE_README.md ./dist/README.md
ts-node ./scripts/productionPackageJson.ts
