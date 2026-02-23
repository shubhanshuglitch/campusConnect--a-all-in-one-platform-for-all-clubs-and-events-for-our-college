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

  // Hamburger
  const hamburger = document.querySelector('.hamburger');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
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

// Run on every page
document.addEventListener('DOMContentLoaded', () => {
  setupNavbar();
  setupTheme();
  setupNavbarScroll();
});
