import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ENTRY_UNITS } from "../constants/units";
import { defaultEntryFormValues, entryToFormData } from "../lib/entryForm";
import { ApiErrorMessage } from "./ApiErrorMessage";
import { FormField } from "./FormField";
import { Modal } from "./Modal";
import { ModalFooter } from "./ModalFooter";
import type { WorkType, WorkEntry, EntryFormData } from "../types";

const schema = z.object({
    date: z.string().min(1, "Укажите дату"),
    work_type_id: z.coerce
        .number({ invalid_type_error: "Выберите вид работ" })
        .positive("Выберите вид работ"),
    volume: z.coerce
        .number({ invalid_type_error: "Введите число" })
        .positive("Объём должен быть больше 0"),
    unit: z.enum(ENTRY_UNITS, { message: "Выберите единицу измерения" }),
    executor_name: z
        .string()
        .min(1, "Укажите исполнителя")
        .max(150, "Не более 150 символов"),
});

interface Props {
    workTypes: WorkType[];
    initial?: WorkEntry;
    onSubmit: (data: EntryFormData) => void;
    onClose: () => void;
    isLoading?: boolean;
    error?: Error | null;
}

export function EntryForm({
    workTypes,
    initial,
    onSubmit,
    onClose,
    isLoading,
    error,
}: Props) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<EntryFormData>({
        resolver: zodResolver(schema),
        defaultValues: initial
            ? entryToFormData(initial)
            : defaultEntryFormValues,
    });

    useEffect(() => {
        reset(initial ? entryToFormData(initial) : defaultEntryFormValues);
    }, [initial?.id, reset, initial]);

    return (
        <Modal
            onClose={onClose}
            title={initial ? "Редактирование" : "Новая запись"}
        >
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-3 px-4 py-4"
            >
                {error && (
                    <ApiErrorMessage error={error} asAlert className="mb-0" />
                )}

                <FormField label="Дата *" error={errors.date?.message}>
                    <input
                        type="date"
                        {...register("date")}
                        className="input-field"
                    />
                </FormField>

                <FormField
                    label="Вид работ *"
                    error={errors.work_type_id?.message}
                >
                    <select
                        {...register("work_type_id")}
                        className="input-field"
                    >
                        <option value="">— выберите —</option>
                        {workTypes.map((wt) => (
                            <option key={wt.id} value={wt.id}>
                                {wt.name}
                            </option>
                        ))}
                    </select>
                </FormField>

                <div className="flex gap-2">
                    <FormField
                        label="Объём *"
                        error={errors.volume?.message}
                        className="flex-1"
                    >
                        <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            placeholder="0"
                            {...register("volume")}
                            className="input-field font-mono"
                        />
                    </FormField>
                    <FormField
                        label="Ед. *"
                        error={errors.unit?.message}
                        className="w-24"
                    >
                        <select {...register("unit")} className="input-field">
                            {ENTRY_UNITS.map((u) => (
                                <option key={u} value={u}>
                                    {u}
                                </option>
                            ))}
                        </select>
                    </FormField>
                </div>

                <FormField
                    label="Исполнитель (ФИО) *"
                    error={errors.executor_name?.message}
                >
                    <input
                        type="text"
                        placeholder="Иванов И.И."
                        {...register("executor_name")}
                        className="input-field"
                    />
                </FormField>

                <ModalFooter
                    onCancel={onClose}
                    primary={{
                        label: initial ? "Сохранить" : "Добавить",
                        pendingLabel: "Сохранение…",
                        type: "submit",
                        isLoading,
                    }}
                />
            </form>
        </Modal>
    );
}
