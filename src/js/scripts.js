const btn = document.querySelector("button.mobile-menu-button");
const menu = document.querySelector(".mobile-menu");
const brand = document.querySelector(".mobile-menu-brand");
const backToTop = document.querySelector("#back-to-top");
const logo = document.querySelector("#logo");

// btn.addEventListener("click", () => {
//   menu.classList.toggle("hidden");
// });

const nav = document.querySelector("nav");

function afterScroll() {
  if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
    // nav.classList.add("shadow-lg", "backdrop-blur-sm", "bg-white/80", "dark:bg-neutral-700/80");
    // nav.querySelector(".nav-container").classList.add("py-2");
    // brand.classList.add("py-4");
    backToTop.style.display = "flex";
  } else {
    // nav.classList.remove("shadow-lg", "backdrop-blur-sm", "bg-white/80", "dark:bg-neutral-700/80");
    // nav.querySelector(".nav-container").classList.remove("py-2");
    // brand.classList.remove("py-4");
    backToTop.style.display = "none";
  }
}

function toTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
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
