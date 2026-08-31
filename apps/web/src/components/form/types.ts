import type { DefaultValues, FieldValues, Path, UseFormReturn, SubmitHandler } from "react-hook-form";
import type { z } from "zod";

/**
 * Defines the props for the core AppForm component.
 * Strongly types the form based on a Zod schema.
 */
export interface AppFormProps<T extends FieldValues> {
    schema: z.ZodType<T, T>;
    onSubmit: SubmitHandler<T>;
    defaultValues?: DefaultValues<T>;
    children: ((methods: UseFormReturn<T>) => React.ReactNode) | React.ReactNode;
    className?: string;
    id?: string;
}

/**
 * Common field attributes that bridge RHF to UI components.
 * Enforces that `name` must be a valid path in the form's schema type.
 */
export interface BaseFieldProps<T extends FieldValues> {
    name: Path<T>;
    label?: string;
    description?: string;
    className?: string;
}
