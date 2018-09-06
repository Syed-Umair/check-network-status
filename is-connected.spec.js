const isConnected = require('./is-connected');

describe('Test for is-connected Module', ()=>{

	test('Default Call', async () => {
		expect(await isConnected()).toBeTruthy();
	});

	test('Call with timeout option', async () => {
		expect(await isConnected({timeout: 500})).toBeTruthy();
	});

	test('Call with invalid timeout option', async () => {
		expect(await isConnected({timeout: 1})).toBeFalsy();
	});

});