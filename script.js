
/* NAVBAR SCROLL */

const navbar = document.querySelector(".navbar")

function updateNavbar() {
  if (window.scrollY > 80) {
    navbar.classList.add("scrolled")
  } else {
    navbar.classList.remove("scrolled")
  }
}

// Run on scroll AND immediately on page load
window.addEventListener("scroll", updateNavbar)
updateNavbar()

/* MOBILE MENU */

const hamburger = document.getElementById("hamburger")
const mobileMenu = document.getElementById("mobile-menu")
const mobileLinks = document.querySelectorAll(".mobile-link")

// Toggle open/close
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("open")
  mobileMenu.classList.toggle("open")
})

// Close menu when a link is clicked
mobileLinks.forEach(link => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("open")
    mobileMenu.classList.remove("open")
  })
})

// Active section tracking — works for both desktop and mobile links
const sections = document.querySelectorAll("section[id]")
const allNavLinks = document.querySelectorAll(".nav-link, .mobile-link")

function updateActiveLink() {
  let current = ""
  const scrollY = window.scrollY + 120

  sections.forEach(section => {
    if (scrollY >= section.offsetTop && scrollY < section.offsetTop + section.offsetHeight) {
      current = section.id
    }
  })

  if (window.scrollY < 80) current = "hero"

  allNavLinks.forEach(link => {
    link.classList.remove("active")
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active")
    }
  })
}

window.addEventListener("scroll", updateActiveLink)
updateActiveLink()


/* FILTER PORTFOLIO */

const filterBtns = document.querySelectorAll(".filter-btn")
const items = document.querySelectorAll(".portfolio-item")

filterBtns.forEach(btn=>{

btn.addEventListener("click",()=>{

filterBtns.forEach(b=>b.classList.remove("active"))
btn.classList.add("active")

const filter = btn.dataset.filter

items.forEach(item=>{

if(filter==="all" || item.dataset.category===filter){

item.style.display="block"

}else{

item.style.display="none"

}

})

})

})


/* LIGHTBOX */

const lightbox = document.querySelector(".lightbox")
const lightboxImg = document.querySelector(".lightbox-img")

document.querySelectorAll(".portfolio-card img").forEach(img=>{

img.addEventListener("click",()=>{

lightbox.style.display="flex"
lightboxImg.src = img.src

})

})

document.querySelector(".close-lightbox").onclick = ()=>{

lightbox.style.display="none"

}


/* SCROLL REVEAL ANIMATIONS */

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible")
      revealObserver.unobserve(entry.target)
    }
  })
}, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" })

document.querySelectorAll(".reveal-word, .reveal-img").forEach(el => {
  revealObserver.observe(el)
})

const carousel = document.querySelector(".links-carousel")

document.querySelector(".next").onclick = ()=>{

carousel.scrollBy({
left:300,
behavior:"smooth"
})

}

document.querySelector(".prev").onclick = ()=>{

carousel.scrollBy({
left:-300,
behavior:"smooth"
})

}