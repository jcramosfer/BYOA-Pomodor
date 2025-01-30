let timeLeft;
let timerId = null;
let isWorkTime = true;

const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const modeText = document.getElementById('mode-text');
const toggleModeButton = document.getElementById('toggle-mode');
const addTimeButton = document.getElementById('add-time');
const focusDisplay = document.getElementById('focus-display');
const focusText = document.getElementById('focus-text');
const focusModal = document.getElementById('focus-modal');
const focusInput = document.getElementById('focus-input');
const focusSubmit = document.getElementById('focus-submit');

const WORK_TIME = 25 * 60; // 25 minutes in seconds
const BREAK_TIME = 5 * 60; // 5 minutes in seconds

function updateDisplay(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    
    minutesDisplay.textContent = String(minutes).padStart(2, '0');
    secondsDisplay.textContent = String(seconds).padStart(2, '0');
    
    // Update the page title with the current time
    const timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    document.title = `${timeString} - Pomodoro Timer`;
}

function startTimer() {
    if (timerId !== null) return;
    
    if (!timeLeft) {
        timeLeft = WORK_TIME;
    }

    if (isWorkTime) {
        showFocusModal();
        return;
    }

    startTimerInternal();
}

function startTimerInternal(focusTask = null) {
    if (focusTask) {
        focusText.textContent = focusTask;
        focusDisplay.classList.remove('hidden');
    }
    
    startButton.textContent = 'Pause';
    addTimeButton.classList.remove('hidden');
    
    timerId = setInterval(() => {
        timeLeft--;
        updateDisplay(timeLeft);
        
        if (timeLeft === 0) {
            clearInterval(timerId);
            timerId = null;
            startButton.textContent = 'Start';
            switchMode();
            alert(isWorkTime ? 'Break time is over! Time to work!' : 'Work time is over! Take a break!');
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timerId);
    timerId = null;
    startButton.textContent = 'Start';
    addTimeButton.classList.add('hidden');
}

function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    isWorkTime = true;
    timeLeft = WORK_TIME;
    startButton.textContent = 'Start';
    modeText.textContent = 'Work Time';
    addTimeButton.classList.add('hidden');
    focusDisplay.classList.add('hidden');
    
    const toggleIcon = document.getElementById('toggle-mode');
    toggleIcon.className = 'fas fa-sun';
    
    updateDisplay(timeLeft);
    updateColors(true);
}

function switchMode() {
    isWorkTime = !isWorkTime;
    timeLeft = isWorkTime ? WORK_TIME : BREAK_TIME;
    modeText.textContent = isWorkTime ? 'Work Time' : 'Break Time';
    updateDisplay(timeLeft);
}

function toggleMode() {
    isWorkTime = !isWorkTime;
    timeLeft = isWorkTime ? WORK_TIME : BREAK_TIME;
    modeText.textContent = isWorkTime ? 'Work Time' : 'Break Time';
    
    const toggleIcon = document.getElementById('toggle-mode');
    toggleIcon.className = isWorkTime ? 'fas fa-sun' : 'fas fa-moon';
    
    focusDisplay.classList.add('hidden');
    
    updateDisplay(timeLeft);
    updateColors(!isWorkTime);
}

function updateColors(isWorkMode) {
    if (isWorkMode) {
        document.body.classList.remove('break-mode');
        document.body.classList.add('work-mode');
    } else {
        document.body.classList.remove('work-mode');
        document.body.classList.add('break-mode');
    }
}

function addFiveMinutes() {
    timeLeft += 5 * 60; // Add 5 minutes in seconds
    updateDisplay(timeLeft);
}

startButton.addEventListener('click', () => {
    if (timerId === null) {
        startTimer();
    } else {
        pauseTimer();
    }
});

resetButton.addEventListener('click', resetTimer);

toggleModeButton.addEventListener('click', () => {
    if (timerId !== null) {
        clearInterval(timerId);
        timerId = null;
        startButton.textContent = 'Start';
    }
    toggleMode();
});

addTimeButton.addEventListener('click', addFiveMinutes);

// Update the focusSubmit event listener
focusSubmit.addEventListener('click', () => {
    const focusTask = focusInput.value.trim();
    if (focusTask) {
        focusModal.classList.add('hidden');
        document.body.style.overflow = 'auto';  // Re-enable scrolling
        startTimerInternal(focusTask);
        setTimeout(() => {
            focusInput.value = '';
        }, 100);
    }
});

// Also update the Enter key handler
focusInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const focusTask = focusInput.value.trim();
        if (focusTask) {
            focusModal.classList.add('hidden');
            document.body.style.overflow = 'auto';  // Re-enable scrolling
            startTimerInternal(focusTask);
            setTimeout(() => {
                focusInput.value = '';
            }, 100);
        }
    }
});

// Update showFocusModal function
function showFocusModal() {
    focusModal.classList.remove('hidden');
    focusInput.focus();
    document.body.style.overflow = 'hidden';  // Prevent scrolling when modal is open
}

// Initialize display
timeLeft = WORK_TIME;
updateDisplay(timeLeft);

// Initialize colors
updateColors(true); 