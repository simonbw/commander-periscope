import 'clarify';
import PrettyError from 'pretty-error';
import 'trace';

const prettyError = new PrettyError();

prettyError.appendStyle({
  'pretty-error > header': { marginTop: 1 },
  'pretty-error > header > message': {},
  'pretty-error > trace > item': { margin: '0 0 1 2', padding: 0 },
  'pretty-error > trace > item *': { margin: 0, padding: 0 },
});

prettyError.alias(__dirname, '(src)');

// prettyError.skipNodeFiles();
// prettyError.skipPackage('express');

export const registerErrorHandlers = () => {
  process.on('uncaughtException', function (error) {
    console.error(prettyError.render(error));
  });
  
  process.on('unhandledRejection', function (reason) {
    console.error(prettyError.render(reason));
  });
};