/**
 * Brain Arena - Authentication & Profile Management
 * Handles registration, age validation, category preview, avatar picker, and profile switching.
 */

class AuthManager {
    constructor() {
        this.selectedAvatar = '🦊';
        this.avatars = ['🦊', '🦁', '🐼', '🚀', '🤖', '👑', '⚡', '🔮', '🦄', '🐱', '🦉', '🏆'];
    }

    init() {
        this.renderAvatarGrid();
        this.bindEvents();
        this.checkAuthStatus();
    }

    renderAvatarGrid() {
        const grid = document.getElementById('avatar-grid');
        if (!grid) return;

        grid.innerHTML = '';
        this.avatars.forEach(av => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = `avatar-choice-btn ${av === this.selectedAvatar ? 'selected' : ''}`;
            btn.textContent = av;
            btn.onclick = () => {
                this.selectedAvatar = av;
                grid.querySelectorAll('.avatar-choice-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                window.soundEngine.play('click');
            };
            grid.appendChild(btn);
        });
    }

    bindEvents() {
        const ageInput = document.getElementById('reg-age');
        const previewBadge = document.getElementById('preview-cat-badge');

        if (ageInput && previewBadge) {
            ageInput.addEventListener('input', () => {
                const age = parseInt(ageInput.value, 10);
                if (isNaN(age) || age < 3) {
                    previewBadge.textContent = 'Yoshingizni kiriting...';
                    previewBadge.className = 'preview-badge';
                    return;
                }
                const cat = window.storageManager.determineCategoryByAge(age);
                if (cat === 'preschool') {
                    previewBadge.textContent = '🧸 Preschool (3–5 yosh)';
                    previewBadge.className = 'preview-badge cat-badge-preschool';
                } else if (cat === 'kids') {
                    previewBadge.textContent = '🚀 Kids (6–10 yosh)';
                    previewBadge.className = 'preview-badge cat-badge-kids';
                } else if (cat === 'teens') {
                    previewBadge.textContent = '🧬 Teens (11–15 yosh)';
                    previewBadge.className = 'preview-badge cat-badge-teens';
                } else {
                    previewBadge.textContent = '🌌 Young Adults (16–20+ yosh)';
                    previewBadge.className = 'preview-badge cat-badge-ya';
                }
            });
        }

        // Form submission
        const authForm = document.getElementById('auth-form');
        if (authForm) {
            authForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister();
            });
        }

        // Tab switcher in welcome modal
        const tabLoginBtn = document.getElementById('tab-login-btn');
        const tabCreateBtn = document.getElementById('tab-create-btn');
        if (tabLoginBtn && tabCreateBtn) {
            tabLoginBtn.onclick = () => this.showExistingProfilesTab();
            tabCreateBtn.onclick = () => this.showCreateProfileTab();
        }

        // Profile switcher modal triggers
        const userProfileBtn = document.getElementById('user-profile-btn');
        const closeProfileBtn = document.getElementById('close-profile-btn');
        const editAvatarBtn = document.getElementById('edit-avatar-btn');

        if (userProfileBtn) userProfileBtn.onclick = () => this.openProfileModal();
        if (closeProfileBtn) closeProfileBtn.onclick = () => this.closeProfileModal();
        if (editAvatarBtn) editAvatarBtn.onclick = () => this.openProfileModal();

        const pmSwitchBtn = document.getElementById('pm-switch-user-btn');
        const pmNewBtn = document.getElementById('pm-new-user-btn');

        if (pmSwitchBtn) {
            pmSwitchBtn.onclick = () => {
                this.closeProfileModal();
                this.showWelcomeModal(true);
            };
        }
        if (pmNewBtn) {
            pmNewBtn.onclick = () => {
                this.closeProfileModal();
                this.showWelcomeModal(false);
            };
        }
    }

    checkAuthStatus() {
        const user = window.storageManager.loadActiveUser();
        if (!user) {
            const users = window.storageManager.getAllUsers();
            this.showWelcomeModal(users.length > 0);
        } else {
            this.updateUIAfterLogin(user);
        }
    }

    showWelcomeModal(showExistingList = false) {
        const modal = document.getElementById('auth-modal');
        const tabsRow = document.getElementById('profile-tabs-row');
        const users = window.storageManager.getAllUsers();

        if (users.length > 0) {
            tabsRow.classList.remove('hidden');
            if (showExistingList) {
                this.showExistingProfilesTab();
            } else {
                this.showCreateProfileTab();
            }
        } else {
            tabsRow.classList.add('hidden');
            this.showCreateProfileTab();
        }

        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    showExistingProfilesTab() {
        document.getElementById('tab-login-btn').classList.add('active');
        document.getElementById('tab-create-btn').classList.remove('active');
        document.getElementById('existing-profiles-view').classList.remove('hidden');
        document.getElementById('auth-form').classList.add('hidden');
        this.renderProfilesList();
    }

    showCreateProfileTab() {
        const tabCreate = document.getElementById('tab-create-btn');
        const tabLogin = document.getElementById('tab-login-btn');
        if (tabCreate) tabCreate.classList.add('active');
        if (tabLogin) tabLogin.classList.remove('active');
        document.getElementById('existing-profiles-view').classList.add('hidden');
        document.getElementById('auth-form').classList.remove('hidden');
    }

    renderProfilesList() {
        const container = document.getElementById('profiles-list-container');
        if (!container) return;

        const users = window.storageManager.getAllUsers();
        container.innerHTML = '';

        if (users.length === 0) {
            container.innerHTML = '<p class="text-muted">Hozircha saqlangan profillar yo‘q.</p>';
            return;
        }

        users.forEach(u => {
            const item = document.createElement('div');
            item.className = 'profile-list-item';
            item.innerHTML = `
                <div class="pli-left">
                    <span class="pli-avatar">${u.avatar || '🦊'}</span>
                    <div class="pli-meta">
                        <strong>${u.username}</strong>
                        <span>${u.age} yosh • ${u.level} • ${u.xp || 0} XP</span>
                    </div>
                </div>
                <div class="pli-actions">
                    <button class="btn-primary-sm btn-choose">Tanlash</button>
                    <button class="btn-danger-sm btn-del" title="O‘chirish">🗑️</button>
                </div>
            `;

            item.querySelector('.btn-choose').onclick = () => {
                window.soundEngine.play('click');
                window.storageManager.switchUser(u.id);
                this.closeWelcomeModal();
                this.updateUIAfterLogin(u);
                if (window.app) window.app.showToast(`Xush kelibsiz, ${u.username}!`, 'success');
            };

            item.querySelector('.btn-del').onclick = (e) => {
                e.stopPropagation();
                if (confirm(`Haqiqatan ham "${u.username}" profilini o‘chirmoqchimisiz?`)) {
                    window.storageManager.deleteUser(u.id);
                    this.renderProfilesList();
                }
            };

            container.appendChild(item);
        });
    }

    handleRegister() {
        const usernameInput = document.getElementById('reg-username');
        const ageInput = document.getElementById('reg-age');
        const errorEl = document.getElementById('username-error');

        const username = usernameInput.value.trim();
        const age = parseInt(ageInput.value, 10);

        if (!username || username.length < 2) {
            errorEl.textContent = 'Foydalanuvchi nomi kamida 2 ta belgidan iborat bo‘lishi kerak!';
            return;
        }
        if (isNaN(age) || age < 3 || age > 99) {
            errorEl.textContent = 'Iltimos, haqiqiy yoshni kiriting (3 dan 99 gacha)!';
            return;
        }

        errorEl.textContent = '';
        window.soundEngine.play('powerup');

        // Create new user in StorageManager
        const newUser = window.storageManager.createUser(username, age, this.selectedAvatar);
        this.closeWelcomeModal();
        this.updateUIAfterLogin(newUser);

        if (window.app) {
            window.app.showToast(`Profil muvaffaqiyatli yaratildi! Xush kelibsiz, ${username}!`, 'success');
        }
    }

    closeWelcomeModal() {
        document.getElementById('auth-modal').classList.add('hidden');
        document.body.style.overflow = '';
    }

    openProfileModal() {
        const user = window.storageManager.getActiveUser();
        if (!user) {
            this.showWelcomeModal();
            return;
        }

        window.soundEngine.play('click');
        document.getElementById('pm-avatar').textContent = user.avatar || '🦊';
        document.getElementById('pm-username').textContent = user.username;
        document.getElementById('pm-category').textContent = window.gameManager.getCategoryLabel(user.category);
        document.getElementById('pm-xp').textContent = `${user.xp || 0} XP`;
        document.getElementById('pm-level').textContent = user.level || 'Beginner';
        document.getElementById('pm-wins').textContent = user.wins || 0;
        document.getElementById('pm-games').textContent = user.gamesPlayed || 0;

        document.getElementById('profile-modal').classList.remove('hidden');
    }

    closeProfileModal() {
        document.getElementById('profile-modal').classList.add('hidden');
    }

    updateUIAfterLogin(user) {
        if (!user) return;

        // Navbar update
        document.getElementById('nav-user-avatar').textContent = user.avatar || '🦊';
        document.getElementById('nav-user-name').textContent = user.username;
        document.getElementById('nav-user-xp').textContent = `${user.xp || 0} XP`;
        
        const levelInfo = window.storageManager.calculateLevel(user.xp || 0);
        document.getElementById('nav-user-level-badge').textContent = levelInfo.badge;

        // Refresh dashboard
        if (window.dashboard) {
            window.dashboard.refresh();
        }
    }
}

// Global singleton instance
window.authManager = new AuthManager();
