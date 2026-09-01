import { AsyncLocalStorage } from 'async_hooks';

export interface TenantContext {
  tenantId: string | null;
}

export const tenantAls = new AsyncLocalStorage<TenantContext>();
