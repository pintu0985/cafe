/**
 * THE AMBER GLOW CAFE AJMER — GALLERY & LIGHTBOX ENGINE
 * Categorized gallery with filtering and interactive modal lightbox.
 */

// Gallery item dataset (easy for cafe owner to expand)
const galleryItems = [
    {
        id: 1,
        title: "Evening Fairy Light Glow",
        category: "Ambience",
        image: "assets/images/hero-cafe.jpg",
        alt: "Outdoor cafe pergola illuminated with golden fairy lights"
    },
    {
        id: 2,
        title: "Cozy Velvet Lounge Corner",
        category: "Cafe",
        image: "assets/images/cozy-corner.jpg",
        alt: "Cozy cafe lounge with plush seating and string lights"
    },
    {
        id: 3,
        title: "Romantic Table For Two",
        category: "Moments",
        image: "assets/images/date-night.jpg",
        alt: "Couple enjoying coffee and dessert under fairy lights"
    },
    {
        id: 4,
        title: "Artisan Wood-Fired Style Pizza",
        category: "Food",
        image: "assets/images/pizza.jpg",
        alt: "Freshly baked artisan thin crust pizza with basil and mozzarella"
    },
    {
        id: 5,
        title: "Creamy Alfredo Fettuccine",
        category: "Food",
        image: "assets/images/pasta.jpg",
        alt: "Gourmet creamy pasta in elegant bowl with parmesan"
    },
    {
        id: 6,
        title: "Signature Espresso Latte Art",
        category: "Drinks",
        image: "assets/images/coffee.jpg",
        alt: "Specialty coffee latte with delicate latte art and coffee beans"
    },
    {
        id: 7,
        title: "Gathering With Friends",
        category: "Moments",
        image: "assets/images/friends-cafe.jpg",
        alt: "Group of friends laughing and dining at evening cafe"
    },
    {
        id: 8,
        title: "Special Celebrations & Sparkles",
        category: "Moments",
        image: "assets/images/celebration.jpg",
        alt: "Birthday cake with celebration sparkles and fairy lights"
    },
    {
        id: 9,
        title: "Handcrafted Gourmet Burger",
        category: "Food",
        image: "assets/images/burger.jpg",
        alt: "Juicy gourmet burger on wooden board with fries"
    },
    {
        id: 10,
        title: "Berry Citrus Sparkler",
        category: "Drinks",
        image: "assets/images/beverage.jpg",
        alt: "Chilled mocktail with fresh berries and citrus slice"
    },
    {
        id: 11,
        title: "Molten Chocolate Lava Cake",
        category: "Food",
        image: "assets/images/dessert.jpg",
        alt: "Warm chocolate lava cake with vanilla gelato and gold flakes"
    }
];

let currentLightboxIndex = 0;
let filteredItems = [...galleryItems];

document.addEventListener('DOMContentLoaded', () => {
    initGallery();
    initLightbox();
});

function initGallery() {
    const galleryGrid = document.getElementById('galleryGrid');
    const filterBtns = document.querySelectorAll('.gallery-filter-btn');

    if (!galleryGrid) return;

    // Initial render
    renderGallery(galleryItems);

    // Filter clicks
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.dataset.filter;
            if (category === 'all') {
                filteredItems = [...galleryItems];
            } else {
                filteredItems = galleryItems.filter(item => item.category.toLowerCase() === category.toLowerCase());
            }

            renderGallery(filteredItems);
        });
    });
}

function renderGallery(items) {
    const galleryGrid = document.getElementById('galleryGrid');
    if (!galleryGrid) return;

    if (items.length === 0) {
        galleryGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                <p style="color: var(--text-dim);">No images found in this category.</p>
            </div>
        `;
        return;
    }

    galleryGrid.innerHTML = items.map((item, index) => `
        <div class="gallery-item reveal revealed" data-index="${index}" tabindex="0" role="button" aria-label="View ${escapeHtml(item.title)}">
            <img src="${item.image}" alt="${escapeHtml(item.alt)}" loading="lazy">
            <div class="gallery-item-overlay">
                <div class="gallery-item-info">
                    <h4>${escapeHtml(item.title)}</h4>
                    <span>${escapeHtml(item.category)}</span>
                </div>
            </div>
        </div>
    `).join('');

    // Attach click events for lightbox
    const elements = galleryGrid.querySelectorAll('.gallery-item');
    elements.forEach(el => {
        el.addEventListener('click', () => {
            const idx = parseInt(el.getAttribute('data-index'), 10);
            openLightbox(idx);
        });

        el.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const idx = parseInt(el.getAttribute('data-index'), 10);
                openLightbox(idx);
            }
        });
    });
}

function initLightbox() {
    const modal = document.getElementById('galleryLightbox');
    const closeBtn = document.getElementById('lightboxClose');
    const prevBtn = document.getElementById('lightboxPrev');
    const nextBtn = document.getElementById('lightboxNext');

    if (!modal) return;

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (prevBtn) prevBtn.addEventListener('click', showPrevLightbox);
    if (nextBtn) nextBtn.addEventListener('click', showNextLightbox);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('active')) return;

        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrevLightbox();
        if (e.key === 'ArrowRight') showNextLightbox();
    });
}

function openLightbox(index) {
    const modal = document.getElementById('galleryLightbox');
    if (!modal || !filteredItems[index]) return;

    currentLightboxIndex = index;
    updateLightboxContent();
    modal.classList.add('active');
    document.body.classList.add('menu-open');
}

function closeLightbox() {
    const modal = document.getElementById('galleryLightbox');
    if (!modal) return;

    modal.classList.remove('active');
    document.body.classList.remove('menu-open');
}

function showPrevLightbox() {
    if (filteredItems.length <= 1) return;
    currentLightboxIndex = (currentLightboxIndex - 1 + filteredItems.length) % filteredItems.length;
    updateLightboxContent();
}

function showNextLightbox() {
    if (filteredItems.length <= 1) return;
    currentLightboxIndex = (currentLightboxIndex + 1) % filteredItems.length;
    updateLightboxContent();
}

function updateLightboxContent() {
    const img = document.getElementById('lightboxImage');
    const title = document.getElementById('lightboxTitle');
    const category = document.getElementById('lightboxCategory');
    const current = filteredItems[currentLightboxIndex];

    if (!current) return;

    if (img) {
        img.src = current.image;
        img.alt = current.alt;
    }
    if (title) title.textContent = current.title;
    if (category) category.textContent = current.category;
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
