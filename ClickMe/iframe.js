document.addEventListener('DOMContentLoaded', function() {
    const iframe = document.querySelector('iframe');
    const container = document.querySelector('.container');
    
    // Function to update iframe source
    function updateIframeSource(url) {
        if (url) {
            iframe.src = url;
        }
    }

    // Function to handle iframe load events
    function handleIframeLoad() {
        iframe.style.opacity = '1';
        
        // After iframe loads, ensure captcha dots are properly colored
        setTimeout(updateCaptchaDots, 300);
    }
    
    // Function to update captcha dots based on step
    function updateCaptchaDots() {
        // Find the current step
        const currentButton = document.querySelector('.iframe-control-button');
        if (!currentButton || !currentButton.dataset.currentStep) return;
        
        const currentStepNumber = parseInt(currentButton.dataset.currentStep);
        const step = document.querySelector(`.step-container[data-step-number="${currentStepNumber}"]`);
        
        if (!step) return;
        
        const buttonElement = step.querySelector('.element-button');
        if (!buttonElement) return;
        
        const buttonTypeSelect = buttonElement.querySelector('.button-type-select');
        if (!buttonTypeSelect || buttonTypeSelect.value !== 'captcha-puzzle') return;
        
        const stepInput = buttonElement.querySelector('.captcha-puzzle-step');
        if (!stepInput) return;
        
        const totalDotsInput = buttonElement.querySelector('.captcha-puzzle-total-dots');
        const stepValue = parseInt(stepInput.value) || 1;
        const totalDots = parseInt(totalDotsInput?.value) || 4;
        const safeStep = Math.min(Math.max(stepValue, 1), 4);
        const safeTotalDots = Math.min(Math.max(totalDots, 1), 4);
        
        // Update the dots
        const captchaPuzzle = document.getElementById('captcha-puzzle-button');
        if (!captchaPuzzle) return;
        
        for (let i = 1; i <= 4; i++) {
            const dot = captchaPuzzle.querySelector(`.dot-${i}`);
            if (dot) {
                if (i <= safeTotalDots) {
                    dot.style.display = 'block'; // Show the dot if it's within the total
                    if (i === safeStep) {
                        dot.style.backgroundColor = '#00aaff'; // Blue for active
                    } else {
                        dot.style.backgroundColor = '#14141462'; // Gray for inactive
                    }
                } else {
                    dot.style.display = 'none'; // Hide the dot if it's beyond the total
                }
            }
        }
        
        console.log(`Iframe.js: Updated dots based on step ${safeStep} with total dots: ${safeTotalDots}`);
    }

    // Add load event listener
    iframe.addEventListener('load', handleIframeLoad);

    // Initialize with default state
    iframe.style.opacity = '0';
    iframe.style.transition = 'opacity 0.3s ease';
    
    // Export functions for external use
    window.iframeUtils = {
        updateSource: updateIframeSource,
        updateDots: updateCaptchaDots
    };
    
    // Call updateCaptchaDots directly for the initial state
    setTimeout(updateCaptchaDots, 500);

    // Synchronize overlay with normal-button
    const normalButton = document.getElementById('normal-button');
    const normalButtonOverlay = document.getElementById('normal-button-overlay');
    
    // Flags to track if overlays have been manually hidden
    let normalButtonOverlayHidden = false;
    let flyOverlayHidden = false;
    let greenOverlayHidden = false;
    
    if (normalButton && normalButtonOverlay) {
        // Initial sync
        syncOverlayWithButton();
        
        // Set up an interval to check for changes
        setInterval(syncOverlayWithButton, 100);
        
        function syncOverlayWithButton() {
            // Skip synchronization if manually hidden
            if (normalButtonOverlayHidden) return;
            
            // Check if normal-button has style attributes
            if (normalButton.style.width) {
                normalButtonOverlay.style.width = normalButton.style.width;
            }
            if (normalButton.style.height) {
                normalButtonOverlay.style.height = normalButton.style.height;
            }
            if (normalButton.style.left) {
                normalButtonOverlay.style.left = normalButton.style.left;
            }
            if (normalButton.style.top) {
                normalButtonOverlay.style.top = normalButton.style.top;
            }
            
            // Make sure the overlay's visibility matches the button
            // but keep opacity: 0 unless explicitly changed by Show Areas
            if (normalButton.style.display === 'none') {
                normalButtonOverlay.style.display = 'none';
            } else {
                normalButtonOverlay.style.display = 'block'; // Explicitly set to block
                // Only set opacity if it's not already set
                if (normalButtonOverlay.style.opacity === '') {
                    normalButtonOverlay.style.opacity = '0';
                }
            }
        }
    }
    
    // Synchronize fly overlay with fly-1 image
    const flyImage = document.querySelector('.fly-1');
    const flyOverlay = document.getElementById('fly-overlay');
    
    if (flyImage && flyOverlay) {
        // Initial sync
        syncFlyOverlay();
        
        // Set up an interval to check for changes
        setInterval(syncFlyOverlay, 100);
        
        function syncFlyOverlay() {
            // Skip synchronization if manually hidden
            if (flyOverlayHidden) return;
            
            // Copy all position and dimension styles
            if (flyImage.style.width) flyOverlay.style.width = flyImage.style.width;
            if (flyImage.style.height) flyOverlay.style.height = flyImage.style.height;
            if (flyImage.style.left) flyOverlay.style.left = flyImage.style.left;
            if (flyImage.style.right) flyOverlay.style.right = flyImage.style.right;
            if (flyImage.style.top) flyOverlay.style.top = flyImage.style.top;
            if (flyImage.style.bottom) flyOverlay.style.bottom = flyImage.style.bottom;
            
            // Make sure the overlay's visibility matches the image
            // but keep opacity: 0 unless explicitly changed by Show Areas
            if (flyImage.style.display === 'none' || getComputedStyle(flyImage).display === 'none') {
                flyOverlay.style.display = 'none';
            } else {
                flyOverlay.style.display = 'block'; // Explicitly set to block
                // Only set opacity if it's not already set
                if (flyOverlay.style.opacity === '') {
                    flyOverlay.style.opacity = '0';
                }
            }
        }
    }
    
    // Add state tracking for mouseover events
    let lastMouseoverTime = 0;
    let timeoutInProgress = false;

    // Add mouse event handlers for all overlays
    const redOverlay = document.getElementById('red-overlay');
    const greenOverlay = document.querySelector('.green-overlay');
    
    // Helper function to handle mouseover for any overlay
    function handleOverlayMouseOver(e) {
        // If a timeout is already in progress, ignore this mouseover
        if (timeoutInProgress) {
            return;
        }

        // Record the time of this mouseover event
        lastMouseoverTime = Date.now();

        // Remove the red overlay completely when hovered
        if (redOverlay) {
            redOverlay.style.display = 'none';
            console.log('Red overlay removed');
        }
        
        // Check if the target is a green overlay which has !important CSS rules
        if (e.target.classList.contains('green-overlay')) {
            // Add loading animation to the checkbox after 800ms
            const checkboxContainer = e.target.closest('.checkbox-container');
            if (checkboxContainer) {
                setTimeout(() => {
                    checkboxContainer.classList.add('loading');
                }, 800);
            }
            
            // For green overlay with !important, try multiple approaches to ensure it's hidden
            try {
                // First approach: set style attribute directly with !important
                e.target.setAttribute('style', 'display: none !important');
                
                // Second approach: add a class that will force the element to be hidden
                e.target.classList.add('force-hidden');
                
                // Third approach: remove the element from the DOM temporarily
                const parent = e.target.parentNode;
                if (parent) {
                    parent.removeChild(e.target);
                    // Store a reference to reattach it when resetting
                    window.removedGreenOverlay = {element: e.target, parent: parent};
                }
                
                greenOverlayHidden = true;
                console.log('Green overlay forcibly removed');
            } catch (err) {
                console.error('Error removing green overlay:', err);
            }
        } else {
            // For other overlays, use standard style
            e.target.style.display = 'none';
            
            // Set the appropriate hidden flag
            if (e.target === normalButtonOverlay) {
                normalButtonOverlayHidden = true;
                console.log('Normal button overlay removed');
            } else if (e.target === flyOverlay) {
                flyOverlayHidden = true;
                console.log('Fly overlay removed');
            }
        }
        
        console.log(`${e.target.id || e.target.className} removed and flagged`);
        
        // Start the timeout for this step
        timeoutInProgress = true;
        advanceToNextStepAfterTimeout();
    }
    
    // Function to advance to the next step based on timeout
    function advanceToNextStepAfterTimeout() {
        // Find the current step
        const currentButton = document.querySelector('.iframe-control-button');
        if (!currentButton || !currentButton.dataset.currentStep) return;
        
        const currentStepNumber = parseInt(currentButton.dataset.currentStep);
        console.log(`Current step: ${currentStepNumber}`);
        
        // Try to get timeout value from localStorage or use default
        let timeoutValue = 1000; // Default timeout
        
        // Get settings from localStorage
        try {
            const settings = JSON.parse(localStorage.getItem('clickjackingSettings'));
            if (settings && settings.steps) {
                const stepKey = `step${currentStepNumber}`;
                if (settings.steps[stepKey] && settings.steps[stepKey].timeout) {
                    timeoutValue = parseInt(settings.steps[stepKey].timeout);
                    console.log(`Found timeout value for step ${currentStepNumber}: ${timeoutValue}ms`);
                }
            }
        } catch (e) {
            console.error('Error getting timeout from localStorage:', e);
        }
        
        // Set a timeout to advance to the next step
        console.log(`Will advance to next step after ${timeoutValue}ms`);
        setTimeout(() => {
            // Get the steps again in case they changed
            const steps = document.querySelectorAll('.step-container');
            if (currentStepNumber < steps.length) {
                // There's a next step, advance to it
                const nextStepNumber = currentStepNumber + 1;
                console.log(`Advancing to step ${nextStepNumber}`);
                
                // Reset all overlays for the new step
                resetAllOverlays();
                
                // Reset the timeout flag to allow new mouseover events
                timeoutInProgress = false;
                
                // Call the selectStep function from menu.js
                if (typeof selectStep === 'function') {
                    selectStep(nextStepNumber);
                } else {
                    console.error('selectStep function not found in global scope');
                    
                    // Fallback: update the button text and dataset directly
                    const nextStep = steps[nextStepNumber - 1];
                    const stepName = nextStep.dataset.stepName || `Step ${nextStepNumber}`;
                    
                    currentButton.textContent = stepName;
                    currentButton.dataset.currentStep = nextStepNumber;
                    
                    // Manually trigger step change event
                    const event = new Event('stepChanged');
                    document.dispatchEvent(event);
                }
            } else {
                console.log('This is the last step, no more steps to advance to');
                // Reset the timeout flag since we're at the last step
                timeoutInProgress = false;
            }
        }, timeoutValue);
    }
    
    // Function to reset all overlays to their initial state
    function resetAllOverlays() {
        console.log('Resetting all overlays for new step');
        
        // Reset the red overlay
        if (redOverlay) {
            redOverlay.style.display = 'block'; // Ensure it's displayed
        }
        
        // Reset the normal button overlay
        if (normalButtonOverlay) {
            normalButtonOverlay.style.display = 'block'; // Ensure it's displayed
            normalButtonOverlay.style.opacity = '0';
            normalButtonOverlayHidden = false; // Reset the flag
        }
        
        // Reset the fly overlay
        if (flyOverlay) {
            flyOverlay.style.display = 'block'; // Ensure it's displayed
            flyOverlay.style.opacity = '0';
            flyOverlayHidden = false; // Reset the flag
        }
        
        // Remove loading animation from checkbox
        const checkboxContainer = document.querySelector('.checkbox-container');
        if (checkboxContainer) {
            checkboxContainer.classList.remove('loading');
        }
        
        // Check if we need to reattach a removed green overlay
        if (window.removedGreenOverlay) {
            try {
                const {element, parent} = window.removedGreenOverlay;
                // Only reattach if it's not already in the DOM
                if (!document.contains(element)) {
                    parent.appendChild(element);
                    console.log('Reattached removed green overlay');
                }
                window.removedGreenOverlay = null;
            } catch (err) {
                console.error('Error reattaching green overlay:', err);
            }
        }
        
        // Reset all green overlays
        const greenOverlays = document.querySelectorAll('.green-overlay');
        greenOverlays.forEach(overlay => {
            if (overlay) {
                // Remove the force-hidden class
                overlay.classList.remove('force-hidden');
                // Use setAttribute to apply !important inline style
                overlay.setAttribute('style', 'display: block !important; opacity: 0 !important');
            }
        });
        greenOverlayHidden = false; // Reset the flag
        
        console.log('All overlays have been reset');
    }
    
    // Listen for step changes and reset overlays
    document.addEventListener('stepChanged', resetAllOverlays);
    
    // Add mouseover event listeners to all three overlays
    if (normalButtonOverlay) {
        normalButtonOverlay.addEventListener('mouseover', handleOverlayMouseOver);
    }
    
    if (flyOverlay) {
        flyOverlay.addEventListener('mouseover', handleOverlayMouseOver);
    }
    
    if (greenOverlay) {
        greenOverlay.addEventListener('mouseover', handleOverlayMouseOver);
    }
});
