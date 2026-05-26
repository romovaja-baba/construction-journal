import type { WorkType } from "../types";
import { apiFetch } from "./client";

export const getWorkTypes = (): Promise<WorkType[]> =>
    apiFetch<WorkType[]>("/work-types");
