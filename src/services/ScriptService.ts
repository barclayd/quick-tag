import shell from 'shelljs';

export class ScriptService {
  static run(script: string) {
    return shell.exec(script);
  }

  static runSilent(script: string) {
    return shell.exec(script, {
      silent: true,
    });
  }
}
