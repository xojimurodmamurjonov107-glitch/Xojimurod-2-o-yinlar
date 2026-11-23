/**
 * Brain Arena - Games Catalog & Arena Lifecycle Manager
 * Merges all 40 games across 4 categories and handles the game loop.
 */

class GameManager {
    constructor() {
        this.games = {};
        this.activeGame = null;
        this.activeMode = 'alone';
        this.activeDifficulty = 'medium';
        this.currentScore = 0;
        this.timerSeconds = 60;
        this.timerInterval = null;
        this.isPaused = false;
        this.currentFilterCategory = 'all';
        this.currentFilterDifficulty = 'all';
        this.searchQuery = '';
    }

    init() {
        // Collect all 40 games
        this.games = {
            ...(window.PreschoolGames || {}),
            ...(window.KidsGames || {}),
            ...(window.TeensGames || {}),
            ...(window.YoungAdultsGames || {})
        };

        this.bindEvents();
        this.renderCatalog();
    }

    getGame(id) {
        return this.games[id] || null;
    }

    getAllGames() {
        return Object.values(this.games);
    }

    bindEvents() {
        // Arena Controls
        const backBtn = document.getElementById('arena-back-btn');
        if (backBtn) backBtn.onclick = () => this.exitGame();

        const pauseBtn = document.getElementById('arena-pause-btn');
        if (pauseBtn) pauseBtn.onclick = () => this.togglePause();

        const restartBtn = document.getElementById('arena-restart-btn');
        if (restartBtn) restartBtn.onclick = () => this.restartGame();

        const hintBtn = document.getElementById('arena-hint-btn');
        if (hintBtn) hintBtn.onclick = () => this.requestHint();

        const helpBtn = document.getElementById('arena-help-btn');
        if (helpBtn) helpBtn.onclick = () => this.showInstructions(this.activeGame?.id);

        const startBtn = document.getElementById('arena-start-btn');
        if (startBtn) startBtn.onclick = () => this.launchActiveGame();

        // Pause overlay buttons
        const resumeBtn = document.getElementById('pause-resume-btn');
        if (resumeBtn) resumeBtn.onclick = () => this.togglePause();

        const pRestartBtn = document.getElementById('pause-restart-btn');
        if (pRestartBtn) pRestartBtn.onclick = () => {
            this.togglePause();
            this.restartGame();
        };

        const pQuitBtn = document.getElementById('pause-quit-btn');
        if (pQuitBtn) pQuitBtn.onclick = () => {
            this.togglePause();
            this.exitGame();
        };

        // Result screen buttons
        const playAgainBtn = document.getElementById('res-play-again-btn');
        if (playAgainBtn) playAgainBtn.onclick = () => {
            document.getElementById('arena-result-overlay').classList.add('hidden');
            this.restartGame();
        };

        const dashBtn = document.getElementById('res-dashboard-btn');
        if (dashBtn) dashBtn.onclick = () => {
            document.getElementById('arena-result-overlay').classList.add('hidden');
            this.exitGame();
        };

        // Instructions modal close
        const closeInstBtn = document.getElementById('close-instructions-btn');
        const instOkBtn = document.getElementById('inst-ok-btn');
        const closeFn = () => document.getElementById('instructions-modal').classList.add('hidden');
        if (closeInstBtn) closeInstBtn.onclick = closeFn;
        if (instOkBtn) instOkBtn.onclick = closeFn;

        // Mode cards selection
        const modeCards = document.querySelectorAll('.mode-card');
        modeCards.forEach(card => {
            card.onclick = () => {
                modeCards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                const radio = card.querySelector('input[type="radio"]');
                if (radio) radio.checked = true;
                this.activeMode = card.dataset.mode || 'alone';

                const aiDiffRow = document.getElementById('ai-diff-row');
                if (aiDiffRow) {
                    aiDiffRow.style.display = (this.activeMode === 'ai' || this.activeMode === 'challenge') ? 'block' : 'none';
                }
            };
        });

        // Difficulty chips in setup
        const diffChips = document.querySelectorAll('.diff-chip');
        diffChips.forEach(chip => {
            chip.onclick = () => {
                diffChips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                this.activeDifficulty = chip.dataset.diff || 'medium';
            };
        });
    }

