// Performance monitoring for Azure Topology page
// Tracks key metrics and logs performance data

if (typeof window !== 'undefined' && window.performance) {
  // Wait for page to fully load
  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = window.performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      const domReadyTime = perfData.domContentLoadedEventEnd - perfData.navigationStart;
      const renderTime = perfData.domComplete - perfData.domLoading;
      
      console.log('🚀 Azure Topology Performance Metrics:');
      console.log(`  Page Load Time: ${pageLoadTime}ms`);
      console.log(`  DOM Ready Time: ${domReadyTime}ms`);
      console.log(`  Render Time: ${renderTime}ms`);
      
      // Check for performance issues
      if (pageLoadTime > 3000) {
        console.warn('⚠️ Page load time exceeds 3 seconds');
      }
      
      // Log paint metrics if available
      if (window.performance.getEntriesByType) {
        const paintMetrics = window.performance.getEntriesByType('paint');
        paintMetrics.forEach(metric => {
          console.log(`  ${metric.name}: ${Math.round(metric.startTime)}ms`);
        });
      }
      
      // Log resource timing for images
      if (window.performance.getEntriesByType) {
        const resources = window.performance.getEntriesByType('resource');
        const images = resources.filter(r => r.initiatorType === 'img');
        if (images.length > 0) {
          const avgImageLoad = images.reduce((sum, img) => sum + img.duration, 0) / images.length;
          console.log(`  Average Image Load: ${Math.round(avgImageLoad)}ms (${images.length} images)`);
        }
      }
    }, 0);
  });
  
  // Monitor long tasks (if supported)
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            console.warn(`⚠️ Long task detected: ${Math.round(entry.duration)}ms`);
          }
        }
      });
      observer.observe({ entryTypes: ['longtask'] });
    } catch (e) {
      // Long task API not supported
    }
  }
}
