"use client";

import * as React from "react";
import type { FieldValues, Path } from "react-hook-form";
import { AppInput } from "../inputs/AppInput";
import { AppTextarea } from "../inputs/AppTextarea";
import { AppSelect } from "../inputs/AppSelect";
import { AppCheckbox } from "../inputs/AppCheckbox";

export type FormFieldConfig<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  description?: string;
  required?: boolean;
} & (
  | { type: "text" | "email" | "password" | "number" | "date" | "tel" }
  | { type: "textarea"; rows?: number }
  | { type: "checkbox" }
  | {
      type: "select";
      options: { label: string; value: string }[];
      placeholder?: string;
    }
);

export interface FormBuilderProps<T extends FieldValues> {
  fields: FormFieldConfig<T>[];
  className?: string;
}

/**
 * A utility to quickly build simple CRUD forms from a typed array config.
 * DO NOT use this for complex layouts or multi-step flows.
 * Use the individual `AppInput` components directly for those.
 */
export function FormBuilder<T extends FieldValues>({
  fields,
  className,
}: FormBuilderProps<T>) {
  return (
    <div className={className}>
      {fields.map((field) => {
        const key = field.name;

        switch (field.type) {
          case "text":
          case "email":
          case "password":
          case "number":
          case "date":
          case "tel":
            return <AppInput key={key} {...field} type={field.type} />;

          case "textarea":
            return <AppTextarea key={key} {...field} />;

          case "select":
            return (
              <AppSelect
                key={key}
                name={field.name}
                label={field.label}
                description={field.description}
                required={field.required}
                options={field.options}
                placeholder={field.placeholder}
              />
            );

          case "checkbox":
            return (
              <AppCheckbox
                key={key}
                name={field.name}
                label={field.label}
                description={field.description}
                required={field.required}
              />
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
