const functions = require("firebase-functions");

exports.confirmLoginWithDiscord = functions
  .runWith({ secrets: ["CLIENT_SECRET"]})
  .region("europe-west1")
  .https.onCall((data, context) => {
  const origin = data.origin;
  const clientId = "963382206443704342";
  const redirectUri = `${origin}/discord`;
  const code = data.code;
  const grant_type = "authorization_code";
  const clientSecret = process.env.CLIENT_SECRET;
  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("client_secret", clientSecret);
  params.append("grant_type", grant_type);
  params.append("code", code);
  params.append("redirect_uri", redirectUri);
  return fetch('https://discord.com/api/oauth2/token', { method: "POST", body: params })
    .then(response => response.json())
    .then(data => {
      const { access_token, token_type } = data;
      return fetch('https://discord.com/api/users/@me', {
        headers: {
          authorization: `${token_type} ${access_token}`,
        },
      })
        .then(response => response.json())
        .then(data => {
          return {
            id: data.id,
            username: data.username,
            discriminator: data.discriminator,
            avatar: data.avatar,
        };
        }).catch(err => {
          console.log(err)
        });
    });
});
