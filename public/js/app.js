// ===== CampusConnect API Helper =====
const API_BASE = '/api';

const api = {
  getToken() {
    return localStorage.getItem('cc_token');
  },

  setToken(token) {
    localStorage.setItem('cc_token', token);
  },

  setUser(user) {
    localStorage.setItem('cc_user', JSON.stringify(user));
  },

  getUser() {
    const u = localStorage.getItem('cc_user');
    return u ? JSON.parse(u) : null;
  },

  logout() {
    localStorage.removeItem('cc_token');
    localStorage.removeItem('cc_user');
    // Close mobile menu if open
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
      navLinks.classList.remove('open');
    }
    window.location.href = '/login';
  },

  isLoggedIn() {
    return !!this.getToken();
  },

  async request(endpoint, options = {}) {
    const headers = { ...options.headers };
    const token = this.getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;

    // Don't set Content-Type for FormData
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    return data;
  },

  // Auth
  register: (body) => api.request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => api.request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  getMe: () => api.request('/auth/me'),

  // Clubs
  getClubs: (params = '') => api.request(`/clubs${params ? '?' + params : ''}`),
  getClub: (id) => api.request(`/clubs/${id}`),
  createClub: (formData) => api.request('/clubs', { method: 'POST', body: formData }),
  updateClub: (id, formData) => api.request(`/clubs/${id}`, { method: 'PUT', body: formData }),

  // Events
  getEvents: (params = '') => api.request(`/events${params ? '?' + params : ''}`),
  getEvent: (id) => api.request(`/events/${id}`),
  createEvent: (formData) => api.request('/events', { method: 'POST', body: formData }),
  updateEvent: (id, formData) => api.request(`/events/${id}`, { method: 'PUT', body: formData }),
  deleteEvent: (id) => api.request(`/events/${id}`, { method: 'DELETE' }),
  toggleInterest: (id) => api.request(`/events/${id}/interest`, { method: 'POST', body: JSON.stringify({}) }),
};

