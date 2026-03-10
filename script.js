
/* NAVBAR SCROLL */

const navbar = document.querySelector(".navbar")

window.addEventListener("scroll", () => {

if(window.scrollY > 80){

navbar.classList.add("scrolled")

}else{

navbar.classList.remove("scrolled")

}

})


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


/* SCROLL ANIMATIONS */

const observer = new IntersectionObserver((entries)=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.classList.add("show")

}

})

},{threshold:0.2})

document.querySelectorAll(".section").forEach(el=>observer.observe(el))

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