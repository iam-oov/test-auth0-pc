const express = require('express');

const app = express();
const path = require('path');
const axios = require('axios').default;

const port = 3000;

app.engine('html', require('ejs').renderFile);

app.set('view engine', 'html');

let state = '';

app.get('/', async (req, res) => {
  let authorizationCodeRes = '';

  const authorizationCode = req.query.code;
  state = req.query.state;

  if (authorizationCode) {
    const exchangeOptions = {
      grant_type: 'authorization_code',
      client_id: 'VTRYtW6UZXFPORfsIH6Ff23Q1cITNvqZ',
      client_secret: 'lfdYLPdeqhu4_MFEiIAt7T7VoksJvicJqAcia1XI_6VnVgHauNEedKqAiZU4Z4bn',
      code: authorizationCode,
      redirect_uri: 'http://localhost:3000',
    };

    const options = {
      method: 'POST',
      url: 'https://dev-c6aj47u9.us.auth0.com/oauth/token',
      headers: {
        'content-type': 'application/json',
      },
      data: JSON.stringify(exchangeOptions),
    };

    try {
      const response = await axios(options);
      console.log('OK', response.data);
      authorizationCodeRes = response.data.access_token;
    } catch (error) {
      console.error('ERROR:', error.response.data);
      authorizationCodeRes = error.response.data;
    }
  }

  res.render(
    path.join(__dirname, 'index.html'),
    {
      authorizationCode,
      state,
      authorizationCodeRes: JSON.stringify(authorizationCodeRes),
    },
  );
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
