console.log("A Unique Food Supply Loaded");

/* NAVBAR SHADOW */

window.addEventListener("scroll", () => {

  const header = document.querySelector("header");

  if(window.scrollY > 50){
    header.style.background = "rgba(0,0,0,0.9)";
  } else {
    header.style.background = "rgba(0,0,0,0.6)";
  }

});

/* CARD ANIMATION */

const cards = document.querySelectorAll(".card");

cards.forEach((card, index) => {

  card.style.opacity = "0";
  card.style.transform = "translateY(40px)";

  setTimeout(() => {

    card.style.transition = "0.8s ease";

    card.style.opacity = "1";
    card.style.transform = "translateY(0)";

  }, 300 * index);

});