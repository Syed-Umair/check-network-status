const https = require('https');
const pTimeout = require('p-timeout');

const defaults = {
	timeout: 4500,
	url: null
};

const NETWORK_CHECK_URLS = [
	'https://ipinfo.io/ip',
	'https://ifconfig.co/json',
	'https://icanhazip.com/',
	'https://bot.whatismyipaddress.com/',
	'https://httpbin.org/ip',
	'https://tnx.nl/ip',
	'https://extreme-ip-lookup.com/json'
];

const makeRequest = url => {
	return new Promise((resolve, reject)=> {
		https.get(`${url}?_=${Date.now()}`, res => {
			if(res.statusCode >= 200 && res.statusCode < 400) {
				resolve(true);
			} else {
				reject(new Error("Request Failed..."));
			}
		}).on('error', (e) => {
			reject(new Error("Request Failed..."));
		});
	});
};

const parseOptions = options => {
	let opts = {
		...defaults,
		...options
	};
	if (opts.url && typeof opts.url === 'string') {
		NETWORK_CHECK_URLS.push(opts.url);
	}
	return opts;
};

const checkNetworkStatus = async (options) => {
	options = parseOptions(options);
	for (let url of NETWORK_CHECK_URLS) {
		try{
			// console.log('URL:', url);
			await pTimeout(makeRequest(url), options.timeout);
			return true;
		} catch (e) {
			// console.error('Error with URL:', url, e);
			continue;
		}
	}
	return false;
};

module.exports = {
	NETWORK_CHECK_URLS,
	makeRequest,
	parseOptions,
	checkNetworkStatus
};
