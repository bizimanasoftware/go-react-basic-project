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

var talentUpgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true }, // Allow all origins
}

var talentClients = make(map[*websocket.Conn]bool)
var talentBroadcast = make(chan models.Talent)
var talentMutex = &sync.Mutex{}

// SetupTalentRoutes registers talent endpoints and WebSocket
func SetupTalentRoutes(r *gin.Engine) {
	api := r.Group("/api", utils.AuthMiddleware())
	{
		api.GET("/talents", getTalentsHandler)
		api.POST("/talents", createTalentHandler)
	}

	r.GET("/ws/talents", talentWebSocketHandler)

	go handleTalentMessages()
}

// getTalentsHandler returns all talents
func getTalentsHandler(c *gin.Context) {
	var talents []models.Talent
	if err := db.DB.Preload("Owner").Find(&talents).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch talents"})
		return
	}
	c.JSON(http.StatusOK, talents)
}

// createTalentHandler allows users to create talent profiles
func createTalentHandler(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var talent models.Talent
	if err := c.ShouldBindJSON(&talent); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	talent.OwnerID = userID.(uint)

	if err := db.DB.Create(&talent).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create talent"})
		return
	}

	// Preload owner info before broadcasting
	db.DB.Preload("Owner").First(&talent, talent.ID)

	// Broadcast to WebSocket clients
	talentBroadcast <- talent
	c.JSON(http.StatusOK, talent)
}

// talentWebSocketHandler upgrades HTTP to WebSocket
func talentWebSocketHandler(c *gin.Context) {
	conn, err := talentUpgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Println("WebSocket upgrade error:", err)
		return
	}
	defer conn.Close()

	talentMutex.Lock()
	talentClients[conn] = true
	talentMutex.Unlock()

	log.Println("Talent client connected")

	for {
		if _, _, err := conn.ReadMessage(); err != nil {
			log.Println("WebSocket read error:", err)
			talentMutex.Lock()
			delete(talentClients, conn)
			talentMutex.Unlock()
			break
		}
	}
}

// handleTalentMessages broadcasts new talent entries to connected clients
func handleTalentMessages() {
	for talent := range talentBroadcast {
		talentMutex.Lock()
		for client := range talentClients {
			if err := client.WriteJSON(talent); err != nil {
				log.Printf("WebSocket write error: %v", err)
				client.Close()
				delete(talentClients, client)
			}
		}
		talentMutex.Unlock()
	}
}
