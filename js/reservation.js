/**
 * THE AMBER GLOW CAFE AJMER — RESERVATION ENGINE
 * Handles client-side validation, demo localStorage persistence, and confirmation card rendering.
 * 
 * IMPORTANT ARCHITECTURAL NOTE:
 * In this client-side frontend demo, submissions are saved to browser `localStorage` under 'cafeReservations'.
 * For a live production deployment, replace the localStorage save with an authenticated HTTPS POST
 * request to your secure backend API / database (e.g. Node/Express, Firebase, PostgreSQL).
 */

document.addEventListener('DOMContentLoaded', () => {
    initReservationForm();
});

function initReservationForm() {
    const form = document.getElementById('reservationForm');
    const successCard = document.getElementById('reservationSuccessCard');
    const dateInput = document.getElementById('resDate');

    if (!form) return;

    // 1. Prevent past dates in date picker
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }

    // 2. Real-time input cleanup on type
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            if (input.classList.contains('is-invalid')) {
                validateField(input);
            }
        });
    });

    // 3. Form Submission Handler
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameInput = document.getElementById('resName');
        const phoneInput = document.getElementById('resPhone');
        const emailInput = document.getElementById('resEmail');
        const dateInput = document.getElementById('resDate');
        const timeInput = document.getElementById('resTime');
        const guestsInput = document.getElementById('resGuests');
        const seatingInput = document.getElementById('resSeating');
        const occasionInput = document.getElementById('resOccasion');
        const specialRequestInput = document.getElementById('resSpecialRequest');

        // Validation Checks
        let isValid = true;

        if (!nameInput.value.trim()) {
            setFieldError(nameInput, 'Full Name is required');
            isValid = false;
        } else {
            clearFieldError(nameInput);
        }

        const phoneRegex = /^[6-9]\d{9}$/;
        const cleanPhone = phoneInput.value.trim().replace(/[\s-]/g, '');
        if (!cleanPhone) {
            setFieldError(phoneInput, 'Mobile Number is required');
            isValid = false;
        } else if (!phoneRegex.test(cleanPhone)) {
            setFieldError(phoneInput, 'Enter a valid 10-digit Indian mobile number (e.g., 9876543210)');
            isValid = false;
        } else {
            clearFieldError(phoneInput);
        }

        if (emailInput.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value.trim())) {
                setFieldError(emailInput, 'Please enter a valid email address or leave blank');
                isValid = false;
            } else {
                clearFieldError(emailInput);
            }
        } else {
            clearFieldError(emailInput);
        }

        if (!dateInput.value) {
            setFieldError(dateInput, 'Please select a reservation date');
            isValid = false;
        } else {
            const selectedDate = new Date(dateInput.value);
            const todayDate = new Date();
            todayDate.setHours(0, 0, 0, 0);
            if (selectedDate < todayDate) {
                setFieldError(dateInput, 'Reservation date cannot be in the past');
                isValid = false;
            } else {
                clearFieldError(dateInput);
            }
        }

        if (!timeInput.value) {
            setFieldError(timeInput, 'Please choose a preferred time slot');
            isValid = false;
        } else {
            clearFieldError(timeInput);
        }

        if (!guestsInput.value) {
            setFieldError(guestsInput, 'Please select number of guests');
            isValid = false;
        } else {
            clearFieldError(guestsInput);
        }

        if (!isValid) {
            const firstError = form.querySelector('.is-invalid');
            if (firstError) firstError.focus();
            return;
        }

        // Generate Reference ID: AG-2026-XXXX
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const referenceId = `AG-2026-${randomNum}`;

        // Reservation Record
        const reservationRecord = {
            id: referenceId,
            name: nameInput.value.trim(),
            phone: cleanPhone,
            email: emailInput.value.trim() || 'N/A',
            date: dateInput.value,
            time: timeInput.value,
            guests: guestsInput.value,
            seatingPreference: seatingInput ? seatingInput.value : 'No Preference',
            occasion: occasionInput ? occasionInput.value : 'Casual Dining',
            specialRequest: specialRequestInput ? specialRequestInput.value.trim() : '',
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        // Save into localStorage (Demo Persistence)
        try {
            const existing = JSON.parse(localStorage.getItem('cafeReservations') || '[]');
            existing.push(reservationRecord);
            localStorage.setItem('cafeReservations', JSON.stringify(existing));
        } catch (err) {
            console.warn('LocalStorage unavailable or disabled:', err);
        }

        // Render Success View
        renderSuccessView(reservationRecord, form, successCard);
    });
}

