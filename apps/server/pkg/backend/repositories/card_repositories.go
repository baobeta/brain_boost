package repositories

import (
	"time"

	"github.com/baolequoc/Flashcard-system/server/pkg/backend/models"
	"gorm.io/gorm"
)

type CardRepository struct {
    DB *gorm.DB
}

func (r *CardRepository) GetDueCards() ([]models.Card, error) {
    var cards []models.Card
    err := r.DB.Where("due_date <= ?", time.Now()).Find(&cards).Error
    return cards, err
}

func (r *CardRepository) AddCard(card *models.Card) error {
    return r.DB.Create(card).Error
}

func (r *CardRepository) UpdateCard(card *models.Card) error {
    return r.DB.Save(card).Error
}

func (r *CardRepository) GetCardByID(cardID uint) (*models.Card, error) {
    var card models.Card
    err := r.DB.First(&card, cardID).Error
    if err != nil {
        return nil, err
    }
    return &card, nil
}