import { writeFileSync } from 'fs';
import packageJson, {
  name,
  version,
  description,
  main,
  bin,
  scripts,
  dependencies,
} from '../package.json';

const pruneScripts = () => {
  const { start } = scripts;
  return {
    start: start.replace('dist/', ''),
  };
};

const formatModuleAliasKeys = () => {
  const typedPackageJson = packageJson as any;
  if (!typedPackageJson['_moduleAliases']) {
    return {};
  }
  const moduleAlias = typedPackageJson['_moduleAliases'];
  return Object.keys(
    typedPackageJson._moduleAliases as { [key: string]: string },
  ).reduce((acc, key) => {
    acc = {
      ...acc,
      [key]: (moduleAlias as { [key: string]: string })[key].replace(
        'dist',
        '.',
      ),
    };
    return acc;
  }, {});
};

const productionPackageJson = {
  name,
  version,
  description,
  main,
  bin,
  scripts: pruneScripts(),
  dependencies,
  _moduleAliases: formatModuleAliasKeys(),
};

(async () => {
  const distDir = `${process.cwd()}/dist/package.json`;
  await writeFileSync(distDir, JSON.stringify(productionPackageJson, null, 2));
})();
