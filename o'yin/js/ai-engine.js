/**
 * Brain Arena - Advanced Algorithmic AI Game Engine
 * Features:
 * - 4 Persona Engines (Preschool Buddy, Kids Coach, Teen Rival, Grandmaster Cortex)
 * - 4 Difficulty tiers: Easy, Medium, Hard, Expert
 * - Adaptive Difficulty balancing
 * - Algorithmic move evaluators & solvers
 * - Contextual hint generation & mistake explanations
 * - Extensible API integration hook
 */

class AIEngine {
    constructor() {
        this.personas = {
            preschool: {
                name: 'Robo-Do‘st 🧸',
                avatar: '🧸',
                tone: 'supportive',
                phrases: {
                    greet: ['Salom, kichkintoy! Keling birga o‘ynaymiz!', 'Bugun ajoyib o‘yinlar kutmoqda! ✨', 'Men doim yoningdaman!'],
                    correct: ['Barakalla! Juda zo‘r! 🌟', 'Super! Sen juda aqllisan!', 'Ajoyib natija! Davom etamiz! 🎈'],
                    tryAgain: ['Hechqisi yo‘q, keling yana bir bor urinib ko‘ramiz!', 'Juda yaqin kelding! Qaytadan sinab ko‘r.', 'Sen uddalaysan, do‘stim! 💫'],
                    hint: ['Kichik yordam: e’tibor bilan qara, rang yoki shaklga qara!', 'Mana bu tomonga qarab ko‘r-chi! 👀'],
                    victory: ['Uraaa! Biz g‘alaba qildik! Sen chempionsan! 🏆🎉'],
                    defeat: ['Juda yaxshi harakat qilding! Keyingi safar yanada zo‘r bo‘ladi! 🌈']
                }
            },
            kids: {
                name: 'Robo-Spark ⚡',
                avatar: '🤖',
                tone: 'energetic',
                phrases: {
                    greet: ['Salom! Bugun aql bellashuviga tayyormisan?', 'Qani boshladik, chaqqonlikni ko‘rsat! ⚡'],
                    correct: ['To‘g‘ri! Qoyilmaqom tezlik!', 'Daxshat! 100% aniq nishon! 🎯', 'Miya quvvati 100%!'],
                    tryAgain: ['Kichik adashish, lekin taslim bo‘lish yo‘q!', 'Diqqatni jamla, keyingisini aniq topasan! 💪'],
                    hint: ['Maslahat: qonuniyat yoki hisob-kitobga yaxshilab e’tibor ber!', 'Variantlarni birma-bir taqqoslab ko‘r.'],
                    victory: ['Ajoyib g‘alaba! Sen mendan ham tezroq o‘ylading! 🏅'],
                    defeat: ['Yaxshi bellashuv bo‘ldi! Keyingi safar revansh kutaman! 🎮']
                }
            },
            teens: {
                name: 'Nexus-7 🧠',
                avatar: '🧬',
                tone: 'analytical',
                phrases: {
                    greet: ['Tizim ishga tushdi. Mantiqiy tahlilga tayyormisiz?', 'Strategik fikrlash bellashuviga xush kelibsiz.'],
                    correct: ['Mantiqiy yechim to‘g‘ri hisoblandi. Yuqori IQ darajasi! 🚀', 'Optimal javob tasdiqlandi.'],
                    tryAgain: ['Xatolik aniqlandi: bu yondashuvda mantiqiy uzilish bor.', 'Qaror qabul qilishda barcha omillarni hisobga oling.'],
                    hint: ['Tahlil: Deduksiya usulidan foydalaning va noto‘g‘ri variantlarni chiqaring.', 'Algoritmik qonuniyatni qidiring.'],
                    victory: ['Qoyil! Sizning analitik ko‘rsatkichingiz mening hisob-kitoblarimdan ustun keldi! 🎖️'],
                    defeat: ['Strategiyangiz kuchli edi, biroq mening hisoblash quvvatim bu safar ustun keldi.']
                }
            },
            'young-adults': {
                name: 'Cortex Prime 🌌',
                avatar: '🔮',
                tone: 'grandmaster',
                phrases: {
                    greet: ['Heuristic tahlil faollashtirildi. Neyron tarmoqlari maksimal chuqurlikda.', 'Yuqori intellektual maydonga xush kelibsiz.'],
                    correct: ['Brilliant! Ushbu harakat Game Theory va optimal balansga to‘liq mos keladi.', 'Mukammal deduksiya!'],
                    tryAgain: ['Optimal bo‘lmagan harakat. Tizimli muvozanat buzildi.', 'Qaror daraxtidagi ehtimolliklar to‘liq hisoblanmadi.'],
                    hint: ['Metakognitiv tavsiya: Asosiy cheklovchi o‘zgaruvchini aniqlang va min-maks tamoyilini qo‘llang.', 'Uzoq muddatli pozitsion ustunlikni hisobga oling.'],
                    victory: ['Fevqulodda natija! Strategik qarorlaringiz meni mot qildi. Siz haqiqiy Grandmastersiz! 👑'],
                    defeat: ['Qiziqarli partiya. Xatolaringiz tahlil qilindi: keyingi safar chuqurroq pozitsion tahlil tavsiya etiladi.']
                }
            }
        };

        // Simulated AI external API hook (if configured in future)
        this.externalApiConfig = null;
    }

