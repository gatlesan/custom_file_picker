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

//write the code to copy the fileuploader.js to mashzone server.. to..
//C:\SANKUM_SAG-9JGN882_MZNG_DEV\Presto\Trunk\runtime\src\main\dist\apache-tomcat\webapps\mashzone\hub\dashboard\custom-js



