/**
 * PuneUP Real Estate Portal - Properties Controller
 * Rendering, Filtering, Search, Sorting, and Modal View
 */

let currentTabFilter = 'all';
let currentLocality = 'all';
let currentType = 'all';
let currentPriceBucket = 'all';
let currentBeds = 'all';
let currentSort = 'default';
let currentSearch = '';
let filterOnlyWishlist = false;

function getDetailsUrl(id) {
    const isSub = window.location.pathname.includes('/HTML/') || window.location.pathname.includes('\\HTML\\');
    return isSub ? `property-details.html?id=${id}` : `HTML/property-details.html?id=${id}`;
}

function createPropertyCard(item) {
    const isFavorite = wishlist && wishlist.has ? wishlist.has(item.id) : false;
    const badgeColor = item.listingType === 'Sale' ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white';
    const detailsUrl = getDetailsUrl(item.id);

    return `
        <div class="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col group">
            
            <!-- Image Container with Tags -->
            <div class="relative h-60 overflow-hidden bg-slate-900">
                <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'">
                <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60"></div>

                <div class="absolute top-4 left-4 flex gap-2 items-center">
                    <span class="px-3.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wide ${badgeColor} shadow-lg shadow-black/20">
                        For ${item.listingType}
                    </span>
                    <span class="px-3 py-1 rounded-full text-[11px] font-bold bg-white/95 backdrop-blur-md text-slate-800 shadow-md">
                        ${item.category}
                    </span>
                </div>

                <button onclick="toggleWishlist(${item.id})" class="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md text-slate-600 hover:text-red-500 hover:bg-white flex items-center justify-center shadow-lg active:scale-90 transition-all" title="Save to Shortlist">
                    <i class="${isFavorite ? 'fa-solid text-red-500 scale-110' : 'fa-regular'} fa-heart text-sm transition-transform"></i>
                </button>

                <div class="absolute bottom-3 left-4 bg-slate-950/80 backdrop-blur-md text-white px-3 py-1 rounded-xl text-[11px] font-semibold flex items-center gap-1.5 border border-white/10 shadow-md">
                    <i class="fa-solid fa-certificate text-emerald-400"></i> MahaRERA: ${item.reraId}
                </div>
            </div>

            <!-- Content Card Details -->
            <div class="p-6 flex-1 flex flex-col justify-between">
                <div>
                    <div class="flex items-center gap-1.5 text-xs text-brand-600 font-semibold mb-1.5">
                        <i class="fa-solid fa-location-dot"></i>
                        <span>${item.address}</span>
                    </div>

                    <a href="${detailsUrl}">
                        <h3 class="text-base sm:text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-1">
                            ${item.title}
                        </h3>
                    </a>

                    <!-- Property Specs Pill Container -->
                    <div class="grid grid-cols-3 gap-2 p-2.5 rounded-2xl bg-slate-50 border border-slate-100 my-4 text-center">
                        <div>
                            <span class="block text-[10px] font-bold uppercase text-slate-400">Beds</span>
                            <span class="text-xs font-extrabold text-slate-800 flex items-center justify-center gap-1 mt-0.5">
                                <i class="fa-solid fa-bed text-slate-400 text-[11px]"></i> ${item.beds > 0 ? item.beds + ' BHK' : 'Studio'}
                            </span>
                        </div>
                        <div class="border-x border-slate-200/80">
                            <span class="block text-[10px] font-bold uppercase text-slate-400">Baths</span>
                            <span class="text-xs font-extrabold text-slate-800 flex items-center justify-center gap-1 mt-0.5">
                                <i class="fa-solid fa-bath text-slate-400 text-[11px]"></i> ${item.baths} Bath
                            </span>
                        </div>
                        <div>
                            <span class="block text-[10px] font-bold uppercase text-slate-400">Carpet</span>
                            <span class="text-xs font-extrabold text-slate-800 flex items-center justify-center gap-1 mt-0.5">
                                <i class="fa-solid fa-vector-square text-slate-400 text-[11px]"></i> ${item.area}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Footer: Price and CTAs -->
                <div class="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                    <div>
                        <span class="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">All-Inclusive</span>
                        <span class="text-xl font-extrabold text-slate-900 text-brand-700">${item.priceDisplay}</span>
                    </div>

                    <div class="flex items-center gap-2">
                        <button onclick="openPropertyModal(${item.id})" class="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs active:scale-95 transition-all">
                            Quick View
                        </button>
                        <a href="${detailsUrl}" class="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-600/25 active:scale-95 transition-all flex items-center gap-1">
                            <span>Details</span>
                            <i class="fa-solid fa-arrow-right text-[10px]"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderProperties(list) {
    const grid = document.getElementById('propertiesGrid');
    if (!grid) return;

    const countLabel = document.getElementById('resultsCount');
    if (countLabel) {
        countLabel.innerText = `Showing ${list.length} verified ${list.length === 1 ? 'property' : 'properties'} in Pune`;
    }

    if (list.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full py-16 text-center bg-white rounded-3xl border border-slate-200">
                <div class="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-2xl mx-auto mb-3">
                    <i class="fa-solid fa-magnifying-glass"></i>
                </div>
                <h4 class="text-lg font-bold text-slate-800">No Pune Properties Found</h4>
                <p class="text-xs text-slate-500 max-w-sm mx-auto mt-1">We couldn't find matches for this specific criteria. Try clearing filters or picking a different budget.</p>
                <button onclick="resetPropertyFilters()" class="mt-4 px-5 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-semibold shadow-md shadow-brand-600/20">
                    Reset Search Filters
                </button>
            </div>
        `;
        return;
    }

    grid.innerHTML = list.map(item => createPropertyCard(item)).join('');
}

