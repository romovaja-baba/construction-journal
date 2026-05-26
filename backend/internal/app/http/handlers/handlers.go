package handlers

import "journal/internal/service"

type Handler struct {
	entries   *service.EntriesService
	workTypes *service.WorkTypesService
}

func New(entries *service.EntriesService, workTypes *service.WorkTypesService) *Handler {
	return &Handler{entries: entries, workTypes: workTypes}
}
