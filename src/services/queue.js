import kue from 'kue';
import config from '../config/config'
import dotenv from 'dotenv';
dotenv.config();

const queue = kue.createQueue({
    redis : config.redisUrl
})

queue.on('Job enqueue', () => {
    console.log('job submitted to the queue')
});