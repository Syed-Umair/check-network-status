const debug = require('debug')('check-network-status');

const defaults = {
  timeout: 4500,
  backUpURL: null,
  pingDomain: 'google.com',
  method: 'GET'
};

const getNetworkCheckURL = (pingDomain) => {
  if (typeof pingDomain === 'string' && pingDomain.trim()) {
    return `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(pingDomain)}&type=A&_=${Date.now()}`;
  } else {
    throw new Error("Invalid pingDomain parameter");
  }
};

const makeRequest = async (url, timeout = 4500, method = 'GET') => {
  if (!url || !timeout || !method) throw new Error("Invalid Parameters");

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const headers = {
      'Cache-Control': 'no-cache'
    };

    if (url.includes('cloudflare-dns.com/dns-query')) {
      headers['Accept'] = 'application/dns-json';
      headers['Content-Type'] = 'application/dns-json';

    }

    const response = await fetch(url, {
      method: 'GET',
      headers,
      signal: controller.signal
    });

    debug(`Response Status Code: ${response.status}`);
    if (response.ok) {
      return true;
    } else {
      throw new Error(`Request failed with status ${response.status}`);
    }

  } catch (err) {
    debug(`Error for URL ${url}: ${err.message}`);
    return false;
  } finally {
    clearTimeout(timeoutId);
  }
};

const checkReachability = async (url, timeout, method) => {
  return await makeRequest(url, timeout, method);
};

const checkNetworkStatus = async (options = {}) => {
  options = { ...defaults, ...options };

  const checkURL = getNetworkCheckURL(options.pingDomain);
  let isReachable = await checkReachability(checkURL, options.timeout, options.method);

  if (!isReachable && options.backUpURL) {
    isReachable = await checkReachability(options.backUpURL, options.timeout, options.method);
  }

  return isReachable;
};

module.exports = {
  makeRequest,
  checkReachability,
  checkNetworkStatus,
  getNetworkCheckURL
};