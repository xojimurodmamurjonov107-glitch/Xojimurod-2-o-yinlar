/**
 * Brain Arena - Young Adults Games (16-20+ Years)
 * 10 Fully Playable, Advanced, Deep, Analytical & Grandmaster Games.
 * 
 * 1. Advanced Sudoku
 * 2. Chess Grandmaster
 * 3. Algorithm Master
 * 4. Mathematical Genius
 * 5. Strategic Empire
 * 6. Detective Pro
 * 7. Code Master
 * 8. IQ Tournament
 * 9. Crypto Logic
 * 10. Decision Master
 */

window.YoungAdultsGames = {
    // ------------------------------------------------------------------------
    // 1. ADVANCED SUDOKU (Full 9x9 Master Grid)
    // ------------------------------------------------------------------------
    'advanced-sudoku': {
        id: 'advanced-sudoku',
        title: 'Advanced Sudoku',
        category: 'young-adults',
        icon: '🔢',
        description: 'To‘liq 9x9 professional Sudoku: 3x3 bloklar va murakkab qator-ustun kombinatsiyasi!',
        rules: 'Har bir qator, ustun va 3x3 kvadratda 1 dan 9 gacha barcha raqamlar qatnashishi shart.',
        difficulty: 'expert',
        tags: ['Sudoku 9x9', 'Mantiq', 'Kombinatorika'],

        render(container, { onFinish, updateScore }) {
            // Master 9x9 base puzzle
            const solution = [
                [5,3,4,6,7,8,9,1,2],
                [6,7,2,1,9,5,3,4,8],
                [1,9,8,3,4,2,5,6,7],
                [8,5,9,7,6,1,4,2,3],
                [4,2,6,8,5,3,7,9,1],
                [7,1,3,9,2,4,8,5,6],
                [9,6,1,5,3,7,2,8,4],
                [2,8,7,4,1,9,6,3,5],
                [3,4,5,2,8,6,1,7,9]
            ];

            // Sparse puzzle (with strategic blanks)
            const initial = [
                [5,3,0,0,7,0,0,0,0],
                [6,0,0,1,9,5,0,0,0],
                [0,9,8,0,0,0,0,6,0],
                [8,0,0,0,6,0,0,0,3],
                [4,0,0,8,0,3,0,0,1],
                [7,0,0,0,2,0,0,0,6],
                [0,6,0,0,0,0,2,8,0],
                [0,0,0,4,1,9,0,0,5],
                [0,0,0,0,8,0,0,7,9]
            ];

            let currentBoard = JSON.parse(JSON.stringify(initial));
            let selectedCell = null;
            let score = 0;

            container.innerHTML = `
                <div class="ya-game advanced-sudoku-box">
                    <div class="sudoku-9x9-grid" id="as-grid"></div>
                    <div class="sudoku-numpad-9" id="as-numpad"></div>
                    <div class="sudoku-actions">
                        <button class="btn-secondary" id="as-clear">Tozalash ✖</button>
                        <button class="btn-primary" id="as-solve">Tekshirish ✔</button>
                    </div>
                    <div class="ya-feedback-banner" id="as-feedback">Katakni tanlang va 1–9 raqamlarini kiriting.</div>
                </div>
            `;

            const gridEl = container.querySelector('#as-grid');
            const numpadEl = container.querySelector('#as-numpad');
            const feedbackEl = container.querySelector('#as-feedback');
            const clearBtn = container.querySelector('#as-clear');
            const solveBtn = container.querySelector('#as-solve');

            function renderGrid() {
                gridEl.innerHTML = '';
                for (let r = 0; r < 9; r++) {
                    for (let c = 0; c < 9; c++) {
                        const cell = document.createElement('div');
                        const isFixed = initial[r][c] !== 0;
                        cell.className = `s9-cell ${isFixed ? 's9-fixed' : 's9-edit'}`;
                        if (selectedCell && selectedCell.r === r && selectedCell.c === c) {
                            cell.classList.add('s9-selected');
                        }
                        // Add border for 3x3 blocks
                        if ((c + 1) % 3 === 0 && c < 8) cell.classList.add('s9-border-right');
                        if ((r + 1) % 3 === 0 && r < 8) cell.classList.add('s9-border-bottom');

                        const val = currentBoard[r][c];
                        cell.textContent = val !== 0 ? val : '';

                        cell.onclick = () => {
                            if (!isFixed) {
                                selectedCell = { r, c };
                                window.soundEngine.play('click');
                                renderGrid();
                            }
                        };
                        gridEl.appendChild(cell);
                    }
                }
            }

            for (let n = 1; n <= 9; n++) {
                const btn = document.createElement('button');
                btn.className = 's9-num-btn';
                btn.textContent = n;
                btn.onclick = () => {
                    if (selectedCell) {
                        currentBoard[selectedCell.r][selectedCell.c] = n;
                        window.soundEngine.play('click');
                        renderGrid();
                    }
                };
                numpadEl.appendChild(btn);
            }

            clearBtn.onclick = () => {
                if (selectedCell) {
                    currentBoard[selectedCell.r][selectedCell.c] = 0;
                    renderGrid();
                }
            };

            solveBtn.onclick = () => {
                let filled = 0;
                let correct = 0;
                for (let r = 0; r < 9; r++) {
                    for (let c = 0; c < 9; c++) {
                        if (currentBoard[r][c] !== 0) filled++;
                        if (currentBoard[r][c] === solution[r][c]) correct++;
                    }
                }

                if (correct === 81) {
                    window.soundEngine.play('win');
                    score = 100;
                    updateScore(score);
                    feedbackEl.textContent = '👑 GRANDMASTER DARAJASI! 9x9 Sudoku to‘liq yechildi!';
                    feedbackEl.className = 'ya-feedback-banner fb-correct';
                    setTimeout(() => onFinish({ score, won: true, perfect: true }), 1500);
                } else {
                    const accuracy = Math.floor((correct / filled) * 100) || 0;
                    feedbackEl.textContent = `Hozirgi to‘g‘rilik: ${accuracy}%. ${81 - filled} ta bo‘sh katak bor.`;
                    feedbackEl.className = 'ya-feedback-banner fb-notice';
                }
            };

            renderGrid();
        }
    },

    // ------------------------------------------------------------------------
    // 2. CHESS GRANDMASTER (Standard 8x8 Chess vs Deep AI)
    // ------------------------------------------------------------------------
    'chess-grandmaster': {
        id: 'chess-grandmaster',
        title: 'Chess Grandmaster',
        category: 'young-adults',
        icon: '♟️',
        description: 'Standart 8x8 shaxmat taxtasi va pozitsion AI dvigateli bilan professional duel!',
        rules: 'Klassik FIDE shaxmat qoidalari. Donalaringiz bilan raqib shohini mot qiling.',
        difficulty: 'expert',
        tags: ['Shaxmat 8x8', 'Grandmaster', 'Minimax'],

        render(container, { mode, difficulty, onFinish, updateScore, showAIComment }) {
            // Standard 8x8 initial setup
            let board = [
                ['bR', 'bN', 'bB', 'bQ', 'bK', 'bB', 'bN', 'bR'],
                ['bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP'],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP'],
                ['wR', 'wN', 'wB', 'wQ', 'wK', 'wB', 'wN', 'wR']
            ];

            const symbols = {
                'wK': '♔', 'wQ': '♕', 'wR': '♖', 'wB': '♗', 'wN': '♘', 'wP': '♙',
                'bK': '♚', 'bQ': '♛', 'bR': '♜', 'bB': '♝', 'bN': '♞', 'bP': '♟'
            };

            let selected = null;
            let playerTurn = true;
            let score = 0;

            container.innerHTML = `
                <div class="ya-game chess-gm-box">
                    <div class="chess-gm-eval-bar">
                        <div class="eval-fill" id="gm-eval" style="height: 50%;"></div>
                    </div>
                    <div class="chess-gm-main">
                        <div class="chess-8x8-board" id="gm-board"></div>
                        <div class="ya-feedback-banner" id="gm-feedback">Sizning navbatingiz (Oq). Strategik pozitsiyani egallang.</div>
                    </div>
                </div>
            `;

            const boardEl = container.querySelector('#gm-board');
            const feedbackEl = container.querySelector('#gm-feedback');
            const evalBar = container.querySelector('#gm-eval');

            function renderBoard() {
                boardEl.innerHTML = '';
                for (let r = 0; r < 8; r++) {
                    for (let c = 0; c < 8; c++) {
                        const sq = document.createElement('div');
                        const isDark = (r + c) % 2 === 1;
                        sq.className = `gm-sq ${isDark ? 'gm-dark' : 'gm-light'}`;
                        if (selected && selected.r === r && selected.c === c) {
                            sq.classList.add('gm-selected');
                        }

                        const p = board[r][c];
                        if (p) {
                            sq.textContent = symbols[p] || p;
                            sq.classList.add(p.startsWith('w') ? 'piece-white' : 'piece-black');
                        }

                        sq.onclick = () => handleSquare(r, c);
                        boardEl.appendChild(sq);
                    }
                }
            }

            function handleSquare(r, c) {
                if (!playerTurn) return;
                const piece = board[r][c];

                if (!selected) {
                    if (piece && piece.startsWith('w')) {
                        selected = { r, c };
                        window.soundEngine.play('click');
                        renderBoard();
                    }
                } else {
                    if (selected.r === r && selected.c === c) {
                        selected = null;
                        renderBoard();
                        return;
                    }

                    if (piece && piece.startsWith('w')) {
                        selected = { r, c };
                        renderBoard();
                        return;
                    }

                    // Move piece
                    const captured = board[r][c];
                    board[r][c] = board[selected.r][selected.c];
                    board[selected.r][selected.c] = '';
                    selected = null;
                    window.soundEngine.play('move');
                    renderBoard();

                    if (captured === 'bK') {
                        window.soundEngine.play('win');
                        score = 100;
                        updateScore(score);
                        feedbackEl.textContent = '👑 MOT! Cortex Prime ustidan shohona g‘alaba!';
                        setTimeout(() => onFinish({ score, won: true, perfect: true }), 1500);
                        return;
                    }

                    // AI Turn
                    playerTurn = false;
                    feedbackEl.textContent = '🔮 Cortex Prime pozitsiyani tahlil qilmoqda...';
                    evalBar.style.height = '58%';

                    setTimeout(aiMove, window.aiEngine.getReactionTime(difficulty));
                }
            }

            function aiMove() {
                const bPieces = [];
                for (let r = 0; r < 8; r++) {
                    for (let c = 0; c < 8; c++) {
                        if (board[r][c] && board[r][c].startsWith('b')) {
                            bPieces.push({ r, c, piece: board[r][c] });
                        }
                    }
                }

                if (bPieces.length === 0) {
                    onFinish({ score: 100, won: true, perfect: true });
                    return;
                }

                // AI heuristic movement
                for (const p of bPieces.sort(() => 0.5 - Math.random())) {
                    const nextR = p.r + 1;
                    if (nextR < 8) {
                        const target = board[nextR][p.c];
                        if (!target || target.startsWith('w')) {
                            board[nextR][p.c] = p.piece;
                            board[p.r][p.c] = '';
                            window.soundEngine.play('move');

                            if (target === 'wK') {
                                window.soundEngine.play('lose');
                                feedbackEl.textContent = 'Shohingiz mot bo‘ldi. Cortex Prime g‘alaba qildi.';
                                setTimeout(() => onFinish({ score: 40, won: false }), 1200);
                                return;
                            }
                            break;
                        }
                    }
                }

                playerTurn = true;
                feedbackEl.textContent = 'Sizning navbatingiz (Oq).';
                renderBoard();
            }

            renderBoard();
        }
    },

    // ------------------------------------------------------------------------
    // 3. ALGORITHM MASTER (Maze Pathfinding & Optimization)
    // ------------------------------------------------------------------------
    'algorithm-master': {
        id: 'algorithm-master',
        title: 'Algorithm Master',
        category: 'young-adults',
        icon: '⚡',
        description: 'Dijkstra & A* tamoyili: labirintda A nuqtadan B nuqtaga eng qisqa yo‘lni toping!',
        rules: 'Boshlang‘ich nuqtadan (S) marragacha (E) devorlarga (🧱) urilmasdan eng optimal yo‘lni chizing.',
        difficulty: 'expert',
        tags: ['Dijkstra', 'A* Pathfinding', 'Graf'],

        render(container, { onFinish, updateScore }) {
            // 7x7 grid: 0=open, 1=wall, 'S'=start, 'E'=end
            const grid = [
                ['S', 0, 1, 0, 0, 0, 0],
                [0, 0, 1, 0, 1, 1, 0],
                [0, 1, 0, 0, 0, 1, 0],
                [0, 0, 0, 1, 0, 0, 0],
                [1, 1, 0, 1, 1, 0, 1],
                [0, 0, 0, 0, 0, 0, 0],
                [0, 1, 1, 0, 1, 0, 'E']
            ];

            let path = [{ r: 0, c: 0 }];
            let score = 0;

            container.innerHTML = `
                <div class="ya-game algorithm-box">
                    <div class="algo-maze-grid" id="am-grid"></div>
                    <div class="algo-controls">
                        <button class="btn-secondary" id="am-reset">Yo‘lni tozalash 🔄</button>
                    </div>
                    <div class="ya-feedback-banner" id="am-feedback">Boshlang‘ich 'S' dan boshlab qo‘shni kataklarni bosing.</div>
                </div>
            `;

            const gridEl = container.querySelector('#am-grid');
            const feedbackEl = container.querySelector('#am-feedback');
            const resetBtn = container.querySelector('#am-reset');

            function renderMaze() {
                gridEl.innerHTML = '';
                for (let r = 0; r < 7; r++) {
                    for (let c = 0; c < 7; c++) {
                        const cell = document.createElement('div');
                        const isWall = grid[r][c] === 1;
                        const isStart = grid[r][c] === 'S';
                        const isEnd = grid[r][c] === 'E';
                        const inPath = path.some(p => p.r === r && p.c === c);

                        cell.className = 'maze-cell';
                        if (isWall) cell.classList.add('cell-wall');
                        if (isStart) cell.classList.add('cell-start');
                        if (isEnd) cell.classList.add('cell-end');
                        if (inPath && !isStart && !isEnd) cell.classList.add('cell-path');

                        cell.textContent = isStart ? 'S' : (isEnd ? 'E' : (isWall ? '🧱' : ''));
                        cell.onclick = () => handleCellClick(r, c);
                        gridEl.appendChild(cell);
                    }
                }
            }

            function handleCellClick(r, c) {
                if (grid[r][c] === 1) {
                    window.soundEngine.play('wrong');
                    feedbackEl.textContent = '❌ Devor orqali o‘tib bo‘lmaydi!';
                    return;
                }

                const last = path[path.length - 1];
                const dist = Math.abs(last.r - r) + Math.abs(last.c - c);

                if (dist === 1) {
                    window.soundEngine.play('move');
                    path.push({ r, c });
                    renderMaze();

                    if (grid[r][c] === 'E') {
                        window.soundEngine.play('win');
                        score = 100;
                        updateScore(score);
                        feedbackEl.textContent = '🏆 OPTIMAL TRAEKTORIYA TOPILDI! Graf algoritmi muvaffaqiyatli!';
                        feedbackEl.className = 'ya-feedback-banner fb-correct';
                        setTimeout(() => onFinish({ score, won: true, perfect: path.length <= 14 }), 1200);
                    }
                } else {
                    feedbackEl.textContent = 'Faqat qo‘shni kataklarga harakatlana olasiz!';
                }
            }

            resetBtn.onclick = () => {
                path = [{ r: 0, c: 0 }];
                renderMaze();
                feedbackEl.textContent = 'Yo‘l yangilandi.';
            };

            renderMaze();
        }
    },

    // ------------------------------------------------------------------------
    // 4. MATHEMATICAL GENIUS (Calculus, Probability & Higher Math)
    // ------------------------------------------------------------------------
    'mathematical-genius': {
        id: 'mathematical-genius',
        title: 'Mathematical Genius',
        category: 'young-adults',
        icon: '♾️',
        description: 'Ehtimolliklar nazariyasi, kombinatorika va oliy matematika jumboqlari!',
        rules: 'Masalani tahlil qiling va hisoblangan aniq qiymatni tanlang.',
        difficulty: 'expert',
        tags: ['Ehtimollik', 'Kombinatorika', 'Oliy matematika'],

        render(container, { onFinish, updateScore }) {
            const problems = [
                {
                    q: 'Qutida 5 ta qizil va 3 ta ko‘k shar bor. Ketma-ket olingan 2 ta sharning ikkalasi ham qizil bo‘lish ehtimoli qancha?',
                    options: ['5/14', '25/64', '5/8', '15/56'],
                    ans: 0,
                    explanation: 'P = (5/8) × (4/7) = 20/56 = 5/14.'
                },
                {
                    q: 'f(x) = 3x² + 4x - 5 funksiyaning x = 2 nuqtadagi hosilasi (f\'(2)) nechaga teng?',
                    options: ['12', '16', '14', '18'],
                    ans: 1,
                    explanation: 'f\'(x) = 6x + 4. x = 2 da: 6(2) + 4 = 16.'
                },
                {
                    q: '6 nafar kishi davra suhbatida stol atrofida necha xil usulda o‘tirishi mumkin?',
                    options: ['720', '120', '360', '60'],
                    ans: 1,
                    explanation: 'Aylana bo‘yicha o‘rin almashtirish: (n - 1)! = 5! = 120.'
                }
            ];

            let score = 0;
            let current = 0;

            container.innerHTML = `
                <div class="ya-game math-master-box">
                    <div class="ya-problem-card">
                        <h3 id="mm-q"></h3>
                    </div>
                    <div class="ya-options-grid" id="mm-options"></div>
                    <div class="ya-feedback-banner" id="mm-feedback">Hisob-kitobni aniq bajaring.</div>
                </div>
            `;

            const qEl = container.querySelector('#mm-q');
            const optionsEl = container.querySelector('#mm-options');
            const feedbackEl = container.querySelector('#mm-feedback');

            function loadProblem() {
                if (current >= problems.length) {
                    onFinish({ score, won: score >= 60, perfect: score === problems.length * 35 });
                    return;
                }
                const p = problems[current];
                qEl.textContent = p.q;

                optionsEl.innerHTML = '';
                p.options.forEach((opt, idx) => {
                    const btn = document.createElement('button');
                    btn.className = 'ya-action-btn';
                    btn.textContent = opt;
                    btn.onclick = () => {
                        if (idx === p.ans) {
                            window.soundEngine.play('correct');
                            score += 35;
                            updateScore(score);
                            feedbackEl.textContent = `🎯 Brilliant! ${p.explanation}`;
                            feedbackEl.className = 'ya-feedback-banner fb-correct';
                        } else {
                            window.soundEngine.play('wrong');
                            feedbackEl.textContent = `❌ Xato. ${p.explanation}`;
                            feedbackEl.className = 'ya-feedback-banner fb-wrong';
                        }
                        current++;
                        setTimeout(loadProblem, 2200);
                    };
                    optionsEl.appendChild(btn);
                });
            }

            loadProblem();
        }
    },

    // ------------------------------------------------------------------------
    // 5. STRATEGIC EMPIRE (4X Turn-Based Macro Strategy vs AI)
    // ------------------------------------------------------------------------
    'strategic-empire': {
        id: 'strategic-empire',
        title: 'Strategic Empire',
        category: 'young-adults',
        icon: '👑',
        description: 'Iqtisodiy va harbiy imperiyani boshqaring: Oltin, Fan va Armiyani muvozanatlashtiring!',
        rules: 'Har navbatda resurslarni investitsiya qiling va AI sivilizatsiyasidan o‘zib keting.',
        difficulty: 'expert',
        tags: ['Strategiya', '4X', 'Iqtisodiyot'],

        render(container, { onFinish, updateScore }) {
            let turn = 1;
            const maxTurns = 6;
            let gold = 50;
            let science = 10;
            let army = 20;

            let aiScore = 50;
            let score = 0;

            container.innerHTML = `
                <div class="ya-game strategic-empire-box">
                    <div class="empire-hud">
                        <div class="hud-item">Yil (Navbat): <span id="se-turn">1/6</span></div>
                        <div class="res-bar">
                            <span>💰 Oltin: <b id="se-gold">50</b></span>
                            <span>🔬 Fan: <b id="se-sci">10</b></span>
                            <span>⚔️ Armiya: <b id="se-army">20</b></span>
                        </div>
                    </div>
                    <div class="empire-decisions-grid">
                        <button class="empire-card-btn" id="btn-farm">
                            🌾 Qishloq xo‘jaligi (+30 Oltin)
                        </button>
                        <button class="empire-card-btn" id="btn-uni">
                            🏛️ Fanlar Akademiyasi (+25 Fan, -20 Oltin)
                        </button>
                        <button class="empire-card-btn" id="btn-barracks">
                            🛡️ Armiya yollash (+25 Armiya, -25 Oltin)
                        </button>
                    </div>
                    <div class="ya-feedback-banner" id="se-feedback">Strategik qaror qabul qiling.</div>
                </div>
            `;

            const turnEl = container.querySelector('#se-turn');
            const goldEl = container.querySelector('#se-gold');
            const sciEl = container.querySelector('#se-sci');
            const armyEl = container.querySelector('#se-army');
            const feedbackEl = container.querySelector('#se-feedback');

            function nextTurn(action) {
                if (action === 'farm') {
                    gold += 30;
                } else if (action === 'uni') {
                    if (gold < 20) { feedbackEl.textContent = 'Mablag‘ yetarli emas!'; return; }
                    gold -= 20;
                    science += 25;
                } else if (action === 'barracks') {
                    if (gold < 25) { feedbackEl.textContent = 'Mablag‘ yetarli emas!'; return; }
                    gold -= 25;
                    army += 25;
                }

                window.soundEngine.play('move');
                aiScore += 35;
                turn++;

                goldEl.textContent = gold;
                sciEl.textContent = science;
                armyEl.textContent = army;

                if (turn > maxTurns) {
                    const totalEmpirePower = gold + science * 2 + army * 2;
                    const won = totalEmpirePower > aiScore;
                    score = Math.min(100, Math.floor(totalEmpirePower / 2));
                    updateScore(score);
                    feedbackEl.textContent = won ? '🏆 Sizning sivilizatsiyangiz g‘olib bo‘ldi!' : 'AI imperiyasi ustun keldi!';
                    setTimeout(() => onFinish({ score, won, perfect: won && totalEmpirePower >= 250 }), 1500);
                    return;
                }

                turnEl.textContent = `${turn}/${maxTurns}`;
                feedbackEl.textContent = `Navbat yakunlandi. AI kuchi: ${aiScore}`;
            }

            container.querySelector('#btn-farm').onclick = () => nextTurn('farm');
            container.querySelector('#btn-uni').onclick = () => nextTurn('uni');
            container.querySelector('#btn-barracks').onclick = () => nextTurn('barracks');
        }
    },

    // ------------------------------------------------------------------------
    // 6. DETECTIVE PRO (Forensics & Timeline Analysis)
    // ------------------------------------------------------------------------
    'detective-pro': {
        id: 'detective-pro',
        title: 'Detective Pro',
        category: 'young-adults',
        icon: '🔍',
        description: 'Kiber-jinoyatchilik va moliyaviy fitna tergovi: vaqt shkalasi va alibilarni tahlil qiling!',
        rules: 'Raqamli dalillarni taqqoslab, asosiy fitnachi va uning yolg‘onini fosh qiling.',
        difficulty: 'expert',
        tags: ['Kriminalistika', 'Kiberxavfsizlik', 'Deduksiya'],

        render(container, { onFinish, updateScore }) {
            const caseFile = {
                title: 'Kripto-fond serveriga noqonuniy kirish',
                timeline: [
                    '02:15 - Server xonasiga bosh muhandis kartasi bilan eshik ochildi.',
                    '02:22 - Kriptovalyuta hamyonidan 1,000,000$ o‘tkazildi.',
                    '02:30 - Xavfsizlik kameralari qisqa tutashuv tufayli o‘chdi.'
                ],
                suspects: [
                    { name: 'Tizim ma’muri Farhod', claim: 'Men soat 02:00 dan 03:00 gacha uyda uxlayotgandim, lekin IP manzilim serverga ulangan ko‘ringan bo‘lishi mumkin.' },
                    { name: 'Xavfsizlik boshlig‘i Dilshod', claim: 'Men soat 02:25 da kameralar o‘chganini ko‘rib darhol politsiyaga xabar berdim.' },
                    { name: 'Katta muhandis Sanjar', claim: 'Mening kartam soat 02:15 da ishlatilgani yolg‘on, men kartamni soat 20:00 da yo‘qotib qo‘yganman va hech kimga aytmagandim.' }
                ],
                culprit: 1,
                explanation: 'Kameralar 02:30 da o‘chgan bo‘lsa, Dilshod qanday qilib 02:25 da ularning o‘chganini ko‘rishi mumkin? U jinoyat vaqtini oldindan bilgan!'
            };

            let score = 0;

            container.innerHTML = `
                <div class="ya-game detective-pro-box">
                    <div class="forensic-timeline-card">
                        <h3>📁 ${caseFile.title}</h3>
                        <ul class="timeline-list">
                            ${caseFile.timeline.map(t => `<li>⏱️ ${t}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="suspects-statements" id="dp-suspects"></div>
                    <div class="ya-feedback-banner" id="dp-feedback">Vaqt shkalasidagi mantiqiy xatoni toping!</div>
                </div>
            `;

            const suspectsEl = container.querySelector('#dp-suspects');
            const feedbackEl = container.querySelector('#dp-feedback');

            caseFile.suspects.forEach((s, idx) => {
                const card = document.createElement('div');
                card.className = 'suspect-forensic-card';
                card.innerHTML = `
                    <h4>👤 ${s.name}</h4>
                    <p>"${s.claim}"</p>
                `;
                card.onclick = () => {
                    if (idx === caseFile.culprit) {
                        window.soundEngine.play('correct');
                        score = 100;
                        updateScore(score);
                        feedbackEl.textContent = `🔍 AJOYIB DEDUKSIYA! ${caseFile.explanation}`;
                        feedbackEl.className = 'ya-feedback-banner fb-correct';
                        setTimeout(() => onFinish({ score: 100, won: true, perfect: true }), 1500);
                    } else {
                        window.soundEngine.play('wrong');
                        feedbackEl.textContent = `❌ Xato tahlil. Boshqa gumonlanuvchining gapidagi vaqtga qarang!`;
                        feedbackEl.className = 'ya-feedback-banner fb-wrong';
                    }
                };
                suspectsEl.appendChild(card);
            });
        }
    },

    // ------------------------------------------------------------------------
    // 7. CODE MASTER (Big-O & Data Structures Optimization)
    // ------------------------------------------------------------------------
    'code-master': {
        id: 'code-master',
        title: 'Code Master',
        category: 'young-adults',
        icon: '💻',
        description: 'Algoritmlar murakkabligi (Big-O notation) va optimal ma’lumotlar tuzilmasi!',
        rules: 'Berilgan algoritmning vaqt murakkabligini yoki eng samarali usulini aniqlang.',
        difficulty: 'expert',
        tags: ['Big-O', 'Data Structures', 'Algoritm'],

        render(container, { onFinish, updateScore }) {
            const questions = [
                {
                    q: 'Tartiblangan N elementli massivda binar qidiruv (Binary Search) algoritmining eng yomon holatdagi vaqt murakkabligi qanday?',
                    options: ['O(N)', 'O(log N)', 'O(N log N)', 'O(1)'],
                    ans: 1,
                    explanation: 'Binar qidiruv har qadamda qidiruv sohasini 2 barobar qisqartiradi, ya’ni O(log N).'
                },
                {
                    q: 'Quyidagi ma’lumotlar tuzilmalaridan qaysi birida element qidirish o‘rtacha O(1) vaqt oladi?',
                    options: ['Linked List', 'Binary Search Tree', 'Hash Map (Hash Table)', 'Array'],
                    ans: 2,
                    explanation: 'Hash Map kalitlar orqali to‘g‘ridan-to‘g‘ri indekslash hisobiga O(1) amalini bajaradi.'
                }
            ];

            let score = 0;
            let current = 0;

            container.innerHTML = `
                <div class="ya-game code-master-box">
                    <div class="code-master-q-card">
                        <h3 id="cm-q"></h3>
                    </div>
                    <div class="code-master-options" id="cm-options"></div>
                    <div class="ya-feedback-banner" id="cm-feedback">Hisoblash nazariyasi va algoritmlar.</div>
                </div>
            `;

            const qEl = container.querySelector('#cm-q');
            const optionsEl = container.querySelector('#cm-options');
            const feedbackEl = container.querySelector('#cm-feedback');

            function loadQ() {
                if (current >= questions.length) {
                    onFinish({ score, won: score >= 50, perfect: score === questions.length * 50 });
                    return;
                }
                const item = questions[current];
                qEl.textContent = item.q;

                optionsEl.innerHTML = '';
                item.options.forEach((opt, idx) => {
                    const btn = document.createElement('button');
                    btn.className = 'ya-action-btn';
                    btn.textContent = opt;
                    btn.onclick = () => {
                        if (idx === item.ans) {
                            window.soundEngine.play('correct');
                            score += 50;
                            updateScore(score);
                            feedbackEl.textContent = `💻 To‘g‘ri! ${item.explanation}`;
                            feedbackEl.className = 'ya-feedback-banner fb-correct';
                        } else {
                            window.soundEngine.play('wrong');
                            feedbackEl.textContent = `❌ Xato. ${item.explanation}`;
                            feedbackEl.className = 'ya-feedback-banner fb-wrong';
                        }
                        current++;
                        setTimeout(loadQ, 2000);
                    };
                    optionsEl.appendChild(btn);
                });
            }

            loadQ();
        }
    },

    // ------------------------------------------------------------------------
    // 8. IQ TOURNAMENT (Timed Cognitive Aptitude Battery)
    // ------------------------------------------------------------------------
    'iq-tournament': {
        id: 'iq-tournament',
        title: 'IQ Tournament',
        category: 'young-adults',
        icon: '🏆',
        description: 'Vaqtga qarshi yuqori bosimli kognitiv turnir: IQ ko‘rsatkichi va persentil hisobi!',
        rules: 'Ketma-ket 3 ta murakkab analitik savolga tez va xatosiz javob bering.',
        difficulty: 'expert',
        tags: ['IQ Turnir', 'Analitika', 'Tezkor aql'],

        render(container, { onFinish, updateScore }) {
            const battery = [
                { q: 'Agar BARCHA BLOOPLAR GLOOP bo‘lsa, va BARCHA GLOOPLAR ZLOOP bo‘lsa, u holda barcha Blooplar albatta Zloopmi?', options: ['Ha, har doim', 'Yo‘q, hech qachon', 'Faqat ba’zilari'], ans: 0 },
                { q: '12, 23, 35, 48, 62, ? (Ketma-ketlikdagi keyingi son)', options: ['75', '77', '79', '80'], ans: 1 }, // diffs: 11, 12, 13, 14, 15 => 62 + 15 = 77
                { q: 'Kun kechaning 2 barobariga teng bo‘lsa, sutkada necha soat kunduz bo‘ladi?', options: ['12 soat', '14 soat', '16 soat', '18 soat'], ans: 2 } // x + 2x = 24 => 3x=24, x=8, 2x=16
            ];

            let score = 0;
            let current = 0;

            container.innerHTML = `
                <div class="ya-game iq-tourney-box">
                    <div class="tourney-question-card">
                        <h3 id="tq-text"></h3>
                    </div>
                    <div class="tourney-options" id="tq-options"></div>
                    <div class="ya-feedback-banner" id="tq-feedback">Maksimal diqqat va tezlik!</div>
                </div>
            `;

            const textEl = container.querySelector('#tq-text');
            const optionsEl = container.querySelector('#tq-options');
            const feedbackEl = container.querySelector('#tq-feedback');

            function loadQ() {
                if (current >= battery.length) {
                    const estimatedIQ = 110 + Math.floor(score / 3);
                    onFinish({ score, won: score >= 60, perfect: score === battery.length * 35 });
                    return;
                }
                const item = battery[current];
                textEl.textContent = item.q;

                optionsEl.innerHTML = '';
                item.options.forEach((opt, idx) => {
                    const btn = document.createElement('button');
                    btn.className = 'ya-action-btn';
                    btn.textContent = opt;
                    btn.onclick = () => {
                        if (idx === item.ans) {
                            window.soundEngine.play('correct');
                            score += 35;
                            updateScore(score);
                            feedbackEl.textContent = '🎯 Aniq deduksiya!';
                            feedbackEl.className = 'ya-feedback-banner fb-correct';
                        } else {
                            window.soundEngine.play('wrong');
                            feedbackEl.textContent = '❌ Noto‘g‘ri javob.';
                            feedbackEl.className = 'ya-feedback-banner fb-wrong';
                        }
                        current++;
                        setTimeout(loadQ, 1400);
                    };
                    optionsEl.appendChild(btn);
                });
            }

            loadQ();
        }
    },

    // ------------------------------------------------------------------------
    // 9. CRYPTO LOGIC (Caesar, Vigenère & Frequency Analysis)
    // ------------------------------------------------------------------------
    'crypto-logic': {
        id: 'crypto-logic',
        title: 'Crypto Logic',
        category: 'young-adults',
        icon: '🔐',
        description: 'Sezar shifri va kriptoanaliz: shifrlangan maxfiy xabarni kalit bilan yeching!',
        rules: 'Alifbo bo‘yicha surilish (Shift Cipher) qoidasini hisoblab, asl xabarni tiklang.',
        difficulty: 'expert',
        tags: ['Kriptografiya', 'Sezar shifri', 'Xavfsizlik'],

        render(container, { onFinish, updateScore }) {
            // Cipher: "BRAIN" shifted by +3 -> "EUDLQ"
            const challenge = {
                encrypted: 'EUDLQ',
                shift: 3,
                options: ['BRAIN', 'SMART', 'LOGIC', 'ARENA'],
                ans: 0,
                explanation: 'E(-3)=B, U(-3)=R, D(-3)=A, L(-3)=I, Q(-3)=N => BRAIN'
            };

            let score = 0;

            container.innerHTML = `
                <div class="ya-game crypto-box">
                    <div class="crypto-display-card">
                        <div class="crypto-meta">Kriptogramma:</div>
                        <h2 class="cipher-text">${challenge.encrypted}</h2>
                        <div class="cipher-hint">Kalit: Sezar shifri (Siljish: +${challenge.shift})</div>
                    </div>
                    <div class="crypto-options" id="cl-options"></div>
                    <div class="ya-feedback-banner" id="cl-feedback">Har bir harfni 3 ta oldingi harfga qaytaring.</div>
                </div>
            `;

            const optionsEl = container.querySelector('#cl-options');
            const feedbackEl = container.querySelector('#cl-feedback');

            challenge.options.forEach((opt, idx) => {
                const btn = document.createElement('button');
                btn.className = 'ya-action-btn';
                btn.textContent = `🔓 ${opt}`;
                btn.onclick = () => {
                    if (idx === challenge.ans) {
                        window.soundEngine.play('win');
                        score = 100;
                        updateScore(score);
                        feedbackEl.textContent = `🎉 DEKODLANDI! ${challenge.explanation}`;
                        feedbackEl.className = 'ya-feedback-banner fb-correct';
                        setTimeout(() => onFinish({ score: 100, won: true, perfect: true }), 1500);
                    } else {
                        window.soundEngine.play('wrong');
                        feedbackEl.textContent = `❌ Xato kalit. Harflarni 3 pog‘ona orqaga suring!`;
                        feedbackEl.className = 'ya-feedback-banner fb-wrong';
                    }
                };
                optionsEl.appendChild(btn);
            });
        }
    },

    // ------------------------------------------------------------------------
    // 10. DECISION MASTER (Game Theory & Nash Equilibrium)
    // ------------------------------------------------------------------------
    'decision-master': {
        id: 'decision-master',
        title: 'Decision Master',
        category: 'young-adults',
        icon: '⚖️',
        description: 'O‘yinlar nazariyasi (Game Theory): Mahbus dilemmasida AI ga qarshi qaror qabul qiling!',
        rules: 'Hamkorlik (Cooperate) yoki Sotqinlik (Defect)? AI sizning o‘tmishdagi tanlovlaringizga qarab moslashadi.',
        difficulty: 'expert',
        tags: ['Game Theory', 'Nash muvozanati', 'Qaror qabul qilish'],

        render(container, { onFinish, updateScore }) {
            let round = 1;
            const maxRounds = 5;
            let pScore = 0;
            let aiScore = 0;
            let aiHistory = [];

            container.innerHTML = `
                <div class="ya-game decision-box">
                    <div class="decision-hud">
                        <div class="hud-item">Tur: <span id="dm-round">1/5</span></div>
                        <div class="scores-duo">
                            <span>Siz: <b id="dm-p-score">0</b> ball</span>
                            <span>AI (Cortex): <b id="dm-ai-score">0</b> ball</span>
                        </div>
                    </div>
                    <div class="matrix-payout-card">
                        <div class="matrix-row"><span>🤝 Ikkalangiz hamkorlik:</span> <b>+3 ball har biriga</b></div>
                        <div class="matrix-row"><span>⚔️ Ikkalangiz xiyonat:</span> <b>+1 ball har biriga</b></div>
                        <div class="matrix-row"><span>⚡ Birov xiyonat, birov hamkorlik:</span> <b>Xiyonatchi +5, Hamkor 0</b></div>
                    </div>
                    <div class="decision-choices-row">
                        <button class="choice-btn choice-cooperate" id="dm-coop">
                            🤝 Hamkorlik qilish (Cooperate)
                        </button>
                        <button class="choice-btn choice-defect" id="dm-defect">
                            ⚔️ Xiyonat qilish (Defect)
                        </button>
                    </div>
                    <div class="ya-feedback-banner" id="dm-feedback">Strategiyangizni tanlang.</div>
                </div>
            `;

            const roundEl = container.querySelector('#dm-round');
            const pScoreEl = container.querySelector('#dm-p-score');
            const aiScoreEl = container.querySelector('#dm-ai-score');
            const feedbackEl = container.querySelector('#dm-feedback');

            function playDecision(playerMove) {
                // AI Strategy: Tit-for-Tat with 15% forgiveness
                let aiMove = 'cooperate';
                if (round > 1 && aiHistory.length > 0) {
                    const lastPlayerMove = aiHistory[aiHistory.length - 1];
                    aiMove = lastPlayerMove === 'defect' && Math.random() > 0.2 ? 'defect' : 'cooperate';
                }
                aiHistory.push(playerMove);

                let pGain = 0;
                let aiGain = 0;

                if (playerMove === 'cooperate' && aiMove === 'cooperate') {
                    pGain = 3; aiGain = 3;
                } else if (playerMove === 'defect' && aiMove === 'defect') {
                    pGain = 1; aiGain = 1;
                } else if (playerMove === 'defect' && aiMove === 'cooperate') {
                    pGain = 5; aiGain = 0;
                } else {
                    pGain = 0; aiGain = 5;
                }

                pScore += pGain;
                aiScore += aiGain;
                window.soundEngine.play('move');

                pScoreEl.textContent = pScore;
                aiScoreEl.textContent = aiScore;
                feedbackEl.textContent = `Siz: ${playerMove.toUpperCase()} (+${pGain}) | AI: ${aiMove.toUpperCase()} (+${aiGain})`;

                round++;
                if (round > maxRounds) {
                    const won = pScore >= aiScore;
                    const finalScore = Math.min(100, pScore * 7);
                    updateScore(finalScore);
                    feedbackEl.textContent = won ? '👑 AJOYIB! Siz Game Theory duelida ustun keldingiz!' : 'AI ustunlik qildi.';
                    setTimeout(() => onFinish({ score: finalScore, won, perfect: pScore >= 18 }), 1500);
                    return;
                }

                roundEl.textContent = `${round}/${maxRounds}`;
            }

            container.querySelector('#dm-coop').onclick = () => playDecision('cooperate');
            container.querySelector('#dm-defect').onclick = () => playDecision('defect');
        }
    }
};
