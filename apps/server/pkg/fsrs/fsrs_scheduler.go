package fsrs

import (
	"time"

	fsrs "github.com/open-spaced-repetition/go-fsrs/v3"
)
type FSRS struct {
  
}


func (f *FSRS) GetNextReviewDate(card fsrs.Card) time.Time {
  p := fsrs.DefaultParam()
  p.W = fsrs.DefaultWeights()
  p.EnableShortTerm = true
  fsrs := fsrs.NewFSRS(p)
  now := time.Now()
  fsrs.Update(card, now)
  return time.Now()
}