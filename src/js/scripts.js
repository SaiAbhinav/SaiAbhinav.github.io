const btn = document.querySelector("button.mobile-menu-button");
const menu = document.querySelector(".mobile-menu");
const brand = document.querySelector(".mobile-menu-brand");
const backToTop = document.querySelector("#back-to-top");
const next = document.querySelector("#next");
const nav = document.querySelector("nav");

function afterScroll() {
  backToTop.style.display =
    document.body.scrollTop > window.innerHeight ||
    document.documentElement.scrollTop > window.innerHeight
      ? "flex"
      : "none";

  next.style.visibility =
    document.body.scrollTop > 100 ||
    document.documentElement.scrollTop > 100
      ? "hidden"
      : "visible";
}

function nextSection() {
  window.scrollBy({ top: window.innerHeight });
}

function toTop() {
  window.scrollTo({ top: 0 });
}

const inViewport = (entries, observer) => {
  entries.forEach((entry) => {
    if (entry.target.dataset.inviewportDelay) {
      setTimeout(() => {
        entry.target.classList.toggle("is-inViewport", entry.isIntersecting);
      }, entry.target.dataset.inviewportDelay);
    } else {
      entry.target.classList.toggle("is-inViewport", entry.isIntersecting);
    }
  });
};

const Obs = new IntersectionObserver(inViewport);
const obsOptions = {};

// Attach observer to every [data-inviewport] element:
const ELs_inViewport = document.querySelectorAll("[data-inviewport]");
ELs_inViewport.forEach((EL) => {
  Obs.observe(EL, obsOptions);
});

window.addEventListener("load", afterScroll);
window.addEventListener("scroll", afterScroll);

const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');

// Change the icons inside the button based on previous settings
if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    themeToggleLightIcon.classList.remove('hidden');
    themeToggleDarkIcon.classList.add('hidden');

    if (!document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.add('dark');
    }
} else {
    themeToggleDarkIcon.classList.remove('hidden');
    themeToggleLightIcon.classList.add('hidden');

    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
    }
}

const themeToggleBtn = document.getElementById('theme-toggle');

themeToggleBtn.addEventListener('click', function() {

    // toggle icons inside button
    themeToggleDarkIcon.classList.toggle('hidden');
    themeToggleLightIcon.classList.toggle('hidden');

    // if set via local storage previously
    if (localStorage.getItem('color-theme')) {
        if (localStorage.getItem('color-theme') === 'light') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('color-theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('color-theme', 'light');
        }

    // if NOT set via local storage previously
    } else {
        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('color-theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('color-theme', 'dark');
        }
    }
    
});
