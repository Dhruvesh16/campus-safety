function createContactCard(contact, isPrimary = false) {
    const card = document.createElement('div');
    card.className = `contact-card ${isPrimary ? 'primary' : ''}`;
    
    card.innerHTML = `
        <div class="contact-header">
            <img src="https://api.iconify.design/lucide:${contact.icon}.svg" alt="${contact.title}">
            <h4>${contact.title}</h4>
        </div>
        <p class="contact-description">${contact.description}</p>
        <div class="contact-info">
            <div class="contact-detail primary">
                <img src="https://api.iconify.design/lucide:phone.svg" alt="Phone">
                <span>${contact.contact}</span>
            </div>
            ${contact.email ? `
                <div class="contact-detail">
                    <img src="https://api.iconify.design/lucide:mail.svg" alt="Email">
                    <span>${contact.email}</span>
                </div>
            ` : ''}
            ${contact.location ? `
                <div class="contact-detail">
                    <img src="https://api.iconify.design/lucide:map-pin.svg" alt="Location">
                    <span>${contact.location}</span>
                </div>
            ` : ''}
            ${contact.availableHours ? `
                <div class="contact-detail">
                    <img src="https://api.iconify.design/lucide:clock.svg" alt="Hours">
                    <span>${contact.availableHours}</span>
                </div>
            ` : ''}
        </div>
    `;
    
    return card;
} 