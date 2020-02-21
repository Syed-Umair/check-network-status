const http = require('http');
const https = require('https');
const URL = require('url');
const debug = require('debug')('check-network-status');

const defaults = {
	timeout: 4500,
	backUpURL: null,
	pingDomain: 'google.com',
	method: 'GET'
};

const getNetworkCheckURL = (pingDomain) => {
	if(pingDomain && typeof pingDomain === 'string') {
		return `https://cloudflare-dns.com/dns-query?name=${pingDomain}&type=A&_=${Date.now()}`
	} else {
		throw new Error("Invalid Parameters");
	}
};

const makeRequest = (url, timeout, method) => {
	if(url && timeout && method) {
		return new Promise((resolve, reject)=> {

			setTimeout(() => {
				req && req.abort && req.abort();
				reject(new Error(`Request Timed out ${timeout}ms`));
			}, timeout)


			let _request = http.request;
			let options = URL.parse(url);

			if(options.protocol && options.protocol.includes('https')) {
				_request = https.request;
			}

			options.headers = {
				'Cache-Control':'no-cache'
			}

			options.method = method;

			if (url.includes('https://cloudflare-dns.com/dns-query')) {
				options.headers = {
					...options.headers,
					accept: 'application/dns-json',
				}
			}

			var req = _request(options, res => {
				debug(`Response Status Code: ${res.statusCode}`);
				if(res.statusCode >= 200 && res.statusCode < 400) {
					resolve(true);
				} else {
					reject(new Error("Request Failed..."));
				}
			}).on('error', (e) => {
				debug(`error=> ${e.message}`);
				console.error(`error=> ${e.message}`);
				reject(new Error("Request Failed..."));
			});

			req.end();

		});
	} else {
		throw new Error("Invalid Parameters");
	}
};

const checkReachability = async (url, timeout, method) => {
	if(url && timeout && method) {
		try {
			return await makeRequest(url, timeout, method);
		} catch (e) {
			debug(`Error with ${url}: ${e.message}`);
			return false;
		}
	} else {
		throw new Error("Invalid Parameters");
	}
}

const checkNetworkStatus = async (options) => {
	options = {
		...defaults,
		...options
	};

	const NETWORK_CHECK_URL = getNetworkCheckURL(options.pingDomain);

	let response = await checkReachability(NETWORK_CHECK_URL, options.timeout, defaults.method);
	if (!response && options.backUpURL) {
		response = await checkReachability(options.backUpURL, options.timeout, options.method);
	}
	return response;
};

module.exports = {
	makeRequest,
	checkReachability,
	checkNetworkStatus,
	getNetworkCheckURL
};
