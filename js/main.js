const items = document.querySelectorAll(`
  .hero-section-subtitle,
  .home-section-main-title,
  .home-buttons,
  .home-cards,
  .my-photo,
  .about-me,
  .skills,
  .projects-wrapper .project,
  .resume,
  .contact,
  .skills-heading,
  .projects-headings,
  .resume-heading,
  .about-me-headings
`);

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    entry.target.classList.add("show");
    observer.unobserve(entry.target); // run once only (smoother feel)
  });
}, {
  threshold: 0.15
});

/* auto-assign animation styles (NO HTML EDITS NEEDED) */
items.forEach((el, index) => {

  el.classList.add("scroll");

  // automatic variation system
  if (el.classList.contains("home-section-main-title") || el.classList.contains("about-me")) {
    el.classList.add("left");
  }

  if (el.classList.contains("projects-wrapper") || el.classList.contains("project")) {
    el.classList.add("right");
  }

  if (el.classList.contains("home-cards")) {
    el.classList.add("zoom");
    el.classList.add(`delay-${(index % 5) + 1}`);
  }

  observer.observe(el);
});

