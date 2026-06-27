import {
  typewriterPhrases,
  educationList,
  experienceList,
  certificationsList,
  projectsList,
  tickerSkills
} from './data/portfolioData.js';

import { Typewriter } from '../domain/Typewriter.js';
import { TypewriterInteractor } from '../usecases/TypewriterInteractor.js';
import { TypewriterPresenter } from '../adapters/TypewriterPresenter.js';
import { PortfolioPresenter } from '../adapters/PortfolioPresenter.js';
import { PortfolioController } from '../adapters/PortfolioController.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Instantiation and rendering of dynamic lists (Framework & Presenter bindings)
  const portfolioPresenter = new PortfolioPresenter({
    aboutTabContentId: 'about-tab-content',
    projectsId: 'projects-list',
    tickerId: 'ticker-skills'
  });

  // Render initial active tab (Experience) and static widgets
  portfolioPresenter.renderTabContent(experienceList);
  portfolioPresenter.renderProjects(projectsList);
  portfolioPresenter.renderTicker(tickerSkills);

  // 2. Setup Typewriter domain entity & use case flow
  const typewriter = new Typewriter(typewriterPhrases);
  const typewriterInteractor = new TypewriterInteractor(typewriter);
  const typewriterPresenter = new TypewriterPresenter('tw-text');

  typewriterInteractor.execute((text) => {
    typewriterPresenter.render(text);
  });

  // 3. Setup interaction controller with tab arguments
  const portfolioController = new PortfolioController();
  portfolioController.init({
    presenter: portfolioPresenter,
    educationList,
    experienceList,
    certificationsList
  });
});
