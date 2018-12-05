const got = require('got');
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
	return got(`${url}?_=${Date.now()}`).then(res =>{
		if(res.statusCode >= 200 && res.statusCode < 300 || res.statusCode === 304) {
			return true;
		} else {
			Promise.reject();
		}
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
