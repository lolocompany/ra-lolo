import { UserManager } from "oidc-client-ts";

const REDIRECT_URI = window.location.origin + '/auth-callback';

const userManager = new UserManager({
  authority: 'https://cognito-idp.eu-west-1.amazonaws.com/eu-west-1_lQin10bBN',
  client_id: '742fcmsd74enql25761e8cmm6',
  redirect_uri: REDIRECT_URI,
  response_type: "code",
  monitorSession: true,
  automaticSilentRenew: true,
  accessTokenExpiringNotificationTimeInSeconds: 295,
  scope: 'openid aws.cognito.signin.user.admin',
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

  async login() {
    const user = await userManager.getUser();
    if (!user || user.expired) {
      await userManager.signinRedirect();
    }
  }


  async logout() {
    const user = await userManager.getUser();

    if (localStorage.getItem('token') || user) {
      this.clearToken();

      userManager.signoutRedirect({
        extraQueryParams: {
          client_id: userManager.settings.client_id,
          logout_uri: window.location.origin
        }
      });
    }
  }

  async checkAuth() {
    const user = await userManager.getUser();
    if (user && !user.expired) {
      return true;
    }
    throw new Error('User is not authenticated');
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

  async handleCallback() {
    try {
      const user = await userManager.signinRedirectCallback();
      if (user) {
        this.setToken(user);
        window.location.href = window.location.origin;
      }
    } catch (error) {
      console.error('Error handling callback:', error);
    }
    this.cleanupUrl();
  }
  cleanupUrl() {
    window.history.replaceState({}, window.document.title, window.location.origin);
  }

  setToken(user) {
    localStorage.setItem('token', user.id_token);
    localStorage.setItem('access_token', user.access_token);
  }

  clearToken() {
    localStorage.removeItem('token');
    localStorage.removeItem('access_token');
  }
}


export default baseUrl => {
  return new LoloAuthProvider(baseUrl);
};
