// =============================================
//   APOLOGY WEBSITE — script.js  (mobile-optimised)
// =============================================

// ── Data ─────────────────────────────────────
// Replace image URLs with your own photos!
const moments = [
    {
        emoji: "🌹",
        image: "img/img1.gif",
        caption: "I was wrong, and I knew it the moment it happened. I'm so deeply sorry for hurting you."
    },
    {
        emoji: "💌",
        image: "img/img2.gif",
        caption: "Miss you soooo much."
    },
    {
        emoji: "😊",
        image: "img/img3.gif",
        caption: "Smile Baby."
    },
    {
        emoji: "✨",
        image: "img/img4.gif",
        caption: "You mean everything to me — more than I can say in words, but I promise to show you."
    },
    {
        emoji: "🌸",
        image: "img/img5.gif",
        caption: "Please forgive me. I Love You."
    },
    {
        emoji: "💫",
        image: "img/img6.gif",
        caption: "Kissi Lo Tikh Ho Jaogi."
    }
];

const bgMusic = document.getElementById("bgMusic");
let musicStarted = false;

// ── Detect mobile ─────────────────────────────
const isMobile = () => window.matchMedia('(hover: none) and (pointer: coarse)').matches;

// ── Floating petals ───────────────────────────
function createPetals() {
    const container = document.getElementById('petals');
    const symbols = ['🌸', '🌹', '🌷', '💕', '✨', '🌺'];
    // Fewer petals on mobile to save battery / GPU
    const count = isMobile() ? 10 : 18;

    for (let i = 0; i < count; i++) {
        const el = document.createElement('span');
        el.className = 'petal';
        el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        el.setAttribute('aria-hidden', 'true');

        el.style.left = `${Math.random() * 100}%`;
        el.style.animationDuration = `${8 + Math.random() * 10}s`;
        el.style.animationDelay = `${Math.random() * 14}s`;
        el.style.fontSize = `${0.7 + Math.random() * 1.1}rem`;

        container.appendChild(el);
    }
}

// ── Ripple ────────────────────────────────────
// Inject keyframe once
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
  @keyframes rippleAnim {
    to { transform: translate(-50%, -50%) scale(22); opacity: 0; }
  }
`;
document.head.appendChild(rippleStyle);

function addRipple(btn) {
    const r = document.createElement('span');
    r.style.cssText = `
    position:absolute; border-radius:50%;
    width:10px; height:10px;
    background:rgba(255,255,255,0.4);
    top:50%; left:50%;
    transform:translate(-50%,-50%) scale(0);
    animation:rippleAnim 0.5s ease-out forwards;
    pointer-events:none; z-index:10;
  `;
    btn.appendChild(r);
    setTimeout(() => r.remove(), 550);
}

// ── Overlay state ─────────────────────────────
const overlay = document.getElementById('overlay');
const overlayCard = document.getElementById('overlayCard');
const overlayBackdrop = document.getElementById('overlayBackdrop');
const overlayImg = document.getElementById('overlayImg');
const overlayCaption = document.getElementById('overlayCaption');
const closeBtn = document.getElementById('closeBtn');
const dismissBtn = document.getElementById('dismissBtn');

function openOverlay(index) {
    const data = moments[index];

    overlayCaption.textContent = data.caption;

    // Clear previous image / fallback
    const wrap = overlayImg.parentElement;
    const existing = wrap.querySelector('.image-fallback');
    if (existing) existing.remove();
    overlayImg.style.display = 'block';
    overlayImg.style.opacity = '0';
    overlayImg.src = '';

    // Load image
    const img = new Image();
    img.onload = () => {
        overlayImg.src = img.src;
        overlayImg.style.opacity = '1';
    };
    img.onerror = () => {
        overlayImg.style.display = 'none';
        const fallback = document.createElement('div');
        fallback.className = 'image-fallback';
        fallback.innerHTML = `
      <span class="big-emoji" aria-hidden="true">${data.emoji}</span>
      <p>A moment from my heart</p>
    `;
        wrap.appendChild(fallback);
    };
    img.src = data.image;

    overlay.classList.add('visible');
    // Prevent background scroll
    document.body.style.overflow = 'hidden';

    // Focus close button for accessibility
    setTimeout(() => closeBtn.focus(), 400);
}

function closeOverlay() {
    overlay.classList.remove('visible');
    document.body.style.overflow = '';
    setTimeout(() => {
        overlayImg.src = '';
        const fb = overlayCard.querySelector('.image-fallback');
        if (fb) fb.remove();
        overlayImg.style.display = 'block';
    }, 420);
}

// ── Close triggers ────────────────────────────
closeBtn.addEventListener('click', closeOverlay);
dismissBtn.addEventListener('click', closeOverlay);
overlayBackdrop.addEventListener('click', closeOverlay);
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeOverlay();
});

// ── Swipe-down to dismiss (mobile) ───────────
let touchStartY = 0;
let touchStartX = 0;

overlayCard.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
    touchStartX = e.touches[0].clientX;
}, { passive: true });

overlayCard.addEventListener('touchend', (e) => {
    const dy = e.changedTouches[0].clientY - touchStartY;
    const dx = Math.abs(e.changedTouches[0].clientX - touchStartX);
    // Swipe down > 80px and mostly vertical
    if (dy > 80 && dx < 60) {
        closeOverlay();
    }
}, { passive: true });

// ── Glass buttons ─────────────────────────────
document.querySelectorAll('.glass-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id, 10);

        // ▶ Start music only once
        if (!musicStarted) {
            bgMusic.play().catch(() => { });
            musicStarted = true;
        }

        addRipple(btn);
        setTimeout(() => openOverlay(id), 160);
    });

    // Touch feedback — add pressed class
    btn.addEventListener('touchstart', () => {
        btn.classList.add('pressed');
    }, { passive: true });

    btn.addEventListener('touchend', () => {
        btn.classList.remove('pressed');
    }, { passive: true });
});

// ── Init ──────────────────────────────────────
createPetals();