function validateField(input) {
    if (input.required && !input.value.trim()) {
        setFieldError(input, 'This field is required');
    } else {
        clearFieldError(input);
    }
}

function setFieldError(input, message) {
    input.classList.add('is-invalid');
    const parent = input.closest('.form-group');
    if (parent) {
        let err = parent.querySelector('.form-error');
        if (!err) {
            err = document.createElement('span');
            err.className = 'form-error';
            parent.appendChild(err);
        }
        err.textContent = message;
    }
}

function clearFieldError(input) {
    input.classList.remove('is-invalid');
}

function renderSuccessView(data, form, successCard) {
    form.style.display = 'none';

    // Format date for readable display
    let formattedDate = data.date;
    try {
        const d = new Date(data.date);
        formattedDate = d.toLocaleDateString('en-IN', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    } catch (e) {}

    successCard.innerHTML = `
        <div class="success-icon">✨</div>
        <h2 style="color: var(--cream); margin-bottom: 8px;">Reservation Request Received</h2>
        <p style="color: var(--beige); margin-bottom: 24px;">
            Thank you, <strong style="color: var(--gold);">${escapeHtml(data.name)}</strong>. We have received your booking request!
        </p>

        <div class="success-reference-box">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <span class="reference-badge">Reference: ${data.id}</span>
                <span class="success-status-pill">Pending Confirmation</span>
            </div>

            <div class="success-detail-row">
                <span style="color: var(--text-dim);">Date</span>
                <span style="color: var(--cream); font-weight: 500;">${formattedDate}</span>
            </div>
            <div class="success-detail-row">
                <span style="color: var(--text-dim);">Time</span>
                <span style="color: var(--cream); font-weight: 500;">${escapeHtml(data.time)}</span>
            </div>
            <div class="success-detail-row">
                <span style="color: var(--text-dim);">Guests</span>
                <span style="color: var(--cream); font-weight: 500;">${escapeHtml(data.guests)} Guest(s)</span>
            </div>
            <div class="success-detail-row">
                <span style="color: var(--text-dim);">Phone</span>
                <span style="color: var(--cream); font-weight: 500;">+91 ${escapeHtml(data.phone)}</span>
            </div>
            <div class="success-detail-row">
                <span style="color: var(--text-dim);">Seating</span>
                <span style="color: var(--cream); font-weight: 500;">${escapeHtml(data.seatingPreference)}</span>
            </div>
            <div class="success-detail-row">
                <span style="color: var(--text-dim);">Occasion</span>
                <span style="color: var(--cream); font-weight: 500;">${escapeHtml(data.occasion)}</span>
            </div>
        </div>

        <div style="background: rgba(217, 164, 65, 0.08); border-left: 3px solid var(--gold); padding: 12px 16px; border-radius: 4px; max-width: 460px; margin: 0 auto 28px; text-align: left;">
            <p style="font-size: 0.84rem; color: var(--beige); margin: 0;">
                <strong style="color: var(--amber);">Please Note:</strong> Our cafe team will verify table availability and call you shortly to confirm your booking.
            </p>
        </div>

        <div style="display: flex; justify-content: center; gap: 16px; flex-wrap: wrap;">
            <a href="index.html" class="btn btn-secondary">Back to Home</a>
            <a href="tel:+911234567890" class="btn btn-primary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                Call Café (+91 1234567890)
            </a>
        </div>
    `;

    successCard.style.display = 'block';
    successCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
