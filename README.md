[![Build Status](https://travis-ci.org/Syed-Umair/check-network-status.svg?branch=master)](https://travis-ci.org/Syed-Umair/check-network-status)
[![GitHub license](https://img.shields.io/github/license/Syed-Umair/check-network-status.svg)](https://github.com/Syed-Umair/check-network-status/blob/master/LICENSE)
[![Twitter](https://img.shields.io/twitter/url/https/github.com/Syed-Umair/check-network-status.svg?style=social)](https://twitter.com/intent/tweet?text=Wow:&url=https%3A%2F%2Fgithub.com%2FSyed-Umair%2Fcheck-network-status)

# check-network-status
A Node.js Module to check whether you are connected to network or not. Returns a promise resolves to <em>true</em> with network access and to <em>false</em> without network access.

## Install Module
```
    npm install check-network-status
```

<strong>Note: <i>Requires Node >= 8.0.0</i></strong>

## Usage

With Default Options

```javascript
{
    timeout: 4500,
    backUpURL: null,
    pingDomain: 'google.com',
    method: 'GET'
}
```

```javascript
    const { checkNetworkStatus } = require('check-network-status');
    checkNetworkStatus().then(value => console.log(value));
    // prints 'true' or 'false' depending on networking connectivity
```

With Options

- timeout: <i>milliseconds</i>
- url: <i>string with protocol</i>

```javascript
    const { checkNetworkStatus } = require('check-network-status');
    checkNetworkStatus({
        timeout: 3000,
        backUpURL: 'https://example.com',
        pingDomain: 'github.com',
        method: 'GET'
    }).then(value => console.log(value));
    // prints 'true' or 'false' depending on networking connectivity
```

## ChangeLog
v1.2.0 -> v1.2.3 includes following changes
- fixes unhandled timeout error
- stopped printing debug logs
------
v1.1.3 -> v1.2.0 breaking changes include

Renamed option `url` to `backUpURL`

Added option `method` that accepts HTTP methods to be used while requesting `backUpURL`. It defaults to `GET`.

We updated the network check API to [cloudflare DNS query API](https://developers.cloudflare.com/1.1.1.1/dns-over-https/request-structure/), you need to pass the pingDomain option if you don't want to use default value google.com
