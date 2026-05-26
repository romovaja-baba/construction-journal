package handlers

import (
	"net/http"

	"journal/internal/dto"

	"github.com/gin-gonic/gin"
)

func (h *Handler) GetEntries(c *gin.Context) {
	entries, err := h.entries.List(
		c.Query("date_from"),
		c.Query("date_to"),
		c.Query("page"),
		c.Query("page_size"),
		c.Query("order"),
	)
	if err != nil {
		respondError(c, err)
		return
	}
	c.JSON(http.StatusOK, entries)
}

func (h *Handler) CreateEntry(c *gin.Context) {
	var body dto.CreateEntryRequest
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	entry, err := h.entries.Create(body)
	if err != nil {
		respondError(c, err)
		return
	}
	c.JSON(http.StatusCreated, entry)
}

func (h *Handler) UpdateEntry(c *gin.Context) {
	id, ok := parseID(c)
	if !ok {
		return
	}

	var body dto.UpdateEntryRequest
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	entry, err := h.entries.Update(id, body)
	if err != nil {
		respondError(c, err)
		return
	}
	c.JSON(http.StatusOK, entry)
}

func (h *Handler) DeleteEntry(c *gin.Context) {
	id, ok := parseID(c)
	if !ok {
		return
	}

	if err := h.entries.Delete(id); err != nil {
		respondError(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "deleted"})
}
