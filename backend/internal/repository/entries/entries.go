package entries

import (
	"errors"
	"fmt"
	"journal/internal/models"
	"time"

	"gorm.io/gorm"
)

type EntriesRepository struct {
	db *gorm.DB
}

func NewEntriesRepository(db *gorm.DB) *EntriesRepository {
	return &EntriesRepository{db: db}
}

type ListEntriesParams struct {
	DateFrom *time.Time
	DateTo   *time.Time
	Page     int
	PageSize int
	Order    string
}

func (r *EntriesRepository) scopedQuery(params ListEntriesParams) *gorm.DB {
	query := r.db.Model(&models.WorkEntry{})
	if params.DateFrom != nil {
		query = query.Where("date >= ?", *params.DateFrom)
	}
	if params.DateTo != nil {
		query = query.Where("date < ?", params.DateTo.Add(24*time.Hour))
	}
	return query
}

func (r *EntriesRepository) Count(params ListEntriesParams) (int64, error) {
	var total int64
	if err := r.scopedQuery(params).Count(&total).Error; err != nil {
		return 0, err
	}
	return total, nil
}

func (r *EntriesRepository) List(params ListEntriesParams) ([]models.WorkEntry, error) {
	offset := (params.Page - 1) * params.PageSize

	var entries []models.WorkEntry
	err := r.scopedQuery(params).
		Preload("WorkType").
		Order(listOrderClause(params.Order)).
		Offset(offset).
		Limit(params.PageSize).
		Find(&entries).Error
	if err != nil {
		return nil, err
	}
	return entries, nil
}

func (r *EntriesRepository) GetByID(id uint) (models.WorkEntry, error) {
	var entry models.WorkEntry
	err := r.db.Preload("WorkType").First(&entry, id).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return models.WorkEntry{}, models.ErrNotFound
	}
	return entry, err
}

func (r *EntriesRepository) Create(entry *models.WorkEntry) error {
	if err := r.db.Create(entry).Error; err != nil {
		return err
	}
	return r.db.Preload("WorkType").First(entry, entry.ID).Error
}

func (r *EntriesRepository) Update(entry *models.WorkEntry) error {
	if err := r.db.Save(entry).Error; err != nil {
		return err
	}
	return r.db.Preload("WorkType").First(entry, entry.ID).Error
}

func (r *EntriesRepository) Delete(id uint) (bool, error) {
	result := r.db.Delete(&models.WorkEntry{}, id)
	if result.Error != nil {
		return false, result.Error
	}
	return result.RowsAffected > 0, nil
}

func listOrderClause(order string) string {
	dir := "DESC"
	if order == "asc" {
		dir = "ASC"
	}
	return fmt.Sprintf("date %s, id %s", dir, dir)
}
