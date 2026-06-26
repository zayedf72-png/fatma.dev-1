/**
 * Domain entity for the Typewriter state machine.
 * Holds no references to the DOM or browser-specific timing APIs.
 */
export class Typewriter {
  /**
   * @param {string[]} phrases - Array of phrases to type out.
   */
  constructor(phrases) {
    if (!phrases || phrases.length === 0) {
      throw new Error("Typewriter requires at least one phrase.");
    }
    this.phrases = phrases;
    this.phraseIndex = 0;
    this.charIndex = 0;
    this.isDeleting = false;
  }

  /**
   * Returns the phrase currently being typed or deleted.
   * @returns {string}
   */
  getCurrentPhrase() {
    return this.phrases[this.phraseIndex];
  }

  /**
   * Returns the sliced portion of the current phrase.
   * @returns {string}
   */
  getCurrentText() {
    return this.getCurrentPhrase().slice(0, this.charIndex);
  }

  /**
   * Advances the state machine by one character step.
   * Determines state transition variables (e.g. switching phrases, changing delete status).
   * @returns {{ text: string, delay: number }} The current text state and the millisecond delay suggested before the next tick.
   */
  tick() {
    const currentPhrase = this.getCurrentPhrase();
    let delay = 48; // Default typing delay

    if (!this.isDeleting) {
      this.charIndex++;
      if (this.charIndex === currentPhrase.length) {
        this.isDeleting = true;
        delay = 1800; // Pause when phrase is fully typed
      } else {
        delay = 48; // Speed when typing
      }
    } else {
      this.charIndex--;
      if (this.charIndex === 0) {
        this.isDeleting = false;
        this.phraseIndex = (this.phraseIndex + 1) % this.phrases.length;
        delay = 300; // Pause when fully deleted
      } else {
        delay = 28; // Speed when deleting
      }
    }

    return {
      text: this.getCurrentText(),
      delay: delay
    };
  }
}
