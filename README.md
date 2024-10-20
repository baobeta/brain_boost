Database design
# User
id
email
password


# Fsrs Params
id
RequestRetention: 0.9,
MaximumInterval:  36500,
Weight:                DefaultWeights(),
Decay:            Decay,
Factor:           Factor,
EnableShortTerm:  true,
EnableFuzz:       false,
user_id


# Card
id
Due:           time.Time{},
Stability:     0,
Difficulty:    0,
ElapsedDays:   0,
ScheduledDays: 0,
Reps:          0,
Lapses:        0,
State:         New,
LastReview:    time.Time{},
user_id


# Review Log
id
review_date
card_id
grade



