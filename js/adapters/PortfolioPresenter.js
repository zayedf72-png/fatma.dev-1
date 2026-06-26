export class PortfolioPresenter {
  /**
   * @param {Object} selectors - Element IDs for rendering lists.
   * @param {string} selectors.aboutTabContentId
   * @param {string} selectors.projectsId
   * @param {string} selectors.tickerId
   */
  constructor({ aboutTabContentId, projectsId, tickerId }) {
    this.aboutTabContentId = aboutTabContentId;
    this.projectsId = projectsId;
    this.tickerId = tickerId;
  }

  /**
   * Renders the active tab list (education, experience, or certifications).
   * @param {Array<{ title: string, subtitle?: string, institution?: string, company?: string, date: string, location?: string, details?: string[], coursework?: string[], skills?: string[] }>} list
   * @param {boolean} [isGrid=false]
   */
  renderTabContent(list, isGrid = false) {
    const el = document.getElementById(this.aboutTabContentId);
    if (!el) return;

    if (isGrid) {
      el.classList.add('grid-layout');
    } else {
      el.classList.remove('grid-layout');
    }

    el.innerHTML = list.map(item => {
      if (isGrid) {
        const tagsHTML = item.coursework || item.skills || [];
        const skillsHTML = tagsHTML.length > 0
          ? `<div class="cert-skills-tags">
               ${tagsHTML.map(sk => `<span class="tag">${this._escapeHTML(sk)}</span>`).join('')}
             </div>`
          : '';

        return `
          <div class="cert-card animate-fade-in">
            <div class="cert-img-placeholder">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" style="width: 26px; height: 26px; color: var(--blue); opacity: 0.35;"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M8 12l3 3 5-5"/></svg>
              <span class="placeholder-text">Certificate Image</span>
            </div>
            <div class="cert-body">
              <div class="cert-meta">
                <span class="cert-issuer">${this._escapeHTML(item.institution || item.company)}</span>
                <span class="cert-date">${this._escapeHTML(item.date)}</span>
              </div>
              <div class="cert-title">${this._escapeHTML(item.title)}</div>
              <div class="cert-id">ID: ${this._escapeHTML(item.id)}</div>
              ${skillsHTML}
              <a href="#" class="cert-link">Show Credential ↗</a>
            </div>
          </div>
        `;
      }

      const detailsHTML = item.details && item.details.length > 0
        ? `<ul class="card-details-list">
             ${item.details.map(pt => `<li>${this._escapeHTML(pt)}</li>`).join('')}
           </ul>`
        : '';

      const locationHTML = item.location 
        ? `<span class="card-badge badge-loc">${this._escapeHTML(item.location)}</span>`
        : '';

      const courseworkHTML = item.coursework && item.coursework.length > 0
        ? `<div class="card-coursework">
             <div class="coursework-title">Relevant Coursework</div>
             <div class="coursework-tags">
               ${item.coursework.map(cw => `<span class="tag">${this._escapeHTML(cw)}</span>`).join('')}
             </div>
           </div>`
        : '';

      return `
        <div class="tab-card animate-fade-in">
          <div class="card-header">
            <div class="header-left">
              <div class="card-title">${this._escapeHTML(item.title)}</div>
              <div class="card-sub">${this._escapeHTML(item.subtitle || item.institution || item.company)}</div>
            </div>
            <div class="header-right">
              <span class="card-badge badge-date">${this._escapeHTML(item.date)}</span>
              ${locationHTML}
            </div>
          </div>
          ${detailsHTML}
          ${courseworkHTML}
        </div>
      `;
    }).join('');
  }

  /**
   * Renders projects grid.
   * @param {Array<{ title: string, tag: string, description: string, stack: string[], demoUrl?: string, githubUrl?: string }>} projectsList
   */
  renderProjects(projectsList) {
    const el = document.getElementById(this.projectsId);
    if (!el) return;

    const cardsHTML = projectsList.map((project, index) => {
      const githubUrl = project.githubUrl || '#';
      const hiddenClass = index >= 4 ? ' proj-hidden' : '';

      return `
        <div class="proj-card${hiddenClass}">
          <div class="proj-header">
            <span class="proj-tag">${this._escapeHTML(project.tag)}</span>
          </div>
          <div class="proj-title">${this._escapeHTML(project.title)}</div>
          <div class="proj-desc">${this._escapeHTML(project.description)}</div>
          <div class="proj-stack">
            ${project.stack.map(tech => `<span class="tag">${this._escapeHTML(tech)}</span>`).join('')}
          </div>
          <div class="proj-actions">
            <a href="javascript:void(0)" onclick="return false;" class="btn-github" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
              <span class="gh-default">View on GitHub</span>
              <span class="gh-hover">Soon ✦</span>
            </a>
          </div>
        </div>
      `;
    }).join('');

    const hasMore = projectsList.length > 4;
    const toggleBtn = hasMore ? `
      <div class="proj-toggle-wrap">
        <button class="proj-toggle-btn" id="proj-toggle-btn">
          <span class="toggle-label">Show More Projects</span>
          <svg class="toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>
      </div>
    ` : '';

    // Wrap grid and toggle in a container
    el.outerHTML = `
      <div class="proj-grid" id="projects-list">${cardsHTML}</div>
      ${toggleBtn}
    `;
  }

  renderTicker(skills) {
    const el = document.getElementById(this.tickerId);
    if (!el) return;

    // Double the array to ensure smooth continuous loop animation
    const doubledSkills = [...skills, ...skills];

    // Inline SVG for logos that render best embedded
    const svgMap = {
      "Python": `<svg class="skill-svg-logo" viewBox="0 0 128 128"><linearGradient id="py-a" gradientUnits="userSpaceOnUse" x1="70.252" y1="1237.476" x2="170.659" y2="1151.089" gradientTransform="matrix(.563 0 0 -.568 -29.215 707.817)"><stop offset="0" stop-color="#5A9FD4"/><stop offset="1" stop-color="#306998"/></linearGradient><linearGradient id="py-b" gradientUnits="userSpaceOnUse" x1="209.474" y1="1098.811" x2="173.62" y2="1149.537" gradientTransform="matrix(.563 0 0 -.568 -29.215 707.817)"><stop offset="0" stop-color="#FFD43B"/><stop offset="1" stop-color="#FFE873"/></linearGradient><path fill="url(#py-a)" d="M63.391 1.988c-4.222.02-8.252.379-11.8 1.007-10.45 1.846-12.346 5.71-12.346 12.837v9.411h24.693v3.137H29.977c-7.176 0-13.46 4.313-15.426 12.521-2.268 9.405-2.368 15.275 0 25.096 1.755 7.311 5.947 12.519 13.124 12.519h8.491V67.234c0-8.151 7.051-15.34 15.426-15.34h24.665c6.866 0 12.346-5.654 12.346-12.548V15.833c0-6.693-5.646-11.72-12.346-12.837-4.244-.706-8.645-1.027-12.866-1.008zM50.037 9.557c2.55 0 4.634 2.117 4.634 4.721 0 2.593-2.083 4.69-4.634 4.69-2.56 0-4.633-2.097-4.633-4.69-.001-2.604 2.073-4.721 4.633-4.721z" transform="translate(0 10.26)"/><path fill="url(#py-b)" d="M91.682 28.38v10.966c0 8.5-7.208 15.655-15.426 15.655H51.591c-6.756 0-12.346 5.783-12.346 12.549v23.515c0 6.691 5.818 10.628 12.346 12.547 7.816 2.297 15.312 2.713 24.665 0 6.216-1.801 12.346-5.423 12.346-12.547v-9.412H63.938v-3.138h37.012c7.176 0 9.852-5.005 12.348-12.519 2.578-7.735 2.467-15.174 0-25.096-1.774-7.145-5.161-12.521-12.348-12.521h-9.268zM77.809 87.927c2.561 0 4.634 2.097 4.634 4.692 0 2.602-2.074 4.719-4.634 4.719-2.55 0-4.633-2.117-4.633-4.719 0-2.595 2.083-4.692 4.633-4.692z" transform="translate(0 10.26)"/></svg>`,
      "PyTorch": `<svg class="skill-svg-logo" viewBox="0 0 128 128"><path d="M64.032 20.032l-7.744 7.744c-9.888 9.888-9.888 26.048 0 35.936 9.888 9.888 26.048 9.888 35.936 0 9.888-9.888 9.888-26.048 0-35.936l-4.832-4.832-2.816 2.816 4.832 4.832c8.32 8.32 8.32 21.888 0 30.208s-21.888 8.32-30.208 0-8.32-21.888 0-30.208l7.744-7.744-2.912-2.816z" fill="#EE4C2C"/><circle cx="81.6" cy="31.2" r="4.8" fill="#EE4C2C"/><path d="M64 6.4C33.28 6.4 8.384 31.296 8.384 62.016S33.28 117.6 64 117.6s55.616-24.896 55.616-55.584C119.616 31.296 94.72 6.4 64 6.4zm0 6.4c27.2 0 49.216 22.016 49.216 49.216S91.2 111.2 64 111.2 14.784 89.184 14.784 61.984 36.8 12.8 64 12.8z" fill="#EE4C2C"/></svg>`,
      "TensorFlow": `<svg class="skill-svg-logo" viewBox="0 0 128 128"><path d="m61.55 128-21.84-12.68V40.55L6.81 59.56l.08-28.32L61.55 0zM66.46 0v128l21.84-12.68V79.31l16.49 9.53-.1-24.63-16.39-9.36v-14.3l32.89 19.01-.08-28.32z" fill="#ff6f00"/></svg>`,
      "React": `<svg class="skill-svg-logo" viewBox="0 0 128 128"><g fill="#61DAFB"><circle cx="64" cy="64" r="11.4"/><path d="M107.3 45.2c-2.2-.8-4.5-1.6-6.9-2.3.6-2.4 1.1-4.8 1.5-7.1 2.1-13.2-.2-22.5-6.6-26.1-1.9-1.1-4-1.6-6.4-1.6-7 0-15.9 5.2-24.9 13.9-9-8.7-17.9-13.9-24.9-13.9-2.4 0-4.5.5-6.4 1.6-6.4 3.7-8.7 13-6.6 26.1.4 2.3.9 4.7 1.5 7.1-2.4.7-4.7 1.4-6.9 2.3C8.2 50 1.4 56.6 1.4 64s6.9 14 19.3 18.8c2.2.8 4.5 1.6 6.9 2.3-.6 2.4-1.1 4.8-1.5 7.1-2.1 13.2.2 22.5 6.6 26.1 1.9 1.1 4 1.6 6.4 1.6 7.1 0 16-5.2 24.9-13.9 9 8.7 17.9 13.9 24.9 13.9 2.4 0 4.5-.5 6.4-1.6 6.4-3.7 8.7-13 6.6-26.1-.4-2.3-.9-4.7-1.5-7.1 2.4-.7 4.7-1.4 6.9-2.3 12.5-4.8 19.3-11.4 19.3-18.8s-6.8-14-19.3-18.8zM92.5 14.7c4.1 2.4 5.5 9.8 3.8 20.3-.3 2.1-.8 4.3-1.4 6.6-5.2-1.2-10.7-2-16.5-2.5-3.4-4.8-6.9-9.1-10.4-13 7.4-7.3 14.9-12.3 21-12.3 1.3 0 2.5.3 3.5.9zM81.3 74c-1.8 3.2-3.9 6.4-6.1 9.6-3.7.3-7.4.4-11.2.4-3.9 0-7.6-.1-11.2-.4-2.2-3.2-4.2-6.4-6-9.6-1.9-3.3-3.7-6.7-5.3-10 1.6-3.3 3.4-6.7 5.3-10 1.8-3.2 3.9-6.4 6.1-9.6 3.7-.3 7.4-.4 11.2-.4 3.9 0 7.6.1 11.2.4 2.2 3.2 4.2 6.4 6 9.6 1.9 3.3 3.7 6.7 5.3 10-1.7 3.3-3.4 6.6-5.3 10zm8.3-3.3c1.5 3.5 2.7 6.9 3.8 10.3-3.4.8-7 1.4-10.8 1.9 1.2-1.9 2.5-3.9 3.6-6 1.2-2.1 2.3-4.2 3.4-6.2zM64 97.8c-2.4-2.6-4.7-5.4-6.9-8.3 2.3.1 4.6.2 6.9.2 2.3 0 4.6-.1 6.9-.2-2.2 2.9-4.5 5.7-6.9 8.3zm-18.6-15c-3.8-.5-7.4-1.1-10.8-1.9 1.1-3.3 2.3-6.8 3.8-10.3 1.1 2 2.2 4.1 3.4 6.1 1.2 2.2 2.4 4.1 3.6 6.1zm-7-25.5c-1.5-3.5-2.7-6.9-3.8-10.3 3.4-.8 7-1.4 10.8-1.9-1.2 1.9-2.5 3.9-3.6 6-1.2 2.1-2.3 4.2-3.4 6.2zM64 30.2c2.4 2.6 4.7 5.4 6.9 8.3-2.3-.1-4.6-.2-6.9-.2-2.3 0-4.6.1-6.9.2 2.2-2.9 4.5-5.7 6.9-8.3zm22.2 21l-3.6-6c3.8.5 7.4 1.1 10.8 1.9-1.1 3.3-2.3 6.8-3.8 10.3-1.1-2.1-2.2-4.2-3.4-6.2zM31.7 35c-1.7-10.5-.3-17.9 3.8-20.3 1-.6 2.2-.9 3.5-.9 6 0 13.5 4.9 21 12.3-3.5 3.8-7 8.2-10.4 13-5.8.5-11.3 1.4-16.5 2.5-.6-2.3-1-4.5-1.4-6.6zM7 64c0-4.7 5.7-9.7 15.7-13.4 2-.8 4.2-1.5 6.4-2.1 1.6 5 3.6 10.3 6 15.6-2.4 5.3-4.5 10.5-6 15.5C15.3 75.6 7 69.6 7 64zm28.5 49.3c-4.1-2.4-5.5-9.8-3.8-20.3.3-2.1.8-4.3 1.4-6.6 5.2 1.2 10.7 2 16.5 2.5 3.4 4.8 6.9 9.1 10.4 13-7.4 7.3-14.9 12.3-21 12.3-1.3 0-2.5-.3-3.5-.9zM96.3 93c1.7 10.5.3 17.9-3.8 20.3-1 .6-2.2.9-3.5.9-6 0-13.5-4.9-21-12.3 3.5-3.8 7-8.2 10.4-13 5.8-.5 11.3-1.4 16.5-2.5.6 2.3 1 4.5 1.4 6.6zm9-15.6c-2 .8-4.2 1.5-6.4 2.1-1.6-5-3.6-10.3-6-15.6 2.4-5.3 4.5-10.5 6-15.5 13.8 4 22.1 10 22.1 15.6 0 4.7-5.8 9.7-15.7 13.4z"/></g></svg>`,
      "Pandas": `<svg class="skill-svg-logo" viewBox="0 0 128 128"><path d="M48.697 15.176h12.25v25.437h-12.25zm0 52.251h12.25v25.436h-12.25z" fill="#130754"/><path d="M48.697 48.037h12.25v12.001h-12.25z" fill="#ffca00"/><path d="M29.017 36.087h12.25v84.552h-12.25zM67.97 88.414h12.25v25.436H67.97zm0-52.297h12.25v25.437H67.97z" fill="#130754"/><path d="M67.97 68.983h12.25v12.001H67.97z" fill="#e70488"/><path d="M87.238 8.55h12.25v84.552h-12.25z" fill="#130754"/></svg>`,
      "OpenCV": `<svg class="skill-svg-logo" viewBox="0 0 128 128"><path d="M112.871 66.602c9.004 5.277 15.055 15.027 15.074 26.191.032 16.805-13.617 30.453-30.48 30.48-16.863.032-30.559-13.57-30.59-30.375-.02-11.164 5.996-20.933 14.984-26.246l8.774 14.778c.219.37.094.847-.262 1.09-3.32 2.25-5.496 6.046-5.488 10.347.012 6.895 5.633 12.477 12.55 12.461 6.919-.012 12.516-5.61 12.504-12.504-.007-4.3-2.195-8.09-5.523-10.328-.355-.242-.484-.719-.266-1.09z" fill="#128dff"/><path d="M45.477 66.422a30.495 30.495 0 00-14.907-3.867C13.703 62.555.035 76.18.035 92.985c0 16.804 13.668 30.43 30.535 30.43 16.946 0 30.95-14.337 30.524-31.212H43.906c-.453 0-.808.383-.812.832-.043 6.723-5.672 12.434-12.524 12.434-6.922 0-12.527-5.59-12.527-12.485 0-6.894 5.605-12.484 12.527-12.484 1.809 0 3.532.383 5.086 1.074.383.168.836.04 1.047-.316z" fill="#8bda67"/><path d="M47.945 61.648c-8.992-5.293-15.027-15.054-15.027-26.218C32.918 18.625 46.59 5 63.453 5s30.535 13.625 30.535 30.43c0 11.164-6.035 20.925-15.027 26.218L70.21 46.86c-.219-.37-.094-.847.266-1.09 3.32-2.246 5.503-6.039 5.503-10.34 0-6.894-5.609-12.484-12.527-12.484-6.918 0-12.527 5.59-12.527 12.485 0 4.3 2.183 8.093 5.504 10.34.36.242.484.718.265 1.09z" fill="#ff2a44"/></svg>`,
      "Scikit-learn": `<svg class="skill-svg-logo" viewBox="0 0 128 128"><path fill="#f89939" d="M98.18 88.13c15.63-15.62 18.23-38.36 5.8-50.78-12.43-12.42-35.17-9.82-50.8 5.8-15.63 15.62-11.11 45.48-5.8 50.78 4.29 4.29 35.17 9.82 50.8-5.8Z"/><path fill="#3499cd" d="M34.04 65.56c-9.07-9.06-22.27-10.57-29.48-3.37-7.21 7.21-5.7 20.4 3.37 29.46 9.07 9.07 26.4 6.44 29.48 3.37 2.49-2.49 5.71-20.4-3.37-29.46Z"/><path fill="#010101" d="M54.37 74.75c.71-1.19 1.45-1.78 2.23-1.78.82 0 1.24.57 1.24 1.7 0 2.29-1.51 3.85-4.53 4.7 0-1.9.35-3.44 1.06-4.62z"/></svg>`,
      "Tableau": `<svg class="skill-svg-logo" viewBox="0 0 48 48"><rect width="1.5" height="9" x="22.75" y="1" fill="#78909c"></rect><rect width="9" height="1.5" x="19" y="4.75" fill="#78909c"></rect><rect width="1.5" height="9" x="40.75" y="19" fill="#5c6bc0"></rect><rect width="9" height="1.5" x="37" y="22.75" fill="#5c6bc0"></rect><rect width="1.5" height="9" x="4.75" y="19" fill="#78909c"></rect><rect width="9" height="1.5" x="1" y="22.75" fill="#78909c"></rect><rect width="1.5" height="9" x="22.75" y="37" fill="#5c6bc0"></rect><rect width="9" height="1.5" x="19" y="40.75" fill="#5c6bc0"></rect><rect width="17" height="3" x="15" y="22" fill="#e8762d"></rect><rect width="3" height="17" x="22" y="15" fill="#e8762d"></rect><rect width="2" height="14" x="11" y="6" fill="#ffa000"></rect><rect width="14" height="2" x="5" y="12" fill="#ffa000"></rect><rect width="2" height="14" x="34" y="6" fill="#607d8b"></rect><rect width="14" height="2" x="28" y="12" fill="#607d8b"></rect><rect width="2" height="14" x="11" y="27" fill="#c62828"></rect><rect width="14" height="2" x="5" y="33" fill="#c62828"></rect><rect width="2" height="14" x="34" y="27" fill="#0d47a1"></rect><rect width="14" height="2" x="28" y="33" fill="#0d47a1"></rect></svg>`,
      "Google Colab": `<svg class="skill-svg-logo" viewBox="0 0 48 48"><path fill="#ffb300" d="M33.5,10C26.044,10,20,16.044,20,23.5C20,30.956,26.044,37,33.5,37S47,30.956,47,23.5	C47,16.044,40.956,10,33.5,10z M33.5,30c-3.59,0-6.5-2.91-6.5-6.5s2.91-6.5,6.5-6.5s6.5,2.91,6.5,6.5S37.09,30,33.5,30z"></path><path fill="#ffb300" d="M19.14,28.051l0-0.003C17.96,29.252,16.318,30,14.5,30C10.91,30,8,27.09,8,23.5s2.91-6.5,6.5-6.5	c1.83,0,3.481,0.759,4.662,1.976l3.75-6.024C20.604,11.109,17.683,10,14.5,10C7.044,10,1,16.044,1,23.5C1,30.956,7.044,37,14.5,37	c3.164,0,6.067-1.097,8.369-2.919L19.14,28.051z"></path><path fill="#f57c00" d="M8,23.5c0-1.787,0.722-3.405,1.889-4.58l-4.855-5.038C2.546,16.33,1,19.733,1,23.5	c0,3.749,1.53,7.14,3.998,9.586l4.934-4.964C8.74,26.944,8,25.309,8,23.5z"></path><path fill="#f57c00" d="M38.13,18.941C39.285,20.114,40,21.723,40,23.5c0,3.59-2.91,6.5-6.5,6.5	c-1.826,0-3.474-0.755-4.655-1.968l-4.999,4.895C26.298,35.437,29.714,37,33.5,37C40.956,37,47,30.956,47,23.5	c0-3.684-1.479-7.019-3.871-9.455L38.13,18.941z"></path></svg>`,
      "ChromaDB": `<svg class="skill-svg-logo" fill="none" viewBox="0 0 24 24"><path fill="#ffde2d" d="M15.916575 19.52c4.326225 0 7.833325 -3.3668 7.833325 -7.519975 0 -4.153175 -3.5071 -7.519975 -7.833325 -7.519975 -4.326225 0 -7.833325 3.3668 -7.833325 7.519975 0 4.153175 3.5071 7.519975 7.833325 7.519975Z" stroke-width="0.25"></path><path fill="#327eff" d="M8.083325 19.52c4.326225 0 7.833325 -3.3668 7.833325 -7.519975 0 -4.153175 -3.5071 -7.519975 -7.833325 -7.519975C3.7571 4.48005 0.25 7.84685 0.25 12.000025 0.25 16.1532 3.7571 19.52 8.083325 19.52Z" stroke-width="0.25"></path><path fill="#ff6446" d="M15.916625 12.000025c0 4.1532 -3.507125 7.519925 -7.833375 7.519925V12.000025h7.833375Zm-7.833375 0c0 -4.153175 3.5071 -7.519975 7.833375 -7.519975v7.519975H8.08325Z" stroke-width="0.25"></path></svg>`,
      "FAISS": `<svg class="skill-svg-logo" viewBox="0 0 24 24" fill="none"><ellipse cx="12" cy="5.5" rx="8" ry="2.5" fill="#4A90D9" opacity="0.9"/><path d="M4 5.5v4c0 1.38 3.582 2.5 8 2.5s8-1.12 8-2.5v-4" fill="none" stroke="#4A90D9" stroke-width="0"/><path d="M4 5.5C4 6.88 7.582 8 12 8s8-1.12 8-2.5" fill="none" stroke="#4A90D9" stroke-width="0"/><path d="M4 9.5v4c0 1.38 3.582 2.5 8 2.5s8-1.12 8-2.5v-4c0 1.38-3.582 2.5-8 2.5S4 10.88 4 9.5z" fill="#3178c6" opacity="0.75"/><path d="M4 13.5v4c0 1.38 3.582 2.5 8 2.5s8-1.12 8-2.5v-4c0 1.38-3.582 2.5-8 2.5S4 14.88 4 13.5z" fill="#1e5fa8" opacity="0.85"/><ellipse cx="12" cy="5.5" rx="8" ry="2.5" fill="none" stroke="#7eb8f7" stroke-width="0.6"/><ellipse cx="12" cy="9.5" rx="8" ry="2.5" fill="none" stroke="#5a9fd4" stroke-width="0.5" opacity="0.7"/><ellipse cx="12" cy="13.5" rx="8" ry="2.5" fill="none" stroke="#4a90d9" stroke-width="0.5" opacity="0.6"/><ellipse cx="12" cy="17.5" rx="8" ry="2.5" fill="#1a4a80" stroke="#3a7bc8" stroke-width="0.5"/></svg>`
    };

    // CDN-based icons via devicons (lightweight, always up-to-date)
    const cdnMap = {
      "SQL":          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azuresqldatabase/azuresqldatabase-original.svg",
      "JavaScript":   "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg",
      "C++":          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg",
      "Java":         "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg",
      "R":            "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/r/r-original.svg",
      "Keras":        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/keras/keras-original.svg",
      "NumPy":        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/numpy/numpy-original.svg",
      "Matplotlib":   "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/matplotlib/matplotlib-original.svg",
      "FastAPI":      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/fastapi/fastapi-original.svg",
      "Flask":        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/flask/flask-original.svg",
      "Node.js":      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg",
      "Streamlit":    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/streamlit/streamlit-original.svg",
      "Hugging Face": "https://huggingface.co/front/assets/huggingface_logo-noborder.svg",
      "LangChain":    "https://github.com/langchain-ai.png",
      "Docker":       "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg",
      "Git":          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg",
      "Jupyter":      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jupyter/jupyter-original.svg",
      "Google Colab": null,
      "VS Code":      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg",
      "Tableau":      null,
      "Power BI":     "https://upload.wikimedia.org/wikipedia/commons/c/cf/New_Power_BI_Logo.svg",
      "n8n":          "https://github.com/n8n-io.png",
      "LlamaIndex":   "https://github.com/run-llama.png",
      "ChromaDB":     null
    };

    el.innerHTML = doubledSkills.map(skill => {
      const escaped = this._escapeHTML(skill);
      let indicator;
      if (svgMap[skill]) {
        indicator = svgMap[skill];
      } else if (cdnMap[skill]) {
        indicator = `<img class="skill-cdn-logo" src="${cdnMap[skill]}" alt="${escaped}" loading="lazy">`;
      } else {
        indicator = `<span class="skill-dot"></span>`;
      }
      return `
        <div class="t-item">
          ${indicator}
          <span class="skill-name">${escaped}</span>
        </div>
        <div class="t-sep"></div>
      `;
    }).join('');
  }

  /**
   * Helper to escape HTML characters.
   * @param {string} str
   * @returns {string}
   * @private
   */
  _escapeHTML(str) {
    if (!str) return '';
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}
