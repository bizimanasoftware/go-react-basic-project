package routes

import (
	"net/http"

	"github.com/gorilla/websocket"
)

// Shared WebSocket upgrader for all routes
var Upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}
