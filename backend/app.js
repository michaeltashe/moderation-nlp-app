const express = require('express')
const axios = require('axios')
const cors = require('cors')
require('dotenv').config()

const app = express()
const port = 8080

app.use(express.json())
app.use(cors())

const instance = axios.create({
    baseURL: 'https://language.googleapis.com',
    headers: { 'Access-Control-Allow-Origin': '*' }
})

app.post('/nlp', async (req, res, next) => {

    const { text } = req.body;

    const body = {
        "document": {
            "type": "PLAIN_TEXT",
            "content": text
        },
        "modelVersion": "MODEL_VERSION_2"
    }

    try {
        console.log('POST /nlp')
        const gcpRes = await instance.post(`/v2/documents:moderateText?key=${process.env.API_KEY}`, body)
        console.log('POST /nlp 200 OK')
        res.status(200).json(gcpRes.data)
    } catch (err) {
        console.log('POST /nlp 400 Bad Request')
        res.status(400).send(err);
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})