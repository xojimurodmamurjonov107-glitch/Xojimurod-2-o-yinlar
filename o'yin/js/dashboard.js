/**
 * Brain Arena - Dashboard & User Progress Controller
 * Renders user stats, level progress bar, recent games, achievements, and daily challenge.
 */

class Dashboard {
    constructor() {}

    init() {
        this.bindEvents();
        this.refresh();
    }

    bindEvents() {
        // Achievements button in navbar
        const achBtn = document.getElementById('achievements-btn');
        const closeAchBtn = document.getElementById('close-achievements-btn');
        if (achBtn) achBtn.onclick = () => this.openAchievementsModal();
        if (closeAchBtn) closeAchBtn.onclick = () => this.closeAchievementsModal();

        // Daily Challenge Play button
        const dailyPlayBtn = document.getElementById('daily-play-btn');
        if (dailyPlayBtn) {
            dailyPlayBtn.onclick = () => {
                const challenge = window.storageManager.getDailyChallenge();
                if (challenge) {
                    if (challenge.targetCategory && challenge.targetCategory !== 'ai_win') {
                        // Switch category filter
                        if (window.app) window.app.setCategoryFilter(challenge.targetCategory);
                    } else {
                        // Launch first available game
                        window.gameManager.openGameSetup('math-challenge');
                    }
                }
            };
        }
    }

    refresh() {
        const user = window.storageManager.getActiveUser();
        if (!user) return;

        // Render Hero Profile Card
        document.getElementById('dash-avatar').textContent = user.avatar || '🦊';
        document.getElementById('dash-username').textContent = user.username;
        document.getElementById('dash-category-tag').textContent = window.gameManager.getCategoryLabel(user.category);

        // Level & XP
        const levelInfo = window.storageManager.calculateLevel(user.xp || 0);
        document.getElementById('dash-level-icon').textContent = levelInfo.badge;
        document.getElementById('dash-level-title').textContent = levelInfo.levelName;
        document.getElementById('dash-level-num').textContent = `Level ${levelInfo.levelNumber}`;
        document.getElementById('dash-xp-ratio').textContent = `${levelInfo.currentXP} / ${levelInfo.nextLevelXP} XP`;
        document.getElementById('dash-xp-fill').style.width = `${levelInfo.progressPercent}%`;

        // Stats Ribbon
        document.getElementById('dash-streak').textContent = `${user.streak || 1} kun`;
        document.getElementById('dash-games-count').textContent = user.gamesPlayed || 0;
        document.getElementById('dash-wins-count').textContent = user.wins || 0;
        document.getElementById('dash-high-score').textContent = user.highScore || 0;

        // Navbar info
        document.getElementById('nav-user-avatar').textContent = user.avatar || '🦊';
        document.getElementById('nav-user-name').textContent = user.username;
        document.getElementById('nav-user-xp').textContent = `${user.xp || 0} XP`;
        document.getElementById('nav-user-level-badge').textContent = levelInfo.badge;

        // Daily Challenge
        this.renderDailyChallenge();

        // Recent Games
        this.renderRecentGames(user.recentGames || []);

        // Favorite Counter
        this.updateFavoriteCount();

        // Unlocked achievements badge
        this.updateAchievementsBadge(user.achievements || []);
    }

    renderDailyChallenge() {
        const challenge = window.storageManager.getDailyChallenge();
        if (!challenge) return;

        document.getElementById('daily-title').textContent = challenge.title;
        document.getElementById('daily-desc').textContent = challenge.description;
        document.getElementById('daily-reward-pill').textContent = `+${challenge.rewardXP} XP Bonus`;

        const target = challenge.targetWins || challenge.targetScore || 1;
        const current = challenge.currentProgress || 0;
        const percent = Math.min(100, Math.floor((current / target) * 100));

        document.getElementById('daily-progress-fill').style.width = `${percent}%`;
        document.getElementById('daily-progress-num').textContent = `${current}/${target}`;

        const playBtn = document.getElementById('daily-play-btn');
        if (challenge.completed) {
            playBtn.textContent = 'Bajarildi! ✔';
            playBtn.disabled = true;
            playBtn.classList.add('btn-completed');
        } else {
            playBtn.textContent = 'Bajarish ➔';
            playBtn.disabled = false;
            playBtn.classList.remove('btn-completed');
        }
    }

    renderRecentGames(recentGames) {
        const wrap = document.getElementById('recent-games-wrap');
        const list = document.getElementById('recent-games-list');
        if (!wrap || !list) return;

        if (!recentGames || recentGames.length === 0) {
            wrap.classList.add('hidden');
            return;
        }

        wrap.classList.remove('hidden');
        list.innerHTML = '';

        recentGames.forEach(item => {
            const card = document.createElement('div');
            card.className = 'recent-game-chip';
            card.innerHTML = `
                <div class="rg-status ${item.won ? 'won' : 'lost'}">${item.won ? '🏆' : '🎮'}</div>
                <div class="rg-info">
                    <strong>${item.gameTitle || item.gameId}</strong>
                    <span>Ball: ${item.score} • ${item.date}</span>
                </div>
            `;
            card.onclick = () => window.gameManager.openGameSetup(item.gameId);
            list.appendChild(card);
        });
    }

    updateFavoriteCount() {
        const user = window.storageManager.getActiveUser();
        const favsCountEl = document.getElementById('favs-counter');
        if (favsCountEl && user) {
            favsCountEl.textContent = (user.favorites || []).length;
        }
    }

    updateAchievementsBadge(unlocked = []) {
        const badge = document.getElementById('achievements-badge');
        if (badge) {
            if (unlocked.length > 0) {
                badge.textContent = unlocked.length;
                badge.classList.remove('hidden');
            } else {
                badge.classList.add('hidden');
            }
        }
    }

    openAchievementsModal() {
        window.soundEngine.play('click');
        const modal = document.getElementById('achievements-modal');
        const container = document.getElementById('achievements-container');
        if (!modal || !container) return;

        const user = window.storageManager.getActiveUser();
        const unlockedIds = user ? (user.achievements || []) : [];
        const allAchievements = window.storageManager.getAchievements();

        container.innerHTML = '';
        allAchievements.forEach(ach => {
            const isUnlocked = unlockedIds.includes(ach.id);
            const card = document.createElement('div');
            card.className = `achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`;
            card.innerHTML = `
                <div class="ach-icon">${ach.icon}</div>
                <div class="ach-details">
                    <h4 class="ach-title">${ach.title}</h4>
                    <p class="ach-desc">${ach.description}</p>
                    <span class="ach-reward">+${ach.xpReward} XP</span>
                </div>
                <div class="ach-status-badge">${isUnlocked ? 'OCHILGAN ✔' : 'QULFLANGAN 🔒'}</div>
            `;
            container.appendChild(card);
        });

        modal.classList.remove('hidden');
    }

    closeAchievementsModal() {
        document.getElementById('achievements-modal').classList.add('hidden');
    }
}

// Global singleton instance
window.dashboard = new Dashboard();
