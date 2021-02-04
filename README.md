## Documentation

A training on how to create your own website using Volto is available as part of the Plone training at [https://training.plone.org/5/volto/index.html](https://training.plone.org/5/volto/index.html).

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


### mrs_developer

[mrs_developer](https://www.npmjs.com/package/mrs-developer) is a great tool
for developing multiple packages at the same time.

mrs_developer should work with this project by using the `--config` config option:

```bash
missdev --config=jsconfig.json --output=addons
```

Volto's latest razzle config will pay attention to your jsconfig.json file
for any customizations.# bise-frontend

## Updating `public/critical.css`

Updating it necessitates the existence of a CSS-matching version of BISE on another
place, not on `localhost` (e.g. production or demo website). If you wish to work with `localhost`, please check the links in [this issue](https://github.com/nileshgulia1/critical-css-generator/issues/2) to see if the issues related to `localhost` are solved in upstream).

To produce the critical CSS based on a website that is not `localhost` install and use [this](https://github.com/plone/critical-css-cli):

```shell
$ npm i -g @plone/critical-css-cli
$ cd path/to/bise/frontend/dir
$ critical-cli https://demo-biodiversity.eea.europa.eu/ -o public/critical.css -d 767x1100,990x1100,1655x1100
```

The resolutions are selected based on the viewport size stats of EEA and on
search box-related responsive design breakpoints.

1. The viewport size stats say that we should use critical CSS for:
  a. 480x320
  b. 1366x500
  c. 1536x500

2. The resolutions for the search box breakpoints are in the shell command
   above.
