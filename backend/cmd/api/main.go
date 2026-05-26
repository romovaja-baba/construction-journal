package main

import (
	transporthttp "journal/internal/app/http"
	"journal/internal/app/http/handlers"
	"journal/internal/database"
	"journal/internal/repository"
	"journal/internal/service"
	"log"
	"os"

	"github.com/joho/godotenv"
)

func main() {
	_ = godotenv.Load()

	db := database.MustConnect()

	entriesRepo := repository.NewEntriesRepository(db)
	workTypesRepo := repository.NewWorkTypesRepository(db)

	entriesSvc := service.NewEntriesService(entriesRepo, workTypesRepo)
	workTypesSvc := service.NewWorkTypesService(workTypesRepo)

	h := handlers.New(entriesSvc, workTypesSvc)
	r := transporthttp.NewRouter(h)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server listening on :%s\n", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal(err)
	}
}
