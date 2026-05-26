package service

import (
	"errors"
	"fmt"

	"journal/internal/dto"
	"journal/internal/models"
	"journal/internal/repository"
)

type WorkTypesService struct {
	workTypes *repository.WorkTypesRepository
}

func NewWorkTypesService(workTypes *repository.WorkTypesRepository) *WorkTypesService {
	return &WorkTypesService{workTypes: workTypes}
}

func (s *WorkTypesService) List() ([]dto.WorkTypeResponse, error) {
	types, err := s.workTypes.List()
	if err != nil {
		return nil, err
	}
	return dto.WorkTypesToResponse(types), nil
}

func (s *WorkTypesService) Create(req dto.CreateWorkTypeRequest) (dto.WorkTypeResponse, error) {
	wt := models.WorkType{Name: req.Name}
	if err := s.workTypes.Create(&wt); err != nil {
		if errors.Is(err, models.ErrConflict) {
			return dto.WorkTypeResponse{}, fmt.Errorf("work type with this name already exists: %w", models.ErrConflict)
		}
		return dto.WorkTypeResponse{}, err
	}
	return dto.WorkTypeToResponse(wt), nil
}
