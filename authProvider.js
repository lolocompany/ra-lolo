import userManager from './userManager';

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

    if (user) {
      localStorage.setItem('accountId', null);
      userManager.signoutRedirect({
        extraQueryParams: {
          client_id: userManager.settings.client_id,
          logout_uri: window.location.origin,
        },
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
}

export default (baseUrl) => new LoloAuthProvider(baseUrl);