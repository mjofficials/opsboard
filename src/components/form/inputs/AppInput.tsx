import * as React from "react";
import { useFormContext, type FieldValues } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FormField, type FormFieldProps } from "../FormField";

export interface AppInputProps<T extends FieldValues>
    extends Omit<React.ComponentProps<"input">, "name">,
    Omit<FormFieldProps<T>, "children"> { }

/**
 * Standard native text input RHF wrapper.
 * Uses `register` internally since native inputs shouldn't incur the React re-render 
 * overhead of controlled components (`useController`). 
 */
export function AppInput<T extends FieldValues>({
    name,
    label,
    description,
    required,
    className,
    ...inputProps
}: AppInputProps<T>) {
    const { register } = useFormContext<T>();

    return (
        <FormField
            name={name}
            label={label}
            description={description}
            required={required}
            className={className}
        >
            <Input {...register(name)} {...inputProps} />
        </FormField>
    );
}
