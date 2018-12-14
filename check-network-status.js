const https = require('https');
const pTimeout = require('p-timeout');
const URL = require('url');

const defaults = {
	timeout: 3000,
	url: null
};

const NETWORK_CHECK_URLS = [
	'https://google.com',
	// 'https://facebook.com',
	'https://example.com',
	// 'https://httpbin.org',
	'https://github.com',
	// 'https://microsoft.com'
	// 'https://ipinfo.io/ip',
	// 'https://ifconfig.co/json',
	'https://icanhazip.com/',
	'https://bot.whatismyipaddress.com/',
	'https://httpbin.org/get',
	// 'https://tnx.nl/ip',
	// 'https://extreme-ip-lookup.com/json'
];

const getRandomURL = () => {
	let max = NETWORK_CHECK_URLS.length - 1;
	let min = 0;
	let random = Math.floor(Math.random()*(max-min+1)+min);
	return NETWORK_CHECK_URLS[random];
}

const makeRequest = url => {
	return new Promise((resolve, reject)=> {
		let options = URL.parse(`${url}?_=${Date.now()}`);
		options.method = 'HEAD';
		let req = https.request(options, res => {
			console.log(res.statusCode);
			if(res.statusCode >= 200 && res.statusCode < 400) {
				resolve(true);
			} else {
				reject(new Error("Request Failed..."));
			}
		}).on('error', (e) => {
			console.error('error=>', e.message);
			reject(new Error("Request Failed..."));
		});
		req.end();
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
		try{
			var url = getRandomURL();
			console.log('URL:', url);
			await pTimeout(makeRequest(url), options.timeout);
			return true;
		} catch (e) {
			console.error('Error with URL:', url, e);
			return false;
		}
};

module.exports = {
	NETWORK_CHECK_URLS,
	makeRequest,
	parseOptions,
	checkNetworkStatus,
	getRandomURL
};
