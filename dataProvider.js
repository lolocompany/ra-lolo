import { fetchUtils } from 'react-admin';
import { stringify } from 'query-string';
import userManager from './userManager';

class LoloDataProvider {
  constructor(baseUrl, options = {}) {
    this.baseUrl = baseUrl;
    this.options = options;
  }

  async getList(resource, params, additionalQueryParams = {}) {
    const {
      page = 1,
      perPage = 15,
    } = params.pagination || {};

    const {
      field = 'createdAt',
      order = 'desc',
    } = params.sort || {};

    const filters = Object.entries(params.filter || {}).reduce((acc, [key, value]) => {
      acc[`q[${key}]`] = value;
      return acc;
    }, {});

    const query = {
      limit: perPage,
      sort: `${field} ${order.toLowerCase()}`,
      offset: (page - 1) * perPage,
      ...filters,
      ...additionalQueryParams,
    };

    const url = `/${resource}?${stringify(query)}`;
    const { data } = await this.sendRequest(url);
    return this.buildListResponse(data, resource);
  }

  getOne(resource, params) {
    const url = `/${resource}/${params.id}`;
    return this.sendRequest(url);
  }

  getMany(resource, params) {
    const filterParams = { filter: { id: params.ids } };
    return this.getList(resource, filterParams, {
      qor: 1,
      qre: 0,
      limit: 500,
    });
  }

  getManyReference(resource, params) {
    const { target, id, ...otherParams } = params;
    const filterParams = {
      ...otherParams,
      filter: {
        ...otherParams.filter,
        [target]: id,
      },
    };
    return this.getList(resource, filterParams, { qor: 1 });
  }

  create(resource, params) {
    const url = `/${resource}`;
    return this.sendRequest(url, {
      method: 'POST',
      body: JSON.stringify(params.data),
    });
  }

  update(resource, params) {
    const url = `/${resource}/${params.id}`;
    return this.sendRequest(url, {
      method: 'PUT',
      body: JSON.stringify(params.data),
    });
  }

  delete(resource, params) {
    const url = `/${resource}/${params.id}`;
    return this.sendRequest(url, {
      method: 'DELETE',
    });
  }

  async sendRequest(url, options = {}) {
    const fullUrl = url.startsWith('/') ? `${this.baseUrl}${url}` : url;
    await setLoloHeaders(options, this.options.selectedAccount);

    try {
      const { json: data } = await fetchUtils.fetchJson(fullUrl, options);
      return { data };
    } catch (error) {
      if (error.body?.error) {
        error.message = error.body.error;
      }
      throw error;
    }
  }

  buildListResponse(data, resource) {
    const itemsKey = typeof this.options.itemsKey === 'function'
      ? this.options.itemsKey(resource)
      : this.options.itemsKey || 'items';

    if (data[itemsKey]) {
      return {
        data: data[itemsKey],
        total: data.total,
      };
    } else if (Array.isArray(data)) {
      return {
        data: data.map((item, index) => ({ id: index, ...item })),
        total: data.length,
      };
    } else {
      throw new Error(`Unsupported list response type: ${typeof data}`);
    }
  }
}

const setLoloHeaders = async (options, selectedAccount) => {
  const user = await userManager.getUser();
  const token = user?.id_token;
  const accountId = selectedAccount || localStorage.getItem('accountId');

  if (!options.headers) {
    options.headers = new Headers();
  }

  if (token) {
    options.headers.set('Authorization', `Bearer ${token}`);
  }

  if (accountId) {
    options.headers.set('Lolo-Account-Id', accountId);
  }
};

const dataProvider = (baseUrl, options) => {
  return new LoloDataProvider(baseUrl, options);
};

export default dataProvider;
