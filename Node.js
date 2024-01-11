const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client('11084186068-20caef2k04khqom4nlsg9lfr5naeh4a4.apps.googleusercontent.com');

app.post('/authenticate', async (req, res) => {
  const { idToken } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: '11084186068-20caef2k04khqom4nlsg9lfr5naeh4a4.apps.googleusercontent.com',
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    // If request specified a G Suite domain:
    // const domain = payload['hd'];

    // Authenticate the user and send a response
    // ...
  } catch (error) {
    console.error(error);
    res.status(500).send('Error verifying ID token');
  }
});