// report.js

// Incident data structure
const INCIDENT_DATA = {
    emergency: {
        title: "Medical Emergency",
        urgencyLevel: "CRITICAL - Immediate Response Required",
        color: "#dc3545",
        contacts: [
            { title: "Emergency Services", number: "911" },
            { title: "Campus Medical Center", number: "(555) 123-4567" },
            { title: "Campus Security", number: "(555) 987-6543" }
        ],
        procedures: [
            "Ensure the scene is safe",
            "Call 911 immediately", 
            "Stay with the person if safe to do so",
            "Send someone to guide emergency responders",
            "Report incident to campus security"
        ]
    },
    suspicious: {
        title: "Suspicious Activity",
        urgencyLevel: "HIGH - Report Immediately",
        color: "#ffc107",
        contacts: [
            { title: "Campus Police", number: "(555) 234-5678" },
            { title: "Security Hotline", number: "(555) 876-5432" }
        ],
        procedures: [
            "Do not confront the individual",
            "Note physical descriptions",
            "Document time and location",
            "Contact campus police"
        ]
    },
    harassment: {
        title: "Harassment",
        urgencyLevel: "URGENT - Report Required", 
        color: "#fd7e14",
        contacts: [
            { title: "Campus Security", number: "(555) 345-6789" },
            { title: "Student Services", number: "(555) 765-4321" },
            { title: "Counseling Center", number: "(555) 234-5678" }
        ],
        procedures: [
            "Ensure your immediate safety",
            "Document all incidents",
            "Report to campus authorities",
            "Seek support services"
        ]
    },
    other: {
        title: "Other Concerns",
        urgencyLevel: "Standard Response",
        color: "#0dcaf0",
        contacts: [
            { title: "Campus Security", number: "(555) 345-6789" },
            { title: "Information Desk", number: "(555) 111-2222" }
        ],
        procedures: [
            "Document your concern",
            "Contact appropriate department",
            "Follow up if needed"
        ]
    }
};

// Form elements
const incidentForm = document.getElementById('incidentForm');
const incidentTypeSelect = document.getElementById('incidentType');
const incidentInfo = document.getElementById('incidentInfo');
const submitButton = incidentForm.querySelector('.submit-btn');

// Handle incident type selection
incidentTypeSelect.addEventListener('change', function() {
    const selectedType = this.value;
    
    if (!selectedType) {
        incidentInfo.classList.add('hidden');
        return;
    }

    const data = INCIDENT_DATA[selectedType];
    if (!data) return;

    const responseHTML = `
        <div class="urgency-banner" style="background-color: ${data.color}">
            <h3>${data.title}</h3>
            <p>${data.urgencyLevel}</p>
        </div>
        
        <div class="response-section">
            <div class="contacts-panel">
                <h4>Emergency Contacts</h4>
                <div class="contacts-list">
                    ${data.contacts.map(contact => `
                        <div class="contact-card">
                            <strong>${contact.title}</strong>
                            <a href="tel:${contact.number}" class="phone-number">
                                <img src="https://api.iconify.design/lucide:phone.svg" alt="Call">
                                ${contact.number}
                            </a>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="procedures-panel">
                <h4>Response Procedures</h4>
                <ol class="procedures-list">
                    ${data.procedures.map(step => `<li>${step}</li>`).join('')}
                </ol>
            </div>
        </div>
    `;

    incidentInfo.innerHTML = responseHTML;
    incidentInfo.classList.remove('hidden');
});

// Handle form submission
incidentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';

    try {
        const formData = {
            type: incidentTypeSelect.value,
            location: document.getElementById('location').value,
            description: document.getElementById('description').value,
            status: 'new',
            timestamp: new Date().toISOString()
        };

        // Validate form data
        if (!formData.type || !formData.location || !formData.description) {
            throw new Error('Please fill in all required fields');
        }

        const response = await fetch('http://localhost:5000/api/incidents', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error('Failed to submit report');
        }

        const result = await response.json();
        console.log('Report submitted:', result);

        showNotification('Report submitted successfully', 'success');
        incidentForm.reset();
        incidentInfo.classList.add('hidden');

    } catch (error) {
        console.error('Submission error:', error);
        showNotification(error.message, 'error');
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Submit Report';
    }
});

// Notification helper
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type}`;
    notification.textContent = message;

    const container = document.querySelector('.report-card');
    container.insertBefore(notification, container.firstChild);

    setTimeout(() => notification.remove(), 3000);
}

// Initialize contacts section
const contactsSection = document.getElementById('contactsSection');
const contactsGrid = document.getElementById('contactsGrid');

function showContactsSection() {
    contactsSection.classList.remove('hidden');
}

function hideContactsSection() {
    contactsSection.classList.add('hidden');
}