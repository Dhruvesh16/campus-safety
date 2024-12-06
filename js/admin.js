// admin.js

// DOM Elements
const loginSection = document.getElementById('loginSection');
const dashboardSection = document.getElementById('dashboardSection');
const loginForm = document.getElementById('loginForm');
const logoutBtn = document.getElementById('logoutBtn');
const reportsTableBody = document.getElementById('reportsTableBody');

// Auth state
let authToken = localStorage.getItem('adminToken');

// Check if already logged in
if (authToken) {
    showDashboard();
    loadReports();
}

// Authentication handlers
async function login(credentials) {
    try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });

        if (!response.ok) {
            throw new Error('Invalid credentials');
        }

        const data = await response.json();
        authToken = data.token;
        localStorage.setItem('adminToken', authToken);
        
        return true;
    } catch (error) {
        console.error('Login error:', error);
        return false;
    }
}

function logout() {
    authToken = null;
    localStorage.removeItem('adminToken');
    showLogin();
}

// UI State handlers
function showDashboard() {
    loginSection.classList.add('hidden');
    dashboardSection.classList.remove('hidden');
}

function showLogin() {
    loginSection.classList.remove('hidden');
    dashboardSection.classList.add('hidden');
    loginForm.reset();
}

// Reports handlers
async function loadReports() {
    try {
        reportsTableBody.innerHTML = '<tr><td colspan="6">Loading reports...</td></tr>';

        const response = await fetch('http://localhost:5000/api/incidents', {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                logout();
                return;
            }
            throw new Error('Failed to fetch reports');
        }

        const reports = await response.json();
        displayReports(reports);
    } catch (error) {
        console.error('Error loading reports:', error);
        showNotification('Failed to load reports', 'error');
        reportsTableBody.innerHTML = '<tr><td colspan="6">Error loading reports</td></tr>';
    }
}

function displayReports(reports) {
    if (reports.length === 0) {
        reportsTableBody.innerHTML = '<tr><td colspan="6">No reports found</td></tr>';
        return;
    }

    reportsTableBody.innerHTML = reports
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .map(report => `
            <tr>
                <td>${new Date(report.timestamp).toLocaleString()}</td>
                <td>${report.type}</td>
                <td>${report.location}</td>
                <td>${report.description}</td>
                <td>
                    <span class="status-badge status-${report.status || 'new'}">
                        ${report.status || 'New'}
                    </span>
                </td>
                <td>
                    <button onclick="updateStatus('${report._id}', 'in-progress')"
                            class="action-btn"
                            ${report.status === 'resolved' ? 'disabled' : ''}>
                        In Progress
                    </button>
                    <button onclick="updateStatus('${report._id}', 'resolved')"
                            class="action-btn"
                            ${report.status === 'resolved' ? 'disabled' : ''}>
                        Resolved
                    </button>
                </td>
            </tr>
        `).join('');
}

async function updateStatus(reportId, newStatus) {
    try {
        const response = await fetch(`http://localhost:5000/api/incidents/${reportId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ status: newStatus })
        });

        if (!response.ok) {
            if (response.status === 401) {
                logout();
                return;
            }
            throw new Error('Failed to update status');
        }

        await loadReports();
        showNotification(`Status updated to ${newStatus}`, 'success');
    } catch (error) {
        console.error('Error updating status:', error);
        showNotification('Failed to update status', 'error');
    }
}

// Notification helper
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type}`;
    notification.textContent = message;

    const container = dashboardSection.querySelector('.container');
    container.insertBefore(notification, container.firstChild);

    setTimeout(() => notification.remove(), 3000);
}

// Event Listeners
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const credentials = {
        username: document.getElementById('username').value,
        password: document.getElementById('password').value
    };
    
    const success = await login(credentials);
    if (success) {
        showDashboard();
        await loadReports();
    } else {
        showNotification('Invalid credentials', 'error');
    }
});

logoutBtn.addEventListener('click', logout);

// Auto refresh reports every 30 seconds
const REFRESH_INTERVAL = 30000;
setInterval(loadReports, REFRESH_INTERVAL);