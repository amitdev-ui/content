document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('text-input');
    const summaryLength = document.getElementById('summary-length');
    const lengthValue = document.getElementById('length-value');
    const summarizeBtn = document.getElementById('summarize-btn');
    const copyBtn = document.getElementById('copy-btn');
    const resetBtn = document.getElementById('reset-btn');
    const originalWords = document.getElementById('original-words');
    const summaryWords = document.getElementById('summary-words');
    const reductionPercentage = document.getElementById('reduction-percentage');
    const summaryContainer = document.getElementById('summary-container');

    // Update length value display
    function updateLengthValue() {
        lengthValue.textContent = summaryLength.value;
    }

    // Update word counts
    function updateWordCounts() {
        const text = textInput.value;
        const words = text.trim().split(/\s+/).filter(word => word.length > 0);
        originalWords.textContent = words.length;
    }

    // Generate summary
    function generateSummary() {
        const text = textInput.value.trim();
        if (!text) {
            showNotification('Please enter some text to summarize', 'error');
            return;
        }

        // Show loading state
        summaryContainer.innerHTML = '<div class="loading"></div>';

        // Split text into sentences
        const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
        if (sentences.length === 0) {
            showNotification('Please enter complete sentences', 'error');
            summaryContainer.innerHTML = '<p class="placeholder-text">Your summary will appear here...</p>';
            return;
        }

        // Calculate importance of each sentence
        const sentenceScores = sentences.map(sentence => {
            const words = sentence.toLowerCase().split(/\s+/);
            const uniqueWords = new Set(words);
            const wordFrequency = words.reduce((acc, word) => {
                acc[word] = (acc[word] || 0) + 1;
                return acc;
            }, {});

            // Score based on word frequency and sentence position
            const frequencyScore = words.reduce((score, word) => score + wordFrequency[word], 0) / words.length;
            const positionScore = 1 - (sentences.indexOf(sentence) / sentences.length);
            
            return {
                sentence,
                score: frequencyScore * 0.6 + positionScore * 0.4
            };
        });

        // Sort sentences by score and select top ones based on summary length
        const sortedSentences = sentenceScores.sort((a, b) => b.score - a.score);
        const summaryLength = Math.ceil(sentences.length * (parseInt(lengthValue.textContent) / 100));
        const selectedSentences = sortedSentences.slice(0, summaryLength);

        // Restore original order
        const summary = selectedSentences
            .sort((a, b) => sentences.indexOf(a.sentence) - sentences.indexOf(b.sentence))
            .map(item => item.sentence.trim())
            .join(' ');

        // Update stats
        const summaryWordCount = summary.split(/\s+/).filter(word => word.length > 0).length;
        const originalWordCount = text.split(/\s+/).filter(word => word.length > 0).length;
        const reduction = Math.round((1 - (summaryWordCount / originalWordCount)) * 100);

        summaryWords.textContent = summaryWordCount;
        reductionPercentage.textContent = `${reduction}%`;

        // Display summary
        summaryContainer.innerHTML = `
            <h3>Summary</h3>
            <p>${summary}</p>
        `;

        showNotification('Summary generated successfully!', 'success');
    }

    // Copy text to clipboard
    async function copyText() {
        const summaryText = summaryContainer.querySelector('p')?.textContent;
        if (!summaryText || summaryText === 'Your summary will appear here...') {
            showNotification('No summary to copy', 'error');
            return;
        }

        try {
            await navigator.clipboard.writeText(summaryText);
            showNotification('Summary copied to clipboard!', 'success');
        } catch (err) {
            showNotification('Failed to copy text', 'error');
        }
    }

    // Reset text and summary
    function resetText() {
        textInput.value = '';
        summaryContainer.innerHTML = '<p class="placeholder-text">Your summary will appear here...</p>';
        originalWords.textContent = '0';
        summaryWords.textContent = '0';
        reductionPercentage.textContent = '0%';
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
    summaryLength.addEventListener('input', updateLengthValue);
    textInput.addEventListener('input', updateWordCounts);
    summarizeBtn.addEventListener('click', generateSummary);
    copyBtn.addEventListener('click', copyText);
    resetBtn.addEventListener('click', resetText);

    // Initialize
    updateLengthValue();
}); 