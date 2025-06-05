// lib/redisClient.js
const Redis = require('ioredis')
const redis = new Redis(process.env.REDIS_URL) // o localhost por defecto

module.exports = redis
