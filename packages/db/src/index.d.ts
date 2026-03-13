import { PrismaClient as RuntimePrismaClient } from "@prisma/client";

// JS 구현 파일(index.js)을 TypeScript에서 타입 안전하게 읽을 수 있도록
// 별도 d.ts 파일로 노출 타입을 적어둔다.
export type PrismaClient = RuntimePrismaClient;

export declare const createPrismaClient: (databaseUrl: string) => RuntimePrismaClient;

export { RuntimePrismaClient as PrismaClient };
