// Constants
const SPEED_OF_LIGHT = 299792458; // m/s
const C_SQUARED = SPEED_OF_LIGHT * SPEED_OF_LIGHT;

// Unit conversion factors
const massUnits = {
    'kg': 1,
    'g': 0.001,
    'lbs': 0.453592
};

const energyUnits = {
    'J': 1,
    'kT': 4.184e12, // 1 kiloton TNT = 4.184e12 J
    'kWh': 3.6e6   // 1 kWh = 3.6e6 J
};

// Fun facts
const funFacts = [
    "The energy in 1 gram of mass could power a 100W lightbulb for about 28,500 years!",
    "A paperclip (1g) contains about 21.5 kilotons of TNT equivalent energy.",
    "A 70kg human body contains about 1.5 gigatons of TNT equivalent energy—enough to power the entire world for several days.",
    "Only about 0.7% of mass is converted to energy in nuclear fission, and about 0.4% in nuclear fusion.",
    "If you could convert 1kg of matter to energy with 100% efficiency, it could launch a Saturn V rocket over 500 times!",
    "The Sun converts about 4 million tons of mass to energy every second through nuclear fusion.",
    "The total mass-energy of the observable universe is estimated to be about 4 × 10^69 Joules.",
    "Einstein's equation applies to all energy, including the energy stored in chemical bonds and even in food calories!",
    "A single raindrop (0.05g) contains energy equivalent to about 1 ton of TNT.",
    "The energy in your morning coffee comes from mass conversion in the Sun millions of years ago."
];

// DOM elements
const massInput = document.getElementById('massInput');
const energyInput = document.getElementById('energyInput');
const massInputGroup = document.getElementById('massInputGroup');
const energyInputGroup = document.getElementById('energyInputGroup');
const massToEnergyBtn = document.getElementById('massToEnergyBtn');
const energyToMassBtn = document.getElementById('energyToMassBtn');
const calculateBtn = document.getElementById('calculateBtn');
const resultValue = document.getElementById('resultValue');
const resultTitle = document.getElementById('resultTitle');
const funFactElement = document.getElementById('funFact');
const comparisonSelector = document.getElementById('comparisonSelector');
const comparisonList = document.getElementById('comparisonList');
const particleAnimation = document.getElementById('particleAnimation');

// Global variables
let currentMode = 'massToEnergy'; // or 'energyToMass'
let currentMassUnit = 'kg';
let currentEnergyUnit = 'J';
let animationInterval = null;

// Initialize
function init() {
    updateCalculation();
    setupEventListeners();
    createParticles(50);
    updateFunFact();
}

// Set up event listeners
function setupEventListeners() {
    // Mode toggles
    massToEnergyBtn.addEventListener('click', () => {
        setMode('massToEnergy');
    });
    
    energyToMassBtn.addEventListener('click', () => {
        setMode('energyToMass');
    });
    
    // Calculate button
    calculateBtn.addEventListener('click', updateCalculation);
    
    // Input changes
    massInput.addEventListener('input', updateCalculation);
    energyInput.addEventListener('input', updateCalculation);
    
    // Unit buttons
    document.querySelectorAll('.unit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const parent = this.parentElement;
            const unitType = this.getAttribute('data-unit');
            
            // Remove active class from all buttons in this group
            parent.querySelectorAll('.unit-btn').forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Update current unit
            if (parent.parentElement.id === 'massInputGroup') {
                currentMassUnit = unitType;
            } else {
                currentEnergyUnit = unitType;
            }
            
            updateCalculation();
        });
    });
    
    // Comparison selector
    comparisonSelector.addEventListener('change', updateComparison);
    
    // GitHub button - update URL if clicked
    document.querySelector('.github-button').addEventListener('click', function(e) {
        // You can add analytics or other tracking here
        console.log('GitHub repository clicked');
    });
}

// Set calculation mode
function setMode(mode) {
    currentMode = mode;
    
    if (mode === 'massToEnergy') {
        massInputGroup.style.display = 'block';
        energyInputGroup.style.display = 'none';
        massToEnergyBtn.classList.add('active');
        energyToMassBtn.classList.remove('active');
        calculateBtn.innerHTML = '<i class="fas fa-bolt"></i> Calculate Energy from Mass';
        resultTitle.textContent = 'Energy Equivalent';
    } else {
        massInputGroup.style.display = 'none';
        energyInputGroup.style.display = 'block';
        massToEnergyBtn.classList.remove('active');
        energyToMassBtn.classList.add('active');
        calculateBtn.innerHTML = '<i class="fas fa-weight-hanging"></i> Calculate Mass from Energy';
        resultTitle.textContent = 'Mass Equivalent';
    }
    
    updateCalculation();
}

