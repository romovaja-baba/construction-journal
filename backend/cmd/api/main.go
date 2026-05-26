package main

import (
	apphttp "journal/internal/app/http"
	"journal/internal/app/http/handlers"
	"journal/internal/database"
	entriesrepo "journal/internal/repository/entries"
	worktypesrepo "journal/internal/repository/work_types"
	"journal/internal/service/entries"
	"journal/internal/service/work_types"
	"log"
	"os"

	"github.com/joho/godotenv"
)

func main() {
	_ = godotenv.Load()

	db := database.MustConnect()

	entriesRepo := entriesrepo.NewEntriesRepository(db)
	workTypesRepo := worktypesrepo.NewWorkTypesRepository(db)

	entriesSvc := entries.NewEntriesService(entriesRepo, workTypesRepo)
	workTypesSvc := work_types.NewWorkTypesService(workTypesRepo)

	h := handlers.New(entriesSvc, workTypesSvc)
	r := apphttp.NewRouter(h)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server listening on :%s\n", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal(err)
	}
}
