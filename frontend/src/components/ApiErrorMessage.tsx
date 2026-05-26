import { getErrorMessage } from "../lib/errors";
import { FormAlert } from "./FormField";

interface Props {
    error: unknown;
    fallback?: string;
    className?: string;
    asAlert?: boolean;
}

export function ApiErrorMessage({
    error,
    fallback,
    className,
    asAlert = false,
}: Props) {
    const message = getErrorMessage(error, fallback);

    if (asAlert && error instanceof Error) {
        return <FormAlert error={error} className={className} />;
    }

    return (
        <p className={`text-sm text-red-800 ${className ?? ""}`.trim()}>
            {message}
        </p>
    );
}
