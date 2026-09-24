'use client';

import { AppForm } from '@/components/form/AppForm';
import { AppInput } from '@/components/form/inputs/AppInput';
import { AppSelect } from '@/components/form/inputs/AppSelect';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { z } from 'zod';
import { USER_ROLE_OPTIONS, USER_STATUS_OPTIONS } from '../enums';

export const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.string(),
  status: z.enum(['ACTIVE', 'INACTIVE'] as const),
});

export type UserFormValues = z.infer<typeof userSchema>;

interface UserFormProps {
  initialData?: UserFormValues;
  onSubmit: (data: UserFormValues) => Promise<void>;
  onCancel?: () => void;
  title?: string;
  description?: string;
  submitText?: string;
  isReadOnly?: boolean;
}

export function UserForm({
  initialData,
  onSubmit,
  onCancel,
  title = 'User Details',
  description = 'Enter the details for this user.',
  submitText = 'Submit User',
  isReadOnly = false,
}: UserFormProps) {
  const handleCancel = () => onCancel?.();

  return (
    <Card className="border-0 shadow-sm dark:border-zinc-800 sm:border">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <AppForm<UserFormValues>
        schema={userSchema}
        onSubmit={onSubmit}
        defaultValues={
          initialData || {
            name: '',
            email: '',
            role: 'ADMIN',
            status: 'ACTIVE',
          }
        }
      >
        <CardContent className="space-y-4">
          <AppInput
            name="name"
            label="Name"
            placeholder="E.g. John Doe"
            disabled={isReadOnly}
            required
          />

          <AppInput
            type="email"
            name="email"
            label="Email Address"
            placeholder="E.g. john@example.com"
            disabled={isReadOnly}
            required
          />

          <AppSelect
            name="role"
            label="Role"
            options={USER_ROLE_OPTIONS}
            placeholder="Select Role"
            disabled={isReadOnly}
            required
          />

          <AppSelect
            name="status"
            label="Status"
            options={USER_STATUS_OPTIONS}
            placeholder="Select Status"
            disabled={isReadOnly}
            required
          />
        </CardContent>
        <CardFooter className="flex justify-end mt-5">
          <Button
            type="button"
            variant={isReadOnly ? 'default' : 'outline'}
            className={isReadOnly ? '' : 'mr-4'}
            onClick={handleCancel}
          >
            {isReadOnly ? 'Close' : 'Cancel'}
          </Button>
          {!isReadOnly && <Button type="submit">{submitText}</Button>}
        </CardFooter>
      </AppForm>
    </Card>
  );
}
