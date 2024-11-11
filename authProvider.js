import userManager from "./userManager";

class LoloAuthProvider {
  async login(params) {
    const user = await userManager.getUser();
    if (!user || user.expired) {
      await userManager.signinRedirect();
    }
    return Promise.resolve();
  }

  async logout(params) {
    const user = await userManager.getUser();

    if (user) {
      localStorage.removeItem("accountId");
      await userManager.signoutRedirect({
        extraQueryParams: {
          client_id: userManager.settings.client_id,
          logout_uri: window.location.origin,
        },
      });
    }
    return Promise.resolve();
  }

  async checkAuth(params) {
    const user = await userManager.getUser();
    if (user && !user.expired) {
      return Promise.resolve();
    }
    await this.login(params);
    return Promise.reject();
  }

  async checkError(error) {
    if (error.status === 401 || error.status === 403) {
      console.log('Authentication error', error.status);
      return Promise.reject();
    }
    return Promise.resolve();
  }

  async getPermissions(params) {
    // Implement permissions logic if needed
    return Promise.resolve();
  }

  async getIdentity() {
    const user = await userManager.getUser();
    if (!user) return Promise.reject();

    return Promise.resolve({
      id: user.profile["cognito:username"],
      fullName: user.profile["email"],
    });
  }

  async handleCallback() {
    try {
      const user = await userManager.signinRedirectCallback();
      if (user) {
        window.location.href = window.location.origin;
      }
    } catch (error) {
      console.error("Error handling callback:", error);
    }
    this.cleanupUrl();
    return Promise.resolve();
  }

  cleanupUrl() {
    window.history.replaceState(
      {},
      window.document.title,
      window.location.origin
    );
  }

  async getToken() {
    const user = await userManager.getUser();
    return user ? user.id_token : null;
  }
}

export default () => new LoloAuthProvider();
