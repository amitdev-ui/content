document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('text-input');
    const checkBtn = document.getElementById('check-btn');
    const copyBtn = document.getElementById('copy-btn');
    const resetBtn = document.getElementById('reset-btn');
    const issuesCount = document.getElementById('issues-count');
    const spellingCount = document.getElementById('spelling-count');
    const grammarCount = document.getElementById('grammar-count');
    const correctionsContainer = document.getElementById('corrections-container');

    // Common English misspellings and their corrections
    const commonErrors = {
        'recieve': 'receive',
        'seperate': 'separate',
        'occured': 'occurred',
        'grammer': 'grammar',
        'untill': 'until',
        'begining': 'beginning',
        'wierd': 'weird',
        'accomodate': 'accommodate',
        'occurence': 'occurrence',
        'neccessary': 'necessary',
        'concious': 'conscious',
        'existance': 'existence',
        'enviroment': 'environment',
        'goverment': 'government',
        'independant': 'independent',
        'millenium': 'millennium',
        'persue': 'pursue',
        'pharoah': 'pharaoh',
        'publically': 'publicly',
        'restaraunt': 'restaurant'
    };

    // Grammar rules (simplified)
    const grammarRules = [
        {
            pattern: /\b(a)\s+([aeiou])/gi,
            suggestion: 'Use "an" before words that begin with vowel sounds'
        },
        {
            pattern: /\b(their|there|they're)\b/gi,
            suggestion: 'Check usage of their/there/they\'re'
        },
        {
            pattern: /\b(your|you're)\b/gi,
            suggestion: 'Check usage of your/you\'re'
        },
        {
            pattern: /\b(its|it's)\b/gi,
            suggestion: 'Check usage of its/it\'s'
        },
        {
            pattern: /\s+,/g,
            suggestion: 'Remove space before comma'
        },
        {
            pattern: /([.!?])[A-Z]/g,
            suggestion: 'Add space after punctuation'
        }
    ];

    // Check grammar and spelling
    function checkGrammar() {
        const text = textInput.value;
        let spellingErrors = 0;
        let grammarErrors = 0;
        const corrections = [];

        // Check spelling
        const words = text.toLowerCase().split(/\s+/);
        words.forEach(word => {
            if (commonErrors[word]) {
                spellingErrors++;
                corrections.push({
                    type: 'spelling',
                    error: word,
                    suggestion: commonErrors[word]
                });
            }
        });

        // Check grammar
        grammarRules.forEach(rule => {
            const matches = text.match(rule.pattern) || [];
            if (matches.length > 0) {
                grammarErrors += matches.length;
                corrections.push({
                    type: 'grammar',
                    error: matches.join(', '),
                    suggestion: rule.suggestion
                });
            }
        });

        // Update stats
        issuesCount.textContent = spellingErrors + grammarErrors;
        spellingCount.textContent = spellingErrors;
        grammarCount.textContent = grammarErrors;

        // Display corrections
        displayCorrections(corrections);
        showNotification('Grammar check complete!', 'success');
    }

    // Display corrections in the container
    function displayCorrections(corrections) {
        if (corrections.length === 0) {
            correctionsContainer.innerHTML = '<p class="success-message">No issues found! Your text looks good.</p>';
            return;
        }

        const html = corrections.map(correction => `
            <div class="correction-item ${correction.type}">
                <span class="correction-type">${correction.type.toUpperCase()}</span>
                <p class="error-text">Found: "${correction.error}"</p>
                <p class="suggestion-text">Suggestion: ${correction.suggestion}</p>
            </div>
        `).join('');

        correctionsContainer.innerHTML = html;
    }

    // Copy text to clipboard
    async function copyText() {
        try {
            await navigator.clipboard.writeText(textInput.value);
            showNotification('Text copied to clipboard!', 'success');
        } catch (err) {
            showNotification('Failed to copy text', 'error');
        }
    }

    // Reset text and results
    function resetText() {
        textInput.value = '';
        issuesCount.textContent = '0';
        spellingCount.textContent = '0';
        grammarCount.textContent = '0';
        correctionsContainer.innerHTML = '<p class="placeholder-text">Corrections will appear here after checking...</p>';
        showNotification('Text cleared!', 'success');
    }

    // Show notification
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        // Add styles dynamically
        const styles = document.createElement('style');
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 2rem;
                border-radius: 5px;
                color: white;
                font-weight: 500;
                animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s;
                z-index: 1000;
            }
            .success { background-color: #4CAF50; }
            .error { background-color: #f44336; }
            .correction-item {
                background: #f8f9fa;
                border-left: 4px solid #4CAF50;
                margin: 1rem 0;
                padding: 1rem;
                border-radius: 4px;
            }
            .correction-item.grammar {
                border-left-color: #2196F3;
            }
            .correction-item.spelling {
                border-left-color: #FF9800;
            }
            .correction-type {
                display: inline-block;
                padding: 0.25rem 0.5rem;
                border-radius: 3px;
                font-size: 0.8rem;
                font-weight: bold;
                color: white;
                background: #4CAF50;
            }
            .correction-item.grammar .correction-type {
                background: #2196F3;
            }
            .correction-item.spelling .correction-type {
                background: #FF9800;
            }
            .error-text {
                color: #f44336;
                margin: 0.5rem 0;
            }
            .suggestion-text {
                color: #4CAF50;
                margin: 0.5rem 0;
            }
            .success-message {
                color: #4CAF50;
                text-align: center;
                padding: 1rem;
            }
            .placeholder-text {
                color: #666;
                text-align: center;
                padding: 1rem;
            }
            @keyframes slideIn {
                from { transform: translateX(100%); }
                to { transform: translateX(0); }
            }
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(styles);

        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    // Event listeners
    checkBtn.addEventListener('click', checkGrammar);
    copyBtn.addEventListener('click', copyText);
    resetBtn.addEventListener('click', resetText);
}); 