    renderCatalog() {
        const grid = document.getElementById('games-grid');
        const emptyState = document.getElementById('games-empty-state');
        const countLabel = document.getElementById('catalog-count');
        if (!grid) return;

        let list = this.getAllGames();

        // Filter by category
        if (this.currentFilterCategory === 'favorites') {
            list = list.filter(g => window.storageManager.isFavorite(g.id));
        } else if (this.currentFilterCategory !== 'all') {
            list = list.filter(g => g.category === this.currentFilterCategory);
        }

        // Filter by difficulty
        if (this.currentFilterDifficulty !== 'all') {
            list = list.filter(g => g.difficulty === this.currentFilterDifficulty);
        }

        // Filter by search query
        if (this.searchQuery.trim()) {
            const q = this.searchQuery.toLowerCase().trim();
            list = list.filter(g => 
                g.title.toLowerCase().includes(q) ||
                g.description.toLowerCase().includes(q) ||
                (g.tags && g.tags.some(t => t.toLowerCase().includes(q)))
            );
        }

        if (countLabel) {
            countLabel.textContent = `${list.length} ta o‘yin`;
        }

        if (list.length === 0) {
            grid.innerHTML = '';
            if (emptyState) emptyState.classList.remove('hidden');
            return;
        }

        if (emptyState) emptyState.classList.add('hidden');
        grid.innerHTML = '';

        list.forEach(game => {
            const card = document.createElement('div');
            const isFav = window.storageManager.isFavorite(game.id);
            const categoryClass = `cat-card-${game.category}`;

            card.className = `game-catalog-card ${categoryClass} card-fade-in`;
            card.innerHTML = `
                <div class="gc-header">
                    <span class="gc-icon">${game.icon || '🎮'}</span>
                    <button class="fav-btn ${isFav ? 'active' : ''}" data-id="${game.id}" title="Sevimlilarga qo‘shish">
                        ${isFav ? '⭐' : '☆'}
                    </button>
                </div>
                <div class="gc-body">
                    <div class="gc-category-badge">${this.getCategoryLabel(game.category)}</div>
                    <h3 class="gc-title">${game.title}</h3>
                    <p class="gc-desc">${game.description}</p>
                    <div class="gc-tags">
                        ${(game.tags || []).map(t => `<span class="tag-pill">${t}</span>`).join('')}
                    </div>
                </div>
                <div class="gc-footer">
                    <span class="gc-difficulty diff-${game.difficulty}">${this.getDifficultyLabel(game.difficulty)}</span>
                    <button class="btn-play-game" data-id="${game.id}">O‘ynash ▶</button>
                </div>
            `;

            // Favorite button click
            const favBtn = card.querySelector('.fav-btn');
            favBtn.onclick = (e) => {
                e.stopPropagation();
                window.soundEngine.play('click');
                const nowFav = window.storageManager.toggleFavorite(game.id);
                favBtn.classList.toggle('active', nowFav);
                favBtn.textContent = nowFav ? '⭐' : '☆';
                if (window.dashboard) window.dashboard.updateFavoriteCount();
                if (this.currentFilterCategory === 'favorites') this.renderCatalog();
            };

            // Play button click
            const playBtn = card.querySelector('.btn-play-game');
            playBtn.onclick = () => this.openGameSetup(game.id);

            card.onclick = (e) => {
                if (e.target.closest('.fav-btn')) return;
                this.openGameSetup(game.id);
            };

            grid.appendChild(card);
        });
    }

    getCategoryLabel(cat) {
        switch (cat) {
            case 'preschool': return '🧸 Preschool (3–5)';
            case 'kids': return '🚀 Kids (6–10)';
            case 'teens': return '🧬 Teens (11–15)';
            case 'young-adults': return '🌌 Young Adults (16+)';
            default: return cat;
        }
    }

    getDifficultyLabel(diff) {
        switch (diff) {
            case 'easy': return '🟢 Oson';
            case 'medium': return '🟡 O‘rtacha';
            case 'hard': return '🟠 Qiyin';
            case 'expert': return '🔴 Ekspert';
            default: return diff;
        }
    }

