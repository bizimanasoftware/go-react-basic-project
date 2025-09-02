package main

import (
	"log"
	"os"
	"flashhire-mvp/backend/db"
	"flashhire-mvp/backend/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	if os.Getenv("GIN_MODE") != "release" {
		err := godotenv.Load("../.env")
		if err != nil {
			log.Println("Warning: .env file not found, reading from system environment variables")
		}
	}

	db.Init()

	r := gin.Default()
	
	// Configure CORS
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000"}
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Authorization"}
	config.AllowCredentials = true
	r.Use(cors.New(config))


	// Setup routes
	routes.SetupAuthRoutes(r)
	routes.SetupGigRoutes(r)
	routes.SetupTalentRoutes(r)
	routes.SetupChatRoutes(r)

	log.Println("Starting server on port 8000")
	if err := r.Run(":8000"); err != nil {
		log.Fatalf("Failed to run server: %v", err)
	}
}