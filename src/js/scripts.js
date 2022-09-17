const btn = document.querySelector("button.mobile-menu-button");
const menu = document.querySelector(".mobile-menu");
const brand = document.querySelector(".mobile-menu-brand");
const backToTop = document.querySelector("#back-to-top");

btn.addEventListener("click", () => {
  menu.classList.toggle("hidden");
});

const nav = document.querySelector("nav");

function afterScroll() {
  if (
    document.body.scrollTop > 50 ||
    document.documentElement.scrollTop > 50 
  ) {
    nav.classList.add("shadow-lg", "bg-white");
    nav.querySelector(".nav-container").classList.add("py-2");
    brand.classList.add("py-4");
    backToTop.style.display = "flex";
  } else {
    nav.classList.remove("shadow-lg", "bg-white");
    nav.querySelector(".nav-container").classList.remove("py-2");
    brand.classList.remove("py-4");
    backToTop.style.display = "none";
  }
}

function toTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

window.addEventListener("load", afterScroll);
window.addEventListener("scroll", afterScroll);