    getPersona(category = 'kids') {
        return this.personas[category] || this.personas['kids'];
    }

    getRandomPhrase(category, type) {
        const persona = this.getPersona(category);
        const list = persona.phrases[type] || persona.phrases.correct;
        return list[Math.floor(Math.random() * list.length)];
    }

    /**
     * Determines AI calculation delay in ms based on difficulty
     */
    getReactionTime(difficulty = 'medium') {
        switch (difficulty) {
            case 'easy': return 1200 + Math.random() * 800; // Slower, relaxed
            case 'medium': return 800 + Math.random() * 500;
            case 'hard': return 400 + Math.random() * 400;
            case 'expert': return 200 + Math.random() * 250; // Super fast
            default: return 800;
        }
    }

    /**
     * Determines if AI makes an intentional mistake based on difficulty
     */
    shouldAIMakeMistake(difficulty = 'medium') {
        const roll = Math.random();
        switch (difficulty) {
            case 'easy': return roll < 0.50; // 50% mistake rate
            case 'medium': return roll < 0.25; // 25% mistake rate
            case 'hard': return roll < 0.08; // 8% mistake rate
            case 'expert': return roll < 0.01; // 1% mistake rate
            default: return roll < 0.25;
        }
    }

    /**
     * Generates a smart context-aware hint for games
     */
    generateHint(gameId, questionOrState) {
        if (!questionOrState) {
            return "Savol shartini diqqat bilan o‘qing va variantlarni qiyoslang.";
        }

        // Custom hint logic based on game state
        if (typeof questionOrState === 'object') {
            if (questionOrState.hint) return questionOrState.hint;
            if (questionOrState.correctIndex !== undefined && questionOrState.options) {
                const correctOpt = questionOrState.options[questionOrState.correctIndex];
                return `Maslahat: To‘g‘ri javob "${String(correctOpt).charAt(0)}..." bilan boshlanadi yoki shu xususiyatga ega!`;
            }
            if (questionOrState.targetLetter) {
                return `Maslahat: Qidirilayotgan harf - "${questionOrState.targetLetter}"!`;
            }
            if (questionOrState.targetNumber !== undefined) {
                return `Maslahat: Raqam ${questionOrState.targetNumber <= 5 ? '5 dan kichik yoki teng' : '5 dan katta'}!`;
            }
        }

        return "Maslahat: E’tiboringizni eng aniq va mantiqiy faktlarga qarating.";
    }

    /**
     * Provides an educational explanation when the user makes a mistake
     */
    explainMistake(gameId, userChoice, correctChoice, context = {}) {
        let text = '';
        if (context.explanation) {
            return `💡 Tushuntirish: ${context.explanation}`;
        }

        if (userChoice !== undefined && correctChoice !== undefined) {
            text = `💡 Tahlil: Siz "${userChoice}" ni tanladingiz, ammo to‘g‘ri javob "${correctChoice}" edi. `;
            if (context.rule) {
                text += `Sababi: ${context.rule}`;
            } else {
                text += `Qayta tekshirib ko‘ring va keyingi safar ushbu qoidaga e’tibor bering!`;
            }
        } else {
            text = "💡 Tahlil: Qoidaga muvofiq, har bir elementning o‘zaro bog‘liqligini tekshirish zarur.";
        }
        return text;
    }

    /**
     * Adaptive Difficulty Balancer: calculates recommended difficulty
     * based on user's recent win rate.
     */
    computeAdaptiveDifficulty(recentGames = []) {
        if (!recentGames || recentGames.length < 3) return 'medium';

        const lastFive = recentGames.slice(0, 5);
        const winCount = lastFive.filter(g => g.won).length;
        const winRate = winCount / lastFive.length;

        if (winRate >= 0.8) return 'hard';
        if (winRate >= 0.95) return 'expert';
        if (winRate <= 0.3) return 'easy';
        return 'medium';
    }

    /**
     * Algorithmic AI Move Generator for interactive board / logic games
     */
    solveDecision(gameType, possibleMoves, evaluatorFn, difficulty = 'medium') {
        if (!possibleMoves || possibleMoves.length === 0) return null;

        const makeMistake = this.shouldAIMakeMistake(difficulty);
        if (makeMistake || typeof evaluatorFn !== 'function') {
            // Pick random or sub-optimal move
            return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        }

        // Evaluate all moves and pick the highest scored
        let bestMove = possibleMoves[0];
        let bestScore = -Infinity;

        for (const move of possibleMoves) {
            const score = evaluatorFn(move);
            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
        }

        return bestMove;
    }
}

// Global singleton instance
window.aiEngine = new AIEngine();
