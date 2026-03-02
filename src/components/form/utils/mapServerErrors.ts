import type { UseFormReturn, FieldValues, Path } from "react-hook-form";

export type ServerErrors<T> = Partial<Record<keyof T, string[]>> & {
    root?: string[];
};

/**
 * Utility to map server-returned validation errors 
 * directly into React Hook Form's internal state.
 */
export function mapServerErrors<T extends FieldValues>(
    methods: UseFormReturn<T>,
    errors: ServerErrors<T>
) {
    if (!errors) return;

    Object.entries(errors).forEach(([key, messages]) => {
        // Asserting types due to dynamic Object.entries loop
        const typedMessages = messages as string[] | undefined;

        if (!typedMessages || !Array.isArray(typedMessages) || typedMessages.length === 0) return;

        if (key === "root") {
            methods.setError("root.serverError", {
                type: "server",
                message: typedMessages[0],
            });
        } else {
            methods.setError(key as Path<T>, {
                type: "server",
                message: typedMessages[0],
            });
        }
    });
}
