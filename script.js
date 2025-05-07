// DOM Elements
const themeToggle = document.getElementById('theme-toggle');
const cards = document.querySelectorAll('.card');
const speedSlider = document.getElementById('animation-speed');
const speedValue = document.getElementById('speed-value');
const saveButton = document.getElementById('save-preferences');
const body = document.body;

// User preferences object
let userPreferences = {
  darkMode: false,
  animationSpeed: 1
};

// Function to load preferences from localStorage
function loadPreferences() {
  const savedPreferences = localStorage.getItem('themePreferences');
  
  if (savedPreferences) {
    try {
      userPreferences = JSON.parse(savedPreferences);
      
      // Apply saved preferences
      if (userPreferences.darkMode) {
        body.classList.add('dark-theme');
      }
      
      speedSlider.value = userPreferences.animationSpeed;
      speedValue.textContent = `${userPreferences.animationSpeed}x`;
      
      // Update CSS variable for animation duration
      document.documentElement.style.setProperty(
        '--animation-duration', 
        `${1 / userPreferences.animationSpeed}s`
      );
      
      console.log('Preferences loaded from localStorage:', userPreferences);
    } catch (error) {
      console.error('Error parsing preferences from localStorage:', error);
    }
  }
}

// Function to save preferences to localStorage
function savePreferences() {
  localStorage.setItem('themePreferences', JSON.stringify(userPreferences));
  showNotification('Preferences saved!');
  console.log('Preferences saved to localStorage:', userPreferences);
}

// Function to toggle theme
function toggleTheme() {
  body.classList.toggle('dark-theme');
  userPreferences.darkMode = body.classList.contains('dark-theme');
  savePreferences();
}

// Function to update animation speed
function updateAnimationSpeed() {
  const speed = parseFloat(speedSlider.value);
  userPreferences.animationSpeed = speed;
  speedValue.textContent = `${speed}x`;
  
  // Update CSS variable for animation duration
  document.documentElement.style.setProperty(
    '--animation-duration', 
    `${1 / speed}s`
  );
}

// Function to show notification
function showNotification(message) {
  // Remove existing notification if any
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  // Create new notification
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  document.body.appendChild(notification);
  
  // Show notification with animation
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  // Hide notification after 3 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

// Event Listeners
themeToggle.addEventListener('click', toggleTheme);

speedSlider.addEventListener('input', () => {
  updateAnimationSpeed();
});

saveButton.addEventListener('click', () => {
  savePreferences();
});

// Add click animation to the third card
cards[2].addEventListener('click', function() {
  this.classList.add('clicked');
  
  // Remove the class after the animation completes
  setTimeout(() => {
    this.classList.remove('clicked');
  }, parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--animation-duration')) * 1000);
});

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  loadPreferences();
});

// Check if localStorage is available
function isLocalStorageAvailable() {
  try {
    const test = 'test';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

// Show warning if localStorage is not available
if (!isLocalStorageAvailable()) {
  console.warn('localStorage is not available. Preferences will not be saved.');
  showNotification('Warning: localStorage is not available. Your preferences will not be saved.');
}