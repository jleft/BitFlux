module.exports = function(config) {

    if (!(process.env.SAUCE_USERNAME && process.env.SAUCE_ACCESS_KEY)) {
        console.log('Make sure the SAUCE_USERNAME and SAUCE_ACCESS_KEY environment variables are set.');
        process.exit(1);
    }

    var customLaunchers = {
        sl_chrome: {
            base: 'SauceLabs',
            browserName: 'chrome',
            platform: 'Windows 7',
            version: '35'
        },
        sl_firefox: {
            base: 'SauceLabs',
            browserName: 'firefox',
            platform: 'Windows 7',
            version: '30'
        },
        sl_ios_safari: {
            base: 'SauceLabs',
            browserName: 'iphone',
            platform: 'OS X 10.9',
            version: '7.1'
        },
        sl_ie_11: {
            base: 'SauceLabs',
            browserName: 'internet explorer',
            platform: 'Windows 8.1',
            version: '11'
        }
    }

    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        concurrency: Infinity,
        sauceLabs: {
            testName: 'd3fc-showcase Unit Tests',
            recordScreenshots: false
        },
        customLaunchers: customLaunchers,
        browsers: Object.keys(customLaunchers),
        reporters: ['progress', 'saucelabs'],
        singleRun: true,
        captureTimeout: 120000,
        browserDisconnectTimeout: 120000,
        browserNoActivityTimeout: 120000
    })
}
