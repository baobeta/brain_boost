package services

import (
	"time"

	"github.com/baolequoc/Flashcard-system/server/pkg/backend/models"
	"github.com/baolequoc/Flashcard-system/server/pkg/backend/repositories"
	"github.com/baolequoc/Flashcard-system/server/pkg/fsrs"
)

type CardService struct {
    Repository *repositories.CardRepository
    Scheduler  *fsrs.FSRS
}

func (s *CardService) GetCardsToLearnToday() ([]models.Card, error) {
    return s.Repository.GetDueCards()
}

func (s *CardService) AddCard(question, answer string) error {
    card := &models.Card{
        Question: question,
        Answer: answer,
        DueDate: time.Now(),
        Interval: 0,
        Ease: 2.5, // default ease factor
    }
    return s.Repository.AddCard(card)
}

func (s *CardService) ScheduleCard(cardID uint, quality int) error {
    card, err := s.Repository.GetCardByID(cardID)
    if err != nil {
        return err
    }
    card.DueDate, card.Interval, card.Ease = s.Scheduler.Schedule(card.Interval, card.Ease, quality)
    return s.Repository.UpdateCard(card)
}