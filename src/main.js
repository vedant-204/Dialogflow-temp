const dialogflow = require('@google-cloud/dialogflow');
require('dotenv').config();
const express = require('express');

const KEYS = JSON.parse(process.env.CREDENTIALS);

const PROJECID = KEYS.project_id;

const CONFIGURATION = {
    credentials: {
        private_key: KEYS['private_key'],
        client_email: KEYS['client_email']
    }
}

const sessionClient = new dialogflow.SessionsClient(CONFIGURATION);

const detectIntent = async (languageCode, queryText, sessionId) => {

    let sessionPath = sessionClient.projectAgentSessionPath(PROJECID, sessionId);

    let request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: queryText,
                languageCode: languageCode,
            },
        },
    };

    const responses = await sessionClient.detectIntent(request);
    console.log(responses);
    const result = responses[0].queryResult;
    console.log(result);

    return {
        response: result.fulfillmentText
    };
}

detectIntent('en', 'hello', 'session1');

const webApp = express();

webApp.use(express.urlencoded({
    extended: true
}));
webApp.use(express.json());

const PORT = process.env.PORT || 3000;

webApp.get('/', (req, res) => {
    res.send(`Hello`);
});

webApp.post('/dialog', async (req, res) => {

    let languageCode = req.body.languageCode;
    let queryText = req.body.queryText;
    let sessionId = req.body.sessionId;

    let responseData = await detectIntent(languageCode, queryText, sessionId);

    res.send(responseData.response);
});

webApp.listen(PORT, () => {
    console.log(`Server is up and running at ${PORT}`);
});