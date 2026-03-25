import * as React from "react";
import { useFormContext, type FieldValues } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField, type FormFieldProps } from "../FormField";

export interface AppInputProps<T extends FieldValues>
    extends Omit<React.ComponentProps<"input">, "name" | "type">,
    Omit<FormFieldProps<T>, "children"> {
        type?: React.ComponentProps<"input">["type"] | "textarea";
    }

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
    type,
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
            {type === "textarea" ? (
                <Textarea {...register(name)} {...(inputProps as React.ComponentProps<"textarea">)} />
            ) : (
                <Input type={type} {...register(name)} {...inputProps} />
            )}
        </FormField>
    );
}
