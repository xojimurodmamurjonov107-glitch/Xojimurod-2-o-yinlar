/**
 * Brain Arena - Kids Games (6-10 Years)
 * 10 Fully Playable, Competitive, Educational & Logical Games.
 * 
 * 1. Math Challenge
 * 2. Word Builder
 * 3. Brain Memory
 * 4. Logic Puzzle
 * 5. Pattern Master
 * 6. Geography Quest
 * 7. Math Race
 * 8. Riddle Master
 * 9. Code Breaker
 * 10. Smart Chess
 */

window.KidsGames = {
    // ------------------------------------------------------------------------
    // 1. MATH CHALLENGE
    // ------------------------------------------------------------------------
    'math-challenge': {
        id: 'math-challenge',
        title: 'Math Challenge',
        category: 'kids',
        icon: '🧮',
        description: 'Tezkor arifmetika: qo‘shish, ayirish va ko‘paytirish masalalari!',
        rules: 'Misolni hisoblang va 4 ta variantdan to‘g‘risini tanlang.',
        difficulty: 'medium',
        tags: ['Arifmetika', 'Hisoblash', 'Tezlik'],

        render(container, { mode, difficulty, onFinish, updateScore, showAIComment }) {
            let score = 0;
            let round = 0;
            const totalRounds = 6;
            let currentProblem = null;
            let aiScore = 0;

            container.innerHTML = `
                <div class="kids-game math-challenge-box">
                    <div class="kids-hud">
                        <div class="hud-item">Bosqich: <span id="mc-round">1/6</span></div>
                        ${mode === 'ai' ? '<div class="hud-item ai-score-hud">AI Bali: <span id="mc-ai-score">0</span></div>' : ''}
                    </div>
                    <div class="math-problem-card">
                        <div class="math-expr" id="mc-expr">? + ? =</div>
                    </div>
                    <div class="math-options-grid" id="mc-options"></div>
                    <div class="kids-feedback-banner" id="mc-feedback">Hisoblang va javobni tanlang!</div>
                </div>
            `;

            const roundEl = container.querySelector('#mc-round');
            const exprEl = container.querySelector('#mc-expr');
            const optionsEl = container.querySelector('#mc-options');
            const feedbackEl = container.querySelector('#mc-feedback');
            const aiScoreEl = container.querySelector('#mc-ai-score');

            function generateProblem() {
                const ops = ['+', '-', '*'];
                const op = ops[Math.floor(Math.random() * ops.length)];
                let a, b, ans;

                if (op === '+') {
                    a = Math.floor(Math.random() * 40) + 5;
                    b = Math.floor(Math.random() * 40) + 5;
                    ans = a + b;
                } else if (op === '-') {
                    a = Math.floor(Math.random() * 50) + 20;
                    b = Math.floor(Math.random() * a) + 1;
                    ans = a - b;
                } else {
                    a = Math.floor(Math.random() * 9) + 2;
                    b = Math.floor(Math.random() * 9) + 2;
                    ans = a * b;
                }

                const options = [ans];
                while (options.length < 4) {
                    const delta = (Math.floor(Math.random() * 7) + 1) * (Math.random() > 0.5 ? 1 : -1);
                    const cand = ans + delta;
                    if (cand >= 0 && !options.includes(cand)) options.push(cand);
                }
                options.sort(() => 0.5 - Math.random());

                return { a, b, op, ans, options };
            }

            function nextRound() {
                if (round >= totalRounds) {
                    const won = mode === 'ai' ? score > aiScore : score >= 40;
                    onFinish({
                        score,
                        won,
                        perfect: score === totalRounds * 20
                    });
                    return;
                }
                roundEl.textContent = `${round + 1}/${totalRounds}`;
                currentProblem = generateProblem();
                exprEl.textContent = `${currentProblem.a} ${currentProblem.op} ${currentProblem.b} = ?`;

                optionsEl.innerHTML = '';
                currentProblem.options.forEach(opt => {
                    const btn = document.createElement('button');
                    btn.className = 'kids-action-btn';
                    btn.textContent = opt;
                    btn.onclick = () => handleAnswer(opt);
                    optionsEl.appendChild(btn);
                });

                if (mode === 'ai') {
                    // AI answers independently
                    const makeMistake = window.aiEngine.shouldAIMakeMistake(difficulty);
                    const aiWillScore = !makeMistake;
                    setTimeout(() => {
                        if (aiWillScore) {
                            aiScore += 15;
                            if (aiScoreEl) aiScoreEl.textContent = aiScore;
                            showAIComment('⚡ Robo-Spark ham hisobladi!');
                        }
                    }, window.aiEngine.getReactionTime(difficulty));
                }
            }

            function handleAnswer(chosen) {
                if (chosen === currentProblem.ans) {
                    window.soundEngine.play('correct');
                    score += 20;
                    updateScore(score);
                    feedbackEl.textContent = `🎯 To‘g‘ri! ${currentProblem.a} ${currentProblem.op} ${currentProblem.b} = ${currentProblem.ans}`;
                    feedbackEl.className = 'kids-feedback-banner fb-correct';
                } else {
                    window.soundEngine.play('wrong');
                    feedbackEl.textContent = `❌ Xato. To‘g‘ri javob: ${currentProblem.ans}`;
                    feedbackEl.className = 'kids-feedback-banner fb-wrong';
                }
                round++;
                setTimeout(nextRound, 1000);
            }

            nextRound();
        }
    },

    // ------------------------------------------------------------------------
    // 2. WORD BUILDER
    // ------------------------------------------------------------------------
    'word-builder': {
        id: 'word-builder',
        title: 'Word Builder',
        category: 'kids',
        icon: '🔤',
        description: 'Aralashib ketgan harflardan to‘g‘ri so‘zni yig‘ing!',
        rules: 'Harf katakchalarini bosib, berilgan ta’rifga mos so‘zni hosil qiling.',
        difficulty: 'medium',
        tags: ['So‘z boyligi', 'Til', 'Mantiq'],

        render(container, { onFinish, updateScore }) {
            const words = [
                { word: 'MAKTAB', clue: 'Bilim maskani 🏫' },
                { word: 'KITOB', clue: 'Eng yaqin do‘st va bilim manbayi 📖' },
                { word: 'QUYOSH', clue: 'Kunduzgi osmondagi yulduz ☀️' },
                { word: 'KOMPYUTER', clue: 'Axborot va dasturlash vositasi 💻' },
                { word: 'SHAXMAT', clue: 'Donolar aql jangi o‘yini ♟️' }
            ];

            let score = 0;
            let currentIdx = 0;
            let currentWordObj = null;
            let built = [];
            let availableLetters = [];

            container.innerHTML = `
                <div class="kids-game word-builder-box">
                    <div class="kids-hud">
                        <div class="hud-item">So‘z: <span id="wb-round">1/5</span></div>
                    </div>
                    <div class="word-clue-card">
                        <span class="clue-tag">Izoh:</span> <span id="wb-clue"></span>
                    </div>
                    <div class="word-slots-row" id="wb-slots"></div>
                    <div class="letter-pool-row" id="wb-pool"></div>
                    <div class="word-controls">
                        <button class="btn-secondary" id="wb-clear">🧹 Tozalash</button>
                    </div>
                    <div class="kids-feedback-banner" id="wb-feedback">Harflarni ketma-ket bosing!</div>
                </div>
            `;

            const clueEl = container.querySelector('#wb-clue');
            const slotsEl = container.querySelector('#wb-slots');
            const poolEl = container.querySelector('#wb-pool');
            const feedbackEl = container.querySelector('#wb-feedback');
            const clearBtn = container.querySelector('#wb-clear');
            const roundEl = container.querySelector('#wb-round');

            function loadWord() {
                if (currentIdx >= words.length) {
                    onFinish({ score, won: score >= 60, perfect: score === words.length * 25 });
                    return;
                }
                roundEl.textContent = `${currentIdx + 1}/${words.length}`;
                currentWordObj = words[currentIdx];
                clueEl.textContent = currentWordObj.clue;
                built = [];

                // Scramble
                availableLetters = currentWordObj.word.split('').map((letter, id) => ({
                    id,
                    letter,
                    used: false
                })).sort(() => 0.5 - Math.random());

                renderGame();
            }

            function renderGame() {
                // Render Slots
                slotsEl.innerHTML = '';
                for (let i = 0; i < currentWordObj.word.length; i++) {
                    const slot = document.createElement('div');
                    slot.className = `word-slot ${built[i] ? 'filled' : ''}`;
                    slot.textContent = built[i] ? built[i].letter : '';
                    slotsEl.appendChild(slot);
                }

                // Render Pool
                poolEl.innerHTML = '';
                availableLetters.forEach(item => {
                    const tile = document.createElement('button');
                    tile.className = `letter-tile ${item.used ? 'used' : ''}`;
                    tile.textContent = item.letter;
                    tile.disabled = item.used;
                    tile.onclick = () => {
                        if (item.used) return;
                        window.soundEngine.play('click');
                        item.used = true;
                        built.push(item);
                        renderGame();
                        checkWord();
                    };
                    poolEl.appendChild(tile);
                });
            }

            function checkWord() {
                if (built.length === currentWordObj.word.length) {
                    const formed = built.map(b => b.letter).join('');
                    if (formed === currentWordObj.word) {
                        window.soundEngine.play('correct');
                        score += 25;
                        updateScore(score);
                        feedbackEl.textContent = `🎉 Barakalla! "${formed}" to‘g‘ri yig‘ildi!`;
                        feedbackEl.className = 'kids-feedback-banner fb-correct';
                        currentIdx++;
                        setTimeout(loadWord, 1200);
                    } else {
                        window.soundEngine.play('wrong');
                        feedbackEl.textContent = `Noto‘g‘ri: "${formed}". Qaytadan urining!`;
                        feedbackEl.className = 'kids-feedback-banner fb-wrong';
                    }
                }
            }

            clearBtn.onclick = () => {
                built = [];
                availableLetters.forEach(l => l.used = false);
                renderGame();
            };

            loadWord();
        }
    },

    // ------------------------------------------------------------------------
    // 3. BRAIN MEMORY (Simon Says Pattern)
    // ------------------------------------------------------------------------
    'brain-memory': {
        id: 'brain-memory',
        title: 'Brain Memory',
        category: 'kids',
        icon: '🧠',
        description: 'Chiroqlar ketma-ketligini eslab qoling va aynan shunday takrorlang!',
        rules: 'Ketma-ket yongan rangli tugmalarni diqqat bilan kuzatib, keyin birma-bir bosing.',
        difficulty: 'medium',
        tags: ['Xotira', 'Diqqat', 'Ketma-ketlik'],

        render(container, { onFinish, updateScore }) {
            const colors = ['red', 'green', 'blue', 'yellow'];
            let sequence = [];
            let playerStep = 0;
            let level = 1;
            let score = 0;
            let canClick = false;

            container.innerHTML = `
                <div class="kids-game brain-memory-box">
                    <div class="kids-hud">
                        <div class="hud-item">Daraja: <span id="bm-level">1</span></div>
                    </div>
                    <div class="simon-board">
                        <button class="simon-pad simon-red" data-color="red"></button>
                        <button class="simon-pad simon-green" data-color="green"></button>
                        <button class="simon-pad simon-yellow" data-color="yellow"></button>
                        <button class="simon-pad simon-blue" data-color="blue"></button>
                    </div>
                    <div class="kids-feedback-banner" id="bm-status">Diqqat bilan tomosha qiling...</div>
                </div>
            `;

            const pads = container.querySelectorAll('.simon-pad');
            const statusEl = container.querySelector('#bm-status');
            const levelEl = container.querySelector('#bm-level');

            function flashPad(colorName) {
                const pad = container.querySelector(`.simon-${colorName}`);
                if (!pad) return;
                pad.classList.add('lit');
                window.soundEngine.play('cardFlip');
                setTimeout(() => pad.classList.remove('lit'), 400);
            }

            function playSequence() {
                canClick = false;
                statusEl.textContent = '👀 Diqqat bilan tomosha qiling...';
                let idx = 0;
                const interval = setInterval(() => {
                    flashPad(sequence[idx]);
                    idx++;
                    if (idx >= sequence.length) {
                        clearInterval(interval);
                        setTimeout(() => {
                            canClick = true;
                            playerStep = 0;
                            statusEl.textContent = '👉 Endi sizning navbatingiz!';
                        }, 300);
                    }
                }, 650);
            }

            function addStep() {
                levelEl.textContent = level;
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                sequence.push(randomColor);
                setTimeout(playSequence, 800);
            }

            pads.forEach(pad => {
                pad.onclick = () => {
                    if (!canClick) return;
                    const color = pad.dataset.color;
                    flashPad(color);

                    if (color === sequence[playerStep]) {
                        playerStep++;
                        if (playerStep === sequence.length) {
                            window.soundEngine.play('correct');
                            score += 20;
                            updateScore(score);
                            level++;
                            canClick = false;
                            statusEl.textContent = '🌟 Zo‘r! Keyingi bosqich!';

                            if (level > 5) {
                                setTimeout(() => {
                                    window.soundEngine.play('win');
                                    onFinish({ score: 100, won: true, perfect: true });
                                }, 800);
                            } else {
                                setTimeout(addStep, 800);
                            }
                        }
                    } else {
                        window.soundEngine.play('wrong');
                        statusEl.textContent = '❌ Xato ketma-ketlik. O‘yin yakunlandi!';
                        canClick = false;
                        setTimeout(() => {
                            onFinish({ score, won: score >= 40, perfect: false });
                        }, 1200);
                    }
                };
            });

            addStep();
        }
    },

    // ------------------------------------------------------------------------
    // 4. LOGIC PUZZLE (Balance Scale Puzzle)
    // ------------------------------------------------------------------------
    'logic-puzzle': {
        id: 'logic-puzzle',
        title: 'Logic Puzzle',
        category: 'kids',
        icon: '⚖️',
        description: 'Tarozi muvozanatini hisoblang: qaysi meva og‘irroq yoki teng?',
        rules: 'Mantiqiy shartlarni o‘rganib, noma’lum qiymatni toping.',
        difficulty: 'medium',
        tags: ['Mantiq', 'Tarozi', 'Deduksiya'],

        render(container, { onFinish, updateScore }) {
            const puzzles = [
                {
                    premise: '⚖️ 1 ta Qovun = 2 ta Tarvuzchaga teng.<br>⚖️ 1 ta Tarvuzcha = 3 ta Olma.',
                    question: '❓ 1 ta Qovun nechta Olmaga teng bo‘ladi?',
                    options: ['5 ta', '6 ta', '8 ta', '9 ta'],
                    ans: 1,
                    explanation: '1 Qovun = 2 Tarvuz = 2 × 3 Olma = 6 ta Olma.'
                },
                {
                    premise: '⚖️ 2 ta Kitob = 4 ta Daftar.<br>⚖️ 1 ta Daftar = 2 ta Qalam.',
                    question: '❓ 1 ta Kitob nechta Qalamga teng?',
                    options: ['2 ta', '4 ta', '6 ta', '8 ta'],
                    ans: 1,
                    explanation: '2 Kitob = 4 Daftar => 1 Kitob = 2 Daftar. 2 Daftar = 4 Qalam.'
                },
                {
                    premise: '⚖️ Sher = 2 ta Bo‘ri.<br>⚖️ Bo‘ri = 3 ta Tulki.',
                    question: '❓ 1 ta Sher nechta Tulkiga teng?',
                    options: ['4 ta', '5 ta', '6 ta', '8 ta'],
                    ans: 2,
                    explanation: '1 Sher = 2 Bo‘ri = 2 × 3 Tulki = 6 Tulki.'
                }
            ];

            let score = 0;
            let current = 0;

            container.innerHTML = `
                <div class="kids-game logic-puzzle-box">
                    <div class="kids-hud">
                        <div class="hud-item">Jumboq: <span id="lp-round">1/3</span></div>
                    </div>
                    <div class="logic-scale-card">
                        <div class="logic-premise" id="lp-premise"></div>
                        <div class="logic-question" id="lp-question"></div>
                    </div>
                    <div class="logic-options-grid" id="lp-options"></div>
                    <div class="kids-feedback-banner" id="lp-feedback">Mantiqiy zanjirni aniqlang!</div>
                </div>
            `;

            const premiseEl = container.querySelector('#lp-premise');
            const questionEl = container.querySelector('#lp-question');
            const optionsEl = container.querySelector('#lp-options');
            const feedbackEl = container.querySelector('#lp-feedback');
            const roundEl = container.querySelector('#lp-round');

            function loadPuzzle() {
                if (current >= puzzles.length) {
                    onFinish({ score, won: score >= 60, perfect: score === puzzles.length * 35 });
                    return;
                }
                const p = puzzles[current];
                roundEl.textContent = `${current + 1}/${puzzles.length}`;
                premiseEl.innerHTML = p.premise;
                questionEl.innerHTML = p.question;

                optionsEl.innerHTML = '';
                p.options.forEach((opt, idx) => {
                    const btn = document.createElement('button');
                    btn.className = 'kids-action-btn';
                    btn.textContent = opt;
                    btn.onclick = () => {
                        if (idx === p.ans) {
                            window.soundEngine.play('correct');
                            score += 35;
                            updateScore(score);
                            feedbackEl.textContent = `💡 To‘g‘ri! ${p.explanation}`;
                            feedbackEl.className = 'kids-feedback-banner fb-correct';
                        } else {
                            window.soundEngine.play('wrong');
                            feedbackEl.textContent = `❌ Xato. ${p.explanation}`;
                            feedbackEl.className = 'kids-feedback-banner fb-wrong';
                        }
                        current++;
                        setTimeout(loadPuzzle, 2200);
                    };
                    optionsEl.appendChild(btn);
                });
            }

            loadPuzzle();
        }
    },

    // ------------------------------------------------------------------------
    // 5. PATTERN MASTER
    // ------------------------------------------------------------------------
    'pattern-master': {
        id: 'pattern-master',
        title: 'Pattern Master',
        category: 'kids',
        icon: '🔄',
        description: 'Sonlar va shakllar qonuniyatini aniqlab, davom ettiring!',
        rules: 'Savol belgisi o‘rniga mantiqan mos keluvchi elementni toping.',
        difficulty: 'medium',
        tags: ['Ketma-ketlik', 'Qonuniyat', 'Mantiq'],

        render(container, { onFinish, updateScore }) {
            const patterns = [
                { seq: '2, 4, 6, 8, ?', ans: '10', options: ['9', '10', '12', '14'], hint: '+2 qo‘shilib bormoqda' },
                { seq: '3, 6, 9, 12, ?', ans: '15', options: ['14', '15', '16', '18'], hint: '+3 qo‘shilib bormoqda' },
                { seq: '🔴 🔵 🔴 🔵 ?', ans: '🔴', options: ['🔴', '🔵', '🟢', '🟡'], hint: 'Qizil va ko‘k almashmoqda' },
                { seq: '5, 10, 20, 40, ?', ans: '80', options: ['50', '60', '70', '80'], hint: '2 ga ko‘payib bormoqda' },
                { seq: '100, 90, 80, 70, ?', ans: '60', options: ['50', '60', '65', '75'], hint: '10 dan kamayib bormoqda' }
            ];

            let score = 0;
            let current = 0;

            container.innerHTML = `
                <div class="kids-game pattern-master-box">
                    <div class="kids-hud">
                        <div class="hud-item">Bosqich: <span id="pm-round">1/5</span></div>
                    </div>
                    <div class="pattern-display-card">
                        <div class="pattern-sequence" id="pm-seq"></div>
                    </div>
                    <div class="pattern-options-grid" id="pm-options"></div>
                    <div class="kids-feedback-banner" id="pm-feedback">Ketma-ketlikdagi qonuniyatni toping!</div>
                </div>
            `;

            const seqEl = container.querySelector('#pm-seq');
            const optionsEl = container.querySelector('#pm-options');
            const feedbackEl = container.querySelector('#pm-feedback');
            const roundEl = container.querySelector('#pm-round');

            function loadPattern() {
                if (current >= patterns.length) {
                    onFinish({ score, won: score >= 60, perfect: score === patterns.length * 20 });
                    return;
                }
                const p = patterns[current];
                roundEl.textContent = `${current + 1}/${patterns.length}`;
                seqEl.textContent = p.seq;

                optionsEl.innerHTML = '';
                p.options.forEach(opt => {
                    const btn = document.createElement('button');
                    btn.className = 'kids-action-btn';
                    btn.textContent = opt;
                    btn.onclick = () => {
                        if (opt === p.ans) {
                            window.soundEngine.play('correct');
                            score += 20;
                            updateScore(score);
                            feedbackEl.textContent = `🎯 To‘g‘ri! Qonuniyat: ${p.hint}`;
                            feedbackEl.className = 'kids-feedback-banner fb-correct';
                        } else {
                            window.soundEngine.play('wrong');
                            feedbackEl.textContent = `❌ Xato. To‘g‘ri javob: ${p.ans} (${p.hint})`;
                            feedbackEl.className = 'kids-feedback-banner fb-wrong';
                        }
                        current++;
                        setTimeout(loadPattern, 1200);
                    };
                    optionsEl.appendChild(btn);
                });
            }

            loadPattern();
        }
    },

    // ------------------------------------------------------------------------
    // 6. GEOGRAPHY QUEST
    // ------------------------------------------------------------------------
    'geography-quest': {
        id: 'geography-quest',
        title: 'Geography Quest',
        category: 'kids',
        icon: '🌍',
        description: 'Davlatlar bayrog‘i va poytaxtlarini bilasizmi? Sinab ko‘ring!',
        rules: 'Berilgan davlatning poytaxti yoki bayrog‘ini toping.',
        difficulty: 'medium',
        tags: ['Geografiya', 'Dunyo', 'Bilim'],

        render(container, { onFinish, updateScore }) {
            const questions = [
                { q: '🇺🇿 O‘zbekiston Respublikasining poytaxti qaysi shahar?', options: ['Samarqand', 'Toshkent', 'Buxoro', 'Xiva'], ans: 1 },
                { q: '🇯🇵 Kunchiqar mamlakat — Yaponiyaning poytaxti?', options: ['Kioto', 'Tokio', 'Seul', 'Pekin'], ans: 1 },
                { q: '🇫🇷 Eyfel minorasi joylashgan Fransiyaning poytaxti qaysi?', options: ['Parij', 'Lion', 'Rim', 'Madrid'], ans: 0 },
                { q: '🇹🇷 Turkiya davlatining poytaxti qaysi shahar?', options: ['Istanbul', 'Antaliya', 'Anqara', 'Izmir'], ans: 2 },
                { q: '🇬🇧 Buyuk Britaniyaning poytaxti qaysi shahar?', options: ['Liverpul', 'London', 'Manchester', 'Dublin'], ans: 1 }
            ];

            let score = 0;
            let current = 0;

            container.innerHTML = `
                <div class="kids-game geography-quest-box">
                    <div class="kids-hud">
                        <div class="hud-item">Savol: <span id="gq-round">1/5</span></div>
                    </div>
                    <div class="geo-question-card">
                        <h3 id="gq-question"></h3>
                    </div>
                    <div class="geo-options-grid" id="gq-options"></div>
                    <div class="kids-feedback-banner" id="gq-feedback">Dunyo xaritasi bo‘ylab sayohat!</div>
                </div>
            `;

            const qEl = container.querySelector('#gq-question');
            const optionsEl = container.querySelector('#gq-options');
            const feedbackEl = container.querySelector('#gq-feedback');
            const roundEl = container.querySelector('#gq-round');

            function loadQ() {
                if (current >= questions.length) {
                    onFinish({ score, won: score >= 60, perfect: score === questions.length * 20 });
                    return;
                }
                const item = questions[current];
                roundEl.textContent = `${current + 1}/${questions.length}`;
                qEl.textContent = item.q;

                optionsEl.innerHTML = '';
                item.options.forEach((opt, idx) => {
                    const btn = document.createElement('button');
                    btn.className = 'kids-action-btn';
                    btn.textContent = opt;
                    btn.onclick = () => {
                        if (idx === item.ans) {
                            window.soundEngine.play('correct');
                            score += 20;
                            updateScore(score);
                            feedbackEl.textContent = `🌟 To‘g‘ri! ${opt} — to‘g‘ri poytaxt!`;
                            feedbackEl.className = 'kids-feedback-banner fb-correct';
                        } else {
                            window.soundEngine.play('wrong');
                            feedbackEl.textContent = `❌ Xato. To‘g‘ri javob: ${item.options[item.ans]}`;
                            feedbackEl.className = 'kids-feedback-banner fb-wrong';
                        }
                        current++;
                        setTimeout(loadQ, 1200);
                    };
                    optionsEl.appendChild(btn);
                });
            }

            loadQ();
        }
    },

    // ------------------------------------------------------------------------
    // 7. MATH RACE
    // ------------------------------------------------------------------------
    'math-race': {
        id: 'math-race',
        title: 'Math Race',
        category: 'kids',
        icon: '🏎️',
        description: 'AI raqib bilan poyga! Tez hisoblang va mashinangizni marraga yetkazing!',
        rules: 'Har bir to‘g‘ri javob sizning avtomobilingizga nitro tezlik beradi.',
        difficulty: 'medium',
        tags: ['Poyga', 'Tezkor hisob', 'AI bellashuv'],

        render(container, { mode, difficulty, onFinish, updateScore, showAIComment }) {
            let playerPos = 0;
            let aiPos = 0;
            const targetPos = 100;
            let currentEquation = null;
            let gameEnded = false;

            container.innerHTML = `
                <div class="kids-game math-race-box">
                    <div class="race-track-area">
                        <div class="race-lane player-lane">
                            <span class="lane-label">Siz:</span>
                            <div class="race-bar-wrap">
                                <div class="race-car player-car" id="mr-player-car">🏎️</div>
                            </div>
                        </div>
                        <div class="race-lane ai-lane">
                            <span class="lane-label">Robo-Spark:</span>
                            <div class="race-bar-wrap">
                                <div class="race-car ai-car" id="mr-ai-car">🤖</div>
                            </div>
                        </div>
                    </div>
                    <div class="race-math-hud">
                        <div class="race-problem" id="mr-expr">?</div>
                        <div class="race-options-row" id="mr-options"></div>
                    </div>
                    <div class="kids-feedback-banner" id="mr-feedback">Tez hisoblab gazni bosing!</div>
                </div>
            `;

            const playerCar = container.querySelector('#mr-player-car');
            const aiCar = container.querySelector('#mr-ai-car');
            const exprEl = container.querySelector('#mr-expr');
            const optionsEl = container.querySelector('#mr-options');
            const feedbackEl = container.querySelector('#mr-feedback');

            function nextProblem() {
                if (gameEnded) return;
                const a = Math.floor(Math.random() * 15) + 3;
                const b = Math.floor(Math.random() * 15) + 3;
                const isAdd = Math.random() > 0.5;
                const ans = isAdd ? a + b : a - b;

                currentEquation = {
                    text: `${a} ${isAdd ? '+' : '-'} ${b} = ?`,
                    ans
                };
                exprEl.textContent = currentEquation.text;

                const options = [ans];
                while (options.length < 3) {
                    const diff = (Math.floor(Math.random() * 4) + 1) * (Math.random() > 0.5 ? 1 : -1);
                    const val = ans + diff;
                    if (!options.includes(val)) options.push(val);
                }
                options.sort(() => 0.5 - Math.random());

                optionsEl.innerHTML = '';
                options.forEach(opt => {
                    const btn = document.createElement('button');
                    btn.className = 'kids-action-btn';
                    btn.textContent = opt;
                    btn.onclick = () => {
                        if (gameEnded) return;
                        if (opt === currentEquation.ans) {
                            window.soundEngine.play('correct');
                            playerPos = Math.min(targetPos, playerPos + 25);
                            playerCar.style.left = `${playerPos}%`;
                            feedbackEl.textContent = '🚀 Nitro tezlik!';
                            feedbackEl.className = 'kids-feedback-banner fb-correct';
                            checkWin();
                        } else {
                            window.soundEngine.play('wrong');
                            feedbackEl.textContent = '💨 Sekinlashuv!';
                            feedbackEl.className = 'kids-feedback-banner fb-wrong';
                        }
                        if (!gameEnded) nextProblem();
                    };
                    optionsEl.appendChild(btn);
                });
            }

            // AI ticker
            const aiInterval = setInterval(() => {
                if (gameEnded) {
                    clearInterval(aiInterval);
                    return;
                }
                // AI advances based on difficulty
                const step = difficulty === 'expert' ? 18 : (difficulty === 'hard' ? 15 : 12);
                aiPos = Math.min(targetPos, aiPos + step);
                aiCar.style.left = `${aiPos}%`;
                checkWin();
            }, 1800);

            function checkWin() {
                if (gameEnded) return;
                if (playerPos >= targetPos) {
                    gameEnded = true;
                    clearInterval(aiInterval);
                    window.soundEngine.play('win');
                    updateScore(100);
                    feedbackEl.textContent = '🏆 G‘ALABA! Siz AI dan o‘zib ketdingiz!';
                    setTimeout(() => onFinish({ score: 100, won: true, perfect: true }), 1200);
                } else if (aiPos >= targetPos) {
                    gameEnded = true;
                    clearInterval(aiInterval);
                    window.soundEngine.play('lose');
                    feedbackEl.textContent = '🏁 AI marraga birinchi yetdi! Yaxshi poyga!';
                    setTimeout(() => onFinish({ score: playerPos, won: false, perfect: false }), 1200);
                }
            }

            nextProblem();
        }
    },

    // ------------------------------------------------------------------------
    // 8. RIDDLE MASTER
    // ------------------------------------------------------------------------
    'riddle-master': {
        id: 'riddle-master',
        title: 'Riddle Master',
        category: 'kids',
        icon: '❓',
        description: 'Qiziqarli xalq topishmoqlari va mantiqiy jumboqlar!',
        rules: 'Topishmoqni o‘qing va uning javobini toping.',
        difficulty: 'medium',
        tags: ['Topishmoq', 'Mantiq', 'Qiziqarli'],

        render(container, { onFinish, updateScore }) {
            const riddles = [
                { q: 'Oyoqsiz yurar, qanotsiz uchar, ko‘rinmas o‘zi, yelar kecha-kunduz. U nima?', ans: 0, options: ['Shamol 💨', 'Daryo 🌊', 'Quyosh ☀️', 'Mashina 🚗'] },
                { q: 'Qishda oppoq ko‘rpa yopar, bahor kelsa erib ketar. U nima?', ans: 2, options: ['Muzqaymoq 🍦', 'Yomg‘ir 🌧️', 'Qor ❄️', 'Bulut ☁️'] },
                { q: 'Uzun bo‘yli, o‘zi yog‘och, ichida qo‘rg‘oshin, daftarga chizar. U nima?', ans: 1, options: ['Chizg‘ich 📏', 'Qalam ✏️', 'O‘chirg‘ich 🧼', 'Qaychi ✂️'] },
                { q: 'Kunduzi osmonda bir o‘zi charaqlaydi, kechasi esa yo‘qoladi. U nima?', ans: 3, options: ['Oy 🌙', 'Chiroq 💡', 'Samolyot ✈️', 'Quyosh ☀️'] }
            ];

            let score = 0;
            let current = 0;

            container.innerHTML = `
                <div class="kids-game riddle-master-box">
                    <div class="kids-hud">
                        <div class="hud-item">Topishmoq: <span id="rm-round">1/4</span></div>
                    </div>
                    <div class="riddle-card">
                        <p id="rm-text"></p>
                    </div>
                    <div class="riddle-options-grid" id="rm-options"></div>
                    <div class="kids-feedback-banner" id="rm-feedback">Ziyraklik bilan o‘ylang!</div>
                </div>
            `;

            const textEl = container.querySelector('#rm-text');
            const optionsEl = container.querySelector('#rm-options');
            const feedbackEl = container.querySelector('#rm-feedback');
            const roundEl = container.querySelector('#rm-round');

            function loadRiddle() {
                if (current >= riddles.length) {
                    onFinish({ score, won: score >= 50, perfect: score === riddles.length * 25 });
                    return;
                }
                const r = riddles[current];
                roundEl.textContent = `${current + 1}/${riddles.length}`;
                textEl.textContent = r.q;

                optionsEl.innerHTML = '';
                r.options.forEach((opt, idx) => {
                    const btn = document.createElement('button');
                    btn.className = 'kids-action-btn';
                    btn.textContent = opt;
                    btn.onclick = () => {
                        if (idx === r.ans) {
                            window.soundEngine.play('correct');
                            score += 25;
                            updateScore(score);
                            feedbackEl.textContent = `🎯 To‘g‘ri topdingiz: ${opt}!`;
                            feedbackEl.className = 'kids-feedback-banner fb-correct';
                        } else {
                            window.soundEngine.play('wrong');
                            feedbackEl.textContent = `❌ Xato. To‘g‘ri javob: ${r.options[r.ans]}`;
                            feedbackEl.className = 'kids-feedback-banner fb-wrong';
                        }
                        current++;
                        setTimeout(loadRiddle, 1200);
                    };
                    optionsEl.appendChild(btn);
                });
            }

            loadRiddle();
        }
    },

    // ------------------------------------------------------------------------
    // 9. CODE BREAKER (Mastermind)
    // ------------------------------------------------------------------------
    'code-breaker': {
        id: 'code-breaker',
        title: 'Code Breaker',
        category: 'kids',
        icon: '🔐',
        description: 'Yashirin 3 xonali rangli kodni mantiqiy maslahatlar orqali buzing!',
        rules: 'Ranglarni tanlang. Yashil nuqta = joyi va rangi to‘g‘ri; Sariq nuqta = rangi bor lekin joyi boshqa.',
        difficulty: 'medium',
        tags: ['Kod buzish', 'Kripto', 'Deduksiya'],

        render(container, { onFinish, updateScore }) {
            const colors = ['🔴', '🔵', '🟢', '🟡'];
            // Generate secret 3 colors
            const secret = [
                colors[Math.floor(Math.random() * colors.length)],
                colors[Math.floor(Math.random() * colors.length)],
                colors[Math.floor(Math.random() * colors.length)]
            ];

            let attempts = 0;
            const maxAttempts = 5;
            let currentGuess = [];

            container.innerHTML = `
                <div class="kids-game code-breaker-box">
                    <div class="kids-hud">
                        <div class="hud-item">Urinish: <span id="cb-attempt">1/5</span></div>
                    </div>
                    <div class="code-history-area" id="cb-history"></div>
                    <div class="current-guess-slots" id="cb-slots">
                        <div class="c-slot" id="slot-0">❓</div>
                        <div class="c-slot" id="slot-1">❓</div>
                        <div class="c-slot" id="slot-2">❓</div>
                    </div>
                    <div class="color-picker-row" id="cb-picker"></div>
                    <div class="code-controls">
                        <button class="btn-primary" id="cb-submit">Tekshirish 🔓</button>
                    </div>
                    <div class="kids-feedback-banner" id="cb-feedback">3 ta rangni tanlang va tekshiring!</div>
                </div>
            `;

            const historyEl = container.querySelector('#cb-history');
            const pickerEl = container.querySelector('#cb-picker');
            const submitBtn = container.querySelector('#cb-submit');
            const feedbackEl = container.querySelector('#cb-feedback');
            const attemptEl = container.querySelector('#cb-attempt');

            colors.forEach(col => {
                const btn = document.createElement('button');
                btn.className = 'color-pick-item';
                btn.textContent = col;
                btn.onclick = () => {
                    if (currentGuess.length < 3) {
                        currentGuess.push(col);
                        updateSlots();
                    }
                };
                pickerEl.appendChild(btn);
            });

            function updateSlots() {
                for (let i = 0; i < 3; i++) {
                    const slot = container.querySelector(`#slot-${i}`);
                    slot.textContent = currentGuess[i] || '❓';
                }
            }

            submitBtn.onclick = () => {
                if (currentGuess.length < 3) {
                    feedbackEl.textContent = 'Iltimos, 3 ta rang tanlang!';
                    return;
                }

                attempts++;
                attemptEl.textContent = `${attempts}/${maxAttempts}`;

                // Calculate feedback
                let exact = 0;
                let colorMatch = 0;
                const secretCopy = [...secret];
                const guessCopy = [...currentGuess];

                // Check exact matches
                for (let i = 0; i < 3; i++) {
                    if (guessCopy[i] === secretCopy[i]) {
                        exact++;
                        secretCopy[i] = null;
                        guessCopy[i] = null;
                    }
                }

                // Check color matches
                for (let i = 0; i < 3; i++) {
                    if (guessCopy[i] !== null) {
                        const matchIdx = secretCopy.indexOf(guessCopy[i]);
                        if (matchIdx !== -1) {
                            colorMatch++;
                            secretCopy[matchIdx] = null;
                        }
                    }
                }

                // Render history row
                const row = document.createElement('div');
                row.className = 'cb-hist-row';
                row.innerHTML = `
                    <div class="hist-guess">${currentGuess.join(' ')}</div>
                    <div class="hist-indicators">
                        ${'🟢'.repeat(exact)}${'🟡'.repeat(colorMatch)}${'⚪'.repeat(3 - exact - colorMatch)}
                    </div>
                `;
                historyEl.appendChild(row);

                if (exact === 3) {
                    window.soundEngine.play('win');
                    updateScore(100);
                    feedbackEl.textContent = '🎉 TABRIKLAYMIZ! Kod to‘liq buzildi!';
                    feedbackEl.className = 'kids-feedback-banner fb-correct';
                    setTimeout(() => onFinish({ score: 100, won: true, perfect: attempts <= 2 }), 1000);
                    return;
                }

                if (attempts >= maxAttempts) {
                    window.soundEngine.play('lose');
                    feedbackEl.textContent = `Imkoniyat tugadi! Kod: ${secret.join(' ')}`;
                    feedbackEl.className = 'kids-feedback-banner fb-wrong';
                    setTimeout(() => onFinish({ score: 30, won: false, perfect: false }), 1500);
                    return;
                }

                currentGuess = [];
                updateSlots();
            };
        }
    },

    // ------------------------------------------------------------------------
    // 10. SMART CHESS (Mini Tactical Chess)
    // ------------------------------------------------------------------------
    'smart-chess': {
        id: 'smart-chess',
        title: 'Smart Chess',
        category: 'kids',
        icon: '♟️',
        description: 'Sodda 4x4 shaxmat doskasida AI raqib shohini mot qiling!',
        rules: 'Oq donalar sizniki. Shoh, Ot, Fil va Piyoda donalari bilan harakat qiling.',
        difficulty: 'medium',
        tags: ['Shaxmat', 'Strategiya', 'AI raqib'],

        render(container, { mode, difficulty, onFinish, updateScore, showAIComment }) {
            // 4x4 board:
            // Row 0: Black [b_r, b_k, b_b, b_p]
            // Row 1: Black Pawns or empty
            // Row 2: White Pawns
            // Row 3: White [w_r, w_k, w_b, w_p]
            let board = [
                ['bR', 'bK', 'bB', 'bN'],
                ['bP', 'bP', 'bP', 'bP'],
                ['wP', 'wP', 'wP', 'wP'],
                ['wR', 'wK', 'wB', 'wN']
            ];

            const pieceSymbols = {
                'wK': '♔', 'wR': '♖', 'wB': '♗', 'wN': '♘', 'wP': '♙',
                'bK': '♚', 'bR': '♜', 'bB': '♝', 'bN': '♞', 'bP': '♟'
            };

            let selectedSquare = null;
            let playerTurn = true;
            let score = 0;

            container.innerHTML = `
                <div class="kids-game smart-chess-box">
                    <div class="kids-hud">
                        <div class="hud-item">Navbat: <span id="sc-turn">Sizning navbatingiz (Oq)</span></div>
                    </div>
                    <div class="mini-chess-board" id="sc-board"></div>
                    <div class="kids-feedback-banner" id="sc-feedback">Oq donani tanlang va yurish qiling!</div>
                </div>
            `;

            const boardEl = container.querySelector('#sc-board');
            const turnEl = container.querySelector('#sc-turn');
            const feedbackEl = container.querySelector('#sc-feedback');

            function renderBoard() {
                boardEl.innerHTML = '';
                for (let r = 0; r < 4; r++) {
                    for (let c = 0; c < 4; c++) {
                        const sq = document.createElement('div');
                        const isDark = (r + c) % 2 === 1;
                        sq.className = `chess-sq ${isDark ? 'sq-dark' : 'sq-light'}`;
                        if (selectedSquare && selectedSquare.r === r && selectedSquare.c === c) {
                            sq.classList.add('sq-selected');
                        }

                        const piece = board[r][c];
                        if (piece) {
                            sq.textContent = pieceSymbols[piece] || piece;
                            sq.classList.add(piece.startsWith('w') ? 'piece-white' : 'piece-black');
                        }

                        sq.onclick = () => handleSquareClick(r, c);
                        boardEl.appendChild(sq);
                    }
                }
            }

            function handleSquareClick(r, c) {
                if (!playerTurn) return;
                const piece = board[r][c];

                if (!selectedSquare) {
                    if (piece && piece.startsWith('w')) {
                        selectedSquare = { r, c };
                        window.soundEngine.play('click');
                        renderBoard();
                    }
                } else {
                    // Try to move
                    if (selectedSquare.r === r && selectedSquare.c === c) {
                        selectedSquare = null;
                        renderBoard();
                        return;
                    }

                    // Move piece
                    const targetPiece = board[r][c];
                    if (targetPiece && targetPiece.startsWith('w')) {
                        // Switch selection
                        selectedSquare = { r, c };
                        renderBoard();
                        return;
                    }

                    // Perform player move
                    board[r][c] = board[selectedSquare.r][selectedSquare.c];
                    board[selectedSquare.r][selectedSquare.c] = null;
                    selectedSquare = null;
                    window.soundEngine.play('move');
                    renderBoard();

                    if (targetPiece === 'bK') {
                        // Won!
                        window.soundEngine.play('win');
                        score = 100;
                        updateScore(score);
                        feedbackEl.textContent = '👑 MOT! Siz qora shohni yengdingiz!';
                        setTimeout(() => onFinish({ score, won: true, perfect: true }), 1000);
                        return;
                    }

                    // AI Turn
                    playerTurn = false;
                    turnEl.textContent = 'Robo-Spark o‘ylamoqda...';
                    feedbackEl.textContent = '🤖 AI yurish qilmoqda...';

                    setTimeout(makeAIMove, window.aiEngine.getReactionTime(difficulty));
                }
            }

            function makeAIMove() {
                // Find all black pieces
                const blackPieces = [];
                for (let r = 0; r < 4; r++) {
                    for (let c = 0; c < 4; c++) {
                        if (board[r][c] && board[r][c].startsWith('b')) {
                            blackPieces.push({ r, c, piece: board[r][c] });
                        }
                    }
                }

                if (blackPieces.length === 0) {
                    onFinish({ score: 100, won: true, perfect: true });
                    return;
                }

                // AI picks a piece and moves down or captures white
                let moved = false;
                // Prefer forward move or capture
                for (const p of blackPieces.sort(() => 0.5 - Math.random())) {
                    const nextR = p.r + 1;
                    if (nextR < 4) {
                        // Check if can advance
                        const target = board[nextR][p.c];
                        if (!target || target.startsWith('w')) {
                            board[nextR][p.c] = p.piece;
                            board[p.r][p.c] = null;
                            moved = true;
                            window.soundEngine.play('move');
                            if (target === 'wK') {
                                window.soundEngine.play('lose');
                                feedbackEl.textContent = 'Mot bo‘ldingiz! AI shohni oldi.';
                                setTimeout(() => onFinish({ score: 30, won: false }), 1000);
                                return;
                            }
                            break;
                        }
                    }
                }

                playerTurn = true;
                turnEl.textContent = 'Sizning navbatingiz (Oq)';
                feedbackEl.textContent = 'Sizning yurishingiz!';
                renderBoard();
            }

            renderBoard();
        }
    }
};
