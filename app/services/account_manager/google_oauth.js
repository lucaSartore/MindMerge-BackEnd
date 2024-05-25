const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

google.options({
  auth: oauth2Client
});

const people = google.people({version: 'v1', auth: oauth2Client});

const scopes = [
  'https://www.googleapis.com/auth/user.emails.read',
  'profile',
];

/**
 * Returns the redirect URL for the google oauth 
 * @returns {string}
 */
function getGoogleOauthUrl() {
  return oauth2Client.generateAuthUrl({
    scope: scopes,
  });
}

/**
 * Returns the name and email of the user after the oauth code is exchanged 
 * @param {string} code 
 * @returns {Promise<{name: string, email: string}>}
 */
async function getNameAndEmail(code){
  const {tokens} = await oauth2Client.getToken(code)
  oauth2Client.setCredentials(tokens);
  const res = await people.people.get({
      resourceName: 'people/me',
      personFields: 'names,emailAddresses',
    });
  return {
    name: res.data.names[0].displayName,
    email: res.data.emailAddresses[0].value
  };
}

exports.getGoogleOauthUrl = getGoogleOauthUrl;
exports.getNameAndEmail = getNameAndEmail;