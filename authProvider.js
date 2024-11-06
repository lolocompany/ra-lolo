import { UserManager } from "oidc-client-ts";
import { CognitoUserPool, CognitoUser } from "amazon-cognito-identity-js";
import { fetchUtils } from 'react-admin';
import { useRefresh } from 'react-admin';

const tokenUrl = 'https://eu-1.int.lolo.co/tufEqysYEgzBQyrUrAhkzb/cognito-token';
const REDIRECT_URI = window.location.origin + '/auth-callback';

const userManager = new UserManager({
  authority: 'https://cognito-idp.eu-west-1.amazonaws.com/eu-west-1_lQin10bBN',
  client_id: '3dl8ndi1mkmn7r0kk6iconjc6q',
  redirect_uri: REDIRECT_URI,
  response_type: "code",
  monitorSession: true,
  automaticSilentRenew: true,
  accessTokenExpiringNotificationTimeInSeconds: 295,
  scope: 'openid aws.cognito.signin.user.admin',
  disablePKCE: true
});
userManager.events.addUserSessionChanged(() => {
  console.log('user loaded')
})
userManager.events.addUserSignedIn(() => {
  console.log('user signed in')
})
class LoloAuthProvider {
  baseUrl = null;
  updateAuth = null;

  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  /*
   * login
   */
  async login() {
    if (!localStorage.getItem('token')) {
      await userManager.signinRedirect();
    }
  }

  /*
   * logout
   */
  async logout() {
    if (localStorage.getItem('token')) {
      // await this.globalSignout(); 
      localStorage.removeItem("token");

      // Perform local OIDC logout
      userManager.signoutRedirect({
        extraQueryParams: {
          client_id: userManager.settings.client_id,
          logout_uri: window.location.origin
        }
      });
    }
  }

  /*
   * checkAuth
   */
  async checkAuth() {
    if (localStorage.getItem('token')) {
      return true;
    }

    throw new Error();
  }

  /*
   * checkError
   */
  async checkError(err) {
    const status = err.status;

    if (status === 401 || status === 403) {
      console.log('checkError', status);
    }
  }

  /*
   * getPermissions
   */
  async getPermissions() {
  }

  /*
   * getIdentity
   */
  async getIdentity() {
    const token = localStorage.getItem('token');

    if (!token) {
      return;
    }

    const claims = JSON.parse(atob(token.split(".")[1]));

    return {
      id: claims['cognito:username'],
      fullName: claims['email']
    };
  }

  /*
   * handleCallback
   */
  async handleCallback() {
    const { searchParams } = new URL(window.location.href);
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    try {
      const stateKey = `oidc.${state}`;
      const { code_verifier } = JSON.parse(
        localStorage.getItem(stateKey) || "{}"
      );

      const res = await fetch(tokenUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          code_verifier,
          redirect_uri: REDIRECT_URI
        }),
      });

      if (!res.ok) {
        throw new Error('POST /cognito-token failed');
      }

      const json = await res.json();
      localStorage.setItem('token', json.id_token);
      localStorage.setItem('access_token', json.access_token);
      window.location.href = window.location.origin;

    } catch (err) {
      console.error(err);
    }

    userManager.clearStaleState();
    cleanup();
  }
}

const cleanup = () => {
  window.history.replaceState(
    {},
    window.document.title,
    window.location.origin
  );
};

export default baseUrl => {
  return new LoloAuthProvider(baseUrl);
};
