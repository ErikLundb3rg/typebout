import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';

import db from './client';

jest.mock('./client', () => ({
  __esModule: true,

  default: mockDeep<PrismaClient>()
}));

export const prismaMock = db as unknown as DeepMockProxy<PrismaClient>;

beforeEach(() => {
  mockReset(prismaMock);
});
