package repository

import (
	"errors"
	"journal/internal/models"

	"gorm.io/gorm"
)

type WorkTypesRepository struct {
	db *gorm.DB
}

func NewWorkTypesRepository(db *gorm.DB) *WorkTypesRepository {
	return &WorkTypesRepository{db: db}
}

func (r *WorkTypesRepository) List() ([]models.WorkType, error) {
	var types []models.WorkType
	if err := r.db.Order("name").Find(&types).Error; err != nil {
		return nil, err
	}
	return types, nil
}

func (r *WorkTypesRepository) Exists(id uint) (bool, error) {
	var count int64
	if err := r.db.Model(&models.WorkType{}).Where("id = ?", id).Count(&count).Error; err != nil {
		return false, err
	}
	return count > 0, nil
}

func (r *WorkTypesRepository) Create(wt *models.WorkType) error {
	err := r.db.Create(wt).Error
	if errors.Is(err, gorm.ErrDuplicatedKey) {
		return models.ErrConflict
	}
	return err
}

func (r *WorkTypesRepository) GetByID(id uint) (models.WorkType, error) {
	var wt models.WorkType
	err := r.db.First(&wt, id).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return models.WorkType{}, models.ErrNotFound
	}
	return wt, err
}
