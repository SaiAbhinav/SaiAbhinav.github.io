const btn = document.querySelector("button.mobile-menu-button");
const menu = document.querySelector(".mobile-menu");
const brand = document.querySelector(".mobile-menu-brand");

btn.addEventListener("click", () => {
  menu.classList.toggle("hidden");
});

const nav = document.querySelector("nav");

function afterScroll() {
  if (
    document.body.scrollTop > 100 ||
    document.documentElement.scrollTop > 100
  ) {
    nav.classList.add("shadow-lg");
    nav.querySelector(".nav-container").classList.add("py-0");
    brand.classList.add("py-4");
  } else {
    nav.classList.remove("shadow-lg");
    nav.querySelector(".nav-container").classList.remove("py-0");
    brand.classList.remove("py-4");
  }
}

window.addEventListener("load", afterScroll);
window.addEventListener("scroll", afterScroll);
