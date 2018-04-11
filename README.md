# osseus

Osseus modular web server

### Install
```bash
$ npm install osseus
```

### Usage
index.js
```javascript
const Osseus = require('osseus')

const main = async () => {
  await Osseus.init()
}

main()
```

```bash
node .\index.js --OSSEUS_SERVER_PORT 8888 --OSSEUS_SERVER_DEPENDENCIES ["'logger'"] --DEBUG true --OSSEUS_LOGGER_LOG_LEVEL debug
```

## License
Code released under the [MIT License](https://github.com/colucom/osseus/blob/master/LICENSE).