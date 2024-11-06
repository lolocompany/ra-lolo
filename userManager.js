import { UserManager } from "oidc-client-ts";

const REDIRECT_URI = `${window.location.origin}/auth-callback`;
const AUTHORITY_URI = 'https://cognito-idp.eu-west-1.amazonaws.com/eu-west-1_lQin10bBN'
const CLIENT_ID = '742fcmsd74enql25761e8cmm6'

const userManager = new UserManager({
  authority: AUTHORITY_URI,
  client_id: CLIENT_ID,
  redirect_uri: REDIRECT_URI,
  response_type: "code",
  scope: 'openid aws.cognito.signin.user.admin',
});

export default userManager;
