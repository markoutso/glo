# Glo [![Netlify Status](https://api.netlify.com/api/v1/badges/b104b1f2-41a1-4f81-b654-52dafd1dbc15/deploy-status)](https://app.netlify.com/sites/elastic-carson-b9d3c7/deploys)
A complete parser & interpreter for Glossa(Γλώσσα), the programming launguage taught in the final year of Greek high school and included in the examinations for entrance to Greek universities.

This project also provides a CLI and a web interface to the interpreter(cli and webapp modules respectively).

The programming language was created by the AEPP book authors and inspired by Pascal and BASI. All the commands are written in Greek and it does not have support for Object-oriented programming.

## Install
The web application is hosted on [gloglossa.gr](https://gloglossa.gr)

All the modules are published on npm under the `glossa-glo` organization. To install the cli run:
```bash
npm install --global @glossa-glo/cli
```
or, using Yarn:
```bash
yarn global add @glossa-glo/cli
```
Then, run
```bash
glossa filename
```

## Build
The code is structured as a monorepo, using [Lerna](https://github.com/lerna/lerna).
The following commands build all the packages and link them together:
```bash
yarn # Installs dependencies on the root package
yarn run bootstrap # Runs local lerna bootstrap
```

## Run
In order to run the CLI locally, execute the following command from the root directory:
```bash
./modules/cli/bin/run filename
```
To run the web app local development server:
```
cd ./modules/webapp
yarn run dev
```

## Contributing
The project currently does **not** accept any pull requests. Please email me if you are interested in contributing.

## License
MIT License
