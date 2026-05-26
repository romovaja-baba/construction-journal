package models

import "time"

type WorkType struct {
	ID   uint   `json:"id"   gorm:"primaryKey;autoIncrement"`
	Name string `json:"name" gorm:"uniqueIndex;not null"`
}

type WorkEntry struct {
	ID           uint      `json:"id"            gorm:"primaryKey;autoIncrement"`
	Date         time.Time `json:"date"          gorm:"not null"`
	WorkTypeID   uint      `json:"work_type_id"  gorm:"not null"`
	WorkType     WorkType  `json:"work_type"     gorm:"foreignKey:WorkTypeID"`
	Volume       float64   `json:"volume"        gorm:"not null"`
	Unit         string    `json:"unit"          gorm:"not null"`
	ExecutorName string    `json:"executor_name" gorm:"not null"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}
