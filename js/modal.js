// === MODAL FUNKTIONEN ===
let customModalResolve = null;

function showCustomModal(message) {
    return new Promise((resolve) => {
        document.getElementById('modalMessage').textContent = message;
        document.getElementById('customModal').style.display = 'flex';
        customModalResolve = resolve;
    });
}

function closeCustomModal() {
    document.getElementById('customModal').style.display = 'none';
    customModalResolve = null;
}

// Modal Event Listener
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('modalConfirmBtn').addEventListener('click', function() {
        if (customModalResolve) customModalResolve(true);
        closeCustomModal();
    });
    
    document.getElementById('modalCancelBtn').addEventListener('click', function() {
        if (customModalResolve) customModalResolve(false);
        closeCustomModal();
    });
});