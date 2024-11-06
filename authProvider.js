import { UserManager } from "oidc-client-ts";

const REDIRECT_URI = `${window.location.origin}/auth-callback`;

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
  console.log('User session changed');
});

userManager.events.addUserSignedIn(() => {
  console.log('User signed in');
});

class LoloAuthProvider {
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

  async checkError(error) {
    if (error.status === 401 || error.status === 403) {
      console.log('Authentication error', error.status);
    }
  }

  async getPermissions() {
    // Implement permissions logic if needed
  }

  async getIdentity() {
    const user = await userManager.getUser();
    if (!user) return;

    return {
      id: user.profile['cognito:username'],
      fullName: user.profile['email'],
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

  setToken(user) {
    localStorage.setItem('token', user.id_token);
    localStorage.setItem('access_token', user.access_token);
  }

  clearToken() {
    localStorage.removeItem('token');
    localStorage.removeItem('access_token');
  }

  cleanupUrl() {
    window.history.replaceState({}, window.document.title, window.location.origin);
  }
}

export default (baseUrl) => new LoloAuthProvider(baseUrl);
