const got = require('got');
const pAny = require('p-any');
const pTimeout = require('p-timeout');

const defaults = {
	timeout: 5000
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

function makeRequest(url) {
	return got(url).then(res => res.statusCode === 200 || Promise.reject());
}

module.exports = options => {
	options = Object.assign({}, defaults, options);
	const requestArray = pAny(NETWORK_CHECK_URLS.map(url => makeRequest(url)));
	return pTimeout(requestArray, options.timeout).catch(() => false);
};
