/**
 * PuneUP Real Estate Portal - Master Script
 * Modal Management, Toast Notifications, Wishlist & Interactions
 */

// Global Wishlist State backed by localStorage
let wishlist = new Set();
try {
    const saved = localStorage.getItem('puneup_wishlist');
    if (saved) {
        wishlist = new Set(JSON.parse(saved));
    }
} catch (e) {
    wishlist = new Set();
}

function saveWishlist() {
    try {
        localStorage.setItem('puneup_wishlist', JSON.stringify(Array.from(wishlist)));
    } catch (e) {
        // storage disabled or full
    }
    updateWishlistBadge();
}

function updateWishlistBadge() {
    const badges = document.querySelectorAll('#wishlistBadge');
    badges.forEach(b => {
        if (b) b.innerText = wishlist.size;
    });
}

function toggleWishlist(id) {
    if (wishlist.has(id)) {
        wishlist.delete(id);
        showToast('Removed from your shortlisted properties', 'info');
    } else {
        wishlist.add(id);
        showToast('Saved to your shortlisted properties ❤️', 'success');
    }
    saveWishlist();
    
    // If on a page with properties grid, re-render or update heart icons
    if (typeof filterListings === 'function') {
        filterListings();
    } else if (typeof renderProperties === 'function' && typeof puneProperties !== 'undefined') {
        renderProperties(puneProperties);
    }
}

// Toast Notification System
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    const toastIcon = document.getElementById('toastIcon');

    if (!toast || !toastMessage) {
        alert(message);
        return;
    }

    toastMessage.innerText = message;
    if (toastIcon) {
        if (type === 'success') {
            toastIcon.className = "fa-solid fa-circle-check text-brand-500 text-base";
        } else if (type === 'info') {
            toastIcon.className = "fa-solid fa-circle-info text-blue-400 text-base";
        } else if (type === 'error') {
            toastIcon.className = "fa-solid fa-circle-exclamation text-rose-500 text-base";
        }
    }

    toast.classList.remove('translate-y-24', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');

    setTimeout(() => {
        toast.classList.add('translate-y-24', 'opacity-0');
        toast.classList.remove('translate-y-0', 'opacity-100');
    }, 3200);
}

// Modal Helpers
function openModal(id) {
    const el = document.getElementById(id);
    if (el) {
        el.classList.remove('hidden');
        el.classList.add('flex');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(id) {
    const el = document.getElementById(id);
    if (el) {
        el.classList.add('hidden');
        el.classList.remove('flex');
        document.body.style.overflow = '';
    }
}

// Quick action handlers
function contactAgent(name) {
    showToast(`Opening WhatsApp chat with ${name}...`, 'info');
    window.open(`https://wa.me/919823045210?text=Hello%20${encodeURIComponent(name)},%20I%20am%20interested%20in%20a%20Pune%20property%20listing%20on%20PuneUP.`, '_blank');
}

function callAgent(phone) {
    showToast(`Connecting to ${phone}...`, 'info');
    window.location.href = `tel:${phone.replace(/\s+/g, '')}`;
}

function selectPackage(plan, price) {
    showToast(`Selected ${plan} package (₹${price}). Redirecting to checkout...`, 'success');
}

function handleSiteVisit(e, title) {
    if (e && e.preventDefault) e.preventDefault();
    closeModal('propertyModal');
    showToast(`Site inspection confirmed for ${title}! Our Pune consultant will call within 15 minutes.`, 'success');
    if (e && e.target && e.target.reset) e.target.reset();
}

function handlePostProperty(e) {
    if (e && e.preventDefault) e.preventDefault();
    closeModal('postPropertyModal');
    showToast('Your Pune listing has been submitted for MahaRERA verification!', 'success');
    if (e && e.target && e.target.reset) e.target.reset();
}

function handleContactSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();
    closeModal('contactModal');
    showToast('Inquiry received! Our Senapati Bapat Road desk will reach out shortly.', 'success');
    if (e && e.target && e.target.reset) e.target.reset();
}

function handleLoginSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();
    closeModal('loginModal');
    showToast('Welcome back to PuneUP! You are logged in.', 'success');
    if (e && e.target && e.target.reset) e.target.reset();
}

function handleNewsletter(e) {
    if (e && e.preventDefault) e.preventDefault();
    showToast('Subscribed! You will receive the Pune Real Estate Price Index report.', 'success');
    if (e && e.target && e.target.reset) e.target.reset();
}

// Global DOM Initialization
document.addEventListener('DOMContentLoaded', () => {
    updateWishlistBadge();

    // Mobile Menu Toggle Button
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Close modals on outside backdrop click
    ['propertyModal', 'postPropertyModal', 'contactModal', 'loginModal'].forEach(id => {
        const modal = document.getElementById(id);
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal(id);
                }
            });
        }
    });

    // Wishlist button click: open properties page filtered by wishlist if available
    const wishlistBtn = document.getElementById('wishlistBtn');
    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', () => {
            const isSubfolder = window.location.pathname.includes('/HTML/') || window.location.pathname.includes('\\HTML\\');
            if (typeof filterByWishlist === 'function') {
                filterByWishlist();
            } else {
                window.location.href = isSubfolder ? 'properties.html?filter=wishlist' : 'HTML/properties.html?filter=wishlist';
            }
        });
    }
});