    openGameSetup(gameId) {
        const game = this.getGame(gameId);
        if (!game) return;

        window.soundEngine.play('click');
        this.activeGame = game;

        const arenaModal = document.getElementById('game-arena-modal');
        const setupPanel = document.getElementById('arena-setup-panel');
        const playfield = document.getElementById('arena-playfield');
        const resultOverlay = document.getElementById('arena-result-overlay');
        const aiStrip = document.getElementById('arena-ai-strip');
        const timerBox = document.getElementById('arena-timer-box');

        // Reset overlays
        resultOverlay.classList.add('hidden');
        document.getElementById('arena-pause-overlay').classList.add('hidden');
        playfield.innerHTML = '';
        if (aiStrip) aiStrip.classList.add('hidden');
        if (timerBox) timerBox.classList.add('hidden');

        // Set Header details
        document.getElementById('arena-game-icon').textContent = game.icon || '🎮';
        document.getElementById('arena-game-title').textContent = game.title;
        document.getElementById('arena-game-category').textContent = this.getCategoryLabel(game.category);
        document.getElementById('arena-score').textContent = '0';

        // Show setup panel
        setupPanel.classList.remove('hidden');
        arenaModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    launchActiveGame() {
        if (!this.activeGame) return;
        window.soundEngine.play('powerup');

        document.getElementById('arena-setup-panel').classList.add('hidden');
        const playfield = document.getElementById('arena-playfield');
        playfield.innerHTML = '';
        this.currentScore = 0;
        this.isPaused = false;

        const timerBox = document.getElementById('arena-timer-box');
        const aiStrip = document.getElementById('arena-ai-strip');

        // Setup AI Persona strip if mode is AI
        if (this.activeMode === 'ai') {
            const persona = window.aiEngine.getPersona(this.activeGame.category);
            document.getElementById('arena-ai-avatar').textContent = persona.avatar;
            document.getElementById('arena-ai-name').textContent = persona.name;
            document.getElementById('arena-ai-speech').textContent = window.aiEngine.getRandomPhrase(this.activeGame.category, 'greet');
            aiStrip.classList.remove('hidden');
        } else {
            aiStrip.classList.add('hidden');
        }

        // Setup timer for Challenge mode
        if (this.activeMode === 'challenge') {
            timerBox.classList.remove('hidden');
            this.startTimer(60);
        } else {
            timerBox.classList.add('hidden');
            this.stopTimer();
        }

        // Run game render function
        try {
            this.activeGame.render(playfield, {
                mode: this.activeMode,
                difficulty: this.activeDifficulty,
                onFinish: (result) => this.handleGameFinish(result),
                updateScore: (score) => this.handleScoreUpdate(score),
                showAIComment: (text) => this.showAIComment(text)
            });
        } catch (e) {
            console.error('Error rendering game:', e);
            playfield.innerHTML = `<div class="error-msg">O‘yinni yuklashda xatolik yuz berdi: ${e.message}</div>`;
        }
    }

    handleScoreUpdate(score) {
        this.currentScore = score;
        const scoreEl = document.getElementById('arena-score');
        if (scoreEl) scoreEl.textContent = score;
    }

    showAIComment(text) {
        const aiStrip = document.getElementById('arena-ai-strip');
        const speech = document.getElementById('arena-ai-speech');
        if (speech && text) {
            speech.textContent = text;
            if (aiStrip) aiStrip.classList.remove('hidden');
        }
    }

    requestHint() {
        if (!this.activeGame) return;
        window.soundEngine.play('hint');
        const hintText = window.aiEngine.generateHint(this.activeGame.id, {
            hint: this.activeGame.rules
        });
        if (window.app) {
            window.app.showToast(`💡 Maslahat: ${hintText}`, 'info');
        }
        this.showAIComment(hintText);
    }

    showInstructions(gameId) {
        const game = this.getGame(gameId) || this.activeGame;
        if (!game) return;

        window.soundEngine.play('click');
        const modal = document.getElementById('instructions-modal');
        document.getElementById('inst-game-title').textContent = `${game.title} – Qoidalar`;
        document.getElementById('inst-game-icon').textContent = game.icon || '🎮';
        document.getElementById('inst-game-rules').textContent = game.rules || game.description;

        const persona = window.aiEngine.getPersona(game.category);
        document.getElementById('inst-ai-desc').textContent = 
            `${persona.name}: Ushbu o‘yinda sizga yordam beradi, natijalarni tekshiradi va maslahatlar taqdim etadi.`;

        modal.classList.remove('hidden');
    }

    startTimer(seconds) {
        this.stopTimer();
        this.timerSeconds = seconds;
        const timerEl = document.getElementById('arena-timer');
        if (timerEl) timerEl.textContent = `${this.timerSeconds}s`;

        this.timerInterval = setInterval(() => {
            if (this.isPaused) return;
            this.timerSeconds--;
            if (timerEl) timerEl.textContent = `${this.timerSeconds}s`;

            if (this.timerSeconds <= 5 && this.timerSeconds > 0) {
                window.soundEngine.play('tick');
            }

            if (this.timerSeconds <= 0) {
                this.stopTimer();
                window.soundEngine.play('lose');
                this.handleGameFinish({
                    score: this.currentScore,
                    won: false,
                    timeout: true
                });
            }
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        const pauseOverlay = document.getElementById('arena-pause-overlay');
        if (pauseOverlay) {
            pauseOverlay.classList.toggle('hidden', !this.isPaused);
        }
    }

    restartGame() {
        this.stopTimer();
        this.launchActiveGame();
    }

    exitGame() {
        this.stopTimer();
        this.isPaused = false;
        document.getElementById('game-arena-modal').classList.add('hidden');
        document.body.style.overflow = '';
        if (window.dashboard) window.dashboard.refresh();
        this.renderCatalog();
    }

    handleGameFinish({ score = 0, won = false, perfect = false, timeout = false }) {
        this.stopTimer();
        const game = this.activeGame;
        if (!game) return;

        // Save progress to StorageManager
        const result = window.storageManager.recordGameResult({
            gameId: game.id,
            gameTitle: game.title,
            category: game.category,
            score,
            won,
            mode: this.activeMode,
            perfect
        });

        // Update daily challenge
        window.storageManager.updateDailyChallengeProgress(game.category, 1);
        if (this.activeMode === 'ai' && won) {
            window.storageManager.updateDailyChallengeProgress('ai_win', 1);
        }

        // Show Result Screen
        const resultOverlay = document.getElementById('arena-result-overlay');
        const resEmoji = document.getElementById('res-emoji');
        const resTitle = document.getElementById('res-title');
        const resSubtitle = document.getElementById('res-subtitle');
        const resScore = document.getElementById('res-score');
        const resXP = document.getElementById('res-xp');
        const resAiComment = document.getElementById('res-ai-comment');
        const resAiAvatar = document.getElementById('res-ai-avatar');

        const persona = window.aiEngine.getPersona(game.category);
        resAiAvatar.textContent = persona.avatar;

        resScore.textContent = score;
        resXP.textContent = `+${result ? result.earnedXP : 15} XP`;

        if (won) {
            window.soundEngine.play('win');
            resEmoji.textContent = '🏆';
            resTitle.textContent = 'G‘alaba qozondingiz!';
            resSubtitle.textContent = perfect ? 'Mukammal 100% ko‘rsatkich!' : 'Ajoyib natija!';
            resAiComment.textContent = window.aiEngine.getRandomPhrase(game.category, 'victory');
        } else {
            window.soundEngine.play('lose');
            resEmoji.textContent = timeout ? '⏰' : '💫';
            resTitle.textContent = timeout ? 'Vaqt tugadi!' : 'Yaxshi urinish!';
            resSubtitle.textContent = 'Keyingi safar yanada yuqoriroq natijaga erishasiz!';
            resAiComment.textContent = window.aiEngine.getRandomPhrase(game.category, 'defeat');
        }

        // Check if level up
        if (result && result.xpResult && result.xpResult.leveledUp) {
            window.soundEngine.play('levelUp');
            if (window.app) {
                window.app.showToast(`🎉 Darajangiz ko‘tarildi: ${result.xpResult.newLevel.levelName}!`, 'success');
            }
        }

        // Check unlocked achievements
        if (result && result.unlockedAchievements && result.unlockedAchievements.length > 0) {
            result.unlockedAchievements.forEach(achId => {
                const ach = window.storageManager.getAchievements().find(a => a.id === achId);
                if (ach && window.app) {
                    window.app.showToast(`🏆 Yutuq ochildi: "${ach.title}"! (+${ach.xpReward} XP)`, 'achievement');
                }
            });
        }

        resultOverlay.classList.remove('hidden');
    }
}

// Global singleton instance
window.gameManager = new GameManager();
