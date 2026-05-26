package dto

type CreateWorkTypeRequest struct {
	Name string `json:"name" binding:"required,min=1,max=100"`
}
