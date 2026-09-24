import { UserStatus } from './types';

export const USER_STATUS_OPTIONS: { label: string; value: UserStatus }[] = [
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Inactive', value: 'INACTIVE' },
];

export const USER_ROLE_OPTIONS: { label: string; value: string }[] = [
  { label: 'Owner', value: 'OWNER' },
  { label: 'Admin', value: 'ADMIN' },
  { label: 'Member', value: 'MEMBER' },
  { label: 'Viewer', value: 'VIEWER' },
];
