package transporthttp

import (
	"journal/internal/app/http/handlers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func NewRouter(h *handlers.Handler) *gin.Engine {
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders: []string{"Origin", "Content-Type", "Accept"},
	}))

	api := r.Group("/api")
	{
		api.GET("/work-types", h.GetWorkTypes)
		api.POST("/work-types", h.CreateWorkType)

		api.GET("/entries", h.GetEntries)
		api.POST("/entries", h.CreateEntry)
		api.PUT("/entries/:id", h.UpdateEntry)
		api.DELETE("/entries/:id", h.DeleteEntry)
	}

	return r
}
