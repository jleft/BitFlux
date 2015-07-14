# d3fc-showcase [![Build Status] travis link]

A cross-platform financial charting application to showcase the functionality of d3fc components

## Installations 

d3fc-showcase and its dependencies (d3fc, D3, [css-layout]) (https://github.com/ScottLogic/d3fc-showcase)

'''
Don't know actual installation instructions

'''

To find out more about the application and the components used, visit the [project webpage](https://github.com/ScottLogic/d3fc-showcase)

## Developing

im not quite sure what we need here

### Initial setup

- Download or clone this repository locally
- Ensure [Node.js](https://nodejs.org/), which includes npm, is installed
- Ensure [Grunt](http://gruntjs.com/getting-started#installing-the-cli) is installed:

```
npm install -g grunt-cli
```

- Navigate to the root of your local copy of this project and install the dependencies:

```
npm install
```

- Perform an initial build:

```
grunt
```

### Grunt Tasks

The following Grunt tasks, found in `Gruntfile.js`, can be run from the command line. The most commonly used tasks to build and develop the project are:

- `grunt build` - generate the project's JavaScript and CSS files in the _dist_ directory (at the root of the project); build the visual tests
- `grunt dev` - run `grunt build`, then `grunt watch`
- `grunt dev:serve` - same as `grunt dev` but also starts a web server for viewing the visual tests

Other tasks include:

- `grunt check` - run JSHint and JSCS checks
- `grunt test` - run unit tests and build the visual tests
- `grunt watch` - watch the source files and rebuild when a change is saved
- `grunt serve` - start a web server for viewing the visual tests
- `grunt` - check, test and build the project

### Visual Tests

The project includes a number of unit tests, however, because these components are visual in nature, unit testing is not enough. This project contains a number of ad-hoc visual tests that are found within the `visual-tests` folder. The visual tests are compiled, via [assemble](http://assemble.io/), to create a simple website. To view this site, run `grunt serve` or a [static server](https://gist.github.com/willurd/5720255) from the `visual-tests\dist` folder.

## License

These components are licensed under the [MIT License](http://opensource.org/licenses/MIT).

