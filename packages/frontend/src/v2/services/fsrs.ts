import type { CardState, FSRSParameters } from '../types'; // Import types

export class FSRSEngine {
  parameters: FSRSParameters;

  constructor() {
    // Default FSRS parameters
    this.parameters = {
      requestRetention: 0.9,
      maximumInterval: 36500, // 100 years
      w: [0.4, 0.6, 2.4, 5.8, 4.93, 0.94, 0.86, 0.01, 1.49, 0.14, 0.94, 2.18, 0.05, 0.34, 1.26, 0.29, 2.61],
    };
  }

  // Initialize a new card
  initializeCard(): CardState {
    return {
      interval: 1,
      ease: 2.5,
      reps: 0,
      lapses: 0,
      stability: 1,
      difficulty: 5,
    };
  }

  // Process a review and return updated card state
  processReview(cardState: CardState, quality: number): CardState {
    const { interval, ease, reps, lapses, stability, difficulty } = cardState;

    let newInterval: number;
    const newEase: number = ease; // Ease is not directly updated by FSRS v4, but kept for compatibility
    let newReps: number = reps;
    let newLapses: number = lapses;
    let newStability: number = stability;
    let newDifficulty: number = difficulty;

    // Update difficulty
    newDifficulty = Math.max(1, Math.min(10, difficulty + this.parameters.w[6] * (quality - 3)));

    if (quality < 2) {
      // Failed review (Again or Hard)
      newInterval = 1;
      newReps = 0;
      newLapses = lapses + 1;
      newStability =
        this.parameters.w[11] *
        Math.pow(difficulty, -this.parameters.w[12]) *
        (Math.pow(stability + 1, this.parameters.w[13]) - 1) *
        Math.exp(this.parameters.w[14] * (1 - quality));
    } else {
      // Successful review (Good or Easy)
      newReps = reps + 1;

      if (reps === 0) {
        // First successful review
        newStability = this.parameters.w[quality - 1];
      } else {
        // Subsequent reviews
        const retrievability = Math.exp((Math.log(0.9) * interval) / stability);
        newStability =
          stability *
          (Math.exp(this.parameters.w[8]) *
            (11 - difficulty) *
            Math.pow(stability, -this.parameters.w[9]) *
            (Math.exp(this.parameters.w[10] * (1 - retrievability)) - 1) *
            quality +
            1);
      }

      // Calculate new interval
      newInterval = Math.round((newStability * Math.log(this.parameters.requestRetention)) / Math.log(0.9));
      newInterval = Math.max(1, Math.min(this.parameters.maximumInterval, newInterval));

      // Adjust for quality (simplified from original FSRS for clarity, can be more complex)
      if (quality === 1) {
        // Hard
        newInterval = Math.max(1, Math.round(newInterval * 1.2));
      } else if (quality === 3) {
        // Easy
        newInterval = Math.round(newInterval * 1.3);
      }
    }

    return {
      interval: newInterval,
      ease: newEase,
      reps: newReps,
      lapses: newLapses,
      stability: newStability,
      difficulty: newDifficulty,
    };
  }

  // Calculate next review date
  getNextReviewDate(interval: number): Date {
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + interval);
    return nextDate;
  }
}

export const fsrsEngine = new FSRSEngine();
