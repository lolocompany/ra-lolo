import { fetchUtils } from 'react-admin';
import { stringify } from 'query-string';
import userManager from './userManager';

/*
 * LoloDataProvider
 */

class LoloDataProvider {
  constructor(baseUrl, opts = {}) {
    this.baseUrl = baseUrl;
    this.opts = opts;
  }

  /*
   * getList
   */

  async getList(resource, params, queryOpts) {
    const {
      page = 1,
      perPage = 15
    } = params.pagination || {};

    const {
      field = 'createdAt',
      order = 'desc'
    } = params.sort || {};

    const qs = Object.entries(params.filter).reduce(
      (memo, [k, v]) => {
        memo[`q[${k}]`] = v;
        return memo;
      },
      {}
    );

    const query = {
      limit: perPage,
      sort: field + ' ' + order.toLowerCase(),
      offset: (page - 1) * perPage,
      ...qs,
      ...queryOpts
    };

    const url = '/' + resource + '?' + stringify(query);

    const { data } = await this.sendRequest(url);
    return this.buildListResponse(data, resource);
  }

  /*
   * getOne
   */

  getOne(resource, params) {
    return this.sendRequest(`/${resource}/${params.id}`);
  }

  /*
   * getMany
   */

  getMany(resource, params) {
    params.filter = { id: params.ids };

    return this.getList(resource, params, {
      qor: 1,
      qre: 0,
      limit: 500
    });
  }

  /*
   * getManyReference
   */

  getManyReference(resource, { target, ...params }) {
    params = {
      ...params,
      filter: {
        ...params.filter,
        [target]: params.id
      }
    };

    return this.getList(resource, params, {
      qor: 1,
    });
  }

  /*
   * create
   */

  create(resource, params) {
    return this.sendRequest(`/${resource}`, {
      method: 'POST',
      body: JSON.stringify(params.data),
    });
  }

  /*
   * update
   */

  update(resource, params) {
    return this.sendRequest(`/${resource}/${params.id}`, {
      method: 'PUT',
      body: JSON.stringify(params.data),
    });
  }

  /*
   * delete
   */

  delete(resource, params) {
    return this.sendRequest(`/${resource}/${params.id}`, {
      method: 'DELETE',
    });
  }

  /*
   * sendRequest
   */

  async sendRequest(url, opts = {}) {
    if (url.startsWith('/')) {
      url = this.baseUrl + url;
    }

    await setLoloHeaders(opts);

    try {
      const { json: data } = await fetchUtils.fetchJson(url, opts);
      return { data };

    } catch (err) {
      if (err.body?.error) {
        err.message = err.body.error;
      }

      throw err;
    }
  }

  buildListResponse(data, resource) {
    const { opts } = this;

    const itemsKey = typeof opts.itemsKey === 'function' ?
      opts.itemsKey(resource) : (
        opts.itemsKey || 'items'
      );

    if (data[itemsKey]) {
      // crud collection response
      return {
        data: data[itemsKey],
        total: data.total
      };

    } else if (Array.isArray(data)) {
      // accounting
      return {
        data: data.map((it, i) => ({ id: i, ...it })),
        total: data.length
      }
    } else {
      throw new Error('unsupported list response', typeof data);
    }
  }
}

/*
 * setLoloHeaders
 */

const setLoloHeaders = async opts => {
  const user = await userManager.getUser();
  const token = user.id_token;
  const accountId = localStorage.getItem('accountId');

  if (!opts.headers) {
    opts.headers = new Headers();
  }

  opts.headers.set('authorization', token);

  if (accountId) {
    opts.headers.set('lolo-account-id', accountId);
  }
}

const dataProvider = (baseUrl, opts) => {
  return new LoloDataProvider(baseUrl, opts);
};

export default dataProvider;
