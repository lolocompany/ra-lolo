import { UserManager } from "oidc-client-ts";
import { fetchUtils } from 'react-admin';
import { useRefresh } from 'react-admin';

const tokenUrl = 'https://be.dev.pvpc.io/dpVtXAhC1Phki2poDN4ncw/cognito-token';
const redirectUri = window.location.origin + '/auth-callback';

const userManager = new UserManager({
  authority: 'https://cognito-idp.eu-west-1.amazonaws.com/eu-west-1_lQin10bBN',
  client_id: '3dl8ndi1mkmn7r0kk6iconjc6q',
  redirect_uri: redirectUri,
  response_type: "code",
  scope: [ 'openid' ]
});

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
      localStorage.removeItem("token");
      // await userManager.signoutRedirect();
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
      // localStorage.removeItem('token');
      // throw new Error();
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
    }
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
          redirect_uri: redirectUri
        }),
      });
  
      if (!res.ok) {
        throw new Error('POST /cognito-token failed');
      }

      const json = await res.json();
      localStorage.setItem('token', json.id_token);
      window.dispatchEvent(new Event('tokenUpdated'));

    } catch (err) {
      console.error(err);
    }

    userManager.clearStaleState();
    cleanup();
  }
};

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