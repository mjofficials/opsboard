import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { tenantAls } from '../common/als/tenant.als.js';

export const extendedPrismaClient = (client: PrismaClient) => {
  return client.$extends({
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          const context = tenantAls.getStore();
          const tenantId = context?.tenantId;
          const tenantModels = ['Project', 'Ticket'];

          if (tenantId && tenantModels.includes(model)) {
            // Scope queries to the active tenant
            const readAndWriteOps = ['findMany', 'findFirst', 'count', 'updateMany', 'deleteMany'];
            const singleOps = ['findUnique', 'findUniqueOrThrow', 'update', 'delete'];

            if (readAndWriteOps.includes(operation) || singleOps.includes(operation)) {
              const anyArgs = args as any;
              anyArgs.where = { ...(anyArgs.where || {}), organizationId: tenantId };
            }
            
            if (operation === 'create' || operation === 'createMany') {
              const anyArgs = args as any;
              if (anyArgs.data) {
                if (Array.isArray(anyArgs.data)) {
                  anyArgs.data = anyArgs.data.map((d: any) => ({ ...d, organizationId: tenantId }));
                } else {
                  anyArgs.data = { ...(anyArgs.data as any), organizationId: tenantId };
                }
              }
            }
          }
          return query(args);
        },
      },
    },
  });
};

export type ExtendedPrismaClient = ReturnType<typeof extendedPrismaClient>;

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly _client: ExtendedPrismaClient;

  constructor() {
    const connectionString = process.env.DATABASE_URL;
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    super({ adapter });
    this._client = extendedPrismaClient(this);
  }

  get client() {
    return this._client;
  }

  async onModuleInit() {
    await this.$connect();
  }
}
