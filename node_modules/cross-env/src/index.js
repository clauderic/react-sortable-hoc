import {spawn} from 'cross-spawn';
import assign from 'lodash.assign';
export default crossEnv;

const envSetterRegex = /(\w+)=('(.+)'|"(.+)"|(.+))/;

function crossEnv(args) {
  const [command, commandArgs, env] = getCommandArgsAndEnvVars(args);
  if (command) {
    const proc = spawn(command, commandArgs, {stdio: 'inherit', env});
    proc.on('exit', process.exit);
    return proc;
  }
}

function getCommandArgsAndEnvVars(args) {
  let command;
  const envVars = assign({}, process.env);
  const commandArgs = args.slice();
  while (commandArgs.length) {
    const shifted = commandArgs.shift();
    const match = envSetterRegex.exec(shifted);
    if (match) {
      envVars[match[1]] = match[3] || match[4] || match[5];
    } else {
      command = shifted;
      break;
    }
    envVars.APPDATA = process.env.APPDATA;
  }
  return [command, commandArgs, envVars];
}
