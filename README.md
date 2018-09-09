[![Build Status](https://travis-ci.org/Syed-Umair/is-Connected.svg?branch=master)](https://travis-ci.org/Syed-Umair/is-Connected)
[![GitHub license](https://img.shields.io/github/license/Syed-Umair/is-Connected.svg)](https://github.com/Syed-Umair/is-Connected/blob/master/LICENSE)
[![Twitter](https://img.shields.io/twitter/url/https/github.com/Syed-Umair/is-Connected.svg?style=social)](https://twitter.com/intent/tweet?text=Wow:&url=https%3A%2F%2Fgithub.com%2FSyed-Umair%2Fis-Connected)

# is-Connected
A Node.js Module to check whether you are connected to network or not. Returns a promise resolves to <em>true</em> with network access and to <em>false</em> without network access.

## Install Module
```
    npm install is-Connected
```

<strong>Note: <i>Requires Node >= 8.0.0</i></strong>

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