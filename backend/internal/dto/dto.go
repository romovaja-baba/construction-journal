package dto

import (
	"time"
)

type EntriesListResponse struct {
	Items    []WorkEntryResponse `json:"items"`
	Total    int64               `json:"total"`
	Page     int                 `json:"page"`
	PageSize int                 `json:"page_size"`
}

type CreateWorkTypeRequest struct {
	Name string `json:"name" binding:"required,min=1,max=100"`
}

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
