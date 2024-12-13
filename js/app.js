// Brawler data
const brawlers = {
    Common: ['Shelly'],
    Rare: ['Brock', 'Bull', 'Colt', 'Barley', 'El Primo', 'Poco', 'Rosa', 'Nita'],
    'Super-Rare': ['Rico', 'Darryl', 'Penny', 'Carl', 'Jacky', 'Gus', '8-Bit', 'Tick', 'Dynamike', 'Jessie'],
    Epic: ['Piper', 'Pam', 'Frank', 'Bibi', 'Bea', 'Nani', 'Edgar', 'Griff', 'Grom', 'Bonnie', 'Sam', 'Meeple', 
           'Shade', 'Berry', 'Angelo', 'Larry & Lawrie', 'Pearl', 'Hank', 'Maisie', 'Mandy', 'Bo', 'Emz', 'Stu', 
           'Belle', 'Ash', 'Lola', 'Colette', 'Gale'],
    Mythic: ['Mortis', 'Tara', 'Gene', 'Max', 'Mr. P', 'Sprout', 'Byron', 'Squeak', 'Eve', 'Janet', 'Otis', 
             'Juju', 'Moe', 'Clancy', 'Lily', 'Melodie', 'Mico', 'Charlie', 'Chuck', 'Doug', 'Willow', 'R-T', 
             'Gray', 'Buster', 'Buzz', 'Ruffs', 'Lou', 'Fang'],
    Legendary: ['Spike', 'Crow', 'Leon', 'Sandy', 'Amber', 'Meg', 'Chester', 'Buzz Lightyear', 'Kenji', 
                'Draco', 'Kit', 'Cordelius', 'Surge']
};

// Initialize the character pool
function initializeCharacters() {
    const characterPool = document.getElementById('character-pool');
    
    Object.entries(brawlers).forEach(([rarity, characters]) => {
        characters.forEach(name => {
            const character = document.createElement('div');
            character.className = `character ${rarity}`;
            character.draggable = true;
            character.id = name.replace(/\s+/g, '-');
            character.textContent = name;
            
            character.addEventListener('dragstart', dragStart);
            character.addEventListener('dragend', dragEnd);
            
            characterPool.appendChild(character);
        });
    });
}

// Drag and drop functionality
function dragStart(e) {
    e.target.classList.add('dragging');
    e.dataTransfer.setData('text/plain', e.target.id);
}

function dragEnd(e) {
    e.target.classList.remove('dragging');
}

function dragOver(e) {
    e.preventDefault();
}

function drop(e) {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    const draggable = document.getElementById(id);
    
    let dropZone = e.target;
    
    // Find the nearest valid drop zone
    while (dropZone && !dropZone.classList.contains('tier-content') && dropZone.id !== 'character-pool') {
        dropZone = dropZone.parentElement;
    }
    
    if (dropZone && (dropZone.classList.contains('tier-content') || dropZone.id === 'character-pool')) {
        dropZone.appendChild(draggable);
    }
}

// Initialize the application
function initializeApp() {
    // Initialize characters
    initializeCharacters();
    
    // Add drop zone event listeners
    document.querySelectorAll('.tier-content').forEach(zone => {
        zone.addEventListener('dragover', dragOver);
        zone.addEventListener('drop', drop);
    });
    
    const characterPool = document.getElementById('character-pool');
    characterPool.addEventListener('dragover', dragOver);
    characterPool.addEventListener('drop', drop);
    
    // Initialize buttons
    document.getElementById('resetButton').addEventListener('click', resetTierList);
    
    // Initialize modals
    document.querySelectorAll('.modal .close').forEach(closeButton => {
        closeButton.addEventListener('click', () => {
            closeButton.closest('.modal').style.display = 'none';
        });
    });
}

// Reset functionality
function resetTierList() {
    if (!confirm('Are you sure you want to reset the tier list? This will move all characters back to the pool.')) {
        return;
    }
    
    const characterPool = document.getElementById('character-pool');
    document.querySelectorAll('.tier-content').forEach(tier => {
        while (tier.firstChild) {
            characterPool.appendChild(tier.firstChild);
        }
    });
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', initializeApp);