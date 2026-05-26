package entries

import (
	"errors"
	"fmt"
	"strconv"
	"time"

	"journal/internal/converter"
	"journal/internal/dto"
	"journal/internal/models"
	"journal/internal/repository/entries"
	"journal/internal/repository/work_types"
)

const (
	defaultEntriesPage     = 1
	defaultEntriesPageSize = 25
	maxEntriesPageSize     = 100
	defaultEntriesOrder    = "desc"
)

type EntriesService struct {
	entries   *entries.EntriesRepository
	workTypes *work_types.WorkTypesRepository
}

func NewEntriesService(entries *entries.EntriesRepository, workTypes *work_types.WorkTypesRepository) *EntriesService {
	return &EntriesService{entries: entries, workTypes: workTypes}
}

func (s *EntriesService) List(dateFrom, dateTo, pageStr, pageSizeStr, orderStr string) (dto.EntriesListResponse, error) {
	params, err := parseListFilter(dateFrom, dateTo, pageStr, pageSizeStr, orderStr)
	if err != nil {
		return dto.EntriesListResponse{}, err
	}

	total, err := s.entries.Count(params)
	if err != nil {
		return dto.EntriesListResponse{}, err
	}

	entries, err := s.entries.List(params)
	if err != nil {
		return dto.EntriesListResponse{}, err
	}

	return dto.EntriesListResponse{
		Items:    converter.WorkEntriesToResponse(entries),
		Total:    total,
		Page:     params.Page,
		PageSize: params.PageSize,
	}, nil
}

func (s *EntriesService) Create(req dto.CreateEntryRequest) (dto.WorkEntryResponse, error) {
	date, err := parseEntryDate(req.Date)
	if err != nil {
		return dto.WorkEntryResponse{}, err
	}
	if err := s.ensureWorkTypeExists(req.WorkTypeID); err != nil {
		return dto.WorkEntryResponse{}, err
	}

	entry := models.WorkEntry{
		Date:         date,
		WorkTypeID:   req.WorkTypeID,
		Volume:       req.Volume,
		Unit:         req.Unit,
		ExecutorName: req.ExecutorName,
	}
	if err := s.entries.Create(&entry); err != nil {
		return dto.WorkEntryResponse{}, err
	}
	return converter.WorkEntryToResponse(entry), nil
}

func (s *EntriesService) Update(id uint, req dto.UpdateEntryRequest) (dto.WorkEntryResponse, error) {
	entry, err := s.entries.GetByID(id)
	if errors.Is(err, models.ErrNotFound) {
		return dto.WorkEntryResponse{}, fmt.Errorf("entry not found: %w", models.ErrNotFound)
	}
	if err != nil {
		return dto.WorkEntryResponse{}, err
	}

	date, err := parseEntryDate(req.Date)
	if err != nil {
		return dto.WorkEntryResponse{}, err
	}
	if err := s.ensureWorkTypeExists(req.WorkTypeID); err != nil {
		return dto.WorkEntryResponse{}, err
	}

	entry.Date = date
	entry.WorkTypeID = req.WorkTypeID
	entry.Volume = req.Volume
	entry.Unit = req.Unit
	entry.ExecutorName = req.ExecutorName

	if err := s.entries.Update(&entry); err != nil {
		return dto.WorkEntryResponse{}, err
	}
	return converter.WorkEntryToResponse(entry), nil
}

func (s *EntriesService) Delete(id uint) error {
	deleted, err := s.entries.Delete(id)
	if err != nil {
		return err
	}
	if !deleted {
		return fmt.Errorf("entry not found: %w", models.ErrNotFound)
	}
	return nil
}

func parseListFilter(dateFrom, dateTo, pageStr, pageSizeStr, orderStr string) (entries.ListEntriesParams, error) {
	params := entries.ListEntriesParams{
		Page:     defaultEntriesPage,
		PageSize: defaultEntriesPageSize,
		Order:    defaultEntriesOrder,
	}

	if dateFrom != "" {
		t, err := time.Parse("2006-01-02", dateFrom)
		if err != nil {
			return params, fmt.Errorf("%w: invalid date_from, expected YYYY-MM-DD", models.ErrInvalidInput)
		}
		params.DateFrom = &t
	}
	if dateTo != "" {
		t, err := time.Parse("2006-01-02", dateTo)
		if err != nil {
			return params, fmt.Errorf("%w: invalid date_to, expected YYYY-MM-DD", models.ErrInvalidInput)
		}
		params.DateTo = &t
	}

	page, pageSize, err := parsePagination(pageStr, pageSizeStr)
	if err != nil {
		return params, err
	}
	params.Page = page
	params.PageSize = pageSize

	order, err := parseSortOrder(orderStr)
	if err != nil {
		return params, err
	}
	params.Order = order

	return params, nil
}

func parseSortOrder(orderStr string) (string, error) {
	if orderStr == "" {
		return defaultEntriesOrder, nil
	}
	if orderStr != "asc" && orderStr != "desc" {
		return "", fmt.Errorf("%w: invalid order, expected asc or desc", models.ErrInvalidInput)
	}
	return orderStr, nil
}

func parsePagination(pageStr, pageSizeStr string) (int, int, error) {
	page := defaultEntriesPage
	pageSize := defaultEntriesPageSize

	if pageStr != "" {
		p, err := strconv.Atoi(pageStr)
		if err != nil || p < 1 {
			return 0, 0, fmt.Errorf("%w: invalid page", models.ErrInvalidInput)
		}
		page = p
	}
	if pageSizeStr != "" {
		ps, err := strconv.Atoi(pageSizeStr)
		if err != nil || ps < 1 || ps > maxEntriesPageSize {
			return 0, 0, fmt.Errorf("%w: invalid page_size", models.ErrInvalidInput)
		}
		pageSize = ps
	}

	return page, pageSize, nil
}

func parseEntryDate(dateStr string) (time.Time, error) {
	t, err := time.Parse("2006-01-02", dateStr)
	if err != nil {
		return time.Time{}, fmt.Errorf("%w: invalid date, expected YYYY-MM-DD", models.ErrInvalidInput)
	}
	return t, nil
}

func (s *EntriesService) ensureWorkTypeExists(id uint) error {
	exists, err := s.workTypes.Exists(id)
	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf("work type not found: %w", models.ErrNotFound)
	}
	return nil
}
