[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)

# Osseus

Osseus modular web server

## Install
```bash
$ npm install osseus
```
This will install all osseus modules as well

* [osseus-config](https://github.com/colucom/osseus-config)
* [osseus-logger](https://github.com/colucom/osseus-logger)
* [osseus-mongo](https://github.com/colucom/osseus-mongo)
* [osseus-queue](https://github.com/colucom/osseus-queue)
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

## License
Code released under the [MIT License](https://github.com/colucom/osseus/blob/master/LICENSE).
