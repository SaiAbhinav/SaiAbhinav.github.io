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

const checkbox = document.getElementById('theme');

checkbox.addEventListener('change', (e)=>{
  document.documentElement.classList.toggle('dark', e.target.checked);
});
