let currentIndex = 0;
let images = [{
  src: "/img/carousel-1.jpg",
  text: 'Right now, as part of the UK we are <b>guaranteed</b> the worst pension in the developed world <small>(*we may raise retirement age)</small> <a href="/the-facts/pensions">Find out more</a>'
}, {
  src: "/img/carousel-2.jpg",
  text: 'What is process for removing our EU citizenship? Voting Yes <a href="/the-facts/the-eu">Find out more</a>'
}];

let links = document.querySelectorAll("#carousel-buttons a");
let title = document.querySelector("#carousel-title h2");
let carousel = document.querySelector("#carousel");

function cycle(index) {
  currentIndex = index;
  links.forEach((link, i) => {
    link.classList.toggle("active", i == index);
  });
  title.innerHTML = images[index].text;
  carousel.style.backgroundImage = "url(" + images[index].src + ")";
}

let interval = setInterval(() => {
  let index = ((currentIndex + 1) == images.length) ?
    0 : currentIndex + 1;
  cycle(index);
}, 5000);

links.forEach((link, i) => {
  link.addEventListener("click", () => {
    if (interval) {
      clearInterval(interval);
    }
    cycle(i);
  });
});
