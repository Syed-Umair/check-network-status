const {
	checkNetworkStatus,
	makeRequest,
	checkReachability,
	getNetworkCheckURL
} = require('./check-network-status');

describe('Test for check-network-status Module', () => {

	test('getNetworkCheckURL method without parameter', () => {
		expect(getNetworkCheckURL).toThrowError();
	})

	test('getNetworkCheckURL method with invalid parameter', () => {
		expect(getNetworkCheckURL.bind(null,1234567)).toThrowError();
	})

	test('getNetworkCheckURL method with valid pingDomain', () => {
		expect(getNetworkCheckURL('github.com')
			.includes('https://cloudflare-dns.com/dns-query?name=github.com&type=A')
		).toBeTruthy();
	})

	test('makeRequest method without parameters', () => {
        expect(makeRequest).toThrowError();
	});

	test('makeRequest Method with valid URL', async () => {
		expect(await makeRequest('https://google.com', 4500, 'HEAD')).toBeTruthy();
	});

	test('makeRequest Method with invalid URL', async () => {
		await expect(makeRequest('https://google.com/test/1/2/3', 4500, 'HEAD')).rejects.toThrow();
	});

	test('checkReachability method without parameters', () => {
        expect(checkReachability).rejects;
    });

    test('checkReachability method with valid parameters', async () => {
        expect(await checkReachability('https://google.com', 2000, 'HEAD')).toBeTruthy();
    });

	test('Default Call', async () => {
		expect(await checkNetworkStatus()).toBeTruthy();
	});

	test('Call with valid options', async () => {
		expect(await checkNetworkStatus({
			backUpURL: 'https://syed-umair.github.io',
			pingDomain: 'github.com',
			timeout: 2000
		})).toBeTruthy();
	});

	test('Call with invalid timeout option', async () => {
		expect(await checkNetworkStatus({
			timeout: 1
		})).toBeFalsy();
	});

});