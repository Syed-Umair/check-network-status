const got = require('got');
const pAny = require('p-any');
const pTimeout = require('p-timeout');

const defaults = {
	timeout: 5000,
	url: null
};

const NETWORK_CHECK_URLS = [
	'https://ifconfig.co/json',
	'https://httpbin.org/ip',
	'https://bot.whatismyipaddress.com/',
	'https://icanhazip.com/',
	'https://ipinfo.io/ip',
	'https://tnx.nl/ip',
	'https://extreme-ip-lookup.com/json',
	'https://nyxi.eu/ip/'
];

const makeRequest = url => {
	return got(`${url}?_=${Date.now()}`).then(res => res.statusCode === 200 || Promise.reject());
};

const parseOptions = options => {
	let opts = Object.assign({}, defaults, options);
	if (opts.url && typeof opts.url === 'string') {
		NETWORK_CHECK_URLS.push(opts.url);
	}
	return opts;
};

const isConnected = options => {
	options = parseOptions(options);
	const requestArray = pAny(NETWORK_CHECK_URLS.map(url => makeRequest(url)));
	return pTimeout(requestArray, options.timeout).catch(() => false);
};

module.exports = {
	NETWORK_CHECK_URLS,
	makeRequest,
	parseOptions,
	isConnected
};
