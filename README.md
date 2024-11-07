# ra-lolo

[![npm version](https://img.shields.io/npm/v/@lolocompany/ra-lolo)](https://www.npmjs.com/package/@lolocompany/ra-lolo)

**ra-lolo** is a set of providers compatible with [react-admin](https://github.com/marmelab/react-admin), specifically designed to integrate with Amazon Cognito. It provides both an authentication provider and a data provider to enable seamless backend communication for applications using react-admin.

## Features

- **Authentication Provider**: Integrates with Amazon Cognito to handle user authentication via `oidc-client-ts`. Supports login, logout, and identity verification.
- **Data Provider**: A flexible data provider to handle API requests, compatible with react-admin standards.
- **React-Admin Integration**: Built to work out-of-the-box with react-admin, providing standard data fetching capabilities (CRUD operations).

## Installation

To install **ra-lolo** in your project, use npm or yarn:

```bash
npm install ra-lolo
```

or

```bash
yarn add ra-lolo
```

## Usage

### Setup LoloAdmin

```javascript

const apiUrl = 'YOUR_BACKEND_URL';

const options = {
  itemsKey: 'records',
  headers: {
    'X-Custom-Header': 'value'
  }
};

const App = () => (
  <LoloAdmin
    authProvider={authProvider()}
    dataProvider={dataProvider(apiUrl, options)}
  />
);

export default App;
```

## Configuration

- **Authentication Flow**: The authentication provider (`LoloAuthProvider`) uses the `oidc-client-ts` library to interact with Amazon Cognito, supporting login and logout flows.
- **API Communication**: The data provider (`LoloDataProvider`) uses RESTful API conventions to interact with backend endpoints, including pagination, filtering, sorting, and more.

### Data Provider Options

The `dataProvider` function accepts an optional second argument, `options`, which allows you to customize the behavior of the data provider:

- **`itemsKey`**: Specifies the key used to extract the list of items from the server response. This can either be a string or a function that takes the resource name and returns the key.
- **`headers`**: Custom headers that should be added to every request. You can add any additional headers needed by your API.

Example:

```javascript
const options = {
  itemsKey: 'records',
  headers: {
    'X-Custom-Header': 'value'
  }
};

const dataProviderInstance = dataProvider(apiUrl, options);
```

### UserManager Configuration

The `userManager` configuration includes:

- **`authority`**: The URL of your Amazon Cognito identity provider.
- **`client_id`**: Your Cognito app client ID.
- **`redirect_uri`**: The URL for redirecting after authentication (must be registered in the Cognito app settings).

You can modify these in the `userManager` instance located in `userManager.js`.

## Project Structure

```
ra-lolo/
  |- index.js
  |- authProvider.js
  |- dataProvider.js
  |- userManager.js
```

- **`index.js`**: Exports the main components of the package.
- **`authProvider.js`**: Contains `LoloAuthProvider` for handling authentication.
- **`dataProvider.js`**: Contains `LoloDataProvider` for API operations.
- **`userManager.js`**: Configures and exports the `UserManager` instance for handling authentication.

## License

This project is licensed under the ISC License. See the LICENSE file for details.

## Contributing

Contributions are welcome! Feel free to submit issues and pull requests to help improve this project.

## Acknowledgments

This project leverages [react-admin](https://github.com/marmelab/react-admin) and [oidc-client-ts](https://github.com/authts/oidc-client-ts). We appreciate the amazing work done by their respective communities.

## Contact

If you have any questions, suggestions, or issues, feel free to open an issue on [GitHub](https://github.com/your-username/ra-lolo).

---

We hope **ra-lolo** makes your journey with react-admin and Amazon Cognito easier and more efficient. Give it a try, and let us know how it works for you!

