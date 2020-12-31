import { writeFileSync } from 'fs';
import {
  name,
  version,
  description,
  author,
  main,
  bin,
  scripts,
  dependencies,
  bugs,
  homepage,
  license,
  keywords,
  _moduleAliases,
} from '../package.json';

const pruneScripts = () => {
  const { start } = scripts;
  return {
    start: start.replace('dist/', ''),
  };
};

const formatModuleAliasKeys = () => {
  return Object.keys(_moduleAliases as { [key: string]: string }).reduce(
    (acc, key) => {
      acc = {
        ...acc,
        [key]: (_moduleAliases as { [key: string]: string })[key].replace(
          'dist',
          '.',
        ),
      };
      return acc;
    },
    {},
  );
};

const productionPackageJson = {
  name,
  version,
  description,
  main,
  bin,
  scripts: pruneScripts(),
  keywords,
  author,
  homepage,
  bugs,
  license,
  dependencies,
  _moduleAliases: formatModuleAliasKeys(),
};

(async () => {
  const distDir = `${process.cwd()}/dist/package.json`;
  await writeFileSync(distDir, JSON.stringify(productionPackageJson, null, 2));
})();
