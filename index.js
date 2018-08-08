const async = require('async')
let osseus

const traceAndClarifyIfPossible = (config) => {
  if (config && (config.debug || (config.env && config.env.toLowerCase() !== 'production'))) {
    require('trace-and-clarify-if-possible')
  }
}

const requireModule = (moduleName) => {
  try {
    return require(moduleName)
  } catch (e1) {
    if (e1.code !== 'MODULE_NOT_FOUND') {
      throw e1
    }
    try {
      return module.parent.require(moduleName)
    } catch (e2) {
      throw e2
    }
  }
}

const init = async (config) => {
  const log = msg => { if (config.debug) { console.log(msg) } }

  return new Promise(async (resolve, reject) => {
    config = config || await require('osseus-config').init().catch(err => { reject(err) })

    traceAndClarifyIfPossible(config)

    osseus = {config: config}
    const modules = {}

    log(`osseus.config.keys: ${osseus.config.keys}`)
    osseus.config.keys.forEach(async key => {
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
          try {
            let _module = await requireModule(key).init(osseus)
            log(`required: ${key}`)
            if (_module.start) {
              log(`${key}.start()...`)
              try {
                await _module.start()
                log(`started ${key}`)
              } catch (err) {
                throw err
              }
            }
            osseus[moduleName] = _module
            return _module
          } catch (err) {
            console.error(`osseus init`, err.stack)
            process.exit(1)
          }
        })
      }
    })

    try {
      async.auto(modules, err => {
        if (err) return reject(err)
        resolve(osseus)
      })
    } catch (err) {
      reject(err)
    }
  })
}

const get = () => {
  return new Promise(async (resolve, reject) => {
    if (!osseus) {
      osseus = await init().catch(err => { reject(err) })
      resolve(osseus)
    }
    resolve(osseus)
  })
}

module.exports = {
  init: init,
  get: get
}