// Update calculation
function updateCalculation() {
    let result, resultText;
    
    if (currentMode === 'massToEnergy') {
        // Convert mass to energy: E = m * c^2
        const massKg = parseFloat(massInput.value) * massUnits[currentMassUnit];
        const energyJoules = massKg * C_SQUARED;
        const energyConverted = energyJoules / energyUnits[currentEnergyUnit];
        
        result = formatNumber(energyConverted);
        resultText = `${result} ${currentEnergyUnit === 'kT' ? 'kilotons TNT' : currentEnergyUnit}`;
        
        // Update visualization
        updateVisualization(massKg);
    } else {
        // Convert energy to mass: m = E / c^2
        const energyJoules = parseFloat(energyInput.value) * energyUnits[currentEnergyUnit];
        const massKg = energyJoules / C_SQUARED;
        const massConverted = massKg / massUnits[currentMassUnit];
        
        result = formatNumber(massConverted);
        resultText = `${result} ${currentMassUnit}`;
        
        // Update visualization
        updateVisualization(massKg);
    }
    
    resultValue.innerHTML = resultText.replace(/(\d+\.?\d*)e([+-]?\d+)/, '$1 × 10<sup>$2</sup>');
    updateComparison();
}

// Format number for display
function formatNumber(num) {
    if (num === 0) return '0';
    if (isNaN(num)) return 'Invalid';
    
    // Handle very large or very small numbers
    if (Math.abs(num) >= 1e12) {
        return (num / 1e12).toFixed(6) + ' × 10¹²';
    } else if (Math.abs(num) >= 1e9) {
        return (num / 1e9).toFixed(6) + ' × 10⁹';
    } else if (Math.abs(num) >= 1e6) {
        return (num / 1e6).toFixed(6) + ' × 10⁶';
    } else if (Math.abs(num) >= 1e3) {
        return (num / 1e3).toFixed(6) + ' × 10³';
    } else if (Math.abs(num) >= 1) {
        return num.toFixed(6);
    } else if (Math.abs(num) >= 1e-3) {
        return (num * 1e3).toFixed(6) + ' × 10⁻³';
    } else if (Math.abs(num) >= 1e-6) {
        return (num * 1e6).toFixed(6) + ' × 10⁻⁶';
    } else if (Math.abs(num) >= 1e-9) {
        return (num * 1e9).toFixed(6) + ' × 10⁻⁹';
    } else {
        return num.toExponential(6);
    }
}

// Update visualization
function updateVisualization(massKg) {
    // Scale the energy wave height (max 180px)
    const energyJoules = massKg * C_SQUARED;
    const logEnergy = Math.log10(Math.max(1, energyJoules));
    
    // Normalize between 0 and 180
    let waveHeight = 0;
    if (logEnergy > 10) {
        waveHeight = Math.min(180, (logEnergy - 10) * 10);
    } else if (logEnergy > 5) {
        waveHeight = (logEnergy - 5) * 2;
    }
    
    const energyWave = document.getElementById('energyWave');
    if (energyWave) {
        energyWave.style.height = `${waveHeight}px`;
    }
    
    // Update particles based on mass
    const particleCount = Math.min(200, Math.max(5, Math.floor(massKg * 1000)));
    createParticles(particleCount);
}

// Create particles for animation
function createParticles(count = 50) {
    particleAnimation.innerHTML = '<div class="energy-wave" id="energyWave"></div>';
    
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random position
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        
        particle.style.left = `${x}%`;
        particle.style.top = `${y}%`;
        
        // Random size and color variation
        const size = 4 + Math.random() * 6;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random color variation around yellow
        const hue = 50 + Math.random() * 20;
        const saturation = 80 + Math.random() * 20;
        particle.style.background = `hsl(${hue}, ${saturation}%, 60%)`;
        particle.style.boxShadow = `0 0 ${size * 2}px hsl(${hue}, ${saturation}%, 70%)`;
        
        // Add animation with random parameters
        const duration = 3 + Math.random() * 4;
        const delay = Math.random() * 2;
        particle.style.animation = `float ${duration}s infinite ease-in-out ${delay}s`;
        
        particleAnimation.appendChild(particle);
    }
}

