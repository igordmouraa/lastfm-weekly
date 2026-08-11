import '@testing-library/jest-dom/vitest';
import { beforeAll, afterEach, afterAll, vi } from 'vitest';
import { server } from './mocks/handlers';

vi.mock('next/cache', () => ({
    unstable_cache: <T extends (...args: never[]) => unknown>(fn: T) => fn,
}));

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
