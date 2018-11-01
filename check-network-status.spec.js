const {
	checkNetworkStatus,
	makeRequest,
	parseOptions
} = require('./check-network-status');

describe('Test for check-network-status Module', () => {

	test('makeRequest Method with valid URL', async () => {
		expect(await makeRequest('https://google.com')).toBeTruthy();
	});

	test('makeRequest Method with invalid URL', async () => {
		await expect(makeRequest('https://google.com/test/1/2/3')).rejects.toThrow();
	});

	test('parseOptions method without options', () => {
		expect(parseOptions()).toEqual({
			timeout: 4500,
			url: null
		});
	});

	test('parseOptions method with options', () => {
		expect(parseOptions({
			timeout: 4000,
			url: 'https://test.com'
		})).toEqual({
			timeout: 4000,
			url: 'https://test.com'
		});
	});

	test('Default Call', async () => {
		expect(await checkNetworkStatus()).toBeTruthy();
	});

	test('Call with timeout option', async () => {
		expect(await checkNetworkStatus({
			timeout: 500
		})).toBeTruthy();
	});

	test('Call with invalid timeout option', async () => {
		expect(await checkNetworkStatus({
			timeout: 1
		})).toBeFalsy();
	});

	test('Call with customURL', async () => {
		expect(await checkNetworkStatus({
			url: 'https://syedumair.ml'
		})).toBeTruthy();
		let urls = require('./check-network-status').NETWORK_CHECK_URLS;
		expect(urls[urls.length - 1]).toBe('https://syedumair.ml');
	});
});