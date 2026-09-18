'use client';

import { z } from 'zod';
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
import { PROJECT_STATUS_OPTIONS } from '../enums';

export const projectSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string(),
  status: z.enum(['ACTIVE', 'COMPLETED', 'ARCHIVED'] as const),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  initialData?: ProjectFormValues;
  onSubmit: (data: ProjectFormValues) => Promise<void>;
  onCancel?: () => void;
  title?: string;
  description?: string;
  submitText?: string;
  isReadOnly?: boolean;
}

export function ProjectForm({
  initialData,
  onSubmit,
  onCancel,
  title = 'Project Details',
  description = 'Enter the details for this project.',
  submitText = 'Submit Project',
  isReadOnly = false,
}: ProjectFormProps) {
  const handleCancel = () => onCancel?.();

  return (
    <Card className="border-0 shadow-sm dark:border-zinc-800 sm:border">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <AppForm<ProjectFormValues>
        schema={projectSchema}
        onSubmit={onSubmit}
        defaultValues={
          initialData || {
            title: '',
            description: '',
            status: 'ACTIVE',
          }
        }
      >
        <CardContent className="space-y-4">
          <AppInput
            name="title"
            label="Subject / Title"
            placeholder="E.g. New project"
            disabled={isReadOnly}
            required
          />

          <AppSelect
            name="status"
            label="Status"
            options={PROJECT_STATUS_OPTIONS}
            placeholder="Select Status"
            disabled={isReadOnly}
            required
          />

          <AppInput
            type="textarea"
            name="description"
            label="Detailed Description"
            placeholder="Please describe the project in detail..."
            disabled={isReadOnly}
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
