/**
 * Brain Arena - Storage & State Management
 * Persistent user state, scoring, levels, achievements, and settings via LocalStorage.
 */

const STORAGE_KEYS = {
    USERS: 'brain_arena_users_v2',
    ACTIVE_USER_ID: 'brain_arena_active_uid_v2',
    SETTINGS: 'brain_arena_settings_v2',
    DAILY_CHALLENGE: 'brain_arena_daily_v2'
};

const LEVELS = [
    { level: 1, name: 'Beginner', minXP: 0, maxXP: 299, badge: '🌱', color: '#00D4FF' },
    { level: 2, name: 'Learner', minXP: 300, maxXP: 799, badge: '⭐', color: '#06D6A0' },
    { level: 3, name: 'Smart Thinker', minXP: 800, maxXP: 1599, badge: '💡', color: '#FFD166' },
    { level: 4, name: 'Brain Master', minXP: 1600, maxXP: 2999, badge: '🔥', color: '#6C63FF' },
    { level: 5, name: 'Genius', minXP: 3000, maxXP: Infinity, badge: '👑', color: '#FF4081' }
];

const ACHIEVEMENTS_LIST = [
    {
        id: 'first_game',
        title: 'First Game',
        description: 'Platformada ilk o‘yinni yakunlang',
        icon: '🎮',
        xpReward: 50
    },
    {
        id: 'brain_starter',
        title: 'Brain Starter',
        description: 'Jami 5 ta o‘yin o‘ynang',
        icon: '🚀',
        xpReward: 100
    },
    {
        id: 'smart_player',
        title: 'Smart Player',
        description: 'Jami 10 ta o‘yinda g‘alabaga erishing',
        icon: '🏆',
        xpReward: 150
    },
    {
        id: 'ai_challenger',
        title: 'AI Challenger',
        description: 'AI raqib ustidan g‘alaba qozoning',
        icon: '🤖',
        xpReward: 120
    },
    {
        id: 'perfect_mind',
        title: 'Perfect Mind',
        description: 'Birorta o‘yinda 100% mukammal natija oling',
        icon: '✨',
        xpReward: 200
    },
    {
        id: 'daily_champion',
        title: 'Daily Champion',
        description: 'Ketma-ket 3 kun platformaga kirib o‘ynang',
        icon: '🔥',
        xpReward: 180
    },
    {
        id: 'genius_level',
        title: 'Genius Level',
        description: 'Eng yuqori Genius darajasiga yeting',
        icon: '👑',
        xpReward: 300
    },
    {
        id: 'grand_explorer',
        title: 'Grand Explorer',
        description: 'Barcha toifalardan kamida 1 ta o‘yin o‘ynang',
        icon: '🧭',
        xpReward: 250
    }
];

class StorageManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.loadActiveUser();
    }

    // --- User Management ---

    getAllUsers() {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.USERS);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Failed to parse users:', e);
            return [];
        }
    }

    saveUsers(users) {
        try {
            localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
        } catch (e) {
            console.error('Failed to save users:', e);
        }
    }

    getActiveUserId() {
        return localStorage.getItem(STORAGE_KEYS.ACTIVE_USER_ID);
    }

    setActiveUserId(id) {
        if (id) {
            localStorage.setItem(STORAGE_KEYS.ACTIVE_USER_ID, id);
        } else {
            localStorage.removeItem(STORAGE_KEYS.ACTIVE_USER_ID);
        }
    }

    getActiveUser() {
        return this.currentUser || this.loadActiveUser();
    }

    loadActiveUser() {
        const id = this.getActiveUserId();
        const users = this.getAllUsers();
        if (id && users.length > 0) {
            this.currentUser = users.find(u => u.id === id) || users[0];
            this.updateDailyStreak(this.currentUser);
        } else {
            this.currentUser = null;
        }
        return this.currentUser;
    }

    determineCategoryByAge(age) {
        const numAge = parseInt(age, 10);
        if (numAge >= 3 && numAge <= 5) return 'preschool';
        if (numAge >= 6 && numAge <= 10) return 'kids';
        if (numAge >= 11 && numAge <= 15) return 'teens';
        return 'young-adults'; // 16+
    }

    createUser(username, age, avatar = '🦊') {
        const users = this.getAllUsers();
        const category = this.determineCategoryByAge(age);
        const today = new Date().toISOString().slice(0, 10);

        const newUser = {
            id: 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            username: username.trim(),
            age: parseInt(age, 10),
            category: category,
            avatar: avatar,
            xp: 0,
            level: 'Beginner',
            levelNumber: 1,
            gamesPlayed: 0,
            wins: 0,
            highScore: 0,
            streak: 1,
            lastActiveDate: today,
            achievements: [],
            favorites: [],
            recentGames: [],
            gameStats: {},
            categoriesPlayed: [],
            createdAt: today
        };

        users.push(newUser);
        this.saveUsers(users);
        this.setActiveUserId(newUser.id);
        this.currentUser = newUser;
        return newUser;
    }

    updateUser(updates) {
        if (!this.currentUser) return null;
        const users = this.getAllUsers();
        const index = users.findIndex(u => u.id === this.currentUser.id);
        if (index === -1) return null;

        users[index] = { ...users[index], ...updates };
        this.currentUser = users[index];
        this.saveUsers(users);
        return this.currentUser;
    }

    switchUser(id) {
        const users = this.getAllUsers();
        const user = users.find(u => u.id === id);
        if (user) {
            this.setActiveUserId(user.id);
            this.currentUser = user;
            this.updateDailyStreak(user);
            return user;
        }
        return null;
    }

    deleteUser(id) {
        let users = this.getAllUsers();
        users = users.filter(u => u.id !== id);
        this.saveUsers(users);
        if (this.currentUser && this.currentUser.id === id) {
            if (users.length > 0) {
                this.switchUser(users[0].id);
            } else {
                this.currentUser = null;
                this.setActiveUserId(null);
            }
        }
    }

    // --- Streak & Level Calculation ---

    updateDailyStreak(user) {
        if (!user) return;
        const today = new Date().toISOString().slice(0, 10);
        if (!user.lastActiveDate) {
            user.lastActiveDate = today;
            user.streak = 1;
            this.updateUser({ lastActiveDate: today, streak: 1 });
            return;
        }

        if (user.lastActiveDate === today) {
            return; // Already logged today
        }

        const lastDate = new Date(user.lastActiveDate);
        const currDate = new Date(today);
        const diffTime = currDate - lastDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        let newStreak = user.streak || 1;
        if (diffDays === 1) {
            newStreak += 1;
        } else if (diffDays > 1) {
            newStreak = 1;
        }

        this.updateUser({
            lastActiveDate: today,
            streak: newStreak
        });

        if (newStreak >= 3) {
            this.unlockAchievement('daily_champion');
        }
    }

    calculateLevel(xp) {
        for (let i = LEVELS.length - 1; i >= 0; i--) {
            if (xp >= LEVELS[i].minXP) {
                const currentLevel = LEVELS[i];
                const nextLevel = LEVELS[i + 1] || null;
                let progressPercent = 100;
                let nextLevelXP = currentLevel.maxXP + 1;

                if (nextLevel) {
                    const range = nextLevel.minXP - currentLevel.minXP;
                    const earned = xp - currentLevel.minXP;
                    progressPercent = Math.min(100, Math.floor((earned / range) * 100));
                    nextLevelXP = nextLevel.minXP;
                }

                return {
                    levelNumber: currentLevel.level,
                    levelName: currentLevel.name,
                    badge: currentLevel.badge,
                    color: currentLevel.color,
                    progressPercent,
                    currentXP: xp,
                    nextLevelXP
                };
            }
        }
        return {
            levelNumber: 1,
            levelName: 'Beginner',
            badge: '🌱',
            color: '#00D4FF',
            progressPercent: 0,
            currentXP: xp,
            nextLevelXP: 300
        };
    }

    addXP(amount) {
        if (!this.currentUser) return null;
        const oldXP = this.currentUser.xp || 0;
        const newXP = oldXP + amount;

        const oldLevelInfo = this.calculateLevel(oldXP);
        const newLevelInfo = this.calculateLevel(newXP);

        const updates = {
            xp: newXP,
            level: newLevelInfo.levelName,
            levelNumber: newLevelInfo.levelNumber
        };

        this.updateUser(updates);

        let leveledUp = false;
        if (newLevelInfo.levelNumber > oldLevelInfo.levelNumber) {
            leveledUp = true;
            if (newLevelInfo.levelName === 'Genius') {
                this.unlockAchievement('genius_level');
            }
        }

        return {
            added: amount,
            totalXP: newXP,
            leveledUp,
            oldLevel: oldLevelInfo,
            newLevel: newLevelInfo
        };
    }

    // --- Record Game Progress ---

    recordGameResult({
        gameId,
        gameTitle,
        category,
        score = 0,
        won = false,
        mode = 'practice',
        perfect = false
    }) {
        if (!this.currentUser) return null;

        const user = this.currentUser;
        const gamesPlayed = (user.gamesPlayed || 0) + 1;
        const wins = (user.wins || 0) + (won ? 1 : 0);
        const highScore = Math.max(user.highScore || 0, score);

        // Update categories played
        let categoriesPlayed = user.categoriesPlayed || [];
        if (!categoriesPlayed.includes(category)) {
            categoriesPlayed = [...categoriesPlayed, category];
        }

        // Recent games (keep max 10)
        const recentGames = [
            {
                gameId,
                gameTitle,
                category,
                score,
                won,
                mode,
                date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            },
            ...(user.recentGames || [])
        ].slice(0, 10);

        // Game stats per game
        const gameStats = { ...(user.gameStats || {}) };
        const currentStats = gameStats[gameId] || { played: 0, wins: 0, bestScore: 0 };
        gameStats[gameId] = {
            played: currentStats.played + 1,
            wins: currentStats.wins + (won ? 1 : 0),
            bestScore: Math.max(currentStats.bestScore, score)
        };

        this.updateUser({
            gamesPlayed,
            wins,
            highScore,
            recentGames,
            gameStats,
            categoriesPlayed
        });

        // Calculate XP earned:
        // Base score XP + Win bonus + Difficulty / Mode bonus
        let earnedXP = 15; // Participation
        if (score > 0) earnedXP += Math.min(100, Math.floor(score / 2));
        if (won) earnedXP += 25;
        if (mode === 'ai' && won) earnedXP += 30;
        if (mode === 'challenge') earnedXP += 20;

        const xpResult = this.addXP(earnedXP);

        // Check achievements
        const unlockedAchievements = [];

        if (gamesPlayed >= 1 && this.unlockAchievement('first_game')) {
            unlockedAchievements.push('first_game');
        }
        if (gamesPlayed >= 5 && this.unlockAchievement('brain_starter')) {
            unlockedAchievements.push('brain_starter');
        }
        if (wins >= 10 && this.unlockAchievement('smart_player')) {
            unlockedAchievements.push('smart_player');
        }
        if (mode === 'ai' && won && this.unlockAchievement('ai_challenger')) {
            unlockedAchievements.push('ai_challenger');
        }
        if (perfect && this.unlockAchievement('perfect_mind')) {
            unlockedAchievements.push('perfect_mind');
        }
        if (categoriesPlayed.length >= 4 && this.unlockAchievement('grand_explorer')) {
            unlockedAchievements.push('grand_explorer');
        }

        return {
            earnedXP,
            xpResult,
            unlockedAchievements
        };
    }

    // --- Favorites ---

    toggleFavorite(gameId) {
        if (!this.currentUser) return false;
        let favorites = this.currentUser.favorites || [];
        const index = favorites.indexOf(gameId);
        let isFav = false;
        if (index > -1) {
            favorites.splice(index, 1);
            isFav = false;
        } else {
            favorites.push(gameId);
            isFav = true;
        }
        this.updateUser({ favorites });
        return isFav;
    }

    isFavorite(gameId) {
        if (!this.currentUser || !this.currentUser.favorites) return false;
        return this.currentUser.favorites.includes(gameId);
    }

    // --- Achievements ---

    getAchievements() {
        return ACHIEVEMENTS_LIST;
    }

    unlockAchievement(achId) {
        if (!this.currentUser) return false;
        const currentAchievements = this.currentUser.achievements || [];
        if (currentAchievements.includes(achId)) return false;

        const achievement = ACHIEVEMENTS_LIST.find(a => a.id === achId);
        if (!achievement) return false;

        currentAchievements.push(achId);
        this.updateUser({ achievements: currentAchievements });

        // Add achievement reward XP
        if (achievement.xpReward) {
            this.addXP(achievement.xpReward);
        }

        return true;
    }

    // --- Daily Challenge ---

    getDailyChallenge() {
        const today = new Date().toISOString().slice(0, 10);
        let stored = null;
        try {
            stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.DAILY_CHALLENGE));
        } catch (e) {}

        if (stored && stored.date === today) {
            return stored;
        }

        // Generate daily challenge based on day
        const dayNum = parseInt(today.replace(/-/g, ''), 10);
        const challenges = [
            {
                id: 'daily_1',
                title: 'Aqliy Chiniqish',
                description: 'Bugun 3 ta Kids yoki Teens o‘yinida g‘alaba qozoning',
                targetCategory: 'kids',
                targetWins: 3,
                rewardXP: 100
            },
            {
                id: 'daily_2',
                title: 'AI Raqobat',
                description: 'AI rejimida 2 ta o‘yinda g‘alaba qozoning',
                targetCategory: 'ai_win',
                targetWins: 2,
                rewardXP: 120
            },
            {
                id: 'daily_3',
                title: 'Matematik Shiddat',
                description: 'Math Challenge yoki Math Genius o‘yinida 100+ ball oling',
                targetCategory: 'math',
                targetScore: 100,
                rewardXP: 110
            },
            {
                id: 'daily_4',
                title: 'Xotira Ustasi',
                description: 'Brain Memory yoki Memory Cards o‘yinini yakunlang',
                targetCategory: 'memory',
                targetWins: 1,
                rewardXP: 90
            }
        ];

        const selected = challenges[dayNum % challenges.length];
        const newChallenge = {
            ...selected,
            date: today,
            completed: false,
            currentProgress: 0
        };

        try {
            localStorage.setItem(STORAGE_KEYS.DAILY_CHALLENGE, JSON.stringify(newChallenge));
        } catch (e) {}

        return newChallenge;
    }

    updateDailyChallengeProgress(type, count = 1) {
        const challenge = this.getDailyChallenge();
        if (!challenge || challenge.completed) return false;

        let shouldAdvance = false;
        if (challenge.targetCategory === type || type === 'any') {
            shouldAdvance = true;
        }

        if (shouldAdvance) {
            challenge.currentProgress = (challenge.currentProgress || 0) + count;
            const target = challenge.targetWins || challenge.targetScore || 1;
            if (challenge.currentProgress >= target) {
                challenge.completed = true;
                this.addXP(challenge.rewardXP);
                try {
                    localStorage.setItem(STORAGE_KEYS.DAILY_CHALLENGE, JSON.stringify(challenge));
                } catch (e) {}
                return { completed: true, challenge };
            }
            try {
                localStorage.setItem(STORAGE_KEYS.DAILY_CHALLENGE, JSON.stringify(challenge));
            } catch (e) {}
        }
        return false;
    }

    // --- Settings ---

    getSettings() {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
            return data ? JSON.parse(data) : { sound: true, theme: 'dark', volume: 0.5 };
        } catch (e) {
            return { sound: true, theme: 'dark', volume: 0.5 };
        }
    }

    saveSettings(settings) {
        try {
            localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
        } catch (e) {}
    }
}

// Global singleton instance
window.storageManager = new StorageManager();