// Update comparison list
function updateComparison() {
    // Get current energy value
    let currentEnergy;
    
    if (currentMode === 'massToEnergy') {
        const massKg = parseFloat(massInput.value) * massUnits[currentMassUnit];
        currentEnergy = massKg * C_SQUARED;
    } else {
        currentEnergy = parseFloat(energyInput.value) * energyUnits[currentEnergyUnit];
    }
    
    // If input is invalid, use default value
    if (isNaN(currentEnergy) || currentEnergy <= 0) {
        currentEnergy = C_SQUARED; // Default to 1kg equivalent
    }
    
    // Update comparison list
    comparisonList.innerHTML = '';
    
    const comparisonsToShow = {
        'Hiroshima atomic bomb (15 kT)': 6.276e13,
        'Tsar Bomba (50 MT)': 2.092e17,
        'Annual US electricity use': 1.44e19,
        '1 liter of gasoline': 3.2e7,
        'Daily food intake (adult)': 1.0e7,
        'AA battery (alkaline)': 1.08e4,
        'Smartphone battery (full charge)': 1.8e4,
        'Lightning bolt (average)': 1e9,
        'Human heartbeat (per beat)': 0.5
    };
    
    for (const [name, energy] of Object.entries(comparisonsToShow)) {
        const ratio = currentEnergy / energy;
        
        const item = document.createElement('div');
        item.className = 'comparison-item';
        
        let ratioText;
        if (ratio >= 1e12) {
            ratioText = `${(ratio / 1e12).toFixed(2)} trillion times`;
        } else if (ratio >= 1e9) {
            ratioText = `${(ratio / 1e9).toFixed(2)} billion times`;
        } else if (ratio >= 1e6) {
            ratioText = `${(ratio / 1e6).toFixed(2)} million times`;
        } else if (ratio >= 1e3) {
            ratioText = `${(ratio / 1e3).toFixed(2)} thousand times`;
        } else if (ratio >= 1) {
            ratioText = `${ratio.toFixed(2)} times`;
        } else if (ratio >= 1e-3) {
            ratioText = `${(ratio * 100).toFixed(2)}%`;
        } else {
            ratioText = `${(ratio * 100).toFixed(4)}%`;
        }
        
        // Color code based on magnitude
        if (ratio >= 1000) {
            item.style.color = '#ff6b6b';
        } else if (ratio >= 1) {
            item.style.color = '#ffcc00';
        } else {
            item.style.color = '#4ecdc4';
        }
        
        item.innerHTML = `
            <span>${name}</span>
            <span>${ratioText}</span>
        `;
        
        comparisonList.appendChild(item);
    }
}

// Update fun fact
function updateFunFact() {
    const randomFact = funFacts[Math.floor(Math.random() * funFacts.length)];
    funFactElement.textContent = randomFact;
    
    // Clear existing interval if any
    if (animationInterval) {
        clearInterval(animationInterval);
    }
    
    // Change fun fact every 10 seconds
    animationInterval = setInterval(() => {
        const randomFact = funFacts[Math.floor(Math.random() * funFacts.length)];
        funFactElement.textContent = randomFact;
    }, 10000);
}

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        updateCalculation();
    }
    
    // Ctrl+1 for mass to energy mode
    if (e.ctrlKey && e.key === '1') {
        e.preventDefault();
        setMode('massToEnergy');
    }
    
    // Ctrl+2 for energy to mass mode
    if (e.ctrlKey && e.key === '2') {
        e.preventDefault();
        setMode('energyToMass');
    }
    
    // Ctrl+G to open GitHub
    if (e.ctrlKey && e.key === 'g') {
        e.preventDefault();
        window.open('https://github.com/yourusername/einstein-emc2-explorer', '_blank');
    }
});

// Add particle animation on mouse move
document.addEventListener('mousemove', (e) => {
    const particles = document.querySelectorAll('.particle');
    if (particles.length > 0) {
        const mouseX = (e.clientX / window.innerWidth) * 100;
        const mouseY = (e.clientY / window.innerHeight) * 100;
        
        particles.forEach(particle => {
            const x = parseFloat(particle.style.left);
            const y = parseFloat(particle.style.top);
            
            // Calculate distance from mouse
            const dx = mouseX - x;
            const dy = mouseY - y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Apply gentle push effect
            if (distance < 20) {
                const angle = Math.atan2(dy, dx);
                const pushForce = (20 - distance) / 5;
                particle.style.left = `${x - Math.cos(angle) * pushForce}%`;
                particle.style.top = `${y - Math.sin(angle) * pushForce}%`;
            }
        });
    }
});

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);