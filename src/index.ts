#!/usr/bin/env node
import moduleAlias from 'module-alias';
if (process.env.NODE_ENV !== 'development') {
  moduleAlias();
}
import { readdirSync, readFileSync } from 'fs';
import { PackageJson, ReleaseAnswer } from '@/types';
import inquirer from 'inquirer';
import { ScriptService } from '@/services/ScriptService';

const isPackageJsonInCwd = () =>
  readdirSync(process.cwd()).includes('package.json');

const LAST_COMMIT_MESSAGE = `git reflog -1 | sed 's/^.*: //'`;

const blueStdout = (output: string) => `echo -e "\\033[34m${output}\\033[m"`;

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

const gitTag = ({ message, version }: ReleaseAnswer) => {
  ScriptService.run(`git tag -a ${version} -m "${message}"`);
  ScriptService.runSilent('git push --follow-tags');
  ScriptService.run(blueStdout('Release published!'));
};

(async () => {
  let version: string | undefined;
  if (isPackageJsonInCwd()) {
    version = packageJson()?.version;
  }
  const { stdout: commitMessage } = ScriptService.runSilent(
    LAST_COMMIT_MESSAGE,
  );
  const formattedCommitMessage = commitMessage.replace(/(\r\n|\n|\r)/gm, '');
  const answer = await inquirer.prompt<ReleaseAnswer>([
    {
      type: 'input',
      message: 'Release version',
      name: 'version',
      default: () => version,
    },
    {
      type: 'input',
      message: 'Release message',
      name: 'message',
      default: () => formattedCommitMessage,
    },
  ]);
  gitTag(answer);
})();
