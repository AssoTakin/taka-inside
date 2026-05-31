import '@testing-library/jest-dom';

// Mock global fetch pour les tests (Strapi)
global.fetch = jest.fn();

// Mock next/navigation
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() { return null; }
  disconnect() { return null; }
  unobserve() { return null; }
};
