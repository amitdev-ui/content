document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('text-input');
    const uppercaseBtn = document.getElementById('uppercase-btn');
    const lowercaseBtn = document.getElementById('lowercase-btn');
    const titlecaseBtn = document.getElementById('titlecase-btn');
    const copyBtn = document.getElementById('copy-btn');
    const resetBtn = document.getElementById('reset-btn');
    const originalLength = document.getElementById('original-length');
    const currentCase = document.getElementById('current-case');

    // Update stats
    function updateStats() {
        originalLength.textContent = textInput.value.length;
    }

    // Convert to uppercase
    function convertToUppercase() {
        textInput.value = textInput.value.toUpperCase();
        currentCase.textContent = 'UPPERCASE';
        showNotification('Text converted to uppercase!', 'success');
    }

    // Convert to lowercase
    function convertToLowercase() {
        textInput.value = textInput.value.toLowerCase();
        currentCase.textContent = 'lowercase';
        showNotification('Text converted to lowercase!', 'success');
    }

    // Convert to title case
    function convertToTitleCase() {
        textInput.value = textInput.value
            .toLowerCase()
            .split(' ')
            .map(word => {
                if (word.length === 0) return word;
                return word[0].toUpperCase() + word.slice(1);
            })
            .join(' ');
        currentCase.textContent = 'Title Case';
        showNotification('Text converted to title case!', 'success');
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

    // Reset text and stats
    function resetText() {
        textInput.value = '';
        currentCase.textContent = 'Original';
        updateStats();
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
    textInput.addEventListener('input', updateStats);
    uppercaseBtn.addEventListener('click', convertToUppercase);
    lowercaseBtn.addEventListener('click', convertToLowercase);
    titlecaseBtn.addEventListener('click', convertToTitleCase);
    copyBtn.addEventListener('click', copyText);
    resetBtn.addEventListener('click', resetText);

    // Initialize stats
    updateStats();
}); 