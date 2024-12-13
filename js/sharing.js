// Initialize sharing functionality
document.addEventListener('DOMContentLoaded', () => {
    const shareButton = document.getElementById('shareButton');
    const shareModal = document.getElementById('shareModal');
    const copyButton = shareModal.querySelector('.copy-button');
    
    shareButton.addEventListener('click', showShareModal);
    copyButton.addEventListener('click', copyShareLink);
    
    // Load shared tier list if URL contains data
    loadSharedTierList();
});

function showShareModal() {
    const tierList = {};
    document.querySelectorAll('.tier-content').forEach((tier, index) => {
        const characters = Array.from(tier.children).map(char => char.id);
        tierList[`tier${index}`] = characters;
    });

    const shareData = btoa(JSON.stringify(tierList));
    const shareLink = `${window.location.origin}${window.location.pathname}?data=${shareData}`;
    
    document.getElementById('shareModal').style.display = 'block';
    document.getElementById('shareLink').value = shareLink;
}

function copyShareLink() {
    const shareLink = document.getElementById('shareLink');
    shareLink.select();
    document.execCommand('copy');
    alert('Link copied to clipboard!');
}

function loadSharedTierList() {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedData = urlParams.get('data');
    
    if (sharedData) {
        try {
            const tierList = JSON.parse(atob(sharedData));
            
            // Reset current tier list
            const characterPool = document.getElementById('character-pool');
            document.querySelectorAll('.tier-content').forEach(tier => {
                while (tier.firstChild) {
                    characterPool.appendChild(tier.firstChild);
                }
            });
            
            // Load shared positions
            Object.entries(tierList).forEach(([tier, characters]) => {
                const tierElement = document.querySelectorAll('.tier-content')[parseInt(tier.replace('tier', ''))];
                characters.forEach(charId => {
                    const element = document.getElementById(charId);
                    if (element) {
                        tierElement.appendChild(element);
                    }
                });
            });
        } catch (e) {
            console.error('Failed to load shared tier list:', e);
        }
    }
}

// Validate tier list data
function validateTierListData(data) {
    try {
        const parsed = JSON.parse(atob(data));
        // Check if the data structure is correct
        if (typeof parsed !== 'object') return false;
        
        // Check if all tiers are present
        for (let i = 0; i < 5; i++) {
            if (!parsed[`tier${i}`] || !Array.isArray(parsed[`tier${i}`])) {
                return false;
            }
        }
        
        return true;
    } catch {
        return false;
    }
}