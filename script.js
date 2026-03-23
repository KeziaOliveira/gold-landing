
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


/* CAROUSEL — drag to scroll + zone navigation */
/* CAROUSEL — drag to scroll + zone navigation + pagination */

/* 
   DEFINITIVE CAROUSEL — 100% JS Driven 
   This replaces CSS animations with a requestAnimationFrame loop for perfect control.
*/
;(function () {
  const wrapper = document.querySelector('.links-carousel-wrapper')
  const track   = document.querySelector('.proj-carousel-track')
  if (!wrapper || !track) return

  // Configurações
  const NUM_CARDS     = 4
  const IDLE_RESUME   = 3000
  let scrollSpeed   = window.innerWidth < 768 ? 0.35 : 0.6 // Pixels por frame
  
  // Estado
  let currentX    = 0
  let targetX     = null
  let isPaused    = false
  let isDragging  = false
  let isJumping   = false
  let isHovered   = false
  let startX      = 0
  let dragStartX  = 0
  let resumeTimer = null

  const getCardStep = () => {
    const card = track.querySelector('.proj-card')
    if (!card) return 320
    const gap = parseFloat(window.getComputedStyle(track).gap) || 20
    return card.offsetWidth + gap
  }

  // Centraliza o início
  function initCentering() {
    const step = getCardStep()
    const viewportCenter = wrapper.offsetWidth / 2
    const cardHalf = (step - 20) / 2
    currentX = viewportCenter - cardHalf
  }

  /* ─── PAGINAÇÃO ─── */
  const pagination = document.createElement('div')
  pagination.className = 'carousel-pagination'
  const dots = []

  for (let i = 0; i < NUM_CARDS; i++) {
    const dot = document.createElement('button')
    dot.className = 'carousel-dot'
    dot.setAttribute('aria-label', `Ir para slide ${i + 1}`)
    dot.addEventListener('click', (e) => {
      e.preventDefault()
      e.stopPropagation()
      jumpToIndex(i)
    })
    pagination.appendChild(dot)
    dots.push(dot)
  }
  wrapper.after(pagination)

  function updateActiveDot(x) {
    const step = getCardStep()
    const loopPoint = (track.scrollWidth + 20) / 2
    const viewportCenter = wrapper.offsetWidth / 2
    const cardHalf = (step - 20) / 2
    
    let norm = ((x % loopPoint) - loopPoint) % loopPoint
    let index = Math.round(Math.abs(norm - viewportCenter + cardHalf) / step) % NUM_CARDS
    
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index)
    })
  }

  function jumpToIndex(targetIdx) {
    clearTimeout(resumeTimer)
    isJumping = true
    isPaused  = true
    
    const step = getCardStep()
    const viewportCenter = wrapper.offsetWidth / 2
    const cardHalf = (step - 20) / 2
    
    // Calcula o índice real atual baseado na posição
    const currentIndex = Math.round(Math.abs(currentX - viewportCenter + cardHalf) / step)
    const currentRealIndex = currentIndex % NUM_CARDS
    
    let diff = targetIdx - currentRealIndex
    if (diff > NUM_CARDS / 2) diff -= NUM_CARDS
    if (diff < -NUM_CARDS / 2) diff += NUM_CARDS
    
    targetX = currentX - (diff * step)
  }

  /* ─── INTERAÇÃO ─── */

  function handleStart(clientX) {
    clearTimeout(resumeTimer)
    isDragging = true
    isPaused   = true
    isJumping  = false
    startX     = clientX
    dragStartX = currentX
    wrapper.style.cursor = 'grabbing'
  }

  function handleMove(clientX) {
    if (!isDragging) return
    const delta = clientX - startX
    currentX = dragStartX + delta
  }

  function handleEnd() {
    if (!isDragging) return
    isDragging = false
    wrapper.style.cursor = 'grab'
    if (!isHovered) {
      resumeTimer = setTimeout(() => { isPaused = false }, IDLE_RESUME)
    }
  }

  wrapper.addEventListener('mousedown', e => {
    if (e.target.closest('.carousel-zone')) return
    handleStart(e.clientX)
  })
  window.addEventListener('mousemove', e => handleMove(e.clientX))
  window.addEventListener('mouseup', handleEnd)

  wrapper.addEventListener('touchstart', e => handleStart(e.touches[0].clientX), { passive: true })
  wrapper.addEventListener('touchmove', e => handleMove(e.touches[0].clientX), { passive: true })
  wrapper.addEventListener('touchend', handleEnd)

  wrapper.addEventListener('mouseenter', () => { isHovered = true; isPaused = true; })
  wrapper.addEventListener('mouseleave', () => { 
    isHovered = false; 
    if (!isDragging) resumeTimer = setTimeout(() => { isPaused = false }, 1000)
  })

  // Zonas laterais
  function shiftBy(dir) {
    clearTimeout(resumeTimer)
    isJumping = true
    isPaused  = true
    targetX   = currentX + dir * getCardStep()
  }

  const zonePrev = document.createElement('div')
  zonePrev.className = 'carousel-zone carousel-zone--prev'
  zonePrev.addEventListener('click', (e) => { e.stopPropagation(); shiftBy(1); })
  
  const zoneNext = document.createElement('div')
  zoneNext.className = 'carousel-zone carousel-zone--next'
  zoneNext.addEventListener('click', (e) => { e.stopPropagation(); shiftBy(-1); })

  wrapper.appendChild(zonePrev)
  wrapper.appendChild(zoneNext)

  /* ─── RENDER LOOP ─── */
  function render() {
    const loopPoint = (track.scrollWidth + 20) / 2

    // 1. Auto-scroll
    if (!isPaused && !isDragging && !isJumping) {
      currentX -= scrollSpeed
    }

    // 2. Jump/Shift interpolation
    if (isJumping && targetX !== null) {
      const dist = targetX - currentX
      currentX += dist * 0.12 // Ease out
      if (Math.abs(dist) < 0.5) {
        currentX = targetX
        isJumping = false
        targetX = null
        if (!isHovered) resumeTimer = setTimeout(() => { isPaused = false }, IDLE_RESUME)
      }
    }

    // 3. Infinite Wrap — Sincroniza o targetX para evitar giros infinitos
    if (currentX > 0) {
      currentX -= loopPoint
      if (targetX !== null) targetX -= loopPoint
    }
    if (currentX < -loopPoint) {
      currentX += loopPoint
      if (targetX !== null) targetX += loopPoint
    }

    // 4. Apply
    track.style.transform = `translateX(${currentX}px)`
    updateActiveDot(currentX)

    requestAnimationFrame(render)
  }

  // Ajusta ao redimensionar
  window.addEventListener('resize', () => {
    scrollSpeed = window.innerWidth < 768 ? 0.35 : 0.6
  })

  initCentering()
  render()
})()


