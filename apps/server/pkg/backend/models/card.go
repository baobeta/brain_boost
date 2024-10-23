package models

import (
	"time"

	"gorm.io/gorm"
)

type Card struct {
    ID       uint           `gorm:"primaryKey"`
    Question string         `gorm:"not null"`
    Answer   string         `gorm:"not null"`
    DueDate  time.Time      `gorm:"not null"`
    Interval int            `gorm:"not null"`
    Ease     float64        `gorm:"not null"`
    CreatedAt time.Time
    UpdatedAt time.Time
    DeletedAt gorm.DeletedAt `gorm:"index"`
}