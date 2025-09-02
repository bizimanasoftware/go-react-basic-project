package models

import "time"

// Talent represents a talent profile
type Talent struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Name      string    `json:"name"`
	Skill     string    `json:"skill"`
	OwnerID   uint      `json:"owner_id"`           // reference to User ID
	Owner     User      `gorm:"foreignKey:OwnerID"` // link to User model, no redeclaration
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
