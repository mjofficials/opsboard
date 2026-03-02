"use client";

import * as React from "react";
import { useController, type FieldValues } from "react-hook-form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { FormField, type FormFieldProps } from "../FormField";

export interface AppSelectProps<T extends FieldValues>
    extends Omit<FormFieldProps<T>, "children"> {
    options: { label: string; value: string }[];
    placeholder?: string;
}

/**
 * Radix Select wrapper. 
 * MUST use `useController` because Radix primitives are fully custom DOM structures
 * that don't emit native synthetic change events that `register` can catch.
 */
export function AppSelect<T extends FieldValues>({
    name,
    label,
    description,
    required,
    className,
    options,
    placeholder,
}: AppSelectProps<T>) {
    // using useController enforces strict controlled-component sync
    // bridging React Hook Form state directly to Radix's value/onValueChange
    const { field } = useController<T>({ name });

    return (
        <FormField
            name={name}
            label={label}
            description={description}
            required={required}
            className={className}
        >
            <Select onValueChange={field.onChange} defaultValue={field.value as string}>
                <SelectTrigger>
                    {/* The clone element logic in FormField relies on this wrapper forwarding `id` and `aria-*` props down implicitly if we spread. 
                         However, SelectTrigger natively grabs the props properly from context in modern Shadcn/Radix. */}
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </FormField>
    );
}
