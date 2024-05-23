const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);


const scopes = [
  'https://www.googleapis.com/auth/user.emails.read',
  'profile',
];


function getGoogleOauthUrl() {
  return oauth2Client.generateAuthUrl({
    scope: scopes,
  });
}


exports.getGoogleOauthUrl = getGoogleOauthUrl;