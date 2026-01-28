// Topology Engine - Interactive visualization controller
// Handles node interactions, tooltips, and article navigation

console.log('Topology engine loading...');

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing topology engine...');
  
  const tooltip = document.getElementById('nodeTooltip');
  const articleNodes = document.querySelectorAll('.node-circle');
  const seriesLinks = document.querySelectorAll('.series-link');
  const thematicLinks = document.querySelectorAll('.thematic-link');
  
  console.log('Found elements:', {
    tooltip: !!tooltip,
    articleNodes: articleNodes.length,
    seriesLinks: seriesLinks.length,
    thematicLinks: thematicLinks.length
  });
  
  if (!tooltip) {
    console.error('Tooltip element not found!');
    return;
  }
  
  // Build position map for connecting lines
  const buildPositionMap = () => {
    const positionMap = {};
    articleNodes.forEach(node => {
      const parent = node.closest('.article-node');
      if (!parent) {
        console.warn('Node missing parent .article-node:', node);
        return;
      }
      const id = parent.dataset.articleId;
      const cx = parseFloat(node.getAttribute('cx'));
      const cy = parseFloat(node.getAttribute('cy'));
      if (id && !isNaN(cx) && !isNaN(cy)) {
        positionMap[id] = { x: cx, y: cy };
      }
    });
    console.log('Position map built:', Object.keys(positionMap).length, 'nodes');
    return positionMap;
  };
  
  const positionMap = buildPositionMap();
  
  // Update connection line positions
  const updateConnections = () => {
    let seriesUpdated = 0;
    let thematicUpdated = 0;
    
    seriesLinks.forEach(link => {
      const from = link.dataset.from;
      const to = link.dataset.to;
      if (positionMap[from] && positionMap[to]) {
        link.setAttribute('x1', positionMap[from].x);
        link.setAttribute('y1', positionMap[from].y);
        link.setAttribute('x2', positionMap[to].x);
        link.setAttribute('y2', positionMap[to].y);
        seriesUpdated++;
      }
    });
    
    thematicLinks.forEach(link => {
      const from = link.dataset.from;
      const to = link.dataset.to;
      if (positionMap[from] && positionMap[to]) {
        link.setAttribute('x1', positionMap[from].x);
        link.setAttribute('y1', positionMap[from].y);
        link.setAttribute('x2', positionMap[to].x);
        link.setAttribute('y2', positionMap[to].y);
        thematicUpdated++;
      }
    });
    
    console.log('Connections updated:', { series: seriesUpdated, thematic: thematicUpdated });
  };
  
  updateConnections();
  
  // Node hover interactions
  articleNodes.forEach(node => {
    node.addEventListener('mouseenter', (e) => {
      const title = node.dataset.title;
      const description = node.dataset.description;
      const series = node.dataset.series;
      const seriesPart = node.dataset.seriesPart;
      
      console.log('Node hover:', { title, description, series, seriesPart });
      
      // Update tooltip content
      tooltip.querySelector('.tooltip-title').textContent = title || 'No title';
      tooltip.querySelector('.tooltip-description').textContent = description || 'No description';
      
      let metaText = '';
      if (series && seriesPart) {
        metaText = `${series} - Part ${seriesPart}`;
      }
      tooltip.querySelector('.tooltip-meta').textContent = metaText;
      
      // Position tooltip near cursor - use fixed positioning relative to viewport
      const svgRect = node.closest('svg').getBoundingClientRect();
      const cx = parseFloat(node.getAttribute('cx'));
      const cy = parseFloat(node.getAttribute('cy'));
      
      // Calculate actual screen position from SVG coordinates
      const svgWidth = 1200;
      const svgHeight = 800;
      const scaleX = svgRect.width / svgWidth;
      const scaleY = svgRect.height / svgHeight;
      
      const screenX = svgRect.left + (cx * scaleX);
      const screenY = svgRect.top + (cy * scaleY);
      
      tooltip.style.left = `${screenX + 20}px`;
      tooltip.style.top = `${screenY - 20}px`;
      
      // Show tooltip
      tooltip.classList.add('visible');
      
      // Highlight connected nodes
      const articleId = node.closest('.article-node')?.dataset.articleId;
      if (articleId) {
        highlightConnections(articleId, true);
      }
    });
    
    node.addEventListener('mouseleave', () => {
      tooltip.classList.remove('visible');
      highlightConnections(null, false);
    });
    
    node.addEventListener('click', (e) => {
      e.preventDefault();
      const url = node.dataset.url;
      console.log('Node clicked, URL:', url);
      if (url) {
        window.location.href = url;
      } else {
        console.warn('No URL found for node');
      }
    });
  });
  
  // Highlight series and thematic connections
  const highlightConnections = (articleId, highlight) => {
    if (!articleId) {
      // Reset all highlights
      seriesLinks.forEach(link => {
        link.style.opacity = '0.5';
        link.style.strokeWidth = '2';
      });
      thematicLinks.forEach(link => {
        link.style.opacity = '0.2';
        link.style.strokeWidth = '1';
      });
      articleNodes.forEach(node => {
        node.style.opacity = '1';
      });
      return;
    }
    
    if (highlight) {
      // Dim all nodes initially
      articleNodes.forEach(node => {
        node.style.opacity = '0.3';
      });
      
      // Find and highlight connected nodes
      const connectedIds = new Set([articleId]);
      
      seriesLinks.forEach(link => {
        if (link.dataset.from === articleId || link.dataset.to === articleId) {
          link.style.opacity = '1';
          link.style.strokeWidth = '4';
          connectedIds.add(link.dataset.from);
          connectedIds.add(link.dataset.to);
        } else {
          link.style.opacity = '0.1';
        }
      });
      
      thematicLinks.forEach(link => {
        if (link.dataset.from === articleId || link.dataset.to === articleId) {
          link.style.opacity = '0.6';
          link.style.strokeWidth = '2';
          connectedIds.add(link.dataset.from);
          connectedIds.add(link.dataset.to);
        } else {
          link.style.opacity = '0.05';
        }
      });
      
      // Brighten connected nodes
      articleNodes.forEach(node => {
        const nodeId = node.closest('.article-node')?.dataset.articleId;
        if (nodeId && connectedIds.has(nodeId)) {
          node.style.opacity = '1';
        }
      });
    }
  };
  
  // Cluster center interactions
  const clusterCenters = document.querySelectorAll('.cluster-center');
  clusterCenters.forEach(center => {
    center.addEventListener('click', (e) => {
      const cluster = center.closest('.cluster')?.dataset.cluster;
      if (cluster) {
        console.log('Cluster clicked:', cluster);
        zoomToCluster(cluster);
      }
    });
  });
  
  // About Me center node interaction
  const aboutMeNode = document.querySelector('.about-me-circle');
  if (aboutMeNode) {
    aboutMeNode.parentElement.addEventListener('click', () => {
      window.location.href = '/about/';
    });
    
    aboutMeNode.parentElement.addEventListener('mouseenter', () => {
      aboutMeNode.setAttribute('r', '30');
      aboutMeNode.style.filter = 'brightness(1.2) drop-shadow(0 0 20px #7DFDFE)';
    });
    
    aboutMeNode.parentElement.addEventListener('mouseleave', () => {
      aboutMeNode.setAttribute('r', '25');
      aboutMeNode.style.filter = '';
    });
  }
  
  // Zoom to cluster (future enhancement)
  const zoomToCluster = (clusterName) => {
    console.log(`Zoom to cluster: ${clusterName}`);
    // TODO: Implement smooth zoom/pan to cluster
    // This would involve SVG transform animations
  };
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      tooltip.classList.remove('visible');
      highlightConnections(null, false);
    }
  });
  
  // Window resize handler
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      updateConnections();
    }, 250);
  });
  
  console.log('Topology engine initialized successfully');
});