/* 
   CONTACT FORM & SUCCESS MODAL
*/
;(function () {
  const contactForm = document.getElementById('contact-form')
  const successModal = document.getElementById('success-modal')
  const closeModalBtns = document.querySelectorAll('#close-modal, #modal-confirm-btn')
  
  if (!contactForm || !successModal) return

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault()

    // 1. Get data
    const name = document.getElementById('name').value
    const email = document.getElementById('email').value
    const subject = document.getElementById('subject').value
    const message = document.getElementById('message').value

    // 2. Format mailto
    const recipient = 'goldlgbt@gmail.com'
    const emailSubject = encodeURIComponent(`Site GOLD: ${subject}`)
    const emailBody = encodeURIComponent(
      `Nome: ${name}\n` +
      `E-mail de contato: ${email}\n\n` +
      `Mensagem:\n${message}`
    )

    // 3. Open mail client
    window.location.href = `mailto:${recipient}?subject=${emailSubject}&body=${emailBody}`

    // 4. Show success modal
    successModal.classList.add('active')

    // 5. Clear form (optional but recommended)
    contactForm.reset()
  })

  // Close modal logic
  closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      successModal.classList.remove('active')
    })
  })

  // Close modal on backdrop click
  successModal.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-backdrop-blur')) {
      successModal.classList.remove('active')
    }
  })
})()


/* 
   CONTRIBUA FOCUS (v3) — Definitive Mobile Scroll Effect
*/
;(function () {
  const cards = document.querySelectorAll('.contribua-card')
  const section = document.querySelector('.contribua-section')
  if (!cards.length || !section) return

  function updateFocus() {
    if (window.innerWidth >= 992) return

    const viewportCenter = window.innerHeight * 0.5
    let closestCard = null
    let minDistance = Infinity

    cards.forEach(card => {
      const rect = card.getBoundingClientRect()
      const cardCenter = rect.top + rect.height / 2
      const distance = Math.abs(viewportCenter - cardCenter)

      // Threshold estrito para considerar "no centro" (150px)
      if (distance < minDistance && distance < 150) {
        minDistance = distance
        closestCard = card
      }
    })

    cards.forEach(card => {
      if (card === closestCard) {
        card.classList.add('in-focus')
      } else {
        card.classList.remove('in-focus')
        card.classList.remove('is-flipped')
      }
    })
  }

  // Toggle do PIX — Simplificado e direto
  section.addEventListener('click', (e) => {
    // Procura se o clique foi no card do PIX ou dentro dele
    const pixCard = e.target.closest('.card-pix')
    if (pixCard) {
      pixCard.classList.toggle('is-flipped')
    }
  })

  window.addEventListener('scroll', updateFocus, { passive: true })
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 992) {
      cards.forEach(c => {
        c.classList.remove('in-focus')
      })
    }
    updateFocus()
  })

  // Lógica de Cópia do PIX
  const btnCopy = section.querySelector('.btn-copy-pix')
  const keyText = section.querySelector('.pix-key-text')

  if (btnCopy && keyText) {
    btnCopy.addEventListener('click', (e) => {
      e.preventDefault()
      e.stopPropagation() // Não deixa o card "desvirar" ao clicar em copiar

      const text = keyText.innerText.replace(/\s/g, '').replace(/-/g, '') // Limpa formatação
      navigator.clipboard.writeText(text).then(() => {
        btnCopy.classList.add('copied')
        
        // Feedback visual temporário
        setTimeout(() => {
          btnCopy.classList.remove('copied')
        }, 2000)
      })
    })
  }

  // Inicializa imediatamente e após um breve delay (para layouts dinâmicos)
  updateFocus()
  setTimeout(updateFocus, 100)
})()

