const process = require('child_process');

const serveProcess = process.exec('cd blog-serve && npm run dev', { encoding: 'utf8' });

serveProcess.stdout.on('data', function(data) {
    console.log(data);
})

const webProcess = process.exec('cd admin && npm run serve:local', { encoding: 'utf8' });

webProcess.stdout.on('data', function(data) {
    console.log(data)
})

// const gulpProcess = process.exec('cd blog-serve && gulp', { encoding: 'utf8' });

// gulpProcess.stdout.on('data', function(data) {
//     console.log(data);
// })