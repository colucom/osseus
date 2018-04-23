const auto = require('async').auto
const modules = {}

const init = async (config) => {
  return new Promise(async (resolve, reject) => {
    config = config || await require('osseus-config').init()

    let osseus = {
      config: config
    }

    initModuleDeps(osseus)

    auto(modules, (err) => {
      if (err) return reject(err)
      resolve(osseus)
    })
  })
}

const initModuleDeps = (osseus) => {
  const log = (msg) => {
    if (osseus.config.debug) {
      console.log(msg)
    }
  }
  log(`osseus.config.keys: ${osseus.config.keys}`)
  osseus.config.keys.forEach(async (key) => {
    log(`key: ${key}`)
    if (key.startsWith('osseus')) {
      let moduleName = key.substring(7) // 'osseus_' length
      let dependencies = osseus.config[key].dependencies || []
      if (typeof dependencies === 'string') {
        dependencies = dependencies.split(',')
      }
      log(`${key} dependencies: ${dependencies}`)
      modules[moduleName] = dependencies
      modules[moduleName].push(async () => {
        key = key.replace('_', '-')
        log(`require(${key}).init()...`)
        let module = await require(key).init(osseus)
        log(`required: ${key}`)
        if (module.start) {
          log(`${key}.start()...`)
          await module.start()
          log(`started ${key}`)
        }
        osseus[moduleName] = module
        return module
      })
    }
  })
}

module.exports = {
  init: init
}
