import express from 'express';
import config from './config/config.js'
import appRoute from './api/routes/index'

const {appPort} = config

const app = express()

app.use(express.json());

app.use('/', appRoute)

app.get('/new', (req, res) => {
    res.send('its kukuma working')
})

app.listen(appPort, () => {
    console.log('App listening on port 3000!');
});

export default app