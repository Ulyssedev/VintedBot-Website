const functions = require("firebase-functions");

const getAccessToken = async (userId, tokens) => {
  if (Date.now() > tokens.expires_at) {
    const url = 'https://discord.com/api/v10/oauth2/token';
    const body = new URLSearchParams({
      client_id: clientId,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: tokens.refresh_token,
    });
    const response = await fetch(url, {
      body,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    if (response.ok) {
      const tokens = await response.json();
      tokens.expires_at = Date.now() + tokens.expires_in * 1000;
      return tokens.access_token;
    } else {
      throw new Error(`Error refreshing access token: [${response.status}] ${response.statusText}`);
    }
  }
  return tokens.access_token;
}

exports.confirmLoginWithDiscord = functions
  .runWith({ secrets: ["CLIENT_SECRET"]})
  .region("europe-west1")
  .https.onCall(async (data, context) => {
  const code = data.code;
  const clientId = "963382206443704342";
  const redirectUri = `${data.origin}/discord`;
  const clientSecret = process.env.CLIENT_SECRET;

  try {
    const oAuthResponse = await getOAuthTokens(code, clientId, clientSecret, redirectUri);
    const { access_token, token_type } = oAuthResponse;
    const url = 'https://discord.com/api/v10/users/@me';
    const response = await fetch(url, {
      headers: {
        authorization: `${token_type} ${access_token}`,
      },
    });
    if (response.ok) {
      const userData = await response.json();
      userData.tokens = oAuthResponse;
      console.log(userData);
      return userData;
    } else {
      throw new Error(`Error fetching user data: [${response.status}] ${response.statusText}`);
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
});

async function getOAuthTokens(code, clientId, clientSecret, redirectUri) {
  const url = 'https://discord.com/api/v10/oauth2/token';
  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
  });

  const response = await fetch(url, {
    body,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    throw new Error(`Error fetching OAuth tokens: [${response.status}] ${response.statusText}`);
  }
}

exports.pushMetadata = functions
  .runWith({ secrets: ["CLIENT_SECRET"]})
  .region("europe-west1")
  .https.onCall(async (data, context) => {
  const clientId = "963382206443704342";
  const userId = data.userId;
  const tokens = data.tokens;
  const metadata = data.metadata;

  const url = `https://discord.com/api/v10/users/@me/applications/${clientId}/role-connection`;
  const accessToken = await getAccessToken(userId, tokens);
  const body = {
    platform_name: 'VintedBot',
    metadata,
  };
  const response = await fetch(url, {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error(`Error pushing discord metadata: [${response.status}] ${response.statusText}`);
  }

  return true;
});

exports.getMetadata = functions
.region("europe-west1")
.https.onCall(async (data, context) => {
const userId = data.userId;
const tokens = data.tokens;
const clientId = "963382206443704342";

const url = `https://discord.com/api/v10/users/@me/applications/${clientId}/role-connection`;
const accessToken = await getAccessToken(userId, tokens);
const response = await fetch(url, {
  method: 'GET',
  headers: {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  },
});
if (response.ok) {
  const data = await response.json();
  return data;
} else {
  throw new Error(`Error getting discord metadata: [${response.status}] ${response.statusText}`);
}
});