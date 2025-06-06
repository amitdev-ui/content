// DOM Elements
const textInput = document.getElementById('text-input');
const wordCount = document.getElementById('word-count');
const charCountSpaces = document.getElementById('char-count-spaces');
const charCount = document.getElementById('char-count');
const sentenceCount = document.getElementById('sentence-count');
const copyBtn = document.getElementById('copy-btn');
const resetBtn = document.getElementById('reset-btn');

// Update all counts in real-time
function updateCounts() {
    const text = textInput.value;
    
    // Word count
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    wordCount.textContent = words.length;
    
    // Character count with spaces
    charCountSpaces.textContent = text.length;
    
    // Character count without spaces
    charCount.textContent = text.replace(/\s/g, '').length;
    
    // Sentence count
    const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
    sentenceCount.textContent = sentences.length;
}

// Copy text to clipboard
async function copyText() {
    try {
        await navigator.clipboard.writeText(textInput.value);
        showNotification('Text copied to clipboard!');
    } catch (err) {
        showNotification('Failed to copy text', true);
    }
}

// Reset text area
function resetText() {
    textInput.value = '';
    updateCounts();
    showNotification('Text cleared!');
}

// Show notification
function showNotification(message, isError = false) {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = `notification ${isError ? 'error' : 'success'}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 2rem',
        borderRadius: '5px',
        backgroundColor: isError ? '#ff4444' : '#00C851',
        color: 'white',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
        zIndex: '1000',
        animation: 'slideIn 0.3s ease'
    });
    
    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Event listeners
textInput.addEventListener('input', updateCounts);
copyBtn.addEventListener('click', copyText);
resetBtn.addEventListener('click', resetText);

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add active class to navigation links on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 60) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === currentSection) {
            link.classList.add('active');
        }
    });
});

// Initialize counts
updateCounts();

// Background Slideshow
let slideIndex = 0;
const slides = document.querySelectorAll('.slide');

function showSlides() {
    // Hide all slides
    slides.forEach(slide => slide.style.opacity = '0');
    
    // Move to next slide
    slideIndex++;
    if (slideIndex > slides.length) {
        slideIndex = 1;
    }
    
    // Show current slide
    slides[slideIndex - 1].style.opacity = '1';
    
    // Change image every 5 seconds
    setTimeout(showSlides, 5000);
}

// Start slideshow when page loads
window.addEventListener('load', () => {
    if (slides.length > 0) {
        showSlides();
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Tool Switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    const toolPanels = document.querySelectorAll('.tool-panel');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and panels
            tabBtns.forEach(b => b.classList.remove('active'));
            toolPanels.forEach(p => p.classList.remove('active'));

            // Add active class to clicked button and corresponding panel
            btn.classList.add('active');
            const tool = btn.dataset.tool;
            document.getElementById(tool).classList.add('active');
        });
    });

    // Word Counter Tool
    const textInput = document.getElementById('text-input');
    const wordCount = document.getElementById('word-count');
    const charCountSpaces = document.getElementById('char-count-spaces');
    const charCount = document.getElementById('char-count');
    const sentenceCount = document.getElementById('sentence-count');

    function updateCounts() {
        const text = textInput.value;
        
        // Word count
        const words = text.trim().split(/\s+/).filter(word => word.length > 0);
        wordCount.textContent = words.length;

        // Character counts
        charCountSpaces.textContent = text.length;
        charCount.textContent = text.replace(/\s/g, '').length;

        // Sentence count
        const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
        sentenceCount.textContent = sentences.length;
    }

    textInput.addEventListener('input', updateCounts);

    // Copy and Reset functionality
    document.getElementById('copy-btn').addEventListener('click', () => {
        textInput.select();
        document.execCommand('copy');
        showNotification('Text copied to clipboard!');
    });

    document.getElementById('reset-btn').addEventListener('click', () => {
        textInput.value = '';
        updateCounts();
        showNotification('Text cleared!');
    });

    // Grammar Checker Tool
    const grammarChecker = document.querySelector('#grammar-checker textarea');
    const checkGrammarBtn = document.querySelector('#grammar-checker .btn');

    checkGrammarBtn.addEventListener('click', () => {
        // Simulate grammar checking
        const text = grammarChecker.value;
        if (text.trim().length === 0) {
            showNotification('Please enter some text to check.', 'error');
            return;
        }
        showNotification('Grammar check complete!');
    });

    // Case Converter Tool
    const caseConverter = document.querySelector('#case-converter textarea');
    const caseButtons = document.querySelectorAll('#case-converter .btn');

    caseButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const text = caseConverter.value;
            if (text.trim().length === 0) {
                showNotification('Please enter some text to convert.', 'error');
                return;
            }

            switch (btn.textContent.trim()) {
                case 'UPPERCASE':
                    caseConverter.value = text.toUpperCase();
                    break;
                case 'lowercase':
                    caseConverter.value = text.toLowerCase();
                    break;
                case 'Title Case':
                    caseConverter.value = text.replace(/\w\S*/g, 
                        txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
                    break;
                case 'Reset':
                    caseConverter.value = '';
                    break;
            }
            if (btn.textContent.trim() !== 'Reset') {
                showNotification('Text case converted!');
            }
        });
    });

    // Text Summarizer Tool
    const summarizer = document.querySelector('#summarizer textarea');
    const summaryLength = document.querySelector('#summarizer input[type="range"]');
    const summaryLengthLabel = document.querySelector('#summarizer .range-control span');
    const summarizeBtn = document.querySelector('#summarizer .btn');

    summaryLength.addEventListener('input', () => {
        summaryLengthLabel.textContent = summaryLength.value + '%';
    });

    summarizeBtn.addEventListener('click', () => {
        const text = summarizer.value;
        if (text.trim().length === 0) {
            showNotification('Please enter some text to summarize.', 'error');
            return;
        }
        showNotification('Text summarized!');
    });

    // Readability Analyzer Tool
    const readabilityAnalyzer = document.querySelector('#readability textarea');
    const analyzeBtn = document.querySelector('#readability .btn');

    analyzeBtn.addEventListener('click', () => {
        const text = readabilityAnalyzer.value;
        if (text.trim().length === 0) {
            showNotification('Please enter some text to analyze.', 'error');
            return;
        }
        showNotification('Readability analysis complete!');
    });

    // Plagiarism Checker Tool
    const plagiarismChecker = document.querySelector('#plagiarism textarea');
    const checkPlagiarismBtn = document.querySelector('#plagiarism .btn');

    checkPlagiarismBtn.addEventListener('click', () => {
        const text = plagiarismChecker.value;
        if (text.trim().length === 0) {
            showNotification('Please enter some text to check for plagiarism.', 'error');
            return;
        }
        showNotification('Plagiarism check complete!');
    });

    // Notification System
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => notification.classList.add('show'), 10);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Add notification styles dynamically
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 2rem;
            border-radius: 5px;
            background: var(--primary-color);
            color: white;
            transform: translateX(120%);
            transition: transform 0.3s ease;
            z-index: 1000;
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification.error {
            background: #dc3545;
        }
    `;
    document.head.appendChild(style);
}); 