import { fetchStrapiList, fetchStrapiSingle, getImageUrl } from '@/lib/api';

describe('lib/api', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    (global.fetch as jest.Mock) = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('fetchStrapiList', () => {
    it('should return data array when API responds 200', async () => {
      const mockData = [
        { id: 1, attributes: { titre: 'Projet A' } },
        { id: 2, attributes: { titre: 'Projet B' } },
      ];
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockData }),
      });

      const result = await fetchStrapiList('projets');
      expect(result).toEqual(mockData);
    });

    it('should return null when API responds 404', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const result = await fetchStrapiList('projets');
      expect(result).toBeNull();
    });

    it('should return null when fetch throws', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await fetchStrapiList('projets');
      expect(result).toBeNull();
    });
  });

  describe('fetchStrapiSingle', () => {
    it('should return first item from array', async () => {
      const mockData = [{ id: 1, attributes: { titre: 'Projet A' } }];
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockData }),
      });

      const result = await fetchStrapiSingle('projets');
      expect(result).toEqual(mockData[0]);
    });

    it('should return null when no data', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [] }),
      });

      const result = await fetchStrapiSingle('projets');
      expect(result).toBeNull();
    });
  });

  describe('getImageUrl', () => {
    it('should return full URL when path is relative', () => {
      const image = { url: '/uploads/photo.jpg' };
      const result = getImageUrl(image as unknown as { url: string });
      expect(result).toContain('/uploads/photo.jpg');
    });

    it('should return URL as-is when absolute', () => {
      const image = { url: 'https://cdn.example.com/photo.jpg' };
      const result = getImageUrl(image as unknown as { url: string });
      expect(result).toBe('https://cdn.example.com/photo.jpg');
    });

    it('should return null when no image', () => {
      const result = getImageUrl(null);
      expect(result).toBeNull();
    });
  });
});
