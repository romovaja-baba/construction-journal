package database

import (
	"fmt"
	"journal/internal/models"
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func connect() (*gorm.DB, error) {
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=UTC",
		getEnv("DB_HOST", "localhost"),
		getEnv("DB_USER", "journal"),
		getEnv("DB_PASSWORD", "journal"),
		getEnv("DB_NAME", "journal"),
		getEnv("DB_PORT", "5432"),
	)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		return nil, fmt.Errorf("connect to database: %w", err)
	}
	return db, nil
}

func migrateAndSeed(db *gorm.DB) error {
	if err := db.AutoMigrate(&models.WorkType{}, &models.WorkEntry{}); err != nil {
		return fmt.Errorf("auto migrate: %w", err)
	}
	seedWorkTypes(db)
	return nil
}

func seedWorkTypes(db *gorm.DB) {
	names := []string{
		"Кладка перегородок",
		"Монтаж опалубки",
		"Заливка бетона",
		"Армирование",
		"Монтаж перекрытий",
		"Штукатурные работы",
		"Малярные работы",
		"Устройство стяжки",
		"Монтаж кровли",
		"Земляные работы",
		"Монтаж окон и дверей",
		"Сварочные работы",
		"Электромонтажные работы",
		"Сантехнические работы",
	}

	for _, name := range names {
		db.FirstOrCreate(&models.WorkType{}, models.WorkType{Name: name})
	}
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

func MustConnect() *gorm.DB {
	db, err := connect()
	if err != nil {
		log.Fatal(err)
	}
	if err := migrateAndSeed(db); err != nil {
		log.Fatal(err)
	}
	log.Println("Database connected and migrated")
	return db
}
