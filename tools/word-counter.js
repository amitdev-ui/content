document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('text-input');
    const wordCount = document.getElementById('word-count');
    const charCountWithSpaces = document.getElementById('char-count-with-spaces');
    const charCount = document.getElementById('char-count');
    const sentenceCount = document.getElementById('sentence-count');
    const copyBtn = document.getElementById('copy-btn');
    const resetBtn = document.getElementById('reset-btn');

    // Update counts in real-time
    function updateCounts() {
        const text = textInput.value;
        
        // Count words
        const words = text.trim().split(/\s+/).filter(word => word.length > 0);
        wordCount.textContent = words.length;

        // Count characters (with and without spaces)
        charCountWithSpaces.textContent = text.length;
        charCount.textContent = text.replace(/\s/g, '').length;

        // Count sentences
        const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
        sentenceCount.textContent = sentences.length;
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

    // Reset text and counts
    function resetText() {
        textInput.value = '';
        updateCounts();
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
    textInput.addEventListener('input', updateCounts);
    copyBtn.addEventListener('click', copyText);
    resetBtn.addEventListener('click', resetText);

    // Initial count update
    updateCounts();
}); 