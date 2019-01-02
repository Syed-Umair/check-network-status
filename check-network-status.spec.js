const {
	checkNetworkStatus,
	makeRequest,
	checkReachability
} = require('./check-network-status');

describe('Test for check-network-status Module', () => {


	test('makeRequest method without parameters', () => {
        expect(makeRequest).toThrowError();
	});

	test('makeRequest Method with valid URL', async () => {
		expect(await makeRequest('https://google.com', 4500)).toBeTruthy();
	});

	test('makeRequest Method with invalid URL', async () => {
		await expect(makeRequest('https://google.com/test/1/2/3', 4500)).rejects.toThrow();
	});

	test('checkReachability method without parameters', () => {
        expect(checkReachability).rejects;
    });

    test('checkReachability method with valid parameters', async () => {
        expect(await checkReachability('https://google.com', 2000)).toBeTruthy();
    });

	test('Default Call', async () => {
		expect(await checkNetworkStatus()).toBeTruthy();
	});

	test('Call with valid options', async () => {
		expect(await checkNetworkStatus({
			url: 'https://syed-umair.github.io',
			timeout: 2000
		})).toBeTruthy();
	});

	test('Call with invalid timeout option', async () => {
		expect(await checkNetworkStatus({
			timeout: 1
		})).toBeFalsy();
	});

});