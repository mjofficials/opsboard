"use client";

import * as React from "react";
import { useForm, FormProvider, type FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AppFormProps } from "./types";

export function AppForm<T extends FieldValues>({
    schema,
    defaultValues,
    onSubmit,
    children,
    className,
    id,
}: AppFormProps<T>) {
    // Initialize generic form with strict Zod inference
    const methods = useForm<T>({
        resolver: zodResolver(schema),
        defaultValues,
        mode: "onTouched", // Trigger validation when a field loses focus for better UX
    });

    return (
        <FormProvider {...methods}>
            <form
                id={id}
                onSubmit={methods.handleSubmit(onSubmit)}
                className={className}
                noValidate
            >
                {typeof children === "function" ? children(methods) : children}
            </form>
        </FormProvider>
    );
}
