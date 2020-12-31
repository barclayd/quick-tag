import { readdirSync, readFileSync } from 'fs';
import { PackageJson } from '@/types';

const isPackageJsonInCwd = () =>
  readdirSync(process.cwd()).includes('package.json');

const packageJson = (): PackageJson | undefined => {
  try {
    const stringifyPackageJson = readFileSync(
      process.cwd() + '/package.json',
      'utf8',
    );
    return JSON.parse(stringifyPackageJson);
  } catch (error) {
    console.log(`Following error occurred: ${error}`);
    return undefined;
  }
};

(async () => {
  let version: string | undefined;
  if (isPackageJsonInCwd()) {
    version = packageJson()?.version;
  }
  console.log(version);
})();
