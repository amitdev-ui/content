document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('text-input');
    const analyzeBtn = document.getElementById('analyze-btn');
    const copyBtn = document.getElementById('copy-btn');
    const resetBtn = document.getElementById('reset-btn');
    const readingLevel = document.getElementById('reading-level');
    const readingTime = document.getElementById('reading-time');
    const readabilityScore = document.getElementById('readability-score');
    const wordCount = document.getElementById('word-count');
    const sentenceCount = document.getElementById('sentence-count');
    const paragraphCount = document.getElementById('paragraph-count');
    const complexWords = document.getElementById('complex-words');
    const avgWordLength = document.getElementById('avg-word-length');
    const avgSentenceLength = document.getElementById('avg-sentence-length');

    // Analyze readability
    function analyzeReadability() {
        const text = textInput.value.trim();
        if (!text) {
            showNotification('Please enter some text to analyze', 'error');
            return;
        }

        // Basic text metrics
        const words = text.split(/\s+/).filter(word => word.length > 0);
        const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
        const paragraphs = text.split(/\n\s*\n/).filter(para => para.trim().length > 0);
        
        // Count complex words (words with 3 or more syllables)
        const complexWordCount = words.filter(word => countSyllables(word) >= 3).length;
        
        // Calculate averages
        const averageWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
        const averageSentenceLength = words.length / sentences.length;

        // Update metrics
        wordCount.textContent = words.length;
        sentenceCount.textContent = sentences.length;
        paragraphCount.textContent = paragraphs.length;
        complexWords.textContent = complexWordCount;
        avgWordLength.textContent = averageWordLength.toFixed(1);
        avgSentenceLength.textContent = averageSentenceLength.toFixed(1);

        // Calculate Flesch-Kincaid Grade Level
        const fleschKincaid = calculateFleschKincaid(words.length, sentences.length, complexWordCount);
        readabilityScore.textContent = Math.round(fleschKincaid.score);
        readingLevel.textContent = fleschKincaid.level;

        // Calculate reading time (average reading speed: 200-250 words per minute)
        const minutes = Math.ceil(words.length / 225);
        readingTime.textContent = `${minutes} min`;

        showNotification('Text analysis complete!', 'success');
    }

    // Calculate Flesch-Kincaid Grade Level
    function calculateFleschKincaid(wordCount, sentenceCount, complexWordCount) {
        if (wordCount === 0 || sentenceCount === 0) return { score: 0, level: '-' };

        const score = 206.835 - 1.015 * (wordCount / sentenceCount) - 84.6 * (complexWordCount / wordCount);
        
        let level;
        if (score >= 90) level = 'Very Easy';
        else if (score >= 80) level = 'Easy';
        else if (score >= 70) level = 'Fairly Easy';
        else if (score >= 60) level = 'Standard';
        else if (score >= 50) level = 'Fairly Difficult';
        else if (score >= 30) level = 'Difficult';
        else level = 'Very Difficult';

        return { score, level };
    }

    // Count syllables in a word
    function countSyllables(word) {
        word = word.toLowerCase();
        if (word.length <= 3) return 1;

        // Remove common endings
        word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
        word = word.replace(/^y/, '');

        // Count vowel groups
        return word.match(/[aeiouy]{1,2}/g)?.length || 1;
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

    // Reset text and metrics
    function resetText() {
        textInput.value = '';
        readingLevel.textContent = '-';
        readingTime.textContent = '0 min';
        readabilityScore.textContent = '0';
        wordCount.textContent = '0';
        sentenceCount.textContent = '0';
        paragraphCount.textContent = '0';
        complexWords.textContent = '0';
        avgWordLength.textContent = '0';
        avgSentenceLength.textContent = '0';
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
            .metrics-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1rem;
                margin-top: 1rem;
            }
            .metric-item {
                background: white;
                padding: 1rem;
                border-radius: 8px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .metric-label {
                color: #666;
                font-weight: 500;
            }
            .metric-value {
                color: var(--primary-color);
                font-weight: bold;
                font-size: 1.2rem;
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
    analyzeBtn.addEventListener('click', analyzeReadability);
    copyBtn.addEventListener('click', copyText);
    resetBtn.addEventListener('click', resetText);
}); 