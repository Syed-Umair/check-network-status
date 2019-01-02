const http = require('http');
const https = require('https');
const pTimeout = require('p-timeout');
const URL = require('url');

const defaults = {
	timeout: 3500,
	url: null
};

const NETWORK_CHECK_URL = "http://clients3.google.com/generate_204";

const makeRequest = (url) => {
	if(url) {
		return new Promise((resolve, reject)=> {
			let _request = http.request;
			let options = URL.parse(`${url}?_=${Date.now()}`);
			options.method = 'HEAD';
			if(options.protocol && options.protocol.includes('https')) {
				_request = https.request;
			}
			let req = _request(options, res => {
				console.log(`Response Status Code: ${res.statusCode}`);
				if(res.statusCode >= 200 && res.statusCode < 400) {
					resolve(true);
				} else {
					reject(new Error("Request Failed..."));
				}
			}).on('error', (e) => {
				console.error(`error=> ${e.message}`);
				reject(new Error("Request Failed..."));
			});
			req.end();
		});
	} else {
		throw new Error("Invalid Parameters");
	}
};

const checkReachability = async (url, timeout) => {
	if(url && timeout) {
		try {
			return await pTimeout(makeRequest(url), timeout, `Request Timed Out: ${url}`);
		} catch (e) {
			console.error(`Error with ${url}: ${e.message}`);
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
	let response = await checkReachability(NETWORK_CHECK_URL, options.timeout);
	if (!response && options.url) {
		response = await checkReachability(options.host, options.timeout);
	}
	return response;
};

module.exports = {
	makeRequest,
	checkReachability,
	checkNetworkStatus
};
