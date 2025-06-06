document.addEventListener('DOMContentLoaded', () => {
    const textDisplay = document.querySelector('.text-display');
    const typingInput = document.querySelector('#typing-input');
    const timerDisplay = document.querySelector('.typing-timer');
    const progressBar = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    const modeButtons = document.querySelectorAll('.mode-btn');
    const difficultyButtons = document.querySelectorAll('.difficulty-btn');
    const performanceChart = document.querySelector('#performance-chart');
    const tipsCarousel = document.querySelector('.tips-carousel');
    const wpmDisplay = document.getElementById('wpm');
    const accuracyDisplay = document.getElementById('accuracy');
    const keystrokesDisplay = document.getElementById('keystrokes');
    const restartBtn = document.getElementById('restart-btn');
    const shareBtn = document.getElementById('share-btn');
    const resultsSection = document.querySelector('.typing-results');

    let currentText = '';
    let typedCharacters = 0;
    let mistakes = 0;
    let startTime = null;
    let timerInterval = null;
    let testDuration = 60; // Default 1 minute
    let isTestActive = false;
    let wpmHistory = [];
    let currentTipIndex = 0;

    // Sample paragraphs for different difficulty levels
    const paragraphs = {
        easy: [
            "The quick brown fox jumps over the lazy dog. This simple sentence contains every letter of the alphabet.",
            "Learning to type quickly and accurately is an essential skill in today's digital world.",
            "Practice makes perfect. The more you type, the better you become at it."
        ],
        medium: [
            "The ability to touch type is becoming increasingly important in modern society. As we rely more on computers and digital devices, typing efficiency can significantly impact productivity.",
            "Programming requires precise typing skills. A single misplaced character can cause syntax errors and debugging headaches.",
            "According to research, the average typing speed is around 40 words per minute. Professional typists can reach speeds of over 100 WPM."
        ],
        hard: [
            "In computer science, algorithms are step-by-step procedures for calculations. Algorithms act as an exact list of instructions that conduct specified actions step by step in a finite time.",
            "The QWERTY keyboard layout, developed in the 1870s for mechanical typewriters, remains the standard despite the existence of allegedly more efficient alternatives like Dvorak.",
            "JavaScript is a high-level, interpreted programming language that conforms to the ECMAScript specification. It has dynamic typing, prototype-based object-orientation, and first-class functions."
        ]
    };

    // Typing tips
    const typingTips = [
        "Keep your fingers positioned on the home row keys (ASDF JKL;)",
        "Look at the screen instead of your hands while typing",
        "Practice regularly to build muscle memory",
        "Maintain good posture to prevent fatigue",
        "Focus on accuracy first, speed will come naturally",
        "Take short breaks to prevent strain"
    ];

    // Initialize the typing test
    function initTest() {
        const difficulty = getDifficulty();
        const texts = paragraphs[difficulty];
        currentText = texts[Math.floor(Math.random() * texts.length)];
        displayText();
        resetMetrics();
        updateTip();
        setupChart();
    }

    // Display text with character spans
    function displayText() {
        textDisplay.innerHTML = currentText.split('').map(char => 
            `<span>${char}</span>`
        ).join('');
        highlightCharacter(0);
    }

    // Highlight current character
    function highlightCharacter(index) {
        const spans = textDisplay.querySelectorAll('span');
        spans.forEach(span => span.classList.remove('current'));
        if (index < spans.length) {
            spans[index].classList.add('current');
        }
    }

    // Handle typing input
    function handleTyping(e) {
        if (!isTestActive) {
            startTest();
        }

        const spans = textDisplay.querySelectorAll('span');
        const typed = e.target.value;
        const current = typed.length - 1;

        if (current < 0) return;

        const character = typed[current];
        const expected = currentText[current];

        if (character === expected) {
            spans[current].classList.add('correct');
            spans[current].classList.remove('incorrect');
            typedCharacters++;
        } else {
            spans[current].classList.add('incorrect');
            spans[current].classList.remove('correct');
            mistakes++;
        }

        highlightCharacter(current + 1);
        updateProgress();
        updateMetrics();

        if (typed.length === currentText.length) {
            endTest();
        }
    }

    // Start the typing test
    function startTest() {
        isTestActive = true;
        startTime = Date.now();
        typingInput.focus();
        startTimer();
        wpmHistory = [];
    }

    // End the typing test
    function endTest() {
        isTestActive = false;
        clearInterval(timerInterval);
        showResults();
        updateHistory();
    }

    // Timer functions
    function startTimer() {
        let timeLeft = testDuration;
        updateTimer(timeLeft);

        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimer(timeLeft);
            updateWPMHistory();

            if (timeLeft === 0) {
                endTest();
            }
        }, 1000);
    }

    function updateTimer(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        timerDisplay.textContent = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    // Progress tracking
    function updateProgress() {
        const progress = (typedCharacters / currentText.length) * 100;
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `${Math.round(progress)}% complete`;
    }

    // Metrics calculation and updates
    function updateMetrics() {
        const timeElapsed = (Date.now() - startTime) / 1000;
        const wpm = calculateWPM(timeElapsed);
        const accuracy = calculateAccuracy();

        document.querySelector('#wpm').textContent = Math.round(wpm);
        document.querySelector('#accuracy').textContent = `${Math.round(accuracy)}%`;
        document.querySelector('#errors').textContent = mistakes;
    }

    function calculateWPM(timeElapsed) {
        const words = typedCharacters / 5; // Standard: 5 characters = 1 word
        return (words / timeElapsed) * 60;
    }

    function calculateAccuracy() {
        return ((typedCharacters - mistakes) / typedCharacters) * 100 || 0;
    }

    // Performance tracking
    function updateWPMHistory() {
        const timeElapsed = (Date.now() - startTime) / 1000;
        const wpm = calculateWPM(timeElapsed);
        wpmHistory.push(wpm);
        updateChart();
    }

    // Chart setup and updates
    function setupChart() {
        const ctx = performanceChart.getContext('2d');
        window.typingChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'WPM',
                    data: [],
                    borderColor: '#405DE6',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    function updateChart() {
        if (window.typingChart) {
            window.typingChart.data.labels = Array.from({ length: wpmHistory.length }, (_, i) => i + 1);
            window.typingChart.data.datasets[0].data = wpmHistory;
            window.typingChart.update();
        }
    }

    // Tips carousel
    function updateTip() {
        const tipItems = document.querySelectorAll('.tip-item');
        tipItems.forEach(tip => tip.classList.remove('active'));
        tipItems[currentTipIndex].classList.add('active');
    }

    function nextTip() {
        currentTipIndex = (currentTipIndex + 1) % typingTips.length;
        updateTip();
    }

    // Mode and difficulty selection
    modeButtons.forEach(button => {
        button.addEventListener('click', () => {
            modeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            testDuration = parseInt(button.dataset.time) * 60;
            resetTest();
        });
    });

    difficultyButtons.forEach(button => {
        button.addEventListener('click', () => {
            difficultyButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            resetTest();
        });
    });

    function getDifficulty() {
        const activeButton = document.querySelector('.difficulty-btn.active');
        return activeButton ? activeButton.dataset.difficulty : 'medium';
    }

    // Reset functions
    function resetTest() {
        clearInterval(timerInterval);
        isTestActive = false;
        typingInput.value = '';
        initTest();
    }

    function resetMetrics() {
        typedCharacters = 0;
        mistakes = 0;
        updateMetrics();
        updateProgress();
    }

    // History tracking
    function updateHistory() {
        const wpm = parseInt(document.querySelector('#wpm').textContent);
        const accuracy = parseInt(document.querySelector('#accuracy').textContent);
        
        let history = JSON.parse(localStorage.getItem('typingHistory') || '[]');
        history.push({ wpm, accuracy, date: new Date().toISOString() });
        localStorage.setItem('typingHistory', JSON.stringify(history));
        
        updateHistoryDisplay(history);
    }

    function updateHistoryDisplay(history) {
        if (history.length > 0) {
            const bestWPM = Math.max(...history.map(h => h.wpm));
            const avgWPM = Math.round(history.reduce((sum, h) => sum + h.wpm, 0) / history.length);
            const totalTests = history.length;

            document.querySelector('#best-wpm').textContent = bestWPM;
            document.querySelector('#avg-wpm').textContent = avgWPM;
            document.querySelector('#total-tests').textContent = totalTests;
        }
    }

    // Event listeners
    typingInput.addEventListener('input', handleTyping);
    document.addEventListener('keydown', e => {
        if (e.key === 'Tab') {
            e.preventDefault();
            nextTip();
        }
    });

    // Initialize
    initTest();
    
    // Load history
    const history = JSON.parse(localStorage.getItem('typingHistory') || '[]');
    updateHistoryDisplay(history);

    // Show final results
    function showResults() {
        const timeElapsed = testDuration / 60; // in minutes
        const grossWpm = Math.round((typedCharacters / 5) / timeElapsed);
        const netWpm = Math.round((typedCharacters / 5) / timeElapsed);
        const accuracy = Math.round((typedCharacters / typedCharacters) * 100);

        document.getElementById('gross-wpm').textContent = grossWpm;
        document.getElementById('net-wpm').textContent = netWpm;
        document.getElementById('final-accuracy').textContent = `${accuracy}%`;
        document.getElementById('characters').textContent = typedCharacters;
        document.getElementById('errors').textContent = mistakes;
        document.getElementById('time-taken').textContent = `${testDuration}s`;

        resultsSection.style.display = 'block';
    }

    // Event listeners
    restartBtn.addEventListener('click', initTest);
    
    shareBtn.addEventListener('click', () => {
        const text = `I just completed a typing test on WordMetrics!\nWPM: ${document.getElementById('net-wpm').textContent}\nAccuracy: ${document.getElementById('final-accuracy').textContent}`;
        
        if (navigator.share) {
            navigator.share({
                title: 'My Typing Test Results',
                text: text,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(text)
                .then(() => showNotification('Results copied to clipboard!', 'success'))
                .catch(() => showNotification('Failed to copy results', 'error'));
        }
    });

    // Show notification
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }
}); 