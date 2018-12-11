[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)

# Osseus

Osseus modular web server

## Install
```bash
$ npm install @colucom/osseus
```
***after installing update `package.json` to include `"osseus": "~x.y.z"` instead of `"osseus": "^x.y.z"`***

***see [semantic-versioning](https://docs.npmjs.com/getting-started/semantic-versioning)***

### Osseus Modules
In order to use any one of those modules you should install it on your app

* [osseus-config](https://github.com/colucom/osseus-config)
* [osseus-logger](https://github.com/colucom/osseus-logger)
* [osseus-mongo](https://github.com/colucom/osseus-mongo)
* [osseus-router](https://github.com/colucom/osseus-router)
* [osseus-server](https://github.com/colucom/osseus-server)
* [osseus-wallet](https://github.com/colucom/osseus-wallet)

## Usage

First, create `index.js`:

```javascript
const Osseus = require('osseus')

const main = async () => {
  const osseus = await Osseus.init()
}

main()
```

#### Basic example using CLI configuration

```bash
$ node index.js --OSSEUS_SERVER_PORT 8888 --OSSEUS_SERVER_DEPENDENCIES ["'logger'"] --DEBUG true --OSSEUS_LOGGER_LOG_LEVEL debug
```

For more configuration options see [osseus-config](https://github.com/colucom/osseus-config) 

#### Special module configurations

##### Load

Osseus modules by default are loaded when they appear in the configuration.

You can specify explicitly whether to load a module or not using the `OSSEUS_<MODULE-NAME>_LOAD` configuration param which can be `true` or `false` (boolean)

##### Private

You can write your own private osseus modules which you do not wish to publish to the public npm.

In order to use them you will need to specify explicitly that they are private using the `OSSEUS_<MODULE-NAME>_PRIVATE` configuration param which can be `true` or `false` (boolean)

##### Scope

You can write your own osseus modules and publish to the public npm under your own scope/organization.

In order to use them you will need to specify explicitly the scope of the module using the `OSSEUS_<MODULE-NAME>_SCOPE` configuration param. 

By default modules are loaded from the [`@colucom`](https://www.npmjs.com/settings/colucom/packages) organization.

##### Use_Trace
For debugging purposes, osseus uses [trace-and-clarify-if-possible](https://www.npmjs.com/package/trace-and-clarify-if-possible).
This module causes memory leaks so it can only be used in `debug` mode. To activate this module set `USE_TRACE` to `true`.

##### Dependencies

Osseus modules by default are initialized parallely.

In order for modules to initialize after specific modules we have the "dependencies" configuration setting.

Generally speaking, if you wish for one osseus module to initialize before another you'll have to add the following configuration param: `OSSEUS_<MODULE-NAME>_DEPENDENCIES: ['<other-module-name>']`

For example, if we wish to have an [osseus-server](https://github.com/colucom/osseus-server) but make sure we have [osseus-logger](https://github.com/colucom/osseus-logger) before that we will add to our configuration: `OSSEUS_SERVER_DEPENDENCIES: ['logger']`

## Contributing
Please see [contributing guidelines](https://github.com/colucom/osseus/blob/master/.github/CONTRIBUTING.md).

## License
Code released under the [MIT License](https://github.com/colucom/osseus/blob/master/LICENSE).
