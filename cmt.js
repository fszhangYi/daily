const shell = require('shelljs');
const result = shell.exec('git add . && git commit -m "add one artical" && git push origin master');
console.log(result.stdout);
