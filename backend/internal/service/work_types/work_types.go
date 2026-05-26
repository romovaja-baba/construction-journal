package work_types

import (
	"errors"
	"fmt"

	"journal/internal/converter"
	"journal/internal/dto"
	"journal/internal/models"
	"journal/internal/repository/work_types"
)

type WorkTypesService struct {
	workTypes *work_types.WorkTypesRepository
}

func NewWorkTypesService(workTypes *work_types.WorkTypesRepository) *WorkTypesService {
	return &WorkTypesService{workTypes: workTypes}
}

func (s *WorkTypesService) List() ([]dto.WorkTypeResponse, error) {
	types, err := s.workTypes.List()
	if err != nil {
		return nil, err
	}
	return converter.WorkTypesToResponse(types), nil
}

func (s *WorkTypesService) Create(req dto.CreateWorkTypeRequest) (dto.WorkTypeResponse, error) {
	wt := models.WorkType{Name: req.Name}
	if err := s.workTypes.Create(&wt); err != nil {
		if errors.Is(err, models.ErrConflict) {
			return dto.WorkTypeResponse{}, fmt.Errorf("work type with this name already exists: %w", models.ErrConflict)
		}
		return dto.WorkTypeResponse{}, err
	}
	return converter.WorkTypeToResponse(wt), nil
}
