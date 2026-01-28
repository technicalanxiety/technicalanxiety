// Azure Topology Engine - Interactive controller for Azure-style architecture visualization
// Handles resource groups, articles, VNet peerings, and subscription vending

console.log('Azure Topology Engine loading...');

// State management
let selectedArticle = null;
let selectedConnections = [];

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing Azure topology...');
  
  const tooltip = document.getElementById('resourceTooltip');
  const resourceArticles = document.querySelectorAll('.resource-article');
  const resourceGroups = document.querySelectorAll('.resource-group');
  const peeringLines = document.querySelectorAll('.peering-line');
  const queueArticles = document.querySelectorAll('.queue-article');
  
  console.log('Found elements:', {
    tooltip: !!tooltip,
    resourceArticles: resourceArticles.length,
    resourceGroups: resourceGroups.length,
    peeringLines: peeringLines.length,
    queueArticles: queueArticles.length
  });
  
  if (!tooltip) {
    console.error('Tooltip element not found!');
    return;
  }
  
  // Build position map for VNet peering lines
  const buildPositionMap = () => {
    const positionMap = {};
    resourceArticles.forEach(article => {
      const id = article.dataset.articleId;
      const rect = article.querySelector('.resource-box, .resource-image');
      if (!rect) return;
      
      const x = parseFloat(rect.getAttribute('x')) + parseFloat(rect.getAttribute('width')) / 2;
      const y = parseFloat(rect.getAttribute('y')) + parseFloat(rect.getAttribute('height')) / 2;
      
      if (id && !isNaN(x) && !isNaN(y)) {
        positionMap[id] = { x, y };
      }
    });
    console.log('Position map built:', Object.keys(positionMap).length, 'resources');
    return positionMap;
  };
  
  const positionMap = buildPositionMap();
  
  // Get subscription boundaries for routing
  const getSubscriptionBoundaries = () => {
    const boundaries = [];
    document.querySelectorAll('.subscription-layer').forEach(layer => {
      const rect = layer.querySelector('rect');
      if (!rect) return;
      
      boundaries.push({
        subscription: layer.dataset.subscription,
        x: parseFloat(rect.getAttribute('x')),
        y: parseFloat(rect.getAttribute('y')),
        width: parseFloat(rect.getAttribute('width')),
        height: parseFloat(rect.getAttribute('height'))
      });
    });
    return boundaries;
  };
  
  const subscriptionBoundaries = getSubscriptionBoundaries();
  
  // Calculate routing path that goes around subscriptions
  const calculateRoutedPath = (from, to, peeringIndex, totalPeerings) => {
    if (!from || !to) return null;
    
    // Find which subscriptions the start and end points are in
    const fromSub = subscriptionBoundaries.find(b => 
      from.x >= b.x && from.x <= b.x + b.width &&
      from.y >= b.y && from.y <= b.y + b.height
    );
    
    const toSub = subscriptionBoundaries.find(b => 
      to.x >= b.x && to.x <= b.x + b.width &&
      to.y >= b.y && to.y <= b.y + b.height
    );
    
    // If in same subscription, direct line
    if (fromSub && toSub && fromSub.subscription === toSub.subscription) {
      return `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
    }
    
    // Route with proper vertical drops and horizontal routing lanes
    // Pattern: down → right → vertical travel → left → down
    
    // Calculate vertical lane position (right side of diagram) - all use same lane now
    const baseRouteX = Math.max(
      fromSub ? fromSub.x + fromSub.width + 30 : from.x + 100,
      toSub ? toSub.x + toSub.width + 30 : to.x + 100
    );
    const routeX = baseRouteX; // Remove offset, all lines use same vertical lane
    
    // Calculate vertical drop/rise distances
    // Drop from just inside the bottom of source subscription
    // Rise from just inside the bottom of target subscription
    const fromDropY = fromSub ? fromSub.y + fromSub.height - 10 : from.y + 30;
    const toRiseY = toSub ? toSub.y + toSub.height - 10 : to.y + 30;
    
    // Calculate horizontal exit/entry points (just outside subscription)
    const fromExitX = fromSub ? fromSub.x + fromSub.width + 10 : from.x + 50;
    const toEntryX = toSub ? toSub.x + toSub.width + 10 : to.x + 50;
    
    // Create path: down → right → vertical travel → left → UP to article
    const path = [
      `M ${from.x} ${from.y}`,        // Start at article
      `L ${from.x} ${fromDropY}`,     // Drop down vertically
      `L ${fromExitX} ${fromDropY}`,  // Exit subscription horizontally
      `L ${routeX} ${fromDropY}`,     // Go to routing lane
      `L ${routeX} ${toRiseY}`,       // Travel vertically in routing lane
      `L ${toEntryX} ${toRiseY}`,     // Approach target subscription
      `L ${to.x} ${toRiseY}`,         // Enter target area horizontally
      `L ${to.x} ${to.y}`             // Rise UP to target article
    ].join(' ');
    
    return path;
  };
  
  // Update VNet peering line positions with routing
  const updatePeeringLines = () => {
    let updated = 0;
    const peeringElements = Array.from(peeringLines);
    
    peeringElements.forEach((line, index) => {
      const from = line.dataset.from;
      const to = line.dataset.to;
      if (positionMap[from] && positionMap[to]) {
        const path = calculateRoutedPath(
          positionMap[from], 
          positionMap[to],
          index,
          peeringElements.length
        );
        if (path) {
          // Convert line to path element if needed
          if (line.tagName.toLowerCase() === 'line') {
            // Create a path element to replace the line
            const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            pathElement.setAttribute('d', path);
            pathElement.setAttribute('class', line.getAttribute('class'));
            pathElement.setAttribute('data-from', from);
            pathElement.setAttribute('data-to', to);
            pathElement.setAttribute('stroke', line.getAttribute('stroke'));
            pathElement.setAttribute('stroke-width', line.getAttribute('stroke-width'));
            pathElement.setAttribute('stroke-dasharray', line.getAttribute('stroke-dasharray'));
            pathElement.setAttribute('opacity', line.getAttribute('opacity'));
            pathElement.setAttribute('fill', 'none');
            
            line.parentNode.replaceChild(pathElement, line);
          } else {
            line.setAttribute('d', path);
          }
          updated++;
        }
      }
    });
    console.log('Peering lines updated with routing:', updated);
  };
  
  updatePeeringLines();
  
  // Resource article interactions
  resourceArticles.forEach(article => {
    const resourceBox = article.querySelector('.resource-box, .resource-image');
    
    if (!resourceBox) return;
    
    article.addEventListener('mouseenter', (e) => {
      const title = article.dataset.articleTitle;
      const description = article.dataset.articleDescription;
      const series = article.dataset.series;
      const seriesPart = article.dataset.seriesPart;
      
      // Update tooltip content
      tooltip.querySelector('.tooltip-title').textContent = title || 'No title';
      tooltip.querySelector('.tooltip-description').textContent = description || 'No description';
      
      let metaText = '';
      if (series && seriesPart) {
        metaText = `${series} - Part ${seriesPart}`;
      }
      const rgName = article.closest('.resource-group')?.dataset.rgName;
      if (rgName) {
        metaText += (metaText ? ' | ' : '') + `Resource Group: ${rgName}`;
      }
      
      tooltip.querySelector('.tooltip-meta').textContent = metaText;
      tooltip.classList.add('visible');
      
      // Highlight peerings for this article
      const articleId = article.dataset.articleId;
      highlightPeerings(articleId, true);
      
      // Highlight the resource box
      resourceBox.style.filter = 'brightness(1.5)';
      resourceBox.style.strokeWidth = '3';
    });
    
    article.addEventListener('mousemove', (e) => {
      // Follow mouse cursor
      const x = e.clientX + 15;
      const y = e.clientY + 15;
      tooltip.style.left = `${x}px`;
      tooltip.style.top = `${y}px`;
    });
    
    article.addEventListener('mouseleave', () => {
      tooltip.classList.remove('visible');
      tooltip.style.transform = ''; // Reset transform
      highlightPeerings(null, false);
      resourceBox.style.filter = '';
      resourceBox.style.strokeWidth = '';
    });
  });
  
  // Resource Group interactions
  resourceGroups.forEach(rg => {
    const boundary = rg.querySelector('.rg-boundary');
    if (!boundary) return;
    
    rg.addEventListener('mouseenter', () => {
      boundary.style.strokeWidth = '3';
      boundary.style.filter = 'brightness(1.2)';
      
      // Highlight all resources in this RG
      const resources = rg.querySelectorAll('.resource-box');
      resources.forEach(r => {
        r.style.opacity = '1';
        r.style.filter = 'brightness(1.3)';
      });
    });
    
    rg.addEventListener('mouseleave', () => {
      boundary.style.strokeWidth = '';
      boundary.style.filter = '';
      
      const resources = rg.querySelectorAll('.resource-box');
      resources.forEach(r => {
        r.style.opacity = '';
        r.style.filter = '';
      });
    });
    
    rg.addEventListener('click', (e) => {
      // Don't trigger if clicking on a specific resource
      if (e.target.closest('.resource-article')) return;
      
      const rgName = rg.dataset.rgName;
      const subscription = rg.dataset.subscription;
      console.log('Resource Group clicked:', { rgName, subscription });
      
      // Future: Could expand to show all resources in detail
      // For now, just log
    });
  });
  
  // Highlight VNet peerings
  const highlightPeerings = (articleId, highlight) => {
    if (!articleId || !highlight) {
      // Reset all peerings to default brightness
      peeringLines.forEach(line => {
        line.style.opacity = '0.8';
        line.style.strokeWidth = '2';
      });
      
      // Reset all resource boxes
      resourceArticles.forEach(article => {
        const box = article.querySelector('.resource-box');
        if (box) {
          box.style.opacity = '';
        }
      });
      return;
    }
    
    // Dim all resources initially
    resourceArticles.forEach(article => {
      const box = article.querySelector('.resource-box');
      if (box && article.dataset.articleId !== articleId) {
        box.style.opacity = '0.3';
      }
    });
    
    // Highlight connected peerings
    const connectedIds = new Set([articleId]);
    peeringLines.forEach(line => {
      if (line.dataset.from === articleId || line.dataset.to === articleId) {
        line.style.opacity = '1';
        line.style.strokeWidth = '4';
        connectedIds.add(line.dataset.from);
        connectedIds.add(line.dataset.to);
      } else {
        line.style.opacity = '0.2';
      }
    });
    
    // Brighten connected resources
    resourceArticles.forEach(article => {
      const box = article.querySelector('.resource-box');
      if (box && connectedIds.has(article.dataset.articleId)) {
        box.style.opacity = '1';
      }
    });
  };
  
  // Queue article hover effects
  queueArticles.forEach(article => {
    article.addEventListener('mouseenter', () => {
      article.style.background = 'rgba(0, 120, 212, 0.2)';
      article.style.cursor = 'pointer';
    });
    
    article.addEventListener('mouseleave', () => {
      article.style.background = '';
      article.style.cursor = '';
    });
    
    // Future: Could show preview or more details
  });
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      tooltip.classList.remove('visible');
      highlightPeerings(null, false);
    }
  });
  
  // Window resize handler
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const newPositionMap = buildPositionMap();
      Object.assign(positionMap, newPositionMap);
      updatePeeringLines();
    }, 250);
  });
  
  // Click handler for persistent selection
  const selectArticle = (article) => {
    // Clear previous selection
    if (selectedArticle) {
      selectedArticle.classList.remove('selected');
    }
    
    // Set new selection
    selectedArticle = article;
    article.classList.add('selected');
    
    // Get article data
    const articleId = article.dataset.articleId;
    const title = article.dataset.articleTitle;
    const description = article.dataset.articleDescription;
    const url = article.dataset.articleUrl;
    const series = article.dataset.series;
    const seriesPart = article.dataset.seriesPart;
    const tags = article.dataset.articleTags ? article.dataset.articleTags.split(',') : [];
    
    // Get subscription and resource group
    const rgElement = article.closest('.resource-group');
    const subElement = article.closest('.subscription-layer');
    const rgName = rgElement?.dataset.rgName || 'Unknown';
    const subName = subElement?.dataset.subscription || 'Unknown';
    
    // Find connections
    selectedConnections = [];
    peeringLines.forEach(line => {
      if (line.dataset.from === articleId || line.dataset.to === articleId) {
        line.classList.add('highlighted');
        
        const connectedId = line.dataset.from === articleId ? line.dataset.to : line.dataset.from;
        const connectedArticle = Array.from(resourceArticles).find(a => a.dataset.articleId === connectedId);
        
        if (connectedArticle) {
          const connectedTags = connectedArticle.dataset.articleTags ? connectedArticle.dataset.articleTags.split(',') : [];
          const sharedTags = tags.filter(t => connectedTags.includes(t));
          
          selectedConnections.push({
            id: connectedId,
            title: connectedArticle.dataset.articleTitle,
            url: connectedArticle.dataset.articleUrl,
            sharedTags: sharedTags,
            subscription: connectedArticle.closest('.subscription-layer')?.dataset.subscription,
            resourceGroup: connectedArticle.closest('.resource-group')?.dataset.rgName
          });
        }
      } else {
        line.classList.remove('highlighted');
      }
    });
    
    // Update vending machine sections
    showDeployingSection(title);
    showDeployedSection({
      title,
      description,
      url,
      series,
      seriesPart,
      tags,
      subscription: subName,
      resourceGroup: rgName,
      connections: selectedConnections
    });
    
    console.log('Article selected:', { title, connections: selectedConnections.length });
  };
  
  // Show deploying section
  const showDeployingSection = (title) => {
    const deployingSection = document.getElementById('deployingSection');
    const deployingContent = document.getElementById('deployingContent');
    
    deployingContent.innerHTML = `
      <span class="deploying-icon">⚡</span>
      <span class="deploying-title">${title}</span>
    `;
    
    deployingSection.style.display = 'block';
  };
  
  // Show deployed section (context panel)
  const showDeployedSection = (data) => {
    const deployedSection = document.getElementById('deployedSection');
    const breadcrumb = document.getElementById('breadcrumb');
    const articleDetails = document.getElementById('articleDetails');
    const connectionsList = document.getElementById('connectionsList');
    
    // Build breadcrumb
    const subLabel = {
      mentalHealth: 'Mental Health',
      leadership: 'Leadership',
      azure: 'Azure'
    }[data.subscription] || data.subscription;
    
    breadcrumb.innerHTML = `
      <span class="breadcrumb-item">${subLabel}</span>
      <span class="breadcrumb-separator">→</span>
      <span class="breadcrumb-item">${data.resourceGroup}</span>
      <span class="breadcrumb-separator">→</span>
      <span class="breadcrumb-current">${data.title}</span>
    `;
    
    // Build article details
    let detailsHTML = `<h4>${data.title}</h4>`;
    if (data.description) {
      detailsHTML += `<p class="article-description">${data.description}</p>`;
    }
    
    detailsHTML += `<div class="article-meta">`;
    if (data.series && data.seriesPart) {
      detailsHTML += `<span>📚 ${data.series} - Part ${data.seriesPart}</span>`;
    }
    if (data.tags && data.tags.length > 0) {
      detailsHTML += `<span>🏷️ ${data.tags.length} tags</span>`;
    }
    detailsHTML += `</div>`;
    detailsHTML += `<a href="${data.url}" class="article-link">Read Article →</a>`;
    
    articleDetails.innerHTML = detailsHTML;
    
    // Build connections list
    if (data.connections.length === 0) {
      connectionsList.innerHTML = '<div class="no-connections">No cross-subscription connections found</div>';
    } else {
      connectionsList.innerHTML = data.connections.map(conn => {
        const connSubLabel = {
          mentalHealth: 'Mental Health',
          leadership: 'Leadership',
          azure: 'Azure'
        }[conn.subscription] || conn.subscription;
        
        return `
          <div class="connection-item" data-article-id="${conn.id}">
            <div class="connection-title">${conn.title}</div>
            <div class="connection-reason">
              ${connSubLabel} → ${conn.resourceGroup}
            </div>
            ${conn.sharedTags.length > 0 ? `
              <div class="connection-tags">
                ${conn.sharedTags.map(tag => `<span class="connection-tag">${tag}</span>`).join('')}
              </div>
            ` : ''}
          </div>
        `;
      }).join('');
      
      // Add click handlers to connection items
      connectionsList.querySelectorAll('.connection-item').forEach(item => {
        item.addEventListener('click', () => {
          const connectedId = item.dataset.articleId;
          const connectedArticle = Array.from(resourceArticles).find(a => a.dataset.articleId === connectedId);
          if (connectedArticle) {
            selectArticle(connectedArticle);
            // Scroll to article in diagram
            connectedArticle.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        });
      });
    }
    
    deployedSection.style.display = 'block';
  };
  
  // Clear selection
  const clearSelection = () => {
    if (selectedArticle) {
      selectedArticle.classList.remove('selected');
      selectedArticle = null;
    }
    
    selectedConnections = [];
    
    peeringLines.forEach(line => {
      line.classList.remove('highlighted');
    });
    
    document.getElementById('deployingSection').style.display = 'none';
    document.getElementById('deployedSection').style.display = 'none';
    
    console.log('Selection cleared');
  };
  
  // Add click handlers to articles
  resourceArticles.forEach(article => {
    article.style.cursor = 'pointer';
    article.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      // If clicking the same article, clear selection
      if (selectedArticle === article) {
        clearSelection();
      } else {
        selectArticle(article);
      }
    });
  });
  
  // Close context button
  const closeContextBtn = document.getElementById('closeContext');
  if (closeContextBtn) {
    closeContextBtn.addEventListener('click', clearSelection);
  }
  
  // ESC key to clear selection (update existing handler)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      tooltip.classList.remove('visible');
      highlightPeerings(null, false);
      clearSelection();
    }
  });
  
  console.log('Azure Topology Engine initialized successfully');
});
