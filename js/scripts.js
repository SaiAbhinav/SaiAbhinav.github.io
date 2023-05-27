const themeToggle = document.querySelectorAll(".theme-toggler");
const nav = document.querySelector("nav.navbar.portfolio-nav");
const toggleMore = document.getElementById("toggle-more");
const offcanvasMenu = document.getElementById("offcanvasMenu");

/**
 * Scroll the window to top
 */
function toTop() {
  window.scrollTo({ top: 0 });
}

/**
 * Sets the navbar styles after scrolling for 100px
 */
function afterScroll() {
  if (nav) {
    const scrollOffsetSatisfaction =
      document.body.scrollTop > 100 || document.documentElement.scrollTop > 100;
    nav.classList.toggle("shadow", scrollOffsetSatisfaction);
    nav.classList.toggle("bg-body", scrollOffsetSatisfaction);
    nav
      .querySelector(".navbar-brand")
      .classList.toggle("d-none", !scrollOffsetSatisfaction);
  }
}

/**
 * Scrolls the window by the height of the window
 */
function nextSection() {
  window.scrollBy({ top: window.innerHeight });
}

/**
 * Sets the theme stored in local storage or setting default theme to light
 */
function setTheme() {
  const theme = localStorage.getItem("bsTheme");
  document.documentElement.dataset["bsTheme"] = theme || "light";
}

/**
 * Toggling the page theme between light and dark
 */
function toggleTheme() {
  if (document.documentElement.dataset["bsTheme"] === "light") {
    document.documentElement.dataset["bsTheme"] = "dark";
    localStorage.setItem("bsTheme", "dark");
  } else {
    document.documentElement.dataset["bsTheme"] = "light";
    localStorage.setItem("bsTheme", "light");
  }
}

/**
 * Setting the projects archive viewmore & viewless toggle content based on the expansion status
 */
function setToggleContent() {
  toggleMore.innerHTML =
    toggleMore.ariaExpanded === "true"
      ? `<span>View less</span>&nbsp;<i class="bi bi-caret-up"></i>`
      : `<span>View more</span>&nbsp;<i class="bi bi-caret-down"></i>`;
}

function afterLoad() {
  setTheme();
  afterScroll();

  if (toggleMore) {
    toggleMore.addEventListener("click", setToggleContent);
  }
}

/**
 * Removing the offcanvas menu in portfolio mobile screen on li click
 */
if (offcanvasMenu) {
  Array.from(offcanvasMenu.querySelectorAll('li')).forEach(li => {
    li.addEventListener('click', (event) => {
       // Creating an anchor tag, assigning href and executing click event on it
       const a = document.createElement('a');
       a.href = event.target.dataset.href;
       a.click();
       // Hiding the offcanvas menu and removing the backdrop
       const bsOffcanvas = new bootstrap.Offcanvas('#offcanvasMenu');
       offcanvasMenu.classList.remove('show');
       offcanvasMenu.parentElement.querySelector('.offcanvas-backdrop').remove();
       bsOffcanvas.hide();
       document.body.style.removeProperty('overflow');
    }, false)
  });
}
Array.from(themeToggle).map(el => el.addEventListener("click", toggleTheme));
window.addEventListener("load", afterLoad);
window.addEventListener("scroll", afterScroll);
