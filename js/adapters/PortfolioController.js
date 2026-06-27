export class PortfolioController {
  constructor() {}

  /**
   * Initializes event listeners across the interface.
   * @param {Object} [options]
   * @param {PortfolioPresenter} [options.presenter]
   * @param {Array} [options.educationList]
   * @param {Array} [options.experienceList]
   * @param {Array} [options.certificationsList]
   */
  init({ presenter, educationList, experienceList, certificationsList } = {}) {
    this._bindNavigation();
    this._bindHeroButtons();
    this._bindContactForm();
    this._bindProjectsToggle();
    if (presenter) {
      this._bindTabs({ presenter, educationList, experienceList, certificationsList });
    }
    this._initScrollSpy();
  }

  /**
   * Binds smooth scroll navigation and tab switching.
   * @private
   */
  _bindNavigation() {
    // 1. Logo click handler
    const logoLink = document.querySelector('nav .logo');
    if (logoLink) {
      logoLink.addEventListener('click', (e) => {
        e.preventDefault();
        const targetEl = document.getElementById('hero-section');
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
        // Clear active classes from nav links
        const navLinks = document.querySelectorAll('nav .nav-links a');
        navLinks.forEach(link => link.classList.remove('active'));
      });
    }

    // 2. Nav links click handler
    const navLinks = document.querySelectorAll('nav .nav-links a');
    const navToggle = document.getElementById('nav-toggle');
    const navLinksContainer = document.querySelector('.nav-links');

    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const targetType = link.getAttribute('data-scroll');
        if (!targetType) return;
        
        e.preventDefault();

        // Set clicked link as active immediately
        navLinks.forEach(b => b.classList.remove('active'));
        link.classList.add('active');

        // Close mobile menu if open
        if (navToggle && navLinksContainer) {
          navToggle.classList.remove('active');
          navLinksContainer.classList.remove('active');
        }

        if (targetType === 'experience' || targetType === 'education' || targetType === 'certifications') {
          // Auto select tab
          const tabBtn = document.querySelector(`.about-tabs .tab-btn[data-tab="${targetType}"]`);
          if (tabBtn) {
            tabBtn.click();
          }
          // Scroll to about section
          const targetEl = document.getElementById('about-section');
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth' });
          }
        } else if (targetType === 'projects') {
          const targetEl = document.getElementById('projects-section');
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth' });
          }
        } else if (targetType === 'contact') {
          const targetEl = document.getElementById('contact-section');
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    });

    // 3. Hamburger menu toggle
    if (navToggle && navLinksContainer) {
      navToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        navToggle.classList.toggle('active');
        navLinksContainer.classList.toggle('active');
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (navLinksContainer.classList.contains('active') && !navLinksContainer.contains(e.target) && e.target !== navToggle) {
          navToggle.classList.remove('active');
          navLinksContainer.classList.remove('active');
        }
      });
    }
  }

  /**
   * Binds Hero section buttons to scroll to sections.
   * @private
   */
  _bindHeroButtons() {
    const btnProjects = document.querySelector('.hero .btn-p');
    const btnContact = document.querySelector('.hero .btn-g');

    if (btnProjects) {
      btnProjects.addEventListener('click', () => {
        const targetEl = document.getElementById('projects-section');
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    if (btnContact) {
      btnContact.addEventListener('click', () => {
        const targetEl = document.getElementById('contact-section');
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  }

  /**
   * Binds contact form submit event.
   * @private
   */
  _bindContactForm() {
    const submitBtn = document.querySelector('.form-wrap .btn-p');
    const nameInput = document.querySelector('.form-wrap input[type="text"]');
    const emailInput = document.querySelector('.form-wrap input[type="email"]');
    const messageInput = document.querySelector('.form-wrap textarea');

    if (submitBtn) {
      submitBtn.addEventListener('click', (e) => {
        e.preventDefault();

        const name = nameInput ? nameInput.value.trim() : '';
        const email = emailInput ? emailInput.value.trim() : '';
        const message = messageInput ? messageInput.value.trim() : '';

        if (!name || !email || !message) {
          alert('Please fill in all fields before sending.');
          return;
        }

        alert(`Thank you, ${name}! Your message has been sent successfully.`);

        // Reset inputs
        if (nameInput) nameInput.value = '';
        if (emailInput) emailInput.value = '';
        if (messageInput) messageInput.value = '';
      });
    }
  }

  /**
   * Binds the "Show More / Show Less" toggle for the projects grid.
   * @private
   */
  _bindProjectsToggle() {
    // Use a small delay to ensure the presenter has finished rendering
    setTimeout(() => {
      const btn = document.getElementById('proj-toggle-btn');
      if (!btn) return;

      let isExpanded = false;

      btn.addEventListener('click', () => {
        isExpanded = !isExpanded;

        const hiddenCards = document.querySelectorAll('.proj-card.proj-hidden, .proj-card.proj-visible-extra');
        hiddenCards.forEach((card, i) => {
          if (isExpanded) {
            card.classList.remove('proj-hidden');
            card.classList.add('proj-visible-extra');
            // Stagger animation
            card.style.animationDelay = `${i * 0.07}s`;
          } else {
            card.classList.add('proj-hidden');
            card.classList.remove('proj-visible-extra');
            card.style.animationDelay = '0s';
          }
        });

        // Update button text and icon
        const label = btn.querySelector('.toggle-label');
        const icon = btn.querySelector('.toggle-icon');
        if (label) label.textContent = isExpanded ? 'Show Less' : 'Show More Projects';
        if (icon) icon.style.transform = isExpanded ? 'rotate(180deg)' : 'rotate(0deg)';

        btn.classList.toggle('expanded', isExpanded);
      });
    }, 100);
  }

  /**
   * Binds click events to the About section tab buttons.
   * @private
   */
  _bindTabs({ presenter, educationList, experienceList, certificationsList }) {
    const tabButtons = document.querySelectorAll('.about-tabs .tab-btn');
    tabButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        // Toggle active class on buttons
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Render appropriate content
        const tabName = btn.getAttribute('data-tab');
        if (tabName === 'experience') {
          presenter.renderTabContent(experienceList);
        } else if (tabName === 'education') {
          presenter.renderTabContent(educationList);
        } else if (tabName === 'certifications') {
          presenter.renderTabContent(certificationsList, true);
        }

        // Sync with active navbar link
        const navLinks = document.querySelectorAll('nav .nav-links a');
        navLinks.forEach(link => {
          if (link.getAttribute('data-scroll') === tabName) {
            navLinks.forEach(b => b.classList.remove('active'));
            link.classList.add('active');
          }
        });
      });
    });
  }

  /**
   * Sets up Scroll Spy using IntersectionObserver to highlight active nav link on scroll.
   * @private
   */
  _initScrollSpy() {
    const sections = [
      { id: 'hero-section', name: 'hero' },
      { id: 'about-section', name: 'about' },
      { id: 'projects-section', name: 'projects' },
      { id: 'contact-section', name: 'contact' }
    ];

    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -40% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          const navLinks = document.querySelectorAll('nav .nav-links a');

          if (sectionId === 'hero-section') {
            navLinks.forEach(link => link.classList.remove('active'));
          } else if (sectionId === 'about-section') {
            const activeTabBtn = document.querySelector('.about-tabs .tab-btn.active');
            const activeTabName = activeTabBtn ? activeTabBtn.getAttribute('data-tab') : 'experience';
            navLinks.forEach(link => {
              if (link.getAttribute('data-scroll') === activeTabName) {
                navLinks.forEach(b => b.classList.remove('active'));
                link.classList.add('active');
              }
            });
          } else if (sectionId === 'projects-section') {
            navLinks.forEach(link => {
              if (link.getAttribute('data-scroll') === 'projects') {
                navLinks.forEach(b => b.classList.remove('active'));
                link.classList.add('active');
              }
            });
          } else if (sectionId === 'contact-section') {
            navLinks.forEach(link => {
              if (link.getAttribute('data-scroll') === 'contact') {
                navLinks.forEach(b => b.classList.remove('active'));
                link.classList.add('active');
              }
            });
          }
        }
      });
    }, observerOptions);

    sections.forEach(sec => {
      const el = document.getElementById(sec.id);
      if (el) observer.observe(el);
    });
  }
}
