# d3fc-showcase

[![Build Status](https://travis-ci.org/ScottLogic/d3fc-showcase.svg?branch=develop)](https://travis-ci.org/ScottLogic/d3fc-showcase)
[![Dependency Status](https://david-dm.org/ScottLogic/d3fc-showcase.svg)](https://david-dm.org/ScottLogic/d3fc-showcase)
[![devDependency Status](https://david-dm.org/ScottLogic/d3fc-showcase/dev-status.svg)](https://david-dm.org/ScottLogic/d3fc-showcase#info=devDependencies)

A cross-platform financial charting application to showcase the functionality of [d3fc](http://scottlogic.github.io/d3fc/) components.

## Developing

[npm](https://www.npmjs.com/), the package manager for [Node.js](https://nodejs.org/), is used to manage the project's dependencies. [Grunt](http://gruntjs.com/), a JavaScript task runner, is used to test and build the project.

### Initial Setup

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

### Running

#### Local server

To run on local server, run the grunt task:

```
grunt serve
```

The project is then accessible at http://localhost:PORTNUMBER

#### GitHub Pages

For this option to be available, you should have forked the ScottLogic/d3fc-showcase repository to your GitHub account.

To run on GitHub Pages, run the grunt command:

```
grunt deploy
```

The project is then accessible at the obvious address (USERNAME.github.io/REPO-NAME).

### Development

To run a development build on a local server, run the grunt task:

```
grunt dev
```

The project is then accessible at http://localhost:PORTNUMBER

This will also start a watch task on the repository, and cause grunt to rebuild and reload the project once any file is changed.

### Testing

To run the unit tests, run the grunt command:

```
grunt test
```

## License

This project is licensed under the [MIT License](http://opensource.org/licenses/MIT).