function filterListings() {
    if (typeof puneProperties === 'undefined') return;

    let filtered = puneProperties.filter(item => {
        // Tab filter (Sale, Rent, all)
        if (currentTabFilter !== 'all' && item.listingType !== currentTabFilter) {
            return false;
        }

        // Wishlist Only filter
        if (filterOnlyWishlist && !wishlist.has(item.id)) {
            return false;
        }

        // Locality filter
        if (currentLocality !== 'all' && !item.locality.toLowerCase().includes(currentLocality.toLowerCase())) {
            return false;
        }

        // Category filter
        if (currentType !== 'all' && item.category !== currentType) {
            return false;
        }

        // Bedrooms filter
        if (currentBeds !== 'all') {
            const b = parseInt(currentBeds, 10);
            if (b === 4 && item.beds < 4) return false;
            if (b < 4 && item.beds !== b) return false;
        }

        // Price bucket filter
        if (currentPriceBucket === 'under-50L' && item.priceNumeric > 5000000) return false;
        if (currentPriceBucket === '50L-1Cr' && (item.priceNumeric <= 5000000 || item.priceNumeric > 10000000)) return false;
        if (currentPriceBucket === '1Cr-2.5Cr' && (item.priceNumeric <= 10000000 || item.priceNumeric > 25000000)) return false;
        if (currentPriceBucket === 'above-2.5Cr' && item.priceNumeric <= 25000000) return false;

        // Search text
        if (currentSearch.trim() !== '') {
            const q = currentSearch.toLowerCase().trim();
            const haystack = `${item.title} ${item.locality} ${item.address} ${item.category} ${item.description}`.toLowerCase();
            if (!haystack.includes(q)) return false;
        }

        return true;
    });

    // Sorting
    if (currentSort === 'price-low') {
        filtered.sort((a, b) => a.priceNumeric - b.priceNumeric);
    } else if (currentSort === 'price-high') {
        filtered.sort((a, b) => b.priceNumeric - a.priceNumeric);
    } else if (currentSort === 'beds-high') {
        filtered.sort((a, b) => b.beds - a.beds);
    }

    renderProperties(filtered);
}

function setTabFilter(tab) {
    currentTabFilter = tab;
    document.querySelectorAll('.tab-btn').forEach(btn => {
        if (btn.getAttribute('data-tab') === tab) {
            btn.className = "tab-btn active px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-brand-600 text-white shadow-sm transition-all";
        } else {
            btn.className = "tab-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 transition-all";
        }
    });
    filterListings();
}

function filterByCategory(type) {
    currentType = type;
    const select = document.getElementById('searchType') || document.getElementById('filterType');
    if (select) select.value = type;
    filterListings();
    const sec = document.getElementById('properties-section');
    if (sec) sec.scrollIntoView({ behavior: 'smooth' });
    showToast(`Showing: ${type}`, 'info');
}

function filterByLocalityName(loc) {
    currentLocality = loc;
    const select = document.getElementById('searchLocality') || document.getElementById('filterLocality');
    if (select) select.value = loc;
    filterListings();
    const sec = document.getElementById('properties-section');
    if (sec) sec.scrollIntoView({ behavior: 'smooth' });
    showToast(`Showing properties in ${loc}`, 'info');
}

function filterByWishlist() {
    filterOnlyWishlist = !filterOnlyWishlist;
    filterListings();
    showToast(filterOnlyWishlist ? 'Showing shortlisted favorites' : 'Showing all listings', 'info');
}

function resetPropertyFilters() {
    currentTabFilter = 'all';
    currentLocality = 'all';
    currentType = 'all';
    currentPriceBucket = 'all';
    currentBeds = 'all';
    currentSort = 'default';
    currentSearch = '';
    filterOnlyWishlist = false;

    ['searchLocality', 'filterLocality', 'searchType', 'filterType', 'searchPrice', 'filterPrice', 'filterBeds', 'sortBy'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = el.options[0].value;
    });

    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = '';

    setTabFilter('all');
    showToast('Filters reset', 'info');
}

