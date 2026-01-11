function getTodayDate() {
    return new Date().toISOString().split('T')[0]; // YYYY-MM-DD
}

function updateDailyStreak() {
    const today = getTodayDate();

    let streak = Number(localStorage.getItem("ecoStreak")) || 0;
    let lastDate = localStorage.getItem("ecoLastDate");

    if (!lastDate) {
        streak = 1;
    } 
    else {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);  
        const yDate = yesterday.toISOString().split('T')[0];

        if (lastDate === today) {
            return streak; // already counted today
        }
        else if (lastDate === yDate) {
            streak += 1; // continue streak
        }
        else {
            streak = 1; // missed a day
        }
    }

    localStorage.setItem("ecoStreak", streak);
    localStorage.setItem("ecoLastDate", today);

    return streak;
}

// Data Coefficients
const FACTORS = {
    transport: 0.192, // kg per km
    energy: 0.4,      // kg per unit
    food: 2.5,        // kg per meal
    purchase: 0.1     // kg per currency unit
};

let currentStreak = 5; // Default from image

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
        p.classList.add('hidden');
    });
    
    const target = document.getElementById(pageId);
    target.classList.remove('hidden');
    target.classList.add('active');
    window.scrollTo(0,0);
}

function calculateResult() {
    // 1. Gather Inputs
    const valTrans = parseFloat(document.getElementById('inp-transport').value) || 0;
    const valEnergy = parseFloat(document.getElementById('inp-energy').value) || 0;
    const valFood = parseFloat(document.getElementById('inp-food').value) || 0;
    const valPurch = parseFloat(document.getElementById('inp-purchase').value) || 0;

    // 2. Calculate
    const total = (
        (valTrans * FACTORS.transport) +
        (valEnergy * FACTORS.energy) +
        (valFood * FACTORS.food) +
        (valPurch * FACTORS.purchase)
    ).toFixed(1);

    // 3. Update DOM
    document.getElementById('preview-score').textContent = total;
    document.getElementById('final-score').textContent = total;

    // 4. Set Impact Status
    const badge = document.getElementById('impact-badge');
    const txt = document.getElementById('impact-text');
    
    badge.className = 'impact-badge'; // reset
    if (total < 6) {
        badge.classList.add('low-impact');
        txt.textContent = "Low Impact";
    } else if (total < 15) {
        badge.classList.add('medium-impact');
        txt.textContent = "Medium Impact";
    } else {
        badge.classList.add('high-impact');
        txt.textContent = "High Impact";
    }

    // 5. Update Streak Logic (Simulated)
    // updateStreak(currentStreak);
    const streak = updateDailyStreak();

// update UI
document.getElementById('home-streak-val').textContent = streak + " Days";
document.getElementById('final-streak-val').textContent = streak + " Days";

    // 6. Navigate
    showPage('result-page');
}

function updateStreak(days) {
    document.getElementById('home-streak-val').textContent = days + " Days";
    document.getElementById('final-streak-val').textContent = days + " Days";

    // Unlock badges based on days
    const b7 = document.getElementById('badge-7');
    const b14 = document.getElementById('badge-14');

    if(days >= 7) b7.classList.add('active');
    else b7.classList.remove('active');

    if(days >= 14) b14.classList.add('active');
    else b14.classList.remove('active');
}

// Initial Run
document.addEventListener('DOMContentLoaded', () => {
    const streak = Number(localStorage.getItem("ecoStreak")) || 0;
    document.getElementById('home-streak-val').textContent = streak + " Days";
    showPage('home-page');
});
