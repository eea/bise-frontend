[![Pipeline](https://ci.eionet.europa.eu/buildStatus/icon?job=volto/bise-frontend/master&subject=pipeline)](https://ci.eionet.europa.eu/view/Github/job/volto/job/bise-frontend/job/master/display/redirect)
[![Release](https://img.shields.io/github/v/release/eea/bise-frontend?sort=semver)](https://github.com/eea/bise-frontend/releases)

## Documentation

The Volto project for 25bff536947122c6ffe09895da0ea8bd1b1a2b91

## Releases

See https://github.com/eea/eea.docker.plone.bise for details.

To create a new release in this repo, run `env GITHUB_TOKEN=... release-it`

## Quick Start

Below is a list of commands you will probably find useful.

### `yarn start`

Runs the project in development mode.
You can view your application at `http://localhost:3000`

The page will reload if you make edits.

### `yarn build`

Builds the app for production to the build folder.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

### `yarn start:prod`

Runs the compiled app in production.

You can again view your application at `http://localhost:3000`

### `yarn test`

Runs the test watcher (Jest) in an interactive mode.
By default, runs tests related to files changed since the last commit.

### `yarn i18n`

Runs the test i18n runner which extracts all the translation strings and
generates the needed files.


### mrs-developer

[mrs-developer](https://github.com/collective/mrs-developer) is a great tool
for developing multiple packages at the same time.

mrs-developer should work with this project by running the configured shortcut script:

```bash
yarn develop
```

Volto's latest razzle config will pay attention to your jsconfig.json file for any customizations.

In case you don't want (or can't) install mrs-developer globally, you can install it in this project by running:

```bash
yarn add -W mrs-developer
```
