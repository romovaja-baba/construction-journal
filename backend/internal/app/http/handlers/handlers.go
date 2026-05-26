package handlers

import (
	"journal/internal/service/entries"
	"journal/internal/service/work_types"
)

type Handler struct {
	entries   *entries.EntriesService
	workTypes *work_types.WorkTypesService
}

func New(entries *entries.EntriesService, workTypes *work_types.WorkTypesService) *Handler {
	return &Handler{entries: entries, workTypes: workTypes}
}
