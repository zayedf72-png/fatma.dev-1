export class TypewriterPresenter {
  /**
   * @param {string} elementId - The ID of the DOM element where typewriter text should render.
   */
  constructor(elementId) {
    this.elementId = elementId;
  }

  /**
   * Renders the given text into the DOM element.
   * @param {string} text
   */
  render(text) {
    const el = document.getElementById(this.elementId);
    if (el) {
      el.textContent = text;
    }
  }
}
