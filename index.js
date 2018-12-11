const async = require('async')
let osseus

const traceAndClarifyIfPossible = (config) => {
  if (config && config.use_trace && config.env && config.env.toLowerCase() !== 'production') {
    console.log('using trace-and-clarify-if-possible, MEMORY LEAKS EXPECTED!!')

    require('trace-and-clarify-if-possible')
  } else {
    console.log('Not using trace-and-clarify-if-possible')
  }
}

const requireModule = (moduleName) => {
  try {
    return require(moduleName)
  } catch (err) {
    if (err.code !== 'MODULE_NOT_FOUND') {
      throw err
    }
    return module.parent.require(moduleName)
  }
}

const init = async (config) => {
  const log = msg => { if (config.debug) { console.log(msg) } }

  return new Promise(async (resolve, reject) => {
    config = config || await require('@colucom/osseus-config').init().catch(err => { reject(err) })

    traceAndClarifyIfPossible(config)

    osseus = {config: config}
    const modules = {}

    log(`osseus.config.keys: ${osseus.config.keys}`)
    osseus.config.keys.forEach(async key => {
      log(`key: ${key}`)
      if (key.startsWith('osseus')) {
        let loadModule = typeof osseus.config[key].load !== 'undefined' ? osseus.config[key].load : true
        let isPrivate = typeof osseus.config[key].private !== 'undefined' ? osseus.config[key].private : false
        let scope = osseus.config[key].scope
        log(`${key} loadModule: ${loadModule}, isPrivate: ${isPrivate}, scope: ${scope}`)

        if (loadModule) {
          let moduleName = key.substring(7) // 'osseus_' length
          let dependencies = osseus.config[key].dependencies || []
          if (typeof dependencies === 'string') {
            dependencies = dependencies.split(',')
          }
          log(`${key} dependencies: ${dependencies}`)
          modules[moduleName] = dependencies
          modules[moduleName].push(async () => {
            key = key.replace('_', '-')
            key = isPrivate ? key : (scope ? `@${scope}/${key}` : `@colucom/${key}`)
            log(`require(${key}).init()...`)
            try {
              const _module = await requireModule(key).init(osseus)
              log(`required: ${key}`)
              if (_module.start) {
                log(`${key}.start()...`)
                await _module.start()
                log(`started ${key}`)
              }
              osseus[moduleName] = _module
              return _module
            } catch (err) {
              console.error(`osseus init`, err.stack)
              reject(err)
            }
          })
        } else {
          console.warn(`not loading ${key}...`)
        }
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
