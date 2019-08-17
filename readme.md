This is BrowserSync plugin. It uploads backend rendered files over ftp, while using proxy server.

Config example
```
...
.browserSync{
    proxy: 'http://your-website',
    files: ['**/*.(js|css)'],
    plugins: [
        {
            module: require('./bs-ftp-sync'),
            options: {
                files: '**/*.(php|twig)',
                host: 'your-host',
                user: 'your-user',
                password: 'your-password',
                path: '/your-website/www/wp-content/themes/theme-name/',
            }
        },
    ],
    serveStatic: [{
        route: '/wp-content/themes/theme-name/dist/',
        dir: ['./dist'],
    }],
})
```