/**
 * Brain Arena - Teens Games (11-15 Years)
 * 10 Fully Playable, Intellectual, Analytical & Strategic Games.
 * 
 * 1. IQ Challenge
 * 2. Sudoku Master
 * 3. Chess Battle
 * 4. Math Genius
 * 5. Code Puzzle
 * 6. Detective Mystery
 * 7. Strategic Battle
 * 8. Memory Pro
 * 9. Word Logic
 * 10. Physics Brain
 */

window.TeensGames = {
    // ------------------------------------------------------------------------
    // 1. IQ CHALLENGE (Abstract Pattern Matrices)
    // ------------------------------------------------------------------------
    'iq-challenge': {
        id: 'iq-challenge',
        title: 'IQ Challenge',
        category: 'teens',
        icon: '🧠',
        description: 'Raven matritsalari uslubidagi fazoviy va mavhum mantiqiy savollar!',
        rules: '3x3 katakdagi qonuniyatni aniqlang va bo‘sh katak (?) o‘rniga mos javobni tanlang.',
        difficulty: 'hard',
        tags: ['IQ', 'Mantiq', 'Fazoviy idrok'],

        render(container, { onFinish, updateScore }) {
            const puzzles = [
                {
                    grid: ['⬛', '⬛⬛', '⬛⬛⬛', '🔷', '🔷🔷', '🔷🔷🔷', '⭐', '⭐⭐', '❓'],
                    options: ['⭐', '⭐⭐⭐', '🔷🔷', '⬛⬛⬛⬛'],
                    ans: 1,
                    explanation: 'Har bir qatorda elementlar soni 1, 2, 3 tartibida ortib bormoqda.'
                },
                {
                    grid: ['⚪', '⚫', '⚪', '⚫', '⚪', '⚫', '⚪', '⚫', '❓'],
                    options: ['⚪', '⚫', '🔴', '🔷'],
                    ans: 0,
                    explanation: 'Shaxmat taxtasi tartibida oq va qora doiralar almashmoqda.'
                },
                {
                    grid: ['1', '4', '9', '16', '25', '36', '49', '64', '❓'],
                    options: ['72', '80', '81', '100'],
                    ans: 2,
                    explanation: 'Kvadratlar ketma-ketligi: 1², 2², 3², 4², 5², 6², 7², 8², 9² = 81.'
                }
            ];

            let score = 0;
            let current = 0;

            container.innerHTML = `
                <div class="teens-game iq-challenge-box">
                    <div class="teens-hud">
                        <div class="hud-item">Savol: <span id="iq-round">1/3</span></div>
                    </div>
                    <div class="iq-matrix-grid" id="iq-grid"></div>
                    <div class="iq-options-grid" id="iq-options"></div>
                    <div class="teens-feedback-banner" id="iq-feedback">Matritsadagi geometrik yoki sonli qoidani toping!</div>
                </div>
            `;

            const gridEl = container.querySelector('#iq-grid');
            const optionsEl = container.querySelector('#iq-options');
            const feedbackEl = container.querySelector('#iq-feedback');
            const roundEl = container.querySelector('#iq-round');

            function loadPuzzle() {
                if (current >= puzzles.length) {
                    onFinish({ score, won: score >= 60, perfect: score === puzzles.length * 35 });
                    return;
                }
                const p = puzzles[current];
                roundEl.textContent = `${current + 1}/${puzzles.length}`;

                gridEl.innerHTML = '';
                p.grid.forEach(cell => {
                    const el = document.createElement('div');
                    el.className = `iq-matrix-cell ${cell === '❓' ? 'target-cell' : ''}`;
                    el.textContent = cell;
                    gridEl.appendChild(el);
                });

                optionsEl.innerHTML = '';
                p.options.forEach((opt, idx) => {
                    const btn = document.createElement('button');
                    btn.className = 'teens-action-btn';
                    btn.textContent = opt;
                    btn.onclick = () => {
                        if (idx === p.ans) {
                            window.soundEngine.play('correct');
                            score += 35;
                            updateScore(score);
                            feedbackEl.textContent = `🎯 To‘g‘ri deduksiya! ${p.explanation}`;
                            feedbackEl.className = 'teens-feedback-banner fb-correct';
                        } else {
                            window.soundEngine.play('wrong');
                            feedbackEl.textContent = `❌ Xato. ${p.explanation}`;
                            feedbackEl.className = 'teens-feedback-banner fb-wrong';
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
    // 2. SUDOKU MASTER (6x6 Grid with Mini-Blocks)
    // ------------------------------------------------------------------------
    'sudoku-master': {
        id: 'sudoku-master',
        title: 'Sudoku Master',
        category: 'teens',
        icon: '🔢',
        description: 'Klassik 6x6 Sudoku: har bir qator, ustun va 2x3 blokda 1-6 raqamlar takrorlanmasligi kerak!',
        rules: 'Bo‘sh katakni tanlang va pastdagi raqamlar orqali to‘ldiring.',
        difficulty: 'hard',
        tags: ['Sudoku', 'Kombinatorika', 'Mantiq'],

        render(container, { onFinish, updateScore }) {
            // 6x6 valid puzzle (0 = empty)
            const solution = [
                [1, 2, 3, 4, 5, 6],
                [4, 5, 6, 1, 2, 3],
                [2, 3, 1, 5, 6, 4],
                [5, 6, 4, 2, 3, 1],
                [3, 1, 2, 6, 4, 5],
                [6, 4, 5, 3, 1, 2]
            ];

            // Some cells cleared
            const initial = [
                [1, 0, 3, 0, 5, 6],
                [0, 5, 6, 1, 0, 3],
                [2, 3, 0, 5, 6, 0],
                [0, 6, 4, 0, 3, 1],
                [3, 0, 2, 6, 0, 5],
                [6, 4, 0, 3, 1, 0]
            ];

            let currentBoard = JSON.parse(JSON.stringify(initial));
            let selectedCell = null;
            let score = 0;

            container.innerHTML = `
                <div class="teens-game sudoku-box">
                    <div class="sudoku-6x6-grid" id="sdk-grid"></div>
                    <div class="sudoku-numpad" id="sdk-numpad"></div>
                    <div class="sudoku-actions">
                        <button class="btn-secondary" id="sdk-erase">Tozalash ✖</button>
                        <button class="btn-primary" id="sdk-check">Tekshirish ✔</button>
                    </div>
                    <div class="teens-feedback-banner" id="sdk-feedback">Katakni bosing va raqam tanlang.</div>
                </div>
            `;

            const gridEl = container.querySelector('#sdk-grid');
            const numpadEl = container.querySelector('#sdk-numpad');
            const feedbackEl = container.querySelector('#sdk-feedback');
            const eraseBtn = container.querySelector('#sdk-erase');
            const checkBtn = container.querySelector('#sdk-check');

            function renderSudoku() {
                gridEl.innerHTML = '';
                for (let r = 0; r < 6; r++) {
                    for (let c = 0; c < 6; c++) {
                        const cell = document.createElement('div');
                        const isFixed = initial[r][c] !== 0;
                        cell.className = `sdk-cell ${isFixed ? 'sdk-fixed' : 'sdk-editable'}`;
                        if (selectedCell && selectedCell.r === r && selectedCell.c === c) {
                            cell.classList.add('sdk-selected');
                        }
                        cell.textContent = currentBoard[r][c] !== 0 ? currentBoard[r][c] : '';
                        cell.onclick = () => {
                            if (!isFixed) {
                                selectedCell = { r, c };
                                window.soundEngine.play('click');
                                renderSudoku();
                            }
                        };
                        gridEl.appendChild(cell);
                    }
                }
            }

            // Numpad 1 to 6
            for (let num = 1; num <= 6; num++) {
                const btn = document.createElement('button');
                btn.className = 'sdk-num-btn';
                btn.textContent = num;
                btn.onclick = () => {
                    if (selectedCell) {
                        currentBoard[selectedCell.r][selectedCell.c] = num;
                        window.soundEngine.play('click');
                        renderSudoku();
                    }
                };
                numpadEl.appendChild(btn);
            }

            eraseBtn.onclick = () => {
                if (selectedCell) {
                    currentBoard[selectedCell.r][selectedCell.c] = 0;
                    renderSudoku();
                }
            };

            checkBtn.onclick = () => {
                let correctCount = 0;
                let emptyCount = 0;

                for (let r = 0; r < 6; r++) {
                    for (let c = 0; c < 6; c++) {
                        if (currentBoard[r][c] === 0) emptyCount++;
                        else if (currentBoard[r][c] === solution[r][c]) correctCount++;
                    }
                }

                if (correctCount === 36) {
                    window.soundEngine.play('win');
                    score = 100;
                    updateScore(score);
                    feedbackEl.textContent = '🎉 MUKAMMAL! Sudoku to‘liq va to‘g‘ri yechildi!';
                    feedbackEl.className = 'teens-feedback-banner fb-correct';
                    setTimeout(() => onFinish({ score, won: true, perfect: true }), 1200);
                } else if (emptyCount > 0) {
                    feedbackEl.textContent = `Hali ${emptyCount} ta katak bo‘sh. To‘ldiring!`;
                } else {
                    window.soundEngine.play('wrong');
                    feedbackEl.textContent = 'Ba’zi raqamlar takrorlangan yoki xato joylashgan.';
                    feedbackEl.className = 'teens-feedback-banner fb-wrong';
                }
            };

            renderSudoku();
        }
    },

    // ------------------------------------------------------------------------
    // 3. CHESS BATTLE (Tactical Chess Board)
    // ------------------------------------------------------------------------
    'chess-battle': {
        id: 'chess-battle',
        title: 'Chess Battle',
        category: 'teens',
        icon: '⚔️',
        description: 'Taktik shaxmat: AI ga qarshi kurashib, mot yoki ustunlikka erishing!',
        rules: 'Donalaringiz bilan raqibni burchakka qising va uning shohini xavf ostiga qo‘ying.',
        difficulty: 'hard',
        tags: ['Shaxmat', 'Taktika', 'Minimax'],

        render(container, { mode, difficulty, onFinish, updateScore, showAIComment }) {
            // 5x5 board for tight tactical teens play
            let board = [
                ['bK', 'bQ', 'bB', 'bN', 'bR'],
                ['bP', 'bP', 'bP', 'bP', 'bP'],
                ['', '', '', '', ''],
                ['wP', 'wP', 'wP', 'wP', 'wP'],
                ['wR', 'wN', 'wB', 'wQ', 'wK']
            ];

            const symbols = {
                'wK': '♔', 'wQ': '♕', 'wR': '♖', 'wB': '♗', 'wN': '♘', 'wP': '♙',
                'bK': '♚', 'bQ': '♛', 'bR': '♜', 'bB': '♝', 'bN': '♞', 'bP': '♟'
            };

            let selected = null;
            let playerTurn = true;
            let score = 0;

            container.innerHTML = `
                <div class="teens-game chess-battle-box">
                    <div class="teens-hud">
                        <div class="hud-item">Navbat: <span id="cb-turn">Sizning navbatingiz (Oq)</span></div>
                    </div>
                    <div class="chess-tactical-grid" id="cb-board"></div>
                    <div class="teens-feedback-banner" id="cb-feedback">Oq donani tanlang va katakka bosing!</div>
                </div>
            `;

            const boardEl = container.querySelector('#cb-board');
            const turnEl = container.querySelector('#cb-turn');
            const feedbackEl = container.querySelector('#cb-feedback');

            function renderBoard() {
                boardEl.innerHTML = '';
                for (let r = 0; r < 5; r++) {
                    for (let c = 0; c < 5; c++) {
                        const sq = document.createElement('div');
                        const isDark = (r + c) % 2 === 1;
                        sq.className = `tactical-sq ${isDark ? 'sq-dark' : 'sq-light'}`;
                        if (selected && selected.r === r && selected.c === c) {
                            sq.classList.add('sq-selected');
                        }

                        const piece = board[r][c];
                        if (piece) {
                            sq.textContent = symbols[piece] || piece;
                            sq.classList.add(piece.startsWith('w') ? 'piece-white' : 'piece-black');
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
                        feedbackEl.textContent = '👑 RAQIB SHOHI YIQITILDI! Siz g‘alaba qozondingiz!';
                        setTimeout(() => onFinish({ score, won: true, perfect: true }), 1200);
                        return;
                    }

                    // AI Turn
                    playerTurn = false;
                    turnEl.textContent = 'Nexus-7 hisoblamoqda...';
                    setTimeout(aiMove, window.aiEngine.getReactionTime(difficulty));
                }
            }

            function aiMove() {
                const bPieces = [];
                for (let r = 0; r < 5; r++) {
                    for (let c = 0; c < 5; c++) {
                        if (board[r][c] && board[r][c].startsWith('b')) {
                            bPieces.push({ r, c, piece: board[r][c] });
                        }
                    }
                }

                if (bPieces.length === 0) {
                    onFinish({ score: 100, won: true, perfect: true });
                    return;
                }

                // AI advances a piece
                for (const p of bPieces.sort(() => 0.5 - Math.random())) {
                    const nextR = p.r + 1;
                    if (nextR < 5) {
                        const target = board[nextR][p.c];
                        if (!target || target.startsWith('w')) {
                            board[nextR][p.c] = p.piece;
                            board[p.r][p.c] = '';
                            window.soundEngine.play('move');

                            if (target === 'wK') {
                                window.soundEngine.play('lose');
                                feedbackEl.textContent = 'Shohingiz mot bo‘ldi! AI g‘olib.';
                                setTimeout(() => onFinish({ score: 35, won: false }), 1000);
                                return;
                            }
                            break;
                        }
                    }
                }

                playerTurn = true;
                turnEl.textContent = 'Sizning navbatingiz (Oq)';
                renderBoard();
            }

            renderBoard();
        }
    },

    // ------------------------------------------------------------------------
    // 4. MATH GENIUS (Algebra & Logic Equations)
    // ------------------------------------------------------------------------
    'math-genius': {
        id: 'math-genius',
        title: 'Math Genius',
        category: 'teens',
        icon: '📐',
        description: 'Tenglamalar va algebraik ifodalarni yeching: X ni toping!',
        rules: 'Matematik mantiq asosida noma’lum o‘zgaruvchini hisoblang.',
        difficulty: 'hard',
        tags: ['Algebra', 'Tenglama', 'Oliy hisob'],

        render(container, { onFinish, updateScore }) {
            const equations = [
                { eq: '3x + 12 = 33', ans: '7', options: ['5', '6', '7', '8'], exp: '3x = 21 => x = 7' },
                { eq: '2x² = 72', ans: '6', options: ['4', '6', '8', '9'], exp: 'x² = 36 => x = 6' },
                { eq: '5(x - 4) = 45', ans: '13', options: ['11', '12', '13', '15'], exp: 'x - 4 = 9 => x = 13' },
                { eq: 'x / 4 + 7 = 15', ans: '32', options: ['24', '28', '32', '36'], exp: 'x / 4 = 8 => x = 32' }
            ];

            let score = 0;
            let current = 0;

            container.innerHTML = `
                <div class="teens-game math-genius-box">
                    <div class="teens-hud">
                        <div class="hud-item">Tenglama: <span id="mg-round">1/4</span></div>
                    </div>
                    <div class="math-genius-card">
                        <div class="genius-formula" id="mg-eq"></div>
                    </div>
                    <div class="math-genius-options" id="mg-options"></div>
                    <div class="teens-feedback-banner" id="mg-feedback">X qiymatini aniqlang!</div>
                </div>
            `;

            const eqEl = container.querySelector('#mg-eq');
            const optionsEl = container.querySelector('#mg-options');
            const feedbackEl = container.querySelector('#mg-feedback');
            const roundEl = container.querySelector('#mg-round');

            function loadEq() {
                if (current >= equations.length) {
                    onFinish({ score, won: score >= 50, perfect: score === equations.length * 25 });
                    return;
                }
                const item = equations[current];
                roundEl.textContent = `${current + 1}/${equations.length}`;
                eqEl.textContent = item.eq;

                optionsEl.innerHTML = '';
                item.options.forEach(opt => {
                    const btn = document.createElement('button');
                    btn.className = 'teens-action-btn';
                    btn.textContent = `x = ${opt}`;
                    btn.onclick = () => {
                        if (opt === item.ans) {
                            window.soundEngine.play('correct');
                            score += 25;
                            updateScore(score);
                            feedbackEl.textContent = `🎯 To‘g‘ri! ${item.exp}`;
                            feedbackEl.className = 'teens-feedback-banner fb-correct';
                        } else {
                            window.soundEngine.play('wrong');
                            feedbackEl.textContent = `❌ Xato. To‘g‘ri javob: x = ${item.ans} (${item.exp})`;
                            feedbackEl.className = 'teens-feedback-banner fb-wrong';
                        }
                        current++;
                        setTimeout(loadEq, 1800);
                    };
                    optionsEl.appendChild(btn);
                });
            }

            loadEq();
        }
    },

    // ------------------------------------------------------------------------
    // 5. CODE PUZZLE (Syntax & Output Tracing)
    // ------------------------------------------------------------------------
    'code-puzzle': {
        id: 'code-puzzle',
        title: 'Code Puzzle',
        category: 'teens',
        icon: '💻',
        description: 'Dasturlash kodi natijasini toping yoki undagi xatoni aniqlang!',
        rules: 'Algoritmik kod parchasini tahlil qiling va console natijasini ayting.',
        difficulty: 'hard',
        tags: ['Kod', 'Algoritm', 'Dasturlash'],

        render(container, { onFinish, updateScore }) {
            const snippets = [
                {
                    code: 'let sum = 0;\nfor(let i = 1; i <= 4; i++) {\n  sum += i;\n}\nconsole.log(sum);',
                    options: ['6', '10', '15', '4'],
                    ans: 1,
                    explanation: '1 + 2 + 3 + 4 = 10'
                },
                {
                    code: 'let a = [10, 20, 30];\na.push(40);\na.pop();\nconsole.log(a.length);',
                    options: ['2', '3', '4', '0'],
                    ans: 1,
                    explanation: 'push(40) bilan 4 ta bo‘ldi, pop() bilan yana 3 ta qoldi.'
                },
                {
                    code: 'function test(x) {\n  return x > 5 ? x * 2 : x + 2;\n}\nconsole.log(test(4));',
                    options: ['8', '6', '10', '2'],
                    ans: 1,
                    explanation: '4 > 5 false, shuning uchun 4 + 2 = 6 qaytadi.'
                }
            ];

            let score = 0;
            let current = 0;

            container.innerHTML = `
                <div class="teens-game code-puzzle-box">
                    <div class="teens-hud">
                        <div class="hud-item">Topshiriq: <span id="cp-round">1/3</span></div>
                    </div>
                    <div class="code-editor-card">
                        <pre><code id="cp-snippet"></code></pre>
                    </div>
                    <div class="code-options-grid" id="cp-options"></div>
                    <div class="teens-feedback-banner" id="cp-feedback">Chiqariladigan natijani bashorat qiling.</div>
                </div>
            `;

            const codeEl = container.querySelector('#cp-snippet');
            const optionsEl = container.querySelector('#cp-options');
            const feedbackEl = container.querySelector('#cp-feedback');
            const roundEl = container.querySelector('#cp-round');

            function loadSnippet() {
                if (current >= snippets.length) {
                    onFinish({ score, won: score >= 60, perfect: score === snippets.length * 35 });
                    return;
                }
                const item = snippets[current];
                roundEl.textContent = `${current + 1}/${snippets.length}`;
                codeEl.textContent = item.code;

                optionsEl.innerHTML = '';
                item.options.forEach((opt, idx) => {
                    const btn = document.createElement('button');
                    btn.className = 'teens-action-btn';
                    btn.textContent = `> ${opt}`;
                    btn.onclick = () => {
                        if (idx === item.ans) {
                            window.soundEngine.play('correct');
                            score += 35;
                            updateScore(score);
                            feedbackEl.textContent = `💻 To‘g‘ri kompilyatsiya! ${item.explanation}`;
                            feedbackEl.className = 'teens-feedback-banner fb-correct';
                        } else {
                            window.soundEngine.play('wrong');
                            feedbackEl.textContent = `❌ Xato. ${item.explanation}`;
                            feedbackEl.className = 'teens-feedback-banner fb-wrong';
                        }
                        current++;
                        setTimeout(loadSnippet, 1800);
                    };
                    optionsEl.appendChild(btn);
                });
            }

            loadSnippet();
        }
    },

    // ------------------------------------------------------------------------
    // 6. DETECTIVE MYSTERY (Case File Deduction)
    // ------------------------------------------------------------------------
    'detective-mystery': {
        id: 'detective-mystery',
        title: 'Detective Mystery',
        category: 'teens',
        icon: '🕵️',
        description: 'Sirli o‘g‘rilik ishini tergov qiling: kim yolg‘on gapirmoqda?',
        rules: 'Gumonlanuvchilarning ko‘rsatmalarini o‘rganib, ziddiyatni toping.',
        difficulty: 'hard',
        tags: ['Detektiv', 'Deduksiya', 'Tergov'],

        render(container, { onFinish, updateScore }) {
            const cases = [
                {
                    title: 'Muzeydagi oltin soat o‘g‘irligi',
                    clue: 'O‘g‘rilik soat 21:00 da kuchli yomg‘ir paytida sodir bo‘ldi.',
                    suspects: [
                        { name: 'Qorovul Akmal', alibi: 'Men qorovulxonada choy ichib o‘tirgandim.' },
                        { name: 'Bog‘bon Jamshid', alibi: 'Men soat 21:00 da bog‘dagi gullarga shlang bilan suv quymoqchi edim.' },
                        { name: 'Oshpaz Sardor', alibi: 'Men oshxonada idish yuvayotgandim.' }
                    ],
                    culprit: 1,
                    explanation: 'Kuchli yomg‘ir yog‘ayotgan paytda bog‘bonning gullarga suv quyishi yolg‘on va ziddiyat!'
                },
                {
                    title: 'Bank sefining buzilishi',
                    clue: 'Sef kodini faqat qora qo‘lqop kiygan shaxs tergan, barmoq izi qolmagan.',
                    suspects: [
                        { name: 'Kassir Lola', alibi: 'Men uyda televizor ko‘rayotgandim.' },
                        { name: 'Menejer Bobur', alibi: 'Mening qo‘lim lat yeb gipslangan edi, kod tera olmasdim.' },
                        { name: 'Usta Rustam', alibi: 'Mening ustaxonamdan qora qo‘lqoplarim va asboblarim yo‘qolganini bilmayman.' }
                    ],
                    culprit: 2,
                    explanation: 'Usta Rustam hech kim so‘ramay turib o‘zining qora qo‘lqopi borligi haqida o‘zini fosh qilib qo‘ydi.'
                }
            ];

            let score = 0;
            let current = 0;

            container.innerHTML = `
                <div class="teens-game detective-box">
                    <div class="case-file-card">
                        <h3 id="dt-title"></h3>
                        <div class="case-clue" id="dt-clue"></div>
                    </div>
                    <div class="suspects-list" id="dt-suspects"></div>
                    <div class="teens-feedback-banner" id="dt-feedback">Ziddiyatli guvohlikni bosing!</div>
                </div>
            `;

            const titleEl = container.querySelector('#dt-title');
            const clueEl = container.querySelector('#dt-clue');
            const suspectsEl = container.querySelector('#dt-suspects');
            const feedbackEl = container.querySelector('#dt-feedback');

            function loadCase() {
                if (current >= cases.length) {
                    onFinish({ score, won: score >= 50, perfect: score === cases.length * 50 });
                    return;
                }
                const c = cases[current];
                titleEl.textContent = `Ish #${current + 1}: ${c.title}`;
                clueEl.textContent = `Dalil: ${c.clue}`;

                suspectsEl.innerHTML = '';
                c.suspects.forEach((s, idx) => {
                    const card = document.createElement('div');
                    card.className = 'suspect-card';
                    card.innerHTML = `
                        <h4>👤 ${s.name}</h4>
                        <p>"${s.alibi}"</p>
                    `;
                    card.onclick = () => {
                        if (idx === c.culprit) {
                            window.soundEngine.play('correct');
                            score += 50;
                            updateScore(score);
                            feedbackEl.textContent = `🔍 ISH OCHILDI! ${c.explanation}`;
                            feedbackEl.className = 'teens-feedback-banner fb-correct';
                        } else {
                            window.soundEngine.play('wrong');
                            feedbackEl.textContent = `❌ Begunoh odam ayblandi. Haqiqiy aybdor: ${c.suspects[c.culprit].name}`;
                            feedbackEl.className = 'teens-feedback-banner fb-wrong';
                        }
                        current++;
                        setTimeout(loadCase, 2500);
                    };
                    suspectsEl.appendChild(card);
                });
            }

            loadCase();
        }
    },

    // ------------------------------------------------------------------------
    // 7. STRATEGIC BATTLE (Turn-Based Grid Warfare)
    // ------------------------------------------------------------------------
    'strategic-battle': {
        id: 'strategic-battle',
        title: 'Strategic Battle',
        category: 'teens',
        icon: '🛡️',
        description: 'Taktik maydonda AI bilan navbatma-navbat jang qiling!',
        rules: 'Har turda Hujum, Mudofaa yoki Maxsus quvvat to‘plash taktikasini tanlang.',
        difficulty: 'hard',
        tags: ['Strategiya', 'Taktika', 'AI Duel'],

        render(container, { difficulty, onFinish, updateScore, showAIComment }) {
            let playerHP = 100;
            let aiHP = 100;
            let playerEnergy = 2;
            let aiEnergy = 2;

            container.innerHTML = `
                <div class="teens-game strategic-battle-box">
                    <div class="battle-duo-hud">
                        <div class="combatant-hud">
                            <h4>Siz (Ritsar)</h4>
                            <div class="hp-bar-wrap"><div class="hp-fill" id="sb-p-hp" style="width: 100%"></div></div>
                            <span id="sb-p-text">100 HP | 2 Energiya</span>
                        </div>
                        <div class="combatant-hud">
                            <h4>Nexus-7 (Kibor)</h4>
                            <div class="hp-bar-wrap"><div class="hp-fill ai-hp-fill" id="sb-ai-hp" style="width: 100%"></div></div>
                            <span id="sb-ai-text">100 HP</span>
                        </div>
                    </div>
                    <div class="tactical-actions-row">
                        <button class="tactical-btn" id="sb-atk">⚔️ Hujum (-25 HP, 1⚡)</button>
                        <button class="tactical-btn" id="sb-def">🛡️ Qalqon (+30 Himoya)</button>
                        <button class="tactical-btn" id="sb-charge">⚡ Quvvatlash (+2 Energiya)</button>
                    </div>
                    <div class="teens-feedback-banner" id="sb-log">Strategik harakatni tanlang!</div>
                </div>
            `;

            const pHPBar = container.querySelector('#sb-p-hp');
            const aiHPBar = container.querySelector('#sb-ai-hp');
            const pText = container.querySelector('#sb-p-text');
            const aiText = container.querySelector('#sb-ai-text');
            const logEl = container.querySelector('#sb-log');

            function updateHUD() {
                pHPBar.style.width = `${Math.max(0, playerHP)}%`;
                aiHPBar.style.width = `${Math.max(0, aiHP)}%`;
                pText.textContent = `${playerHP} HP | ${playerEnergy}⚡`;
                aiText.textContent = `${aiHP} HP`;
            }

            function endTurn(playerAction) {
                // AI picks action
                const aiActions = ['atk', 'def', 'charge'];
                const aiAction = aiEnergy >= 1 ? aiActions[Math.floor(Math.random() * aiActions.length)] : 'charge';

                // Process player
                let pDamage = 0;
                let pShield = false;
                if (playerAction === 'atk') {
                    if (playerEnergy >= 1) {
                        playerEnergy--;
                        pDamage = 25;
                    } else {
                        logEl.textContent = 'Energiya yetarli emas!';
                        return;
                    }
                } else if (playerAction === 'def') {
                    pShield = true;
                } else if (playerAction === 'charge') {
                    playerEnergy += 2;
                }

                // Process AI
                let aiDamage = 0;
                let aiShield = false;
                if (aiAction === 'atk' && aiEnergy >= 1) {
                    aiEnergy--;
                    aiDamage = 25;
                } else if (aiAction === 'def') {
                    aiShield = true;
                } else {
                    aiEnergy += 2;
                }

                // Apply
                if (pDamage > 0) {
                    const actual = aiShield ? 10 : pDamage;
                    aiHP -= actual;
                }
                if (aiDamage > 0) {
                    const actual = pShield ? 10 : aiDamage;
                    playerHP -= actual;
                }

                window.soundEngine.play('move');
                updateHUD();

                logEl.textContent = `Siz: ${playerAction.toUpperCase()} | AI: ${aiAction.toUpperCase()}`;

                if (aiHP <= 0) {
                    window.soundEngine.play('win');
                    updateScore(100);
                    logEl.textContent = '🏆 G‘ALABA! Siz dushmanni taslim qildingiz!';
                    setTimeout(() => onFinish({ score: 100, won: true, perfect: playerHP >= 70 }), 1200);
                } else if (playerHP <= 0) {
                    window.soundEngine.play('lose');
                    logEl.textContent = '💀 Mag‘lubiyat! Qaytadan sinab ko‘ring.';
                    setTimeout(() => onFinish({ score: 40, won: false }), 1200);
                }
            }

            container.querySelector('#sb-atk').onclick = () => endTurn('atk');
            container.querySelector('#sb-def').onclick = () => endTurn('def');
            container.querySelector('#sb-charge').onclick = () => endTurn('charge');
        }
    },

    // ------------------------------------------------------------------------
    // 8. MEMORY PRO (Visual Matrix Recall)
    // ------------------------------------------------------------------------
    'memory-pro': {
        id: 'memory-pro',
        title: 'Memory Pro',
        category: 'teens',
        icon: '🔲',
        description: '4x4 katakli matritsada 2 soniya yongan nuqtalarni eslab qoling!',
        rules: 'Yashil yongan katakchalarni eslab, ular o‘chgach aynan o‘sha joylarni bosing.',
        difficulty: 'hard',
        tags: ['Xotira', 'Fazoviy xotira', 'Matritsa'],

        render(container, { onFinish, updateScore }) {
            let round = 1;
            let score = 0;
            let targetCells = [];
            let selectedCells = [];
            let canClick = false;

            container.innerHTML = `
                <div class="teens-game memory-pro-box">
                    <div class="teens-hud">
                        <div class="hud-item">Bosqich: <span id="mp-round">1/4</span></div>
                    </div>
                    <div class="matrix-4x4-grid" id="mp-grid"></div>
                    <div class="teens-feedback-banner" id="mp-feedback">Yongan katakchalarni eslab qoling...</div>
                </div>
            `;

            const gridEl = container.querySelector('#mp-grid');
            const roundEl = container.querySelector('#mp-round');
            const feedbackEl = container.querySelector('#mp-feedback');

            function startRound() {
                if (round > 4) {
                    onFinish({ score, won: score >= 60, perfect: score === 100 });
                    return;
                }
                roundEl.textContent = `${round}/4`;
                selectedCells = [];
                canClick = false;
                feedbackEl.textContent = '👀 Diqqat bilan eslab qoling...';

                // Pick 3 + round cells
                const count = 3 + round;
                targetCells = [];
                while (targetCells.length < count) {
                    const r = Math.floor(Math.random() * 16);
                    if (!targetCells.includes(r)) targetCells.push(r);
                }

                // Render grid
                gridEl.innerHTML = '';
                for (let i = 0; i < 16; i++) {
                    const cell = document.createElement('div');
                    cell.className = `matrix-cell ${targetCells.includes(i) ? 'lit-memory' : ''}`;
                    gridEl.appendChild(cell);
                }

                // Hide after 1.8s
                setTimeout(() => {
                    const cells = gridEl.querySelectorAll('.matrix-cell');
                    cells.forEach((cell, idx) => {
                        cell.classList.remove('lit-memory');
                        cell.onclick = () => handleCellClick(idx, cell);
                    });
                    canClick = true;
                    feedbackEl.textContent = `👉 Yongan ${count} ta katakni bosing!`;
                }, 1800);
            }

            function handleCellClick(idx, cellEl) {
                if (!canClick || selectedCells.includes(idx)) return;
                selectedCells.push(idx);

                if (targetCells.includes(idx)) {
                    window.soundEngine.play('correct');
                    cellEl.classList.add('correct-memory');

                    if (selectedCells.length === targetCells.length) {
                        score += 25;
                        updateScore(score);
                        feedbackEl.textContent = '🌟 Ajoyib xotira!';
                        round++;
                        setTimeout(startRound, 1000);
                    }
                } else {
                    window.soundEngine.play('wrong');
                    cellEl.classList.add('wrong-memory');
                    feedbackEl.textContent = '❌ Xato katakcha. Bosqich yakunlandi.';
                    canClick = false;
                    round++;
                    setTimeout(startRound, 1200);
                }
            }

            startRound();
        }
    },

    // ------------------------------------------------------------------------
    // 9. WORD LOGIC (Wordle Deduction)
    // ------------------------------------------------------------------------
    'word-logic': {
        id: 'word-logic',
        title: 'Word Logic',
        category: 'teens',
        icon: '📝',
        description: '5 harfli yashirin so‘zni 5 urinishda toping (Wordle uslubida)!',
        rules: 'Yashil = harf to‘g‘ri joyda; Sariq = harf so‘zda bor lekin boshqa joyda; Kulrang = harf yo‘q.',
        difficulty: 'hard',
        tags: ['Wordle', 'Til', 'Deduksiya'],

        render(container, { onFinish, updateScore }) {
            const dictionary = ['BILIM', 'DASTUR', 'QALAM', 'SHAHAR', 'BAHOR', 'ZAMON', 'QUVOS', 'TEMUR'];
            // 5 letter words
            const targets = ['BILIM', 'QALAM', 'BAHOR', 'ZAMON', 'TEMUR'];
            const secret = targets[Math.floor(Math.random() * targets.length)];

            let attempt = 0;
            const maxAttempts = 5;
            let currentInput = '';
            let score = 0;

            container.innerHTML = `
                <div class="teens-game word-logic-box">
                    <div class="wordle-board" id="wl-board"></div>
                    <div class="wordle-input-row">
                        <input type="text" id="wl-input" maxlength="5" placeholder="5 HARF..." autocomplete="off">
                        <button class="btn-primary" id="wl-submit">Kiritish ↵</button>
                    </div>
                    <div class="teens-feedback-banner" id="wl-feedback">5 harfli so‘z kiriting va tekshiring!</div>
                </div>
            `;

            const boardEl = container.querySelector('#wl-board');
            const inputEl = container.querySelector('#wl-input');
            const submitBtn = container.querySelector('#wl-submit');
            const feedbackEl = container.querySelector('#wl-feedback');

            // 5 rows x 5 cols
            function renderEmptyBoard() {
                boardEl.innerHTML = '';
                for (let r = 0; r < maxAttempts; r++) {
                    const row = document.createElement('div');
                    row.className = 'wordle-row';
                    row.id = `wl-row-${r}`;
                    for (let c = 0; c < 5; c++) {
                        const tile = document.createElement('div');
                        tile.className = 'wordle-tile';
                        row.appendChild(tile);
                    }
                    boardEl.appendChild(row);
                }
            }

            renderEmptyBoard();

            submitBtn.onclick = () => {
                const guess = inputEl.value.trim().toUpperCase();
                if (guess.length !== 5) {
                    feedbackEl.textContent = 'Iltimos, aynan 5 ta harf kiriting!';
                    return;
                }

                const row = container.querySelector(`#wl-row-${attempt}`);
                const tiles = row.querySelectorAll('.wordle-tile');

                let matchedExact = 0;
                for (let i = 0; i < 5; i++) {
                    tiles[i].textContent = guess[i];
                    if (guess[i] === secret[i]) {
                        tiles[i].classList.add('w-green');
                        matchedExact++;
                    } else if (secret.includes(guess[i])) {
                        tiles[i].classList.add('w-yellow');
                    } else {
                        tiles[i].classList.add('w-gray');
                    }
                }

                inputEl.value = '';
                attempt++;

                if (matchedExact === 5) {
                    window.soundEngine.play('win');
                    score = 100;
                    updateScore(score);
                    feedbackEl.textContent = `🎉 Ajoyib! Yashirin so‘z "${secret}" topildi!`;
                    feedbackEl.className = 'teens-feedback-banner fb-correct';
                    setTimeout(() => onFinish({ score, won: true, perfect: attempt <= 3 }), 1200);
                    return;
                }

                if (attempt >= maxAttempts) {
                    window.soundEngine.play('lose');
                    feedbackEl.textContent = `Imkoniyat tugadi. Yashirin so‘z: ${secret}`;
                    feedbackEl.className = 'teens-feedback-banner fb-wrong';
                    setTimeout(() => onFinish({ score: 40, won: false }), 1500);
                    return;
                }
            };
        }
    },

    // ------------------------------------------------------------------------
    // 10. PHYSICS BRAIN (Laser & Optical Reflection Puzzle)
    // ------------------------------------------------------------------------
    'physics-brain': {
        id: 'physics-brain',
        title: 'Physics Brain',
        category: 'teens',
        icon: '⚡',
        description: 'Optik oyna burchaklarini to‘g‘rilang va lazer nurini nishonga yo‘naltiring!',
        rules: 'Oynalarni burish uchun bosing. Lazer nuri aks etib qizil kristallga yetib borishi shart.',
        difficulty: 'hard',
        tags: ['Fizika', 'Optika', 'Lazer'],

        render(container, { onFinish, updateScore }) {
            // Mirrors at positions: mirror1 angle, mirror2 angle
            // Target angles to win: m1 = 45 deg, m2 = 135 deg
            let m1Angle = 0;
            let m2Angle = 90;
            let score = 0;

            container.innerHTML = `
                <div class="teens-game physics-brain-box">
                    <div class="physics-board-canvas" id="pb-canvas">
                        <div class="laser-emitter">🔦 Lazer</div>
                        <div class="mirror-item" id="pb-m1" style="left: 30%; top: 40%;">🪞 <span id="pb-m1-deg">0°</span></div>
                        <div class="mirror-item" id="pb-m2" style="left: 70%; top: 40%;">🪞 <span id="pb-m2-deg">90°</span></div>
                        <div class="laser-target" style="left: 70%; top: 80%;">💎 Kristall</div>
                    </div>
                    <div class="physics-controls">
                        <button class="tactical-btn" id="pb-rot-m1">1-Oynani burish (+45°)</button>
                        <button class="tactical-btn" id="pb-rot-m2">2-Oynani burish (+45°)</button>
                        <button class="btn-primary" id="pb-fire">Lazer nurlarini yoqish! ⚡</button>
                    </div>
                    <div class="teens-feedback-banner" id="pb-feedback">Oynalarni 45° va 135° burchakka keltiring.</div>
                </div>
            `;

            const m1El = container.querySelector('#pb-m1');
            const m2El = container.querySelector('#pb-m2');
            const m1Deg = container.querySelector('#pb-m1-deg');
            const m2Deg = container.querySelector('#pb-m2-deg');
            const feedbackEl = container.querySelector('#pb-feedback');

            container.querySelector('#pb-rot-m1').onclick = () => {
                m1Angle = (m1Angle + 45) % 360;
                m1El.style.transform = `rotate(${m1Angle}deg)`;
                m1Deg.textContent = `${m1Angle}°`;
                window.soundEngine.play('click');
            };

            container.querySelector('#pb-rot-m2').onclick = () => {
                m2Angle = (m2Angle + 45) % 360;
                m2El.style.transform = `rotate(${m2Angle}deg)`;
                m2Deg.textContent = `${m2Angle}°`;
                window.soundEngine.play('click');
            };

            container.querySelector('#pb-fire').onclick = () => {
                window.soundEngine.play('laser');
                // Target: m1 = 45 or 225, m2 = 135 or 315
                if ((m1Angle === 45 || m1Angle === 225) && (m2Angle === 135 || m2Angle === 315)) {
                    window.soundEngine.play('win');
                    score = 100;
                    updateScore(score);
                    feedbackEl.textContent = '⚡ NURLAR REFLEKSIYASI TO‘G‘RI! Kristall energiya bilan to‘ldi!';
                    feedbackEl.className = 'teens-feedback-banner fb-correct';
                    setTimeout(() => onFinish({ score, won: true, perfect: true }), 1200);
                } else {
                    window.soundEngine.play('wrong');
                    feedbackEl.textContent = `❌ Lazer adashdi! Hozirgi burchaklar: ${m1Angle}° va ${m2Angle}°. Kerakli: 45° va 135°.`;
                    feedbackEl.className = 'teens-feedback-banner fb-wrong';
                }
            };
        }
    }
};
