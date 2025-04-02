import { PrismaClient } from '@prisma/client';
import { mockDeep } from 'jest-mock-extended';


jest.mock('@prisma/client', () => {
  const mockPrisma = {
    post: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create:
       jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    },
    comment: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    },
    like: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn()
    },
    user: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn()
    },
    $transaction: jest.fn(),
    $disconnect: jest.fn()
  };
  
  return {
    PrismaClient: jest.fn(() => mockPrisma)
  };
});

beforeAll(() => {
  console.error = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});