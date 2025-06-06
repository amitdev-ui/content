document.addEventListener('DOMContentLoaded', () => {
    const fileUpload = document.getElementById('file-upload');
    const urlInput = document.getElementById('url-input');
    const textInput = document.getElementById('text-input');
    const checkButton = document.getElementById('check-plagiarism');
    const clearButton = document.getElementById('clear-input');
    const resultsSection = document.getElementById('results-section');
    const loadingState = document.getElementById('loading-state');
    const progressBar = document.getElementById('progress-bar');
    const sourcesContainer = document.getElementById('sources-container');
    const highlightedText = document.getElementById('highlighted-text');

    // Sample API endpoint (replace with actual endpoint)
    const API_ENDPOINT = 'https://api.plagiarismchecker.com/v1/check';
    const API_KEY = ''; // Add your API key here

    // Handle file upload
    fileUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                textInput.value = event.target.result;
            };
            reader.readAsText(file);
        }
    });

    // Handle URL input
    urlInput.addEventListener('input', debounce(async (e) => {
        const url = e.target.value;
        if (isValidUrl(url)) {
            try {
                const response = await fetch(url);
                const text = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(text, 'text/html');
                textInput.value = doc.body.textContent.trim();
            } catch (error) {
                showError('Failed to fetch URL content');
            }
        }
    }, 1000));

    // Handle plagiarism check
    checkButton.addEventListener('click', async () => {
        const text = textInput.value.trim();
        if (!text) {
            showError('Please enter some text to check');
            return;
        }

        showLoading();
        try {
            const result = await checkPlagiarism(text);
            displayResults(result);
        } catch (error) {
            showError('Failed to check plagiarism');
        } finally {
            hideLoading();
        }
    });

    // Handle clear button
    clearButton.addEventListener('click', () => {
        textInput.value = '';
        urlInput.value = '';
        fileUpload.value = '';
        resultsSection.style.display = 'none';
    });

    // Utility functions
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    function showLoading() {
        loadingState.style.display = 'block';
        resultsSection.style.display = 'none';
        updateProgress(0);
    }

    function hideLoading() {
        loadingState.style.display = 'none';
        resultsSection.style.display = 'block';
    }

    function updateProgress(percent) {
        progressBar.style.width = `${percent}%`;
        progressBar.setAttribute('aria-valuenow', percent);
    }

    function showError(message) {
        // Implement error notification
        console.error(message);
    }

    async function checkPlagiarism(text) {
        // Simulate API call with progress updates
        return new Promise((resolve) => {
            let progress = 0;
            const interval = setInterval(() => {
                progress += 10;
                updateProgress(progress);
                if (progress >= 100) {
                    clearInterval(interval);
                    resolve(generateSampleResults(text));
                }
            }, 500);
        });
    }

    function generateSampleResults(text) {
        // Simulate plagiarism detection results
        const words = text.split(/\s+/);
        const totalWords = words.length;
        
        return {
            originalityScore: 85,
            plagiarizedPercent: 15,
            totalWords: totalWords,
            sources: [
                {
                    title: 'Sample Source 1',
                    url: 'https://example.com/1',
                    matchPercent: 8,
                    snippet: text.substring(0, 100)
                },
                {
                    title: 'Sample Source 2',
                    url: 'https://example.com/2',
                    matchPercent: 7,
                    snippet: text.substring(100, 200)
                }
            ],
            highlights: [
                {
                    text: text.substring(0, 50),
                    sourceIndex: 0
                },
                {
                    text: text.substring(100, 150),
                    sourceIndex: 1
                }
            ]
        };
    }

    function displayResults(results) {
        // Update originality score
        document.getElementById('originality-score').textContent = `${results.originalityScore}%`;
        document.getElementById('plagiarized-percent').textContent = `${results.plagiarizedPercent}%`;
        document.getElementById('words-analyzed').textContent = results.totalWords;

        // Display sources
        sourcesContainer.innerHTML = results.sources.map((source, index) => `
            <div class="source-item">
                <div class="source-icon">
                    <i class="fas fa-link"></i>
                </div>
                <div class="source-info">
                    <h4>${source.title}</h4>
                    <p>${source.url}</p>
                    <p class="source-snippet">${source.snippet}</p>
                </div>
                <span class="source-match">${source.matchPercent}% match</span>
            </div>
        `).join('');

        // Display highlighted text
        let highlightedContent = textInput.value;
        results.highlights.forEach((highlight, index) => {
            const highlightClass = `highlight-${index}`;
            highlightedContent = highlightedContent.replace(
                highlight.text,
                `<span class="highlight-match ${highlightClass}">${highlight.text}</span>`
            );
        });
        highlightedText.innerHTML = highlightedContent;

        // Show results section
        resultsSection.style.display = 'block';
    }
}); 