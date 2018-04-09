const auto = require('async').auto;

const init = async (config) => {
  return new Promise(async (resolve, reject) => {
    console.log('0')
    config = config || await require('osseus-config').init()
    console.log('1')

    let osseus = {
      config: config
    }

    let mudules = initModulDeps(osseus)
    console.log('3')

    auto(modules, (err) => {
      console.log('4')
      if (err) return reject(err)
      resolve(osseus)
    })
  })
}

const initModulDeps = (osseus) => {
  modules = {}
  console.log('2', osseus.config.keys)
  osseus.config.keys.forEach(async (key) => {
    console.log('key', key)
    if (key.startsWith('osseus')) {
      let mudoleName = key.substring(7) // 'osseus_' length
      modules[mudoleName] = osseus.config[key].dependencies || []
      modules[mudoleName].push(async () => {
        console.log('require(' + key.replace('_', '-') + ').init()...')
        let mudole = await require(key.replace('_', '-')).init(osseus)
        console.log('required', key.replace('_', '-'))
        if (mudole.start) {
          console.log(key.replace('_', '-') + '.start()...')
          await mudole.start()
          console.log('started', key.replace('_', '-'))
        }
        osseus[mudoleName] = mudole
        return module
      })
    }
  })
}

module.exports = {
  init: init
}