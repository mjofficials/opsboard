import * as React from "react";
import { useFormContext, type FieldValues } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { FormField, type FormFieldProps } from "../FormField";

export interface AppTextareaProps<T extends FieldValues>
    extends Omit<React.ComponentProps<"textarea">, "name">,
    Omit<FormFieldProps<T>, "children"> { }

/**
 * Native Textarea RHF wrapper.
 * Uncontrolled component via `register` for maximum performance on long typing sessions.
 */
export function AppTextarea<T extends FieldValues>({
    name,
    label,
    description,
    required,
    className,
    ...textareaProps
}: AppTextareaProps<T>) {
    const { register } = useFormContext<T>();

    return (
        <FormField
            name={name}
            label={label}
            description={description}
            required={required}
            className={className}
        >
            <Textarea {...register(name)} {...textareaProps} />
        </FormField>
    );
}