function openPropertyModal(id) {
    const property = (typeof puneProperties !== 'undefined') ? puneProperties.find(p => p.id === id) : null;
    if (!property) return;

    const modalContent = document.getElementById('propertyModalContent');
    if (!modalContent) return;

    const detailsUrl = getDetailsUrl(property.id);

    modalContent.innerHTML = `
        <div class="space-y-6">
            <div class="relative h-64 sm:h-80 rounded-2xl overflow-hidden bg-slate-100">
                <img src="${property.image}" alt="${property.title}" class="w-full h-full object-cover">
                <span class="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase bg-brand-600 text-white shadow-md">
                    For ${property.listingType}
                </span>
                <span class="absolute bottom-4 left-4 px-3 py-1 rounded-full text-xs font-semibold bg-slate-900/80 backdrop-blur-md text-white">
                    RERA: ${property.reraId}
                </span>
            </div>

            <div>
                <div class="flex items-center gap-1.5 text-xs text-brand-600 font-semibold mb-1">
                    <i class="fa-solid fa-map-pin"></i> ${property.address}
                </div>
                <h2 class="text-2xl font-bold text-slate-900">${property.title}</h2>
                <div class="text-2xl font-extrabold text-brand-600 mt-2">${property.priceDisplay}</div>
            </div>

            <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
                ${property.description}
            </p>

            <!-- Features -->
            <div class="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                <div>
                    <span class="block text-[11px] font-bold text-slate-400 uppercase">Bedrooms</span>
                    <span class="text-sm font-extrabold text-slate-800">${property.beds > 0 ? property.beds + ' BHK' : 'Studio'}</span>
                </div>
                <div>
                    <span class="block text-[11px] font-bold text-slate-400 uppercase">Bathrooms</span>
                    <span class="text-sm font-extrabold text-slate-800">${property.baths} Bath</span>
                </div>
                <div>
                    <span class="block text-[11px] font-bold text-slate-400 uppercase">Super Builtup</span>
                    <span class="text-sm font-extrabold text-slate-800">${property.area}</span>
                </div>
            </div>

            <!-- Amenities -->
            <div>
                <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Amenities</h4>
                <div class="flex flex-wrap gap-2">
                    ${property.amenities.map(a => `
                        <span class="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-100 text-xs font-medium flex items-center gap-1">
                            <i class="fa-solid fa-check text-[10px]"></i> ${a}
                        </span>
                    `).join('')}
                </div>
            </div>

            <!-- CTA Actions -->
            <div class="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                    <h4 class="text-sm font-bold text-slate-900">Want full photos & floor plan?</h4>
                    <p class="text-xs text-slate-500">View complete specifications and loan eligibility.</p>
                </div>
                <a href="${detailsUrl}" class="px-5 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs uppercase tracking-wider transition-colors shrink-0">
                    Open Full Page →
                </a>
            </div>
        </div>
    `;

    openModal('propertyModal');
}

// Bind Page Events on Load
document.addEventListener('DOMContentLoaded', () => {
    // Read URL query parameters
    const params = new URLSearchParams(window.location.search);
    if (params.get('locality')) {
        currentLocality = params.get('locality');
        const sel = document.getElementById('filterLocality') || document.getElementById('searchLocality');
        if (sel) sel.value = currentLocality;
    }
    if (params.get('type')) {
        currentType = params.get('type');
        const sel = document.getElementById('filterType') || document.getElementById('searchType');
        if (sel) sel.value = currentType;
    }
    if (params.get('filter') === 'wishlist') {
        filterOnlyWishlist = true;
    }

    // Initial render
    filterListings();

    // Hero Search Button (Home page)
    const heroSearchBtn = document.getElementById('heroSearchBtn');
    if (heroSearchBtn) {
        heroSearchBtn.addEventListener('click', () => {
            const locEl = document.getElementById('searchLocality');
            const typeEl = document.getElementById('searchType');
            const priceEl = document.getElementById('searchPrice');

            if (locEl) currentLocality = locEl.value;
            if (typeEl) currentType = typeEl.value;
            if (priceEl) currentPriceBucket = priceEl.value;

            filterListings();
            const sec = document.getElementById('properties-section');
            if (sec) sec.scrollIntoView({ behavior: 'smooth' });
            showToast('Search results updated', 'info');
        });
    }

    // Dropdown inputs on Properties page
    const bindFilter = (id, setter) => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('change', (e) => {
                setter(e.target.value);
                filterListings();
            });
        }
    };

    bindFilter('filterLocality', val => currentLocality = val);
    bindFilter('filterType', val => currentType = val);
    bindFilter('filterBeds', val => currentBeds = val);
    bindFilter('filterPrice', val => currentPriceBucket = val);
    bindFilter('sortBy', val => currentSort = val);

    // Live search input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearch = e.target.value;
            filterListings();
        });
    }
});
