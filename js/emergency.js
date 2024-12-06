document.addEventListener('DOMContentLoaded', () => {
    const emergencyBtn = document.querySelector('.emergency-btn');
    
    emergencyBtn.addEventListener('click', () => {
        alert('Emergency services have been notified. Stay calm and help is on the way.');
    });
});