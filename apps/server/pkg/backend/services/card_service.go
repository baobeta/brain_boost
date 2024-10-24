package services

import (
	"time"

	"github.com/baolequoc/Flashcard-system/server/pkg/backend/models"
	"github.com/baolequoc/Flashcard-system/server/pkg/backend/repositories"
	fsrs "github.com/open-spaced-repetition/go-fsrs/v3"
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

func convertToFSRSCard(card *models.Card) fsrs.Card {
    return fsrs.Card{
        Due: card.DueDate,
        Stability: card.Ease,
        Difficulty: card.Ease,
        ElapsedDays: uint64(time.Since(card.DueDate).Hours() / 24), 
        ScheduledDays:  uint64(card.Interval),
        State: fsrs.Learning,
        LastReview: card.DueDate,
    }
}

func (s *CardService) ScheduleCard(cardID uint, quality int) error {
    card, err := s.Repository.GetCardByID(cardID)
    if err != nil {
        return err
    }

    rating := fsrs.Rating(quality)
    newCard := convertToFSRSCard(card)

    // Schedule the card for the next review
    scheduler := fsrs.NewFSRS(fsrs.DefaultParam()) // You could customize the parameters as needed
    scheduleInfo := scheduler.Next(newCard, time.Now(), rating)

    // Update due date for card
    card.DueDate =scheduleInfo.Card.Due

    // Update the card with new values
    return s.Repository.UpdateCard(card)
}
