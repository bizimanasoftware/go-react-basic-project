package routes

import (
	"flashhire-mvp/backend/models"
	"flashhire-mvp/backend/utils"
	"log"
	"net/http"
	"sync"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var chatClients = make(map[uint][]*websocket.Conn) // Map userID to connections
var chatMutex = &sync.RWMutex{}

// SetupChatRoutes registers the chat WebSocket route
func SetupChatRoutes(r *gin.Engine) {
	r.GET("/ws/chat", utils.AuthMiddleware(), chatWebSocketHandler)
}

func chatWebSocketHandler(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	currentUserID, ok := userID.(uint)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user ID"})
		return
	}

	conn, err := utils.Upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Printf("Failed to upgrade chat connection: %v", err)
		return
	}
	defer conn.Close()

	// Register new connection
	chatMutex.Lock()
	chatClients[currentUserID] = append(chatClients[currentUserID], conn)
	chatMutex.Unlock()
	log.Printf("User %d connected to chat", currentUserID)

	for {
		var msg models.Message
		if err := conn.ReadJSON(&msg); err != nil {
			log.Printf("Chat read error for user %d: %v", currentUserID, err)

			// Remove this connection
			chatMutex.Lock()
			connections := chatClients[currentUserID]
			for i, c := range connections {
				if c == conn {
					chatClients[currentUserID] = append(connections[:i], connections[i+1:]...)
					break
				}
			}
			if len(chatClients[currentUserID]) == 0 {
				delete(chatClients, currentUserID)
			}
			chatMutex.Unlock()
			break
		}

		// Set sender
		msg.SenderID = currentUserID

		// Broadcast message to receiver
		chatMutex.RLock()
		if receiverConns, ok := chatClients[msg.ReceiverID]; ok {
			for _, receiverConn := range receiverConns {
				if err := receiverConn.WriteJSON(msg); err != nil {
					log.Printf("Chat write error for user %d: %v", msg.ReceiverID, err)
				}
			}
		} else {
			log.Printf("User %d is not online", msg.ReceiverID)
		}
		chatMutex.RUnlock()
	}
}
