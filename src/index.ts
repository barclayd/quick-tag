#!/usr/bin/env node
import moduleAlias from 'module-alias';
moduleAlias();
import { readdirSync, readFileSync } from 'fs';
import { CustomMessageAnswer, PackageJson, ReleaseAnswer } from '@/types';
import inquirer from 'inquirer';
import { ScriptService } from '@/services/ScriptService';

const isPackageJsonInCwd = () =>
  readdirSync(process.cwd()).includes('package.json');

const LAST_TEN_COMMIT_MESSAGES = `git log -15 --oneline --format=%s | sed 's/^.*: //'`;

const blueStdout = (output: string) => `echo "\\033[34m${output}\\033[m"`;

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

const customMessageOption = '~~ write custom message ~~';

(async () => {
  let version: string | undefined;
  if (isPackageJsonInCwd()) {
    version = packageJson()?.version;
  }
  const { stdout: commitMessage } = ScriptService.runSilent(
    LAST_TEN_COMMIT_MESSAGES,
  );
  const formattedCommitMessages = commitMessage
    .replace(/(\r\n|\n|\r)/gm, '|')
    .split('|')
    .map((message) => message.trim())
    .filter((message) => message.length > 0);
  formattedCommitMessages.unshift(customMessageOption);
  const answer = await inquirer.prompt<ReleaseAnswer>([
    {
      type: 'input',
      message: 'Release version',
      name: 'version',
      default: () => version,
    },
    {
      type: 'list',
      message: 'Release message',
      name: 'message',
      choices: formattedCommitMessages,
    },
  ]);
  if (answer.message === customMessageOption) {
    const { customMessage } = await inquirer.prompt<CustomMessageAnswer>([
      {
        type: 'input',
        message: 'Custom release message',
        name: 'customMessage',
        default: () => formattedCommitMessages[1],
      },
    ]);
    answer.message = customMessage;
  }
  gitTag(answer);
})();
