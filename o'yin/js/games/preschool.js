/**
 * Brain Arena - Preschool Games (3-5 Years)
 * 10 Fully Playable, Colorful, Safe, Interactive Games for Toddlers & Preschoolers.
 * 
 * 1. Color Match
 * 2. Shape Master
 * 3. Animal Sounds
 * 4. Memory Cards
 * 5. Number Adventure
 * 6. Find the Difference
 * 7. Puzzle World
 * 8. Fruit Sorting
 * 9. Shadow Match
 * 10. Alphabet Fun
 */

window.PreschoolGames = {
    // ------------------------------------------------------------------------
    // 1. COLOR MATCH
    // ------------------------------------------------------------------------
    'color-match': {
        id: 'color-match',
        title: 'Color Match',
        category: 'preschool',
        icon: '🎨',
        description: 'Rang-barang sharlarni mos keladigan savatlarga joylashtiring!',
        rules: 'Ekranda ko‘rsatilgan rangni toping va mos rangdagi katta tugmani bosing.',
        difficulty: 'easy',
        tags: ['Ranglar', 'Vizual idrok', 'Tezlik'],

        render(container, { mode, difficulty, onFinish, updateScore, showAIComment }) {
            const colors = [
                { name: 'Qizil', hex: '#FF4D4D', emoji: '🔴' },
                { name: 'Ko‘k', hex: '#2196F3', emoji: '🔵' },
                { name: 'Yashil', hex: '#4CAF50', emoji: '🟢' },
                { name: 'Sariq', hex: '#FFEB3B', emoji: '🟡' },
                { name: 'Binafsha', hex: '#9C27B0', emoji: '🟣' },
                { name: 'To‘q sariq', hex: '#FF9800', emoji: '🟠' }
            ];

            let score = 0;
            let currentRound = 0;
            const totalRounds = 5;
            let currentColor = null;
            let canClick = true;

            container.innerHTML = `
                <div class="preschool-game color-match-box">
                    <div class="ps-header">
                        <div class="ps-prompt" id="cm-prompt">Rangni toping!</div>
                        <div class="ps-round-dots" id="cm-dots"></div>
                    </div>
                    <div class="color-target-display" id="cm-target">
                        <div class="color-bubble" id="cm-bubble"></div>
                        <h2 id="cm-target-name"></h2>
                    </div>
                    <div class="color-options-grid" id="cm-options"></div>
                    <div class="ps-ai-cheer" id="cm-cheer">🧸 Robo-Do‘st yoningizda!</div>
                </div>
            `;

            const promptEl = container.querySelector('#cm-prompt');
            const bubbleEl = container.querySelector('#cm-bubble');
            const nameEl = container.querySelector('#cm-target-name');
            const optionsEl = container.querySelector('#cm-options');
            const dotsEl = container.querySelector('#cm-dots');
            const cheerEl = container.querySelector('#cm-cheer');

            function updateDots() {
                dotsEl.innerHTML = Array(totalRounds).fill(0).map((_, i) => `
                    <span class="ps-dot ${i < currentRound ? 'active' : ''} ${i === currentRound ? 'current' : ''}"></span>
                `).join('');
            }

            function nextRound() {
                if (currentRound >= totalRounds) {
                    onFinish({ score, won: score >= 30, perfect: score >= totalRounds * 10 });
                    return;
                }
                canClick = true;
                updateDots();

                // Pick random color
                currentColor = colors[Math.floor(Math.random() * colors.length)];
                bubbleEl.style.backgroundColor = currentColor.hex;
                bubbleEl.style.boxShadow = `0 0 35px ${currentColor.hex}`;
                nameEl.textContent = `${currentColor.name} rangni tanlang!`;
                nameEl.style.color = currentColor.hex;

                // Pick 3 or 4 options (including correct)
                const otherColors = colors.filter(c => c.hex !== currentColor.hex);
                const shuffled = [currentColor, ...otherColors.sort(() => 0.5 - Math.random()).slice(0, 3)]
                    .sort(() => 0.5 - Math.random());

                optionsEl.innerHTML = '';
                shuffled.forEach(c => {
                    const btn = document.createElement('button');
                    btn.className = 'color-btn';
                    btn.style.backgroundColor = c.hex;
                    btn.innerHTML = `<span class="c-emoji">${c.emoji}</span><span class="c-label">${c.name}</span>`;
                    btn.onclick = () => handleChoice(c);
                    optionsEl.appendChild(btn);
                });

                if (mode === 'ai') {
                    showAIComment('🧸 Keling, bu rangni birga topamiz!');
                }
            }

            function handleChoice(chosen) {
                if (!canClick) return;
                canClick = false;

                if (chosen.hex === currentColor.hex) {
                    window.soundEngine.play('correct');
                    score += 10;
                    updateScore(score);
                    cheerEl.textContent = '🌟 Barakalla! To‘ppa-to‘g‘ri!';
                    cheerEl.className = 'ps-ai-cheer cheer-success';
                } else {
                    window.soundEngine.play('wrong');
                    cheerEl.textContent = `💫 Hechqisi yo‘q! Bu ${chosen.name} edi. To‘g‘risi: ${currentColor.name}`;
                    cheerEl.className = 'ps-ai-cheer cheer-retry';
                }

                currentRound++;
                setTimeout(nextRound, 1200);
            }

            nextRound();
        }
    },

    // ------------------------------------------------------------------------
    // 2. SHAPE MASTER
    // ------------------------------------------------------------------------
    'shape-master': {
        id: 'shape-master',
        title: 'Shape Master',
        category: 'preschool',
        icon: '🔺',
        description: 'Geometrik shakllarni (doira, kvadrat, uchburchak, yulduz) toping!',
        rules: 'Ko‘rsatilgan nomga mos keluvchi shakl ustiga bosing.',
        difficulty: 'easy',
        tags: ['Shakllar', 'Fazoviy idrok', 'Mantiq'],

        render(container, { mode, onFinish, updateScore }) {
            const shapes = [
                { id: 'circle', name: 'Aylana', svg: '<circle cx="50" cy="50" r="40" fill="#FF5722"/>' },
                { id: 'square', name: 'Kvadrat', svg: '<rect x="15" y="15" width="70" height="70" rx="8" fill="#4CAF50"/>' },
                { id: 'triangle', name: 'Uchburchak', svg: '<polygon points="50,15 90,85 10,85" fill="#2196F3"/>' },
                { id: 'star', name: 'Yulduzcha', svg: '<polygon points="50,10 63,38 93,38 68,57 78,85 50,67 22,85 32,57 7,38 37,38" fill="#FFD166"/>' },
                { id: 'heart', name: 'Yurakcha', svg: '<path d="M50 82 C50 82 15 55 15 32 C15 17 28 10 40 20 C46 25 50 30 50 30 C50 30 54 25 60 20 C72 10 85 17 85 32 C85 55 50 82 50 82 Z" fill="#E91E63"/>' }
            ];

            let score = 0;
            let round = 0;
            const totalRounds = 5;
            let currentShape = null;

            container.innerHTML = `
                <div class="preschool-game shape-master-box">
                    <div class="ps-header">
                        <h2 class="ps-prompt" id="sm-prompt">Shaklni toping!</h2>
                        <div class="ps-round-dots" id="sm-dots"></div>
                    </div>
                    <div class="shape-question-banner">
                        <span id="sm-target-text"></span>
                    </div>
                    <div class="shapes-grid" id="sm-options"></div>
                    <div class="ps-ai-cheer" id="sm-feedback">🧸 Shakllarni sinchiklab tomosha qiling!</div>
                </div>
            `;

            const textEl = container.querySelector('#sm-target-text');
            const optionsEl = container.querySelector('#sm-options');
            const dotsEl = container.querySelector('#sm-dots');
            const feedbackEl = container.querySelector('#sm-feedback');

            function nextRound() {
                if (round >= totalRounds) {
                    onFinish({ score, won: score >= 30, perfect: score >= totalRounds * 10 });
                    return;
                }
                dotsEl.innerHTML = Array(totalRounds).fill(0).map((_, i) => `
                    <span class="ps-dot ${i < round ? 'active' : ''} ${i === round ? 'current' : ''}"></span>
                `).join('');

                currentShape = shapes[Math.floor(Math.random() * shapes.length)];
                textEl.innerHTML = `Qani, <strong>"${currentShape.name}"</strong> shaklini toping!`;

                const pool = [currentShape, ...shapes.filter(s => s.id !== currentShape.id).sort(() => 0.5 - Math.random()).slice(0, 3)]
                    .sort(() => 0.5 - Math.random());

                optionsEl.innerHTML = '';
                pool.forEach(s => {
                    const card = document.createElement('div');
                    card.className = 'shape-card';
                    card.innerHTML = `
                        <svg viewBox="0 0 100 100" class="shape-svg">${s.svg}</svg>
                        <span class="shape-name">${s.name}</span>
                    `;
                    card.onclick = () => {
                        if (s.id === currentShape.id) {
                            window.soundEngine.play('correct');
                            card.classList.add('correct-glow');
                            score += 10;
                            updateScore(score);
                            feedbackEl.textContent = `🎉 Super! Bu haqiqatan ham ${s.name}!`;
                            feedbackEl.className = 'ps-ai-cheer cheer-success';
                        } else {
                            window.soundEngine.play('wrong');
                            card.classList.add('wrong-shake');
                            feedbackEl.textContent = `Bu ${s.name} edi. Keling, ${currentShape.name}ni qidiramiz!`;
                            feedbackEl.className = 'ps-ai-cheer cheer-retry';
                        }
                        round++;
                        setTimeout(nextRound, 1100);
                    };
                    optionsEl.appendChild(card);
                });
            }

            nextRound();
        }
    },

    // ------------------------------------------------------------------------
    // 3. ANIMAL SOUNDS
    // ------------------------------------------------------------------------
    'animal-sounds': {
        id: 'animal-sounds',
        title: 'Animal Sounds',
        category: 'preschool',
        icon: '🐶',
        description: 'Hayvonlar tovushini eshiting va qaysi hayvon ekanligini toping!',
        rules: 'Ovozni eshitish uchun karnay tugmasini bosing va to‘g‘ri hayvonni tanlang.',
        difficulty: 'easy',
        tags: ['Hayvonlar', 'Eshitish qobiliyati', 'Quvnoq'],

        render(container, { onFinish, updateScore }) {
            const animals = [
                { id: 'cow', name: 'Sigir', emoji: '🐮', soundText: 'Mooo!' },
                { id: 'dog', name: 'Kuchukcha', emoji: '🐶', soundText: 'Vov-vov!' },
                { id: 'cat', name: 'Mushukcha', emoji: '🐱', soundText: 'Miyov!' },
                { id: 'duck', name: 'O‘rdakcha', emoji: '🦆', soundText: 'G‘a-g‘a!' },
                { id: 'bird', name: 'Qushcha', emoji: '🐦', soundText: 'Jik-jik!' },
                { id: 'frog', name: 'Baqa', emoji: '🐸', soundText: 'Vaq-vaq!' },
                { id: 'lion', name: 'Sher', emoji: '🦁', soundText: 'Rrrr!' }
            ];

            let score = 0;
            let round = 0;
            const totalRounds = 5;
            let currentAnimal = null;

            container.innerHTML = `
                <div class="preschool-game animal-sounds-box">
                    <div class="ps-header">
                        <h2 class="ps-prompt">Bu qaysi hayvonning ovozi?</h2>
                        <div class="ps-round-dots" id="as-dots"></div>
                    </div>
                    <div class="sound-speaker-area">
                        <button class="speaker-btn pulse-anim" id="as-play-btn">
                            🔊 Ovozni tinglash
                        </button>
                        <p class="sound-cue" id="as-cue">Tugmani bosing va diqqat bilan eshiting!</p>
                    </div>
                    <div class="animals-grid" id="as-options"></div>
                    <div class="ps-ai-cheer" id="as-cheer">🧸 Quloq solamiz: qaysi hayvon ovoz chiqaryapti?</div>
                </div>
            `;

            const playBtn = container.querySelector('#as-play-btn');
            const cueEl = container.querySelector('#as-cue');
            const optionsEl = container.querySelector('#as-options');
            const dotsEl = container.querySelector('#as-dots');
            const cheerEl = container.querySelector('#as-cheer');

            function playCurrentSound() {
                if (currentAnimal) {
                    window.soundEngine.playAnimal(currentAnimal.id);
                    cueEl.textContent = `Ovoz: "${currentAnimal.soundText}"`;
                }
            }

            playBtn.onclick = playCurrentSound;

            function nextRound() {
                if (round >= totalRounds) {
                    onFinish({ score, won: score >= 30, perfect: score >= totalRounds * 10 });
                    return;
                }
                dotsEl.innerHTML = Array(totalRounds).fill(0).map((_, i) => `
                    <span class="ps-dot ${i < round ? 'active' : ''} ${i === round ? 'current' : ''}"></span>
                `).join('');

                currentAnimal = animals[Math.floor(Math.random() * animals.length)];
                playCurrentSound();

                const pool = [currentAnimal, ...animals.filter(a => a.id !== currentAnimal.id).sort(() => 0.5 - Math.random()).slice(0, 3)]
                    .sort(() => 0.5 - Math.random());

                optionsEl.innerHTML = '';
                pool.forEach(a => {
                    const card = document.createElement('button');
                    card.className = 'animal-card';
                    card.innerHTML = `<span class="a-emoji">${a.emoji}</span><span class="a-name">${a.name}</span>`;
                    card.onclick = () => {
                        if (a.id === currentAnimal.id) {
                            window.soundEngine.play('correct');
                            score += 10;
                            updateScore(score);
                            cheerEl.textContent = `🎉 To‘g‘ri! Bu ${a.name} edi! ${a.soundText}`;
                            cheerEl.className = 'ps-ai-cheer cheer-success';
                        } else {
                            window.soundEngine.play('wrong');
                            cheerEl.textContent = `Bu ${a.name} emas, keling qayta eshitib ko‘ramiz!`;
                            cheerEl.className = 'ps-ai-cheer cheer-retry';
                        }
                        round++;
                        setTimeout(nextRound, 1300);
                    };
                    optionsEl.appendChild(card);
                });
            }

            nextRound();
        }
    },

    // ------------------------------------------------------------------------
    // 4. MEMORY CARDS
    // ------------------------------------------------------------------------
    'memory-cards': {
        id: 'memory-cards',
        title: 'Memory Cards',
        category: 'preschool',
        icon: '🃏',
        description: 'Kartalarni oching va bir xil hayvonchalarni juftlang!',
        rules: 'Har gal 2 ta kartani oching. Ular bir xil bo‘lsa juftlik ochilib qoladi.',
        difficulty: 'easy',
        tags: ['Xotira', 'Diqqat', 'Juftliklar'],

        render(container, { onFinish, updateScore }) {
            const icons = ['🐼', '🦁', '🐰', '🦊']; // 4 pairs = 8 cards (perfect for 3-5yo)
            const deck = [...icons, ...icons].sort(() => 0.5 - Math.random());

            let flipped = [];
            let matchedCount = 0;
            let score = 0;
            let moves = 0;

            container.innerHTML = `
                <div class="preschool-game memory-cards-box">
                    <div class="ps-header">
                        <div class="ps-stat">Harakatlar: <span id="mc-moves">0</span></div>
                        <div class="ps-stat">Topilgan juftliklar: <span id="mc-matches">0/4</span></div>
                    </div>
                    <div class="memory-grid" id="mc-grid"></div>
                    <div class="ps-ai-cheer" id="mc-cheer">🧸 Qani, bir xillarini eslab qolamiz!</div>
                </div>
            `;

            const gridEl = container.querySelector('#mc-grid');
            const movesEl = container.querySelector('#mc-moves');
            const matchesEl = container.querySelector('#mc-matches');
            const cheerEl = container.querySelector('#mc-cheer');

            deck.forEach((icon, idx) => {
                const card = document.createElement('div');
                card.className = 'mem-card';
                card.dataset.index = idx;
                card.dataset.icon = icon;
                card.innerHTML = `
                    <div class="mem-card-inner">
                        <div class="mem-card-front">❓</div>
                        <div class="mem-card-back">${icon}</div>
                    </div>
                `;

                card.onclick = () => {
                    if (card.classList.contains('flipped') || card.classList.contains('matched') || flipped.length === 2) {
                        return;
                    }

                    window.soundEngine.play('cardFlip');
                    card.classList.add('flipped');
                    flipped.push(card);

                    if (flipped.length === 2) {
                        moves++;
                        movesEl.textContent = moves;
                        const [c1, c2] = flipped;

                        if (c1.dataset.icon === c2.dataset.icon) {
                            window.soundEngine.play('match');
                            c1.classList.add('matched');
                            c2.classList.add('matched');
                            matchedCount++;
                            score += 25;
                            updateScore(score);
                            matchesEl.textContent = `${matchedCount}/4`;
                            cheerEl.textContent = `🌟 Zo‘r! ${c1.dataset.icon} juftligi topildi!`;
                            flipped = [];

                            if (matchedCount === icons.length) {
                                setTimeout(() => {
                                    window.soundEngine.play('win');
                                    onFinish({ score: Math.max(50, 100 - moves * 5), won: true, perfect: moves <= 5 });
                                }, 800);
                            }
                        } else {
                            setTimeout(() => {
                                c1.classList.remove('flipped');
                                c2.classList.remove('flipped');
                                flipped = [];
                            }, 1000);
                        }
                    }
                };

                gridEl.appendChild(card);
            });
        }
    },

    // ------------------------------------------------------------------------
    // 5. NUMBER ADVENTURE
    // ------------------------------------------------------------------------
    'number-adventure': {
        id: 'number-adventure',
        title: 'Number Adventure',
        category: 'preschool',
        icon: '🔢',
        description: 'Ekranda nechta buyum borligini sanang va to‘g‘ri raqamni tanlang!',
        rules: '1 dan 10 gacha bo‘lgan narsalarni sanang va mos raqam ustiga bosing.',
        difficulty: 'easy',
        tags: ['Sanash', 'Raqamlar', 'Matematika'],

        render(container, { onFinish, updateScore }) {
            const items = ['🍎', '⭐', '🎈', '🚗', '🧸', '🍓'];
            let score = 0;
            let round = 0;
            const totalRounds = 5;

            container.innerHTML = `
                <div class="preschool-game number-adventure-box">
                    <div class="ps-header">
                        <h2 class="ps-prompt">Buyumlarni birga sanaymiz!</h2>
                        <div class="ps-round-dots" id="na-dots"></div>
                    </div>
                    <div class="items-canvas-area" id="na-items-area"></div>
                    <div class="number-buttons-grid" id="na-options"></div>
                    <div class="ps-ai-cheer" id="na-cheer">🧸 Barmoqlaringiz bilan sanab ko‘ring!</div>
                </div>
            `;

            const itemsArea = container.querySelector('#na-items-area');
            const optionsEl = container.querySelector('#na-options');
            const dotsEl = container.querySelector('#na-dots');
            const cheerEl = container.querySelector('#na-cheer');

            function nextRound() {
                if (round >= totalRounds) {
                    onFinish({ score, won: score >= 30, perfect: score >= totalRounds * 10 });
                    return;
                }
                dotsEl.innerHTML = Array(totalRounds).fill(0).map((_, i) => `
                    <span class="ps-dot ${i < round ? 'active' : ''} ${i === round ? 'current' : ''}"></span>
                `).join('');

                const count = Math.floor(Math.random() * 8) + 2; // 2 to 9
                const itemEmoji = items[Math.floor(Math.random() * items.length)];

                itemsArea.innerHTML = '';
                for (let i = 0; i < count; i++) {
                    const el = document.createElement('span');
                    el.className = 'count-item bounce-in';
                    el.textContent = itemEmoji;
                    el.style.animationDelay = `${i * 0.08}s`;
                    itemsArea.appendChild(el);
                }

                // Numbers options
                const options = [count];
                while (options.length < 4) {
                    const r = Math.floor(Math.random() * 9) + 1;
                    if (!options.includes(r)) options.push(r);
                }
                options.sort(() => 0.5 - Math.random());

                optionsEl.innerHTML = '';
                options.forEach(num => {
                    const btn = document.createElement('button');
                    btn.className = 'num-btn';
                    btn.textContent = num;
                    btn.onclick = () => {
                        if (num === count) {
                            window.soundEngine.play('correct');
                            score += 10;
                            updateScore(score);
                            cheerEl.textContent = `🎉 To‘ppa-to‘g‘ri! Jami ${count} ta edi!`;
                            cheerEl.className = 'ps-ai-cheer cheer-success';
                        } else {
                            window.soundEngine.play('wrong');
                            cheerEl.textContent = `Bu ${num} emas, keling qaytadan sanaymiz!`;
                            cheerEl.className = 'ps-ai-cheer cheer-retry';
                        }
                        round++;
                        setTimeout(nextRound, 1100);
                    };
                    optionsEl.appendChild(btn);
                });
            }

            nextRound();
        }
    },

    // ------------------------------------------------------------------------
    // 6. FIND THE DIFFERENCE
    // ------------------------------------------------------------------------
    'find-difference': {
        id: 'find-difference',
        title: 'Find the Difference',
        category: 'preschool',
        icon: '🔍',
        description: 'Ikki rasm orasidagi 3 ta yorqin farqni toping!',
        rules: 'O‘ngdagi rasmda o‘zgargan yoki yetishmayotgan qismlarni bosing.',
        difficulty: 'easy',
        tags: ['Kuzatuvchanlik', 'Diqqat', 'Vizual'],

        render(container, { onFinish, updateScore }) {
            let foundCount = 0;
            let score = 0;

            const diffSpots = [
                { id: 1, top: '22%', left: '25%', label: 'Quyosh ko‘zoynagi', emoji: '🕶️' },
                { id: 2, top: '55%', left: '70%', label: 'Qo‘shimcha gulcha', emoji: '🌸' },
                { id: 3, top: '65%', left: '30%', label: 'Qizil to‘pcha', emoji: '🎈' }
            ];

            container.innerHTML = `
                <div class="preschool-game find-diff-box">
                    <div class="ps-header">
                        <h2 class="ps-prompt">3 ta farqni toping!</h2>
                        <div class="ps-stat">Topildi: <span id="fd-count">0/3</span></div>
                    </div>
                    <div class="diff-comparison">
                        <div class="diff-scene scene-original">
                            <div class="scene-label">Asl rasm</div>
                            <div class="scene-art">
                                <div class="art-sun">☀️</div>
                                <div class="art-tree">🌳</div>
                                <div class="art-house">🏡</div>
                            </div>
                        </div>
                        <div class="diff-scene scene-target" id="fd-target-scene">
                            <div class="scene-label">O‘zgargan rasm</div>
                            <div class="scene-art">
                                <div class="art-sun">☀️</div>
                                <div class="art-tree">🌳</div>
                                <div class="art-house">🏡</div>
                            </div>
                        </div>
                    </div>
                    <div class="ps-ai-cheer" id="fd-cheer">🧸 Ikkinchi rasmga e’tibor bilan qarab bosing!</div>
                </div>
            `;

            const targetScene = container.querySelector('#fd-target-scene');
            const countEl = container.querySelector('#fd-count');
            const cheerEl = container.querySelector('#fd-cheer');

            diffSpots.forEach(spot => {
                const mark = document.createElement('div');
                mark.className = 'diff-spot';
                mark.style.top = spot.top;
                mark.style.left = spot.left;
                mark.innerHTML = spot.emoji;
                mark.onclick = () => {
                    if (mark.classList.contains('found')) return;
                    window.soundEngine.play('match');
                    mark.classList.add('found');
                    foundCount++;
                    score += 30;
                    updateScore(score);
                    countEl.textContent = `${foundCount}/3`;
                    cheerEl.textContent = `🌟 Ajoyib! "${spot.label}" topildi!`;

                    if (foundCount === 3) {
                        setTimeout(() => {
                            window.soundEngine.play('win');
                            onFinish({ score: 100, won: true, perfect: true });
                        }, 800);
                    }
                };
                targetScene.appendChild(mark);
            });
        }
    },

    // ------------------------------------------------------------------------
    // 7. PUZZLE WORLD
    // ------------------------------------------------------------------------
    'puzzle-world': {
        id: 'puzzle-world',
        title: 'Puzzle World',
        category: 'preschool',
        icon: '🧩',
        description: 'Sodda 4 bo‘lakli chiroyli rasmni to‘g‘ri yig‘ing!',
        rules: 'Bo‘laklarni bosing va ularni o‘z joyiga suring.',
        difficulty: 'easy',
        tags: ['Pazl', 'Mantiq', 'Koordinatsiya'],

        render(container, { onFinish, updateScore }) {
            // 2x2 grid = 4 pieces
            const pieces = [
                { pos: 0, icon: '🚀', text: 'Tepasi' },
                { pos: 1, icon: '⭐', text: 'Yulduz' },
                { pos: 2, icon: '🌍', text: 'Yer' },
                { pos: 3, icon: '🔥', text: 'Olov' }
            ];

            let state = [1, 0, 3, 2]; // Scrambled
            let score = 0;

            container.innerHTML = `
                <div class="preschool-game puzzle-world-box">
                    <div class="ps-header">
                        <h2 class="ps-prompt">Raketani yig‘ishga yordam bering!</h2>
                    </div>
                    <div class="puzzle-2x2-grid" id="pw-grid"></div>
                    <div class="ps-ai-cheer" id="pw-cheer">🧸 Bo‘laklarni bosing va almashtiring!</div>
                </div>
            `;

            const gridEl = container.querySelector('#pw-grid');
            const cheerEl = container.querySelector('#pw-cheer');
            let selectedIdx = null;

            function renderBoard() {
                gridEl.innerHTML = '';
                state.forEach((pieceIdx, slotIdx) => {
                    const piece = pieces[pieceIdx];
                    const tile = document.createElement('div');
                    tile.className = `puzzle-tile ${selectedIdx === slotIdx ? 'selected-tile' : ''}`;
                    tile.innerHTML = `<span class="p-icon">${piece.icon}</span><span class="p-text">${piece.text}</span>`;
                    tile.onclick = () => handleTileClick(slotIdx);
                    gridEl.appendChild(tile);
                });
            }

            function handleTileClick(slotIdx) {
                window.soundEngine.play('click');
                if (selectedIdx === null) {
                    selectedIdx = slotIdx;
                    renderBoard();
                } else {
                    // Swap
                    const temp = state[selectedIdx];
                    state[selectedIdx] = state[slotIdx];
                    state[slotIdx] = temp;
                    selectedIdx = null;
                    renderBoard();

                    // Check win
                    const isSolved = state.every((val, i) => val === i);
                    if (isSolved) {
                        window.soundEngine.play('win');
                        score = 100;
                        updateScore(score);
                        cheerEl.textContent = '🎉 Raketa tayyor! Fazoga uchamiz! 🚀';
                        cheerEl.className = 'ps-ai-cheer cheer-success';
                        setTimeout(() => onFinish({ score, won: true, perfect: true }), 1200);
                    }
                }
            }

            renderBoard();
        }
    },

    // ------------------------------------------------------------------------
    // 8. FRUIT SORTING
    // ------------------------------------------------------------------------
    'fruit-sorting': {
        id: 'fruit-sorting',
        title: 'Fruit Sorting',
        category: 'preschool',
        icon: '🍎',
        description: 'Mevalarni rangiga qarab to‘g‘ri savatga saralang!',
        rules: 'Mevalarni mos keluvchi savatchaga bosing yoki suring.',
        difficulty: 'easy',
        tags: ['Saralash', 'Ranglar', 'Mevalar'],

        render(container, { onFinish, updateScore }) {
            const fruits = [
                { name: 'Olma', color: 'red', emoji: '🍎' },
                { name: 'Banan', color: 'yellow', emoji: '🍌' },
                { name: 'Qulupnay', color: 'red', emoji: '🍓' },
                { name: 'Limon', color: 'yellow', emoji: '🍋' },
                { name: 'Gilos', color: 'red', emoji: '🍒' },
                { name: 'Makkajo‘xori', color: 'yellow', emoji: '🌽' }
            ];

            let score = 0;
            let currentFruitIndex = 0;
            const shuffledFruits = [...fruits].sort(() => 0.5 - Math.random());

            container.innerHTML = `
                <div class="preschool-game fruit-sorting-box">
                    <div class="ps-header">
                        <h2 class="ps-prompt">Mevani qaysi savatga solamiz?</h2>
                    </div>
                    <div class="current-fruit-display">
                        <div class="big-fruit-item" id="fs-fruit"></div>
                        <h3 id="fs-fruit-name"></h3>
                    </div>
                    <div class="baskets-container">
                        <button class="basket-btn basket-red" id="fs-basket-red">
                            🧺 Qizil Savat
                        </button>
                        <button class="basket-btn basket-yellow" id="fs-basket-yellow">
                            🧺 Sariq Savat
                        </button>
                    </div>
                    <div class="ps-ai-cheer" id="fs-cheer">🧸 Qizil mevani qizilga, sariq mevani sariqqa!</div>
                </div>
            `;

            const fruitEl = container.querySelector('#fs-fruit');
            const nameEl = container.querySelector('#fs-fruit-name');
            const cheerEl = container.querySelector('#fs-cheer');
            const redBtn = container.querySelector('#fs-basket-red');
            const yellowBtn = container.querySelector('#fs-basket-yellow');

            function showCurrent() {
                if (currentFruitIndex >= shuffledFruits.length) {
                    onFinish({ score, won: score >= 40, perfect: score === shuffledFruits.length * 15 });
                    return;
                }
                const fruit = shuffledFruits[currentFruitIndex];
                fruitEl.textContent = fruit.emoji;
                nameEl.textContent = fruit.name;
            }

            function handleSort(chosenColor) {
                const fruit = shuffledFruits[currentFruitIndex];
                if (chosenColor === fruit.color) {
                    window.soundEngine.play('correct');
                    score += 15;
                    updateScore(score);
                    cheerEl.textContent = `🌟 To‘g‘ri savatga tushdi!`;
                    cheerEl.className = 'ps-ai-cheer cheer-success';
                } else {
                    window.soundEngine.play('wrong');
                    cheerEl.textContent = `Bu meva ${fruit.color === 'red' ? 'qizil' : 'sariq'} savatga kerak edi.`;
                    cheerEl.className = 'ps-ai-cheer cheer-retry';
                }
                currentFruitIndex++;
                setTimeout(showCurrent, 800);
            }

            redBtn.onclick = () => handleSort('red');
            yellowBtn.onclick = () => handleSort('yellow');

            showCurrent();
        }
    },

    // ------------------------------------------------------------------------
    // 9. SHADOW MATCH
    // ------------------------------------------------------------------------
    'shadow-match': {
        id: 'shadow-match',
        title: 'Shadow Match',
        category: 'preschool',
        icon: '👥',
        description: 'Ekranda ko‘rsatilgan buyumning qop-qora soyasini toping!',
        rules: 'Asosiy buyumga mos keluvchi siluetni tanlang.',
        difficulty: 'easy',
        tags: ['Soya', 'Siluet', 'Vizual mantiq'],

        render(container, { onFinish, updateScore }) {
            const items = [
                { id: 'plane', emoji: '✈️', name: 'Samolyot' },
                { id: 'car', emoji: '🚗', name: 'Mashina' },
                { id: 'tree', emoji: '🌲', name: 'Archa' },
                { id: 'cat', emoji: '🐈', name: 'Mushuk' },
                { id: 'cup', emoji: '☕', name: 'Finjon' }
            ];

            let score = 0;
            let round = 0;
            const totalRounds = 4;
            let currentItem = null;

            container.innerHTML = `
                <div class="preschool-game shadow-match-box">
                    <div class="ps-header">
                        <h2 class="ps-prompt">Bu buyumning soyasini toping!</h2>
                    </div>
                    <div class="shadow-target-area">
                        <div class="real-item" id="sm-real"></div>
                    </div>
                    <div class="shadow-options" id="sm-shadows"></div>
                    <div class="ps-ai-cheer" id="sm-cheer">🧸 Shaklning chetlariga e’tibor bering!</div>
                </div>
            `;

            const realEl = container.querySelector('#sm-real');
            const shadowsEl = container.querySelector('#sm-shadows');
            const cheerEl = container.querySelector('#sm-cheer');

            function nextRound() {
                if (round >= totalRounds) {
                    onFinish({ score, won: score >= 30, perfect: score >= totalRounds * 25 });
                    return;
                }
                currentItem = items[round % items.length];
                realEl.textContent = currentItem.emoji;

                const pool = [currentItem, ...items.filter(i => i.id !== currentItem.id).sort(() => 0.5 - Math.random()).slice(0, 2)]
                    .sort(() => 0.5 - Math.random());

                shadowsEl.innerHTML = '';
                pool.forEach(item => {
                    const btn = document.createElement('button');
                    btn.className = 'shadow-card';
                    btn.innerHTML = `<span class="shadow-silhouette">${item.emoji}</span>`;
                    btn.onclick = () => {
                        if (item.id === currentItem.id) {
                            window.soundEngine.play('correct');
                            score += 25;
                            updateScore(score);
                            cheerEl.textContent = '🎉 Barakalla! Soyasi aniq topildi!';
                            cheerEl.className = 'ps-ai-cheer cheer-success';
                        } else {
                            window.soundEngine.play('wrong');
                            cheerEl.textContent = 'Keling yana sinab ko‘ramiz!';
                            cheerEl.className = 'ps-ai-cheer cheer-retry';
                        }
                        round++;
                        setTimeout(nextRound, 1000);
                    };
                    shadowsEl.appendChild(btn);
                });
            }

            nextRound();
        }
    },

    // ------------------------------------------------------------------------
    // 10. ALPHABET FUN
    // ------------------------------------------------------------------------
    'alphabet-fun': {
        id: 'alphabet-fun',
        title: 'Alphabet Fun',
        category: 'preschool',
        icon: '🔤',
        description: 'Alifbodagi harflarni topish va pufakchalarni yorish!',
        rules: 'Ko‘rsatilgan harfni toping va uning pufakchasini bosing.',
        difficulty: 'easy',
        tags: ['Alifbo', 'Harflar', 'O‘qish'],

        render(container, { onFinish, updateScore }) {
            const alphabet = ['A', 'B', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'O', 'P', 'R', 'S', 'T', 'U', 'V', 'Y', 'Z'];
            let score = 0;
            let round = 0;
            const totalRounds = 5;
            let targetLetter = '';

            container.innerHTML = `
                <div class="preschool-game alphabet-fun-box">
                    <div class="ps-header">
                        <h2 class="ps-prompt" id="af-prompt">Ushbu harfni bosing:</h2>
                    </div>
                    <div class="target-letter-banner" id="af-banner"></div>
                    <div class="alphabet-bubbles-grid" id="af-bubbles"></div>
                    <div class="ps-ai-cheer" id="af-cheer">🧸 Harfni toping va pufakchani yoring!</div>
                </div>
            `;

            const bannerEl = container.querySelector('#af-banner');
            const bubblesEl = container.querySelector('#af-bubbles');
            const cheerEl = container.querySelector('#af-cheer');

            function nextRound() {
                if (round >= totalRounds) {
                    onFinish({ score, won: score >= 30, perfect: score >= totalRounds * 15 });
                    return;
                }
                targetLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
                bannerEl.textContent = targetLetter;

                const pool = [targetLetter];
                while (pool.length < 4) {
                    const l = alphabet[Math.floor(Math.random() * alphabet.length)];
                    if (!pool.includes(l)) pool.push(l);
                }
                pool.sort(() => 0.5 - Math.random());

                bubblesEl.innerHTML = '';
                pool.forEach(l => {
                    const bubble = document.createElement('button');
                    bubble.className = 'letter-bubble-btn pop-anim';
                    bubble.textContent = l;
                    bubble.onclick = () => {
                        window.soundEngine.play('pop');
                        if (l === targetLetter) {
                            window.soundEngine.play('correct');
                            score += 15;
                            updateScore(score);
                            bubble.classList.add('bubble-burst');
                            cheerEl.textContent = `🎈 Super! "${l}" harfi to‘g‘ri topildi!`;
                            cheerEl.className = 'ps-ai-cheer cheer-success';
                        } else {
                            window.soundEngine.play('wrong');
                            cheerEl.textContent = `Bu "${l}" harfi. Bizga esa "${targetLetter}" kerak!`;
                            cheerEl.className = 'ps-ai-cheer cheer-retry';
                        }
                        round++;
                        setTimeout(nextRound, 900);
                    };
                    bubblesEl.appendChild(bubble);
                });
            }

            nextRound();
        }
    }
};
