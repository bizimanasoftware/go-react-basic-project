package models

import "gorm.io/gorm"

type User struct {
    gorm.Model
    Name     string `json:"name" gorm:"not null"`
    Email    string `json:"email" gorm:"unique;not null"`
    Password string `json:"-" gorm:"not null"` // Hide password in JSON responses
    Role     string `json:"role" gorm:"not null"` // 'Talent' or 'Sponsor'
}

type TalentProfile struct {
    gorm.Model
    UserID        uint   `json:"user_id" gorm:"unique;not null"`
    User          User   `gorm:"foreignKey:UserID"`
    Skills        string `json:"skills"` // Comma-separated list of skills
    Availability  string `json:"availability"` // e.g., 'Full-time', 'Part-time'
}