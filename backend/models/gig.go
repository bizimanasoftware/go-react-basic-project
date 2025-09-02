package models

import "gorm.io/gorm"

type Gig struct {
    gorm.Model
    Title       string `json:"title" gorm:"not null"`
    Description string `json:"description" gorm:"not null"`
    SponsorID   uint   `json:"sponsor_id" gorm:"not null"`
    Sponsor     User   `gorm:"foreignKey:SponsorID"`
}