# is-Connected
A Node.js Module to check whether you are connected to network or not. Returns a promise resolves to <em>true</em> with network access and to <em>false</em> without network access.

## Install Module
```
    npm install is-Connected
```

## Usage

With Default Options

```javascript
    const { isConnected } = require('is-connected');
    isConnected().then(value => console.log(value));
    // prints 'true' or 'false' depending on networking connectivity
```

With Options

- timeout: <i>milliseconds</i>
- url: <i>string with protocol</i>

```javascript
    const { isConnected } = require('is-connected');
    isConnected({
        timeout: 3000,
        url: 'https://example.com'
    }).then(value => console.log(value));
    // prints 'true' or 'false' depending on networking connectivity
```