const {
  makeRequest,
  checkReachability,
  checkNetworkStatus,
  getNetworkCheckURL
} = require('./check-network-status');
require('jest-fetch-mock').enableMocks();


describe('check-network-status module', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  describe('getNetworkCheckURL', () => {
    it('should return a valid Cloudflare DNS URL', () => {
      const url = getNetworkCheckURL('example.com');
      expect(url).toMatch(/^https:\/\/cloudflare-dns\.com\/dns-query\?name=example\.com&type=A&_=\d+$/);
    });

    it('should throw error on invalid domain', () => {
      expect(() => getNetworkCheckURL('')).toThrow('Invalid pingDomain parameter');
      expect(() => getNetworkCheckURL(null)).toThrow('Invalid pingDomain parameter');
    });
  });

  describe('makeRequest', () => {
    it('should return true on successful fetch', async () => {
      fetch.mockResponseOnce('', { status: 200 });
      const result = await makeRequest('https://example.com', 1000, 'GET');
      expect(result).toBe(true);
    });

    it('should return false on non-2xx response', async () => {
      fetch.mockResponseOnce('', { status: 500 });
      const result = await makeRequest('https://example.com', 1000, 'GET');
      expect(result).toBe(false);
    });

    it('should return false on fetch error (e.g., timeout)', async () => {
      fetch.mockReject(new Error('Network failure'));
      const result = await makeRequest('https://example.com', 1000, 'GET');
      expect(result).toBe(false);
    });

    it('should throw on missing parameters', async () => {
      await expect(makeRequest()).rejects.toThrow('Invalid Parameters');
    });
  });

  describe('checkReachability', () => {
    it('should delegate to makeRequest and return result', async () => {
      fetch.mockResponseOnce('', { status: 200 });
      const result = await checkReachability('https://example.com', 1000, 'GET');
      expect(result).toBe(true);
    });
  });

  describe('checkNetworkStatus', () => {
    it('should return true if primary DNS check succeeds', async () => {
      fetch.mockResponseOnce('', { status: 200 });
      const result = await checkNetworkStatus();
      expect(result).toBe(true);
    });

    it('should fallback to backup URL if primary fails', async () => {
      fetch
        .mockRejectOnce(new Error('Primary fail')) // Primary fails
        .mockResponseOnce('', { status: 200 });     // Backup succeeds

      const result = await checkNetworkStatus({
        backUpURL: 'https://backup.com'
      });

      expect(result).toBe(true);
      expect(fetch.mock.calls[0][0]).toContain('cloudflare-dns.com');
      expect(fetch.mock.calls[1][0]).toBe('https://backup.com');
    });

    it('should return false if both primary and backup fail', async () => {
      fetch
        .mockRejectOnce(new Error('Primary fail'))
        .mockRejectOnce(new Error('Backup fail'));

      const result = await checkNetworkStatus({
        backUpURL: 'https://backup.com'
      });

      expect(result).toBe(false);
    });
  });
});
