const redis = require('redis')
const { REDIS_CONF } = require('../conf/db.js')

// create redis client
const redisClient=redis.createClient(REDIS_CONF.port, REDIS_CONF.host)

// Listen for the 'ready' event
redisClient.on('ready', () => {
  console.log('Redis client is connected');
});

// Listen for the 'error' event
redisClient.on('error', (err) => {
  console.error(err);
});

function set(key, val) {
  if (typeof val === 'object') {
    val = JSON.stringify(val)
  }
  redisClient.set(key, val, redis.print)
}

function get(key) {
  const promise = new Promise((resolve, reject) => {
    redisClient.get(key, (err, val) => {
      if (err) {
        reject(err)
        return
      }
      if (val == null) {
          resolve(null)
          return
      }
      try {
        resolve(JSON.parse(val))
      } catch (ex) {
        resolve(val)
      }
    })
  })
  return promise
}

module.exports = {
  set,
  get
}