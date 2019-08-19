const { dirname } = require('path');
const Client = require("ftp");
const chokidar = require("chokidar");

module.exports.plugin = ftpSync;

const defaultIgnorePatterns = [
    /node_modules/,
    /bower_components/,
    '.sass-cache',
    '.vscode',
    '.git',
    '.idea',
];


function ftpSync(params) {
    const config = Object.assign({
        files: '**/*.(php|twig)',
        watchOptions: {
            ignored: defaultIgnorePatterns,
            ignoreInitial: true,
        }
    }, params);
    
    
    function upload(file, event) {
        const client = new Client();
        
        client.on('ready', function() {
            client.put(file, config.path + file, function(e) {
                if (e && e.code === 550) {
                    client.mkdir(dirname(config.path + file), true, function(e) {
                        if (!e) { upload(file, event); }
                    });
                } else {
                    const FgGreen = "\x1b[32m";
                    const Reset = "\x1b[0m"
                    console.log(`[${FgGreen}Ftpsync${Reset}] ${file} uploaded`);
                }
            });

            client.end();
        })

        client.connect({
            host: config.host,
            user: config.user,
            password: config.password,
        });
    }

    chokidar.watch(config.files, config.watchOptions)
        .on('add', upload)
        .on('change', upload);
}