// ===== Toast Notifications =====
function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = { success: '✓', error: '✕', warning: '⚠' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type] || ''}</span> ${message}`;
  container.appendChild(toast);

  setTimeout(() => toast.remove(), 3000);
}

// ===== Navbar Setup =====
function setupNavbar() {
  const user = api.getUser();
  const navAuth = document.querySelector('.nav-auth');
  const navLinks = document.querySelector('.nav-links');

  if (navAuth) {
    if (user) {
      let dashLink = '/dashboard';
      if (user.role === 'masterAdmin') dashLink = '/master-admin';
      else if (user.role === 'clubAdmin') dashLink = '/admin';
      
      navAuth.innerHTML = `
        <span style="color: var(--text-secondary); font-size: 0.85rem;">Hi, ${user.name}</span>
        <a href="${dashLink}" class="btn btn-outline btn-sm">Dashboard</a>
        <button onclick="api.logout()" class="btn btn-ghost btn-sm">Logout</button>
      `;
    } else {
      navAuth.innerHTML = `
        <a href="/login" class="btn btn-outline btn-sm">Log In</a>
        <a href="/login" class="btn btn-primary btn-sm">Sign Up</a>
      `;
    }
  }

  // Add auth buttons to mobile menu
  if (navLinks) {
    // Remove any existing mobile auth items
    const existingMobileAuth = navLinks.querySelectorAll('.mobile-auth-item');
    existingMobileAuth.forEach(item => item.remove());
    
    // Add divider and auth options for mobile
    const divider = document.createElement('li');
    divider.className = 'mobile-auth-item nav-divider';
    divider.style.cssText = 'height: 1px; background: var(--border-glass); margin: 0.5rem 0;';
    navLinks.appendChild(divider);
    
    if (user) {
      let dashLink = '/dashboard';
      if (user.role === 'masterAdmin') dashLink = '/master-admin';
      else if (user.role === 'clubAdmin') dashLink = '/admin';
      
      const welcomeItem = document.createElement('li');
      welcomeItem.className = 'mobile-auth-item';
      welcomeItem.innerHTML = `<span style="color: var(--text-muted); font-size: 0.85rem; padding: 0.5rem 1rem; display: block;">Hi, ${user.name}!</span>`;
      navLinks.appendChild(welcomeItem);
      
      const dashItem = document.createElement('li');
      dashItem.className = 'mobile-auth-item';
      dashItem.innerHTML = `<a href="${dashLink}">📊 Dashboard</a>`;
      navLinks.appendChild(dashItem);
      
      const logoutItem = document.createElement('li');
      logoutItem.className = 'mobile-auth-item';
      logoutItem.innerHTML = `<a href="#" onclick="api.logout(); return false;">🚪 Logout</a>`;
      navLinks.appendChild(logoutItem);
    } else {
      const loginItem = document.createElement('li');
      loginItem.className = 'mobile-auth-item';
      loginItem.innerHTML = `<a href="/login">🔐 Log In</a>`;
      navLinks.appendChild(loginItem);
      
      const signupItem = document.createElement('li');
      signupItem.className = 'mobile-auth-item';
      signupItem.innerHTML = `<a href="/login" style="background: rgba(99, 102, 241, 0.1); color: var(--accent-1); border-radius: var(--radius-md);">✨ Sign Up</a>`;
      navLinks.appendChild(signupItem);
    }
  }

  // Hamburger with touch support
  const hamburger = document.querySelector('.hamburger');
  if (hamburger && navLinks) {
    const toggleMenu = (e) => {
      e.preventDefault();
      e.stopPropagation();
      navLinks.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', navLinks.classList.contains('open'));
    };
    
    hamburger.addEventListener('click', toggleMenu);
    hamburger.addEventListener('touchend', toggleMenu, { passive: false });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('open') && 
          !navLinks.contains(e.target) && 
          !hamburger.contains(e.target)) {
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
    
    // Close menu when link is clicked (including mobile auth items)
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', (e) => {
        // Don't close for logout button to ensure it executes
        if (!link.getAttribute('onclick')?.includes('logout')) {
          navLinks.classList.remove('open');
          hamburger.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // Active link
  if (navLinks) {
    const path = window.location.pathname;
    navLinks.querySelectorAll('a').forEach(a => {
      if (a.getAttribute('href') === path) a.classList.add('active');
    });
  }
}

// ===== Touch & Swipe Support =====
function addSwipeSupport() {
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;
  
  const navLinks = document.querySelector('.nav-links');
  const hamburger = document.querySelector('.hamburger');
  
  if (navLinks && hamburger) {
    document.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });
    
    document.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
      const swipeThreshold = 50;
      const diffX = touchEndX - touchStartX;
      const diffY = Math.abs(touchEndY - touchStartY);
      
      // Only trigger if horizontal swipe is greater than vertical
      if (diffY < 100) {
        // Swipe right to open menu
        if (diffX > swipeThreshold && touchStartX < 50 && !navLinks.classList.contains('open')) {
          navLinks.classList.add('open');
          hamburger.setAttribute('aria-expanded', 'true');
        }
        // Swipe left to close menu
        else if (diffX < -swipeThreshold && navLinks.classList.contains('open')) {
          navLinks.classList.remove('open');
          hamburger.setAttribute('aria-expanded', 'false');
        }
      }
    }
  }
}

// ===== Utility =====
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getDateParts(dateStr) {
  const d = new Date(dateStr);
  return {
    day: d.getDate(),
    month: d.toLocaleDateString('en-US', { month: 'short' }),
    year: d.getFullYear()
  };
}

function truncate(str, len = 100) {
  return str.length > len ? str.substring(0, len) + '...' : str;
}

function getCategoryEmoji(cat) {
  const map = {
    'Coding': '💻', 'Music': '🎵', 'Sports': '⚽', 'Arts': '🎨',
    'Science': '🔬', 'Literature': '📚', 'Social Service': '🤝',
    'Photography': '📷', 'Dance': '💃', 'Other': '✨'
  };
  return map[cat] || '✨';
}

// ===== Theme Toggle =====
function setupTheme() {
  const toggle = document.getElementById('theme-toggle');
  const html = document.documentElement;
  
  // Check saved theme or system preference
  const savedTheme = localStorage.getItem('cc_theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
  
  html.setAttribute('data-theme', initialTheme);
  
  if (toggle) {
    toggle.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      const newTheme = current === 'dark' ? 'light' : 'dark';
      
      html.setAttribute('data-theme', newTheme);
      localStorage.setItem('cc_theme', newTheme);
      
      // Animate toggle button
      toggle.style.transform = 'rotate(360deg) scale(1.1)';
      setTimeout(() => toggle.style.transform = '', 300);
    });
  }
  
  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('cc_theme')) {
      html.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    }
  });
}

// ===== Navbar Scroll Effect =====
function setupNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }
}

// ===== Mobile Optimizations =====
function setupMobileOptimizations() {
  // Prevent double-tap zoom on buttons
  let lastTouchEnd = 0;
  document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
      e.preventDefault();
    }
    lastTouchEnd = now;
  }, { passive: false });
  
  // Improve scroll performance on mobile
  let ticking = false;
  let lastScrollY = window.scrollY;
  
  window.addEventListener('scroll', () => {
    lastScrollY = window.scrollY;
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleScroll(lastScrollY);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
  
  function handleScroll(scrollY) {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      if (scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  }
  
  // Add active state visual feedback for touch
  document.querySelectorAll('.btn, .card, .filter-chip').forEach(element => {
    element.addEventListener('touchstart', function() {
      this.style.opacity = '0.8';
    }, { passive: true });
    
    element.addEventListener('touchend', function() {
      this.style.opacity = '';
    }, { passive: true });
    
    element.addEventListener('touchcancel', function() {
      this.style.opacity = '';
    }, { passive: true });
  });
}

// ===== Viewport Height Fix for Mobile =====
function setVhProperty() {
  // Fix for mobile viewport height issues
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Run on every page
document.addEventListener('DOMContentLoaded', () => {
  setupNavbar();
  setupTheme();
  setupNavbarScroll();
  addSwipeSupport();
  setupMobileOptimizations();
  setVhProperty();
});

// Update vh on resize and orientation change
window.addEventListener('resize', setVhProperty);
window.addEventListener('orientationchange', () => {
  setTimeout(setVhProperty, 100);
});