// Article link hover highlighting
const articleLinks = document.querySelectorAll('.article-link');
articleLinks.forEach(link => {
  link.addEventListener('mouseenter', () => {
    const articleId = link.dataset.articleId;
    if (articleId) {
      // Highlight the corresponding node
      const targetNode = document.querySelector(`.article-node[data-article-id="${articleId}"] .node-circle`);
      if (targetNode) {
        targetNode.style.filter = 'brightness(2) drop-shadow(0 0 15px currentColor)';
        targetNode.setAttribute('r', '12');
      }
      // Add highlight class to link
      link.classList.add('highlight');
    }
  });
  
  link.addEventListener('mouseleave', () => {
    const articleId = link.dataset.articleId;
    if (articleId) {
      // Reset node
      const targetNode = document.querySelector(`.article-node[data-article-id="${articleId}"] .node-circle`);
      if (targetNode) {
        targetNode.style.filter = '';
        targetNode.setAttribute('r', '8');
      }
      // Remove highlight class
      link.classList.remove('highlight');
    }
  });
});

// Add series labels to connection lines
const addSeriesLabels = () => {
  const svg = document.querySelector('.topology-graph svg');
  if (!svg) return;
  
  // Create a group for series labels if it doesn't exist
  let labelsGroup = svg.querySelector('.series-labels');
  if (!labelsGroup) {
    labelsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    labelsGroup.classList.add('series-labels');
    svg.appendChild(labelsGroup);
  }
  
  // Clear existing labels
  labelsGroup.innerHTML = '';
  
  // Track series we've already labeled to avoid duplicates
  const labeledSeries = new Set();
  
  seriesLinks.forEach(link => {
    const seriesName = link.dataset.series;
    if (!seriesName || labeledSeries.has(seriesName)) return;
    
    const x1 = parseFloat(link.getAttribute('x1'));
    const y1 = parseFloat(link.getAttribute('y1'));
    const x2 = parseFloat(link.getAttribute('x2'));
    const y2 = parseFloat(link.getAttribute('y2'));
    
    if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2)) return;
    
    // Calculate midpoint
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    
    // Create text label
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', midX);
    text.setAttribute('y', midY - 5);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('fill', '#7DFDFE');
    text.setAttribute('font-size', '11');
    text.setAttribute('font-weight', 'bold');
    text.setAttribute('opacity', '0.8');
    text.style.pointerEvents = 'none';
    text.textContent = seriesName;
    
    // Add background rect for readability
    const bbox = text.getBBox ? text.getBBox() : { x: midX - 40, y: midY - 15, width: 80, height: 14 };
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', bbox.x - 4);
    rect.setAttribute('y', bbox.y - 2);
    rect.setAttribute('width', bbox.width + 8);
    rect.setAttribute('height', bbox.height + 4);
    rect.setAttribute('fill', 'rgba(0, 0, 0, 0.8)');
    rect.setAttribute('rx', '3');
    rect.style.pointerEvents = 'none';
    
    labelsGroup.appendChild(rect);
    labelsGroup.appendChild(text);
    
    labeledSeries.add(seriesName);
  });
  
  console.log('Series labels added:', labeledSeries.size);
};

// Add labels after connections are updated
setTimeout(addSeriesLabels, 100);

console.log('Article link highlighting and series labels initialized');
