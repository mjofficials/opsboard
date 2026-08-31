"use client";

import * as React from "react";
import { useController, type FieldValues } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField, type FormFieldProps } from "../FormField";

export interface AppCheckboxProps<T extends FieldValues>
    extends Omit<FormFieldProps<T>, "children"> {
    // We can add specific checkbox props here if needed, like trailingLabel
}

/**
 * Radix Checkbox wrapper.
 * MUST use `useController` because Radix checkboxes use `aria-checked` and `data-state` 
 * internally instead of native `<input type="checkbox">` events, meaning `register` 
 * cannot correctly track their boolean state.
 */
export function AppCheckbox<T extends FieldValues>({
    name,
    label,
    description,
    required,
    className,
}: AppCheckboxProps<T>) {
    const { field } = useController<T>({ name });

    return (
        <FormField
            name={name}
            // We pass undefined string labels to FormField because Checkbox usually 
            // prefers a side-by-side layout, which we build custom here.
            label={undefined}
            description={description}
            required={required}
            className={className}
        >
            <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <Checkbox
                    checked={field.value as boolean}
                    onCheckedChange={field.onChange}
                />
                <div className="space-y-1 leading-none">
                    {/* Render the label manually here for proper flex alignment */}
                    <label
                        htmlFor={name}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        {label}
                        {required && <span className="text-destructive ml-1">*</span>}
                    </label>
                </div>
            </div>
        </FormField>
    );
}
