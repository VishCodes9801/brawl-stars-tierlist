x// Initialize event listeners for save/load functionality
document.addEventListener('DOMContentLoaded', () => {
    const saveButton = document.getElementById('saveButton');
    const loadButton = document.getElementById('loadButton');
    const saveModal = document.getElementById('saveModal');
    const loadModal = document.getElementById('loadModal');
    
    saveButton.addEventListener('click', showSaveModal);
    loadButton.addEventListener('click', showLoadModal);
    
    // Add save functionality to the save modal button
    saveModal.querySelector('.button.save').addEventListener('click', saveTierList);
});

function showSaveModal() {
    const modal = document.getElementById('saveModal');
    modal.style.display = 'block';
}

function showLoadModal() {
    const modal = document.getElementById('loadModal');
    displaySavedLists();
    modal.style.display = 'block';
}

function saveTierList() {
    const name = document.getElementById('saveNameInput').value;
    if (!name) {
        alert('Please enter a name for your tier list');
        return;
    }

    const tierList = {};
    document.querySelectorAll('.tier-content').forEach((tier, index) => {
        const characters = Array.from(tier.children).map(char => ({
            id: char.id,
            className: char.className
        }));
        tierList[`tier${index}`] = characters;
    });

    const savedLists = JSON.parse(localStorage.getItem('brawlStarsTierLists') || '{}');
    savedLists[name] = {
        data: tierList,
        date: new Date().toISOString()
    };
    
    localStorage.setItem('brawlStarsTierLists', JSON.stringify(savedLists));
    document.getElementById('saveModal').style.display = 'none';
    document.getElementById('saveNameInput').value = '';
    alert('Tier list saved successfully!');
}

function displaySavedLists() {
    const savedLists = JSON.parse(localStorage.getItem('brawlStarsTierLists') || '{}');
    const container = document.getElementById('savedLists');
    container.innerHTML = '';

    Object.entries(savedLists).forEach(([name, {date}]) => {
        const item = document.createElement('div');
        item.className = 'saved-item';
        item.innerHTML = `
            <span>${name} (${new Date(date).toLocaleDateString()})</span>
            <div>
                <button onclick="loadTierList('${name}')" class="button load">Load</button>
                <button onclick="deleteSavedList('${name}')" class="button reset">Delete</button>
            </div>
        `;
        container.appendChild(item);
    });
}

function loadTierList(name) {
    const savedLists = JSON.parse(localStorage.getItem('brawlStarsTierLists') || '{}');
    const tierList = savedLists[name].data;

    // Reset current tier list
    const characterPool = document.getElementById('character-pool');
    document.querySelectorAll('.tier-content').forEach(tier => {
        while (tier.firstChild) {
            characterPool.appendChild(tier.firstChild);
        }
    });

    // Load saved positions
    Object.entries(tierList).forEach(([tier, characters]) => {
        const tierElement = document.querySelectorAll('.tier-content')[parseInt(tier.replace('tier', ''))];
        characters.forEach(char => {
            const element = document.getElementById(char.id);
            if (element) {
                tierElement.appendChild(element);
            }
        });
    });

    document.getElementById('loadModal').style.display = 'none';
}

function deleteSavedList(name) {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
        const savedLists = JSON.parse(localStorage.getItem('brawlStarsTierLists') || '{}');
        delete savedLists[name];
        localStorage.setItem('brawlStarsTierLists', JSON.stringify(savedLists));
        displaySavedLists();
    }
}