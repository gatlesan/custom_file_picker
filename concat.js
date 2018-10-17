var concat = require('concat-files');
concat([
    './dist/fileuploader-app/runtime.js',
    './dist/fileuploader-app/polyfills.js',
    './dist/fileuploader-app/scripts.js',
    './dist/fileuploader-app/main.js'
], './dist/fileuploader.js', function(err) {
    if (err) throw err
    console.log('done');
});