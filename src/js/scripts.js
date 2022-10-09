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

  if (next) {
    next.style.visibility =
      document.body.scrollTop > 100 ||
      document.documentElement.scrollTop > 100
        ? "hidden"
        : "visible";
  }
}

function nextSection() {
  window.scrollBy({ top: window.innerHeight });
}

function toTop() {
  window.scrollTo({ top: 0 });
}

window.addEventListener("load", afterScroll);
window.addEventListener("scroll", afterScroll);

const checkbox = document.getElementById('theme');

checkbox.addEventListener('change', (e)=>{
  document.documentElement.classList.toggle('dark', e.target.checked);
});
