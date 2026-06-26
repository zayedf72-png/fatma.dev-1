export class TypewriterInteractor {
  /**
   * @param {Typewriter} typewriter - The domain typewriter entity.
   */
  constructor(typewriter) {
    this.typewriter = typewriter;
    this.timerId = null;
  }

  /**
   * Executes the typewriter loop.
   * @param {function(string): void} onUpdate - Callback invoked with the updated text on each step.
   * @param {number} [initialDelay=800] - Initial delay before starting the loop.
   */
  execute(onUpdate, initialDelay = 800) {
    this.stop();

    const runLoop = () => {
      const { text, delay } = this.typewriter.tick();
      onUpdate(text);
      this.timerId = setTimeout(runLoop, delay);
    };

    this.timerId = setTimeout(runLoop, initialDelay);
  }

  /**
   * Stops the active typewriter loop.
   */
  stop() {
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }
}
