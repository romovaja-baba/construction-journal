package handlers

import (
	"net/http"

	"journal/internal/dto"

	"github.com/gin-gonic/gin"
)

func (h *Handler) GetWorkTypes(c *gin.Context) {
	types, err := h.workTypes.List()
	if err != nil {
		respondError(c, err)
		return
	}
	c.JSON(http.StatusOK, types)
}

func (h *Handler) CreateWorkType(c *gin.Context) {
	var body dto.CreateWorkTypeRequest
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	wt, err := h.workTypes.Create(body)
	if err != nil {
		respondError(c, err)
		return
	}
	c.JSON(http.StatusCreated, wt)
}
