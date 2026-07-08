// Vercel Web Analytics initialization
// This script initializes Vercel Analytics for tracking page views

(function() {
  // Import the inject function from @vercel/analytics
  // For static sites, we use the queue-based approach
  window.va = window.va || function () { 
    (window.vaq = window.vaq || []).push(arguments); 
  };
  
  // Create script element to load analytics
  var script = document.createElement('script');
  script.defer = true;
  script.src = '/_vercel/insights/script.js';
  
  // Append to document head
  if (document.head) {
    document.head.appendChild(script);
  }
})();
