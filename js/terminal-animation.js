/**
 * Terminal Animation Script
 * Creates a typing effect that "deploys" mental clarity and calm
 * Runs continuously in a loop on the hero section
 */

(function() {
  // Terminal animation sequence - each line with its type and delay
  const terminalSequence = [
    { text: '> npm run deploy-calm', type: 'command', delay: 100 },
    { text: '', type: 'blank', delay: 300 },
    { text: '⚙️  Initializing mental health deployment...', type: 'info', delay: 800 },
    { text: '✓ Removing imposter syndrome', type: 'success', delay: 1200 },
    { text: '✓ Installing confidence@latest', type: 'success', delay: 1000 },
    { text: '✓ Configuring work-life balance', type: 'success', delay: 1000 },
    { text: '✓ Applying burnout prevention policies', type: 'success', delay: 1200 },
    { text: '', type: 'blank', delay: 400 },
    { text: '📦 Building sustainable practices...', type: 'info', delay: 1000 },
    { text: '  + clarity@2.0.0', type: 'package', delay: 600 },
    { text: '  + perspective@1.5.3', type: 'package', delay: 600 },
    { text: '  + resilience@3.2.1', type: 'package', delay: 600 },
    { text: '', type: 'blank', delay: 400 },
    { text: '✓ Deployment successful. Time to relax.', type: 'success', delay: 2000 }
  ];

  let currentLine = 0;
  let currentChar = 0;
  let isTyping = false;
  let terminalContent;
  let cursor;

  /**
   * Initialize the terminal animation
   * Sets up DOM references and starts the typing sequence
   */
  function initTerminal() {
    terminalContent = document.getElementById('terminal-content');
    cursor = document.querySelector('.terminal-cursor');
    
    if (!terminalContent) return;
    
    // Start the animation after a brief delay
    setTimeout(startTyping, 500);
  }

  /**
   * Start typing the current line character by character
   */
  function startTyping() {
    if (currentLine >= terminalSequence.length) {
      // Animation complete - restart after delay
      setTimeout(resetTerminal, 3000);
      return;
    }

    isTyping = true;
    const line = terminalSequence[currentLine];
    
    // Handle blank lines immediately
    if (line.type === 'blank') {
      addLine('', line.type);
      currentLine++;
      setTimeout(startTyping, line.delay);
      return;
    }

    // Type out the line character by character
    typeCharacter();
  }

  /**
   * Type a single character and schedule the next one
   */
  function typeCharacter() {
    const line = terminalSequence[currentLine];
    
    if (currentChar < line.text.length) {
      // Add character to current line
      const currentLineElement = terminalContent.lastElementChild;
      if (currentLineElement && currentLineElement.classList.contains('typing')) {
        currentLineElement.textContent = line.text.substring(0, currentChar + 1);
      } else {
        // Create new line element
        const lineElement = document.createElement('div');
        lineElement.className = `terminal-line terminal-${line.type} typing`;
        lineElement.textContent = line.text.substring(0, currentChar + 1);
        terminalContent.appendChild(lineElement);
      }
      
      currentChar++;
      
      // Random typing speed for more natural feel (30-80ms per character)
      const typingSpeed = Math.random() * 50 + 30;
      setTimeout(typeCharacter, typingSpeed);
    } else {
      // Line complete
      const currentLineElement = terminalContent.lastElementChild;
      if (currentLineElement) {
        currentLineElement.classList.remove('typing');
      }
      
      currentChar = 0;
      currentLine++;
      isTyping = false;
      
      // Delay before next line
      setTimeout(startTyping, line.delay);
    }
  }

  /**
   * Add a complete line to the terminal (for blank lines)
   */
  function addLine(text, type) {
    const lineElement = document.createElement('div');
    lineElement.className = `terminal-line terminal-${type}`;
    lineElement.textContent = text;
    terminalContent.appendChild(lineElement);
  }

  /**
   * Reset the terminal and restart the animation
   */
  function resetTerminal() {
    terminalContent.innerHTML = '';
    currentLine = 0;
    currentChar = 0;
    startTyping();
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTerminal);
  } else {
    initTerminal();
  }
})();
