import Redis from 'ioredis'
import 'dotenv/config'

export const RedisConnection = new Redis({
    host: process.env.REDIS_HOST as string,
    port: parseInt(process.env.REDIS_PORT as string),
    password: process.env.REDIS_PASSWORD as string,
})

