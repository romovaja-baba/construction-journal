package dto

import (
	"journal/internal/models"
	"time"
)

const dateLayout = "2006-01-02"

type WorkTypeResponse struct {
	ID   uint   `json:"id"`
	Name string `json:"name"`
}

type WorkEntryResponse struct {
	ID           uint             `json:"id"`
	Date         string           `json:"date"`
	WorkTypeID   uint             `json:"work_type_id"`
	WorkType     WorkTypeResponse `json:"work_type"`
	Volume       float64          `json:"volume"`
	Unit         string           `json:"unit"`
	ExecutorName string           `json:"executor_name"`
	CreatedAt    time.Time        `json:"created_at"`
	UpdatedAt    time.Time        `json:"updated_at"`
}

type CreateEntryRequest struct {
	Date         string  `json:"date"          binding:"required"`
	WorkTypeID   uint    `json:"work_type_id"  binding:"required"`
	Volume       float64 `json:"volume"        binding:"required,gt=0"`
	Unit         string  `json:"unit"          binding:"required"`
	ExecutorName string  `json:"executor_name" binding:"required,min=1,max=150"`
}

type UpdateEntryRequest struct {
	Date         string  `json:"date"          binding:"required"`
	WorkTypeID   uint    `json:"work_type_id"  binding:"required"`
	Volume       float64 `json:"volume"        binding:"required,gt=0"`
	Unit         string  `json:"unit"          binding:"required"`
	ExecutorName string  `json:"executor_name" binding:"required,min=1,max=150"`
}

func ParseDate(s string) (time.Time, error) {
	return time.Parse(dateLayout, s)
}

func FormatDate(t time.Time) string {
	return t.UTC().Format(dateLayout)
}

func WorkEntryToResponse(e models.WorkEntry) WorkEntryResponse {
	return WorkEntryResponse{
		ID:           e.ID,
		Date:         FormatDate(e.Date),
		WorkTypeID:   e.WorkTypeID,
		WorkType:     WorkTypeToResponse(e.WorkType),
		Volume:       e.Volume,
		Unit:         e.Unit,
		ExecutorName: e.ExecutorName,
		CreatedAt:    e.CreatedAt,
		UpdatedAt:    e.UpdatedAt,
	}
}

func WorkEntriesToResponse(entries []models.WorkEntry) []WorkEntryResponse {
	out := make([]WorkEntryResponse, len(entries))
	for i, e := range entries {
		out[i] = WorkEntryToResponse(e)
	}
	return out
}

func WorkTypeToResponse(wt models.WorkType) WorkTypeResponse {
	return WorkTypeResponse{ID: wt.ID, Name: wt.Name}
}

func WorkTypesToResponse(types []models.WorkType) []WorkTypeResponse {
	out := make([]WorkTypeResponse, len(types))
	for i, wt := range types {
		out[i] = WorkTypeToResponse(wt)
	}
	return out
}
