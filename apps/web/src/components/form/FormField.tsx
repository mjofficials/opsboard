import * as React from "react";
import { useFormContext, type FieldValues } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { BaseFieldProps } from "./types";

export interface FormFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
    children: React.ReactNode;
    required?: boolean;
}

/**
 * The core layout component bridging React Hook Form errors with our UI.
 * Purely structural. Does NOT handle native field events (value/onChange) - 
 * that is the job of the specific `AppInput` / `AppSelect` variants.
 */
export function FormField<T extends FieldValues>({
    name,
    label,
    description,
    required,
    className,
    children,
}: FormFieldProps<T>) {
    // Pull error states directly from Context, dodging immense prop drilling.
    const { formState } = useFormContext<T>();
    const error = formState.errors[name];

    const hasError = !!error;
    const descriptionId = `${name}-description`;
    const errorId = `${name}-error`;

    return (
        <div className={cn("space-y-2", className)}>
            {label && (
                <Label
                    htmlFor={name}
                    className={cn(hasError && "text-destructive")}
                >
                    {label}
                    {required && <span className="text-destructive ml-1">*</span>}
                </Label>
            )}

            {/* Cloned child injection points let us set ARIA globally without boilerplate */}
            <div className="relative">
                {React.Children.map(children, (child) => {
                    if (!React.isValidElement(child)) return child;

                    const childElement = child as React.ReactElement<any>;

                    return React.cloneElement(childElement, {
                        ...childElement.props,
                        id: name,
                        "aria-invalid": hasError ? "true" : "false",
                        "aria-describedby":
                            !hasError && description
                                ? descriptionId
                                : hasError
                                    ? errorId
                                    : undefined,
                    });
                })}
            </div>

            {description && !hasError && (
                <p
                    id={descriptionId}
                    className="text-[0.8rem] text-muted-foreground"
                >
                    {description}
                </p>
            )}

            {hasError && (
                <p
                    id={errorId}
                    className="text-[0.8rem] font-medium text-destructive"
                >
                    {error?.message as string}
                </p>
            )}
        </div>
    );
}
