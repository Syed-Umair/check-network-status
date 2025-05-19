const debug = require('debug')('check-network-status');

const defaults = {
  timeout: 3350,
  backUpURL: null,
  pingDomain: 'google.com',
  method: 'GET'
};

const getNetworkCheckURL = (pingDomain) => {
  if (typeof pingDomain !== 'string' || !pingDomain.trim()) {
    throw new Error("Invalid pingDomain parameter");
  }

  return `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(pingDomain)}&type=A&_=${Date.now()}`;
};

const makeRequest = async (url, timeout = defaults.timeout, method = defaults.method) => {
  if (!url) throw new Error("URL is required");

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const headers = {
      'Cache-Control': 'no-cache',
      ...(url.includes('cloudflare-dns.com/dns-query') && {
        'Accept': 'application/dns-json',
        'Content-Type': 'application/dns-json'
      })
    };

    const response = await fetch(url, {
      method,
      headers,
      signal: controller.signal
    });

    debug(`Response Status Code: ${response.status}`);
    return response?.ok ? true : false;

  } catch (err) {
    debug(`Error for URL ${url}: ${err.message}`);
    return false;
  } finally {
    clearTimeout(timeoutId);
  }
};

const checkReachability = (url, timeout, method) => makeRequest(url, timeout, method);

const checkNetworkStatus = async (options = {}) => {
  const config = { ...defaults, ...options };

  const primaryURL = getNetworkCheckURL(config.pingDomain);
  let reachable = await checkReachability(primaryURL, config.timeout, config.method);

  if (!reachable && config.backUpURL) {
    reachable = await checkReachability(config.backUpURL, config.timeout, config.method);
  }

  return reachable;
};

module.exports = {
  makeRequest,
  checkReachability,
  checkNetworkStatus,
  getNetworkCheckURL
};
