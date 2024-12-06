// incidents.js

// Incident type definitions
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

// Status definitions
const INCIDENT_STATUS = {
    new: {
        label: "New",
        color: "#0dcaf0"
    },
    'in-progress': {
        label: "In Progress",
        color: "#ffc107"
    },
    resolved: {
        label: "Resolved",
        color: "#198754"
    }
};

// Utility functions
function getIncidentData(type) {
    return INCIDENT_DATA[type] || null;
}

function getStatusInfo(status) {
    return INCIDENT_STATUS[status] || INCIDENT_STATUS.new;
}

function validateIncident(incidentData) {
    const requiredFields = ['type', 'location', 'description'];
    return requiredFields.every(field => 
        incidentData[field] && incidentData[field].trim().length > 0
    );
}

function formatIncidentForDisplay(incident) {
    const incidentType = getIncidentData(incident.type);
    const statusInfo = getStatusInfo(incident.status);
    
    return {
        ...incident,
        title: incidentType?.title || 'Unknown Incident',
        urgencyLevel: incidentType?.urgencyLevel || 'Standard Response',
        statusLabel: statusInfo.label,
        statusColor: statusInfo.color,
        formattedDate: new Date(incident.timestamp).toLocaleString()
    };
}

async function createIncident(incidentData) {
    if (!validateIncident(incidentData)) {
        throw new Error('Invalid incident data');
    }

    try {
        const response = await fetch('http://localhost:5000/api/incidents', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...incidentData,
                timestamp: new Date().toISOString(),
                status: 'new'
            })
        });

        if (!response.ok) {
            throw new Error('Failed to create incident');
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating incident:', error);
        throw error;
    }
}

async function updateIncidentStatus(incidentId, newStatus, authToken) {
    if (!INCIDENT_STATUS[newStatus]) {
        throw new Error('Invalid status');
    }

    try {
        const response = await fetch(`http://localhost:5000/api/incidents/${incidentId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ status: newStatus })
        });

        if (!response.ok) {
            throw new Error('Failed to update incident status');
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating incident status:', error);
        throw error;
    }
}

// Export constants and functions
export {
    INCIDENT_DATA,
    INCIDENT_STATUS,
    getIncidentData,
    getStatusInfo,
    validateIncident,
    formatIncidentForDisplay,
    createIncident,
    updateIncidentStatus
};