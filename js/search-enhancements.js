// Enhanced Search Functionality
// Works with existing jQuery-based search in common.js
(function() {
  'use strict';
  
  const searchOverlay = document.querySelector('.search');
  const searchInput = document.getElementById('js-search-input');
  
  // Close search with Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && searchOverlay && searchOverlay.classList.contains('active')) {
      // Use jQuery to close (to work with existing code)
      $('.search').removeClass('active');
      clearSearch();
    }
  });
  
  // Open search with Ctrl/Cmd + K
  document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      // Use jQuery to open (to work with existing code)
      $('.search').addClass('active');
      
      // Focus search input after animation
      setTimeout(function() {
        if (searchInput) {
          searchInput.focus();
        }
      }, 300);
    }
  });
  
  // Close search when clicking outside
  if (searchOverlay) {
    searchOverlay.addEventListener('click', function(e) {
      if (e.target === searchOverlay) {
        $('.search').removeClass('active');
        clearSearch();
      }
    });
  }
  
  // Focus input when search opens
  if (searchOverlay) {
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.attributeName === 'class') {
          if (searchOverlay.classList.contains('active')) {
            setTimeout(function() {
              if (searchInput) {
                searchInput.focus();
              }
            }, 300);
          } else {
            clearSearch();
          }
        }
      });
    });
    
    observer.observe(searchOverlay, { attributes: true });
  }
  
  function clearSearch() {
    if (searchInput) {
      searchInput.value = '';
      // Trigger input event to clear results
      searchInput.dispatchEvent(new Event('input'));
    }
  }
  
  // Add search result count
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      setTimeout(function() {
        const resultsContainer = document.getElementById('js-results-container');
        if (resultsContainer) {
          const resultItems = resultsContainer.querySelectorAll('.search-item:not(.search-no-item)');
          const noResults = resultsContainer.querySelector('.search-no-item');
          
          // Add result count indicator
          let countIndicator = document.querySelector('.search-count');
          if (!countIndicator && resultItems.length > 0) {
            countIndicator = document.createElement('div');
            countIndicator.className = 'search-count';
            resultsContainer.parentNode.insertBefore(countIndicator, resultsContainer);
          }
          
          if (countIndicator) {
            if (resultItems.length > 0) {
              countIndicator.textContent = `Found ${resultItems.length} result${resultItems.length !== 1 ? 's' : ''}`;
              countIndicator.style.display = 'block';
            } else {
              countIndicator.style.display = 'none';
            }
          }
        }
      }, 100);
    });
  }
  
  // Highlight search terms in results
  function highlightSearchTerms() {
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    if (!searchTerm) return;
    
    const resultItems = document.querySelectorAll('.search-result-title, .search-result-excerpt');
    resultItems.forEach(function(item) {
      const text = item.textContent;
      const regex = new RegExp(`(${searchTerm})`, 'gi');
      const highlightedText = text.replace(regex, '<mark>$1</mark>');
      if (highlightedText !== text) {
        item.innerHTML = highlightedText;
      }
    });
  }
  
  // Add keyboard navigation for search results
  if (searchInput) {
    searchInput.addEventListener('keydown', function(e) {
      const resultsContainer = document.getElementById('js-results-container');
      if (!resultsContainer) return;
      
      const results = resultsContainer.querySelectorAll('.search-link');
      if (results.length === 0) return;
      
      const currentFocus = document.activeElement;
      let currentIndex = -1;
      
      // Find current focused result
      results.forEach(function(result, index) {
        if (result === currentFocus || result.contains(currentFocus)) {
          currentIndex = index;
        }
      });
      
      // Arrow down
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIndex = currentIndex < results.length - 1 ? currentIndex + 1 : 0;
        results[nextIndex].focus();
      }
      
      // Arrow up
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (currentIndex <= 0) {
          searchInput.focus();
        } else {
          results[currentIndex - 1].focus();
        }
      }
    });
  }
  
})();
