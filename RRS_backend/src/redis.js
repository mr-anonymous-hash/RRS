const Redis = require('ioredis');

const redis = new Redis({
  host: 'localhost',    // Redis server host
  port: 6379,           // Redis server port
  password: 'your_password',  // Optional password if you set one
  db: 0                 // Default database
});

redis.on('connect', () => {
  console.log('Connected to Redis');
});

redis.on('error', (err) => {
  console.log('Redis error: ', err);
});

module.exports = redis;
