package converter

import (
	"journal/internal/dto"
	"journal/internal/models"
)

func WorkEntryToResponse(e models.WorkEntry) dto.WorkEntryResponse {
	return dto.WorkEntryResponse{
		ID:           e.ID,
		Date:         e.Date.UTC().Format("2006-01-02"),
		WorkTypeID:   e.WorkTypeID,
		WorkType:     WorkTypeToResponse(e.WorkType),
		Volume:       e.Volume,
		Unit:         e.Unit,
		ExecutorName: e.ExecutorName,
		CreatedAt:    e.CreatedAt,
		UpdatedAt:    e.UpdatedAt,
	}
}

func WorkEntriesToResponse(entries []models.WorkEntry) []dto.WorkEntryResponse {
	out := make([]dto.WorkEntryResponse, len(entries))
	for i, e := range entries {
		out[i] = WorkEntryToResponse(e)
	}
	return out
}

func WorkTypeToResponse(wt models.WorkType) dto.WorkTypeResponse {
	return dto.WorkTypeResponse{ID: wt.ID, Name: wt.Name}
}

func WorkTypesToResponse(types []models.WorkType) []dto.WorkTypeResponse {
	out := make([]dto.WorkTypeResponse, len(types))
	for i, wt := range types {
		out[i] = WorkTypeToResponse(wt)
	}
	return out
}
