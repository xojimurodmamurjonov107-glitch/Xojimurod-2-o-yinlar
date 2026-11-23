/**
 * Brain Arena - Main Application Orchestrator
 * Wires together UI components, theme, audio, search, filters, and global toasts.
 */

class App {
    constructor() {
        this.currentTheme = 'dark';
    }

    init() {
        this.loadSettings();
        this.bindGlobalEvents();

        // Initialize managers
        window.soundEngine.init();
        window.storageManager.init();
        window.authManager.init();
        window.gameManager.init();
        window.dashboard.init();

        // If user already active, select user's age category by default in navbar!
        const user = window.storageManager.getActiveUser();
        if (user && user.category) {
            this.setCategoryFilter(user.category);
        }
    }

    loadSettings() {
        const settings = window.storageManager.getSettings();
        this.currentTheme = settings.theme || 'dark';
        this.applyTheme(this.currentTheme);

        if (settings.sound === false) {
            window.soundEngine.setMuted(true);
            document.getElementById('sound-icon').textContent = '🔇';
        } else {
            window.soundEngine.setMuted(false);
            document.getElementById('sound-icon').textContent = '🔊';
        }
    }

    applyTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        document.body.className = `theme-${theme}`;
        const themeIcon = document.getElementById('theme-icon');
        if (themeIcon) {
            themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
        }
    }

    toggleTheme() {
        const nextTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(nextTheme);
        window.soundEngine.play('click');

        const settings = window.storageManager.getSettings();
        settings.theme = nextTheme;
        window.storageManager.saveSettings(settings);

        this.showToast(`Mavzu: ${nextTheme === 'dark' ? 'Tungi rejim 🌙' : 'Kunduzgi rejim ☀️'}`, 'info');
    }

    toggleSound() {
        const isMuted = window.soundEngine.toggleMute();
        const icon = document.getElementById('sound-icon');
        if (icon) {
            icon.textContent = isMuted ? '🔇' : '🔊';
        }

        const settings = window.storageManager.getSettings();
        settings.sound = !isMuted;
        window.storageManager.saveSettings(settings);

        if (!isMuted) window.soundEngine.play('click');
        this.showToast(isMuted ? 'Ovoz o‘chirildi 🔇' : 'Ovoz yoqildi 🔊', 'info');
    }

    bindGlobalEvents() {
        // Logo click -> reset filters & scroll to top
        const brandLogo = document.getElementById('brand-logo');
        if (brandLogo) {
            brandLogo.onclick = () => {
                this.setCategoryFilter('all');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            };
        }

        // Theme toggle button
        const themeBtn = document.getElementById('theme-toggle-btn');
        if (themeBtn) themeBtn.onclick = () => this.toggleTheme();

        // Sound toggle button
        const soundBtn = document.getElementById('sound-toggle-btn');
        if (soundBtn) soundBtn.onclick = () => this.toggleSound();

        // Category Pills in navbar
        const catPills = document.querySelectorAll('.cat-pill');
        catPills.forEach(pill => {
            pill.onclick = () => {
                window.soundEngine.play('click');
                const cat = pill.dataset.category;
                this.setCategoryFilter(cat);
            };
        });

        // Global Search Input
        const searchInput = document.getElementById('global-search');
        const searchClearBtn = document.getElementById('search-clear-btn');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value;
                if (searchClearBtn) {
                    searchClearBtn.classList.toggle('hidden', query.length === 0);
                }
                window.gameManager.searchQuery = query;
                window.gameManager.renderCatalog();
            });
        }

        if (searchClearBtn) {
            searchClearBtn.onclick = () => {
                if (searchInput) searchInput.value = '';
                searchClearBtn.classList.add('hidden');
                window.gameManager.searchQuery = '';
                window.gameManager.renderCatalog();
            };
        }

        // Difficulty dropdown
        const diffFilter = document.getElementById('difficulty-filter');
        if (diffFilter) {
            diffFilter.addEventListener('change', (e) => {
                window.gameManager.currentFilterDifficulty = e.target.value;
                window.gameManager.renderCatalog();
            });
        }

        // Reset filter buttons
        const resetFiltersBtn = document.getElementById('reset-filters-btn');
        const emptyResetBtn = document.getElementById('empty-reset-btn');
        const doReset = () => {
            if (searchInput) searchInput.value = '';
            if (searchClearBtn) searchClearBtn.classList.add('hidden');
            if (diffFilter) diffFilter.value = 'all';
            window.gameManager.searchQuery = '';
            window.gameManager.currentFilterDifficulty = 'all';
            this.setCategoryFilter('all');
        };

        if (resetFiltersBtn) resetFiltersBtn.onclick = doReset;
        if (emptyResetBtn) emptyResetBtn.onclick = doReset;

        // Global ESC key listener for modals
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const instructionsModal = document.getElementById('instructions-modal');
                const profileModal = document.getElementById('profile-modal');
                const achievementsModal = document.getElementById('achievements-modal');

                if (instructionsModal && !instructionsModal.classList.contains('hidden')) {
                    instructionsModal.classList.add('hidden');
                } else if (profileModal && !profileModal.classList.contains('hidden')) {
                    profileModal.classList.add('hidden');
                } else if (achievementsModal && !achievementsModal.classList.contains('hidden')) {
                    achievementsModal.classList.add('hidden');
                } else if (window.gameManager.activeGame) {
                    window.gameManager.togglePause();
                }
            }
        });
    }

    setCategoryFilter(category) {
        window.gameManager.currentFilterCategory = category;

        // Update pills
        const catPills = document.querySelectorAll('.cat-pill');
        catPills.forEach(p => {
            p.classList.toggle('active', p.dataset.category === category);
        });

        // Update catalog title
        const catalogTitle = document.getElementById('catalog-title');
        if (catalogTitle) {
            if (category === 'all') catalogTitle.textContent = '🎮 Barcha O‘yinlar Katalogi';
            else if (category === 'favorites') catalogTitle.textContent = '⭐ Sevimli O‘yinlaringiz';
            else catalogTitle.textContent = window.gameManager.getCategoryLabel(category);
        }

        window.gameManager.renderCatalog();
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type} toast-slide-in`;

        let icon = 'ℹ️';
        if (type === 'success') icon = '✅';
        if (type === 'achievement') icon = '🏆';
        if (type === 'warning') icon = '⚠️';

        toast.innerHTML = `
            <span class="toast-icon">${icon}</span>
            <span class="toast-text">${message}</span>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('toast-fade-out');
            setTimeout(() => toast.remove(), 400);
        }, 3500);
    }
}

// Global App instance & DOMContentLoaded boot
window.app = new App();
window.addEventListener('DOMContentLoaded', () => {
    window.app.init();
});
