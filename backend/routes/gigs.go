package routes

import (
	"flashhire-mvp/backend/db"
	"flashhire-mvp/backend/models"
	"flashhire-mvp/backend/utils"
	"log"
	"net/http"
	"sync"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true }, // Allow all origins
}

var gigClients = make(map[*websocket.Conn]bool)
var gigBroadcast = make(chan models.Gig)
var gigMutex = &sync.Mutex{}

// SetupGigRoutes registers REST and WebSocket routes
func SetupGigRoutes(r *gin.Engine) {
	api := r.Group("/api", utils.AuthMiddleware())
	{
		api.GET("/gigs", getGigsHandler)
		api.POST("/gigs", createGigHandler)
	}

	r.GET("/ws/gigs", gigWebSocketHandler)

	go handleGigMessages()
}

// getGigsHandler returns all gigs with sponsor info
func getGigsHandler(c *gin.Context) {
	var gigs []models.Gig
	if err := db.DB.Preload("Sponsor").Find(&gigs).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch gigs"})
		return
	}
	c.JSON(http.StatusOK, gigs)
}

// createGigHandler allows sponsors to create gigs
func createGigHandler(c *gin.Context) {
	userRole, exists := c.Get("userRole")
	if !exists || userRole.(string) != "Sponsor" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Only sponsors can create gigs"})
		return
	}

	var gig models.Gig
	if err := c.ShouldBindJSON(&gig); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	gig.SponsorID = userID.(uint)

	if err := db.DB.Create(&gig).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create gig"})
		return
	}

	// Preload sponsor info before broadcasting
	db.DB.Preload("Sponsor").First(&gig, gig.ID)

	// Broadcast to WebSocket clients
	gigBroadcast <- gig
	c.JSON(http.StatusOK, gig)
}

// gigWebSocketHandler upgrades HTTP connection to WebSocket
func gigWebSocketHandler(c *gin.Context) {
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Println("WebSocket upgrade error:", err)
		return
	}
	defer conn.Close()

	gigMutex.Lock()
	gigClients[conn] = true
	gigMutex.Unlock()

	log.Println("Gig client connected")

	for {
		// Keep connection alive
		if _, _, err := conn.ReadMessage(); err != nil {
			log.Println("WebSocket read error:", err)
			gigMutex.Lock()
			delete(gigClients, conn)
			gigMutex.Unlock()
			break
		}
	}
}

// handleGigMessages broadcasts gigs to all connected WebSocket clients
func handleGigMessages() {
	for gig := range gigBroadcast {
		gigMutex.Lock()
		for client := range gigClients {
			if err := client.WriteJSON(gig); err != nil {
				log.Printf("WebSocket write error: %v", err)
				client.Close()
				delete(gigClients, client)
			}
		}
		gigMutex.Unlock()
	}
}
