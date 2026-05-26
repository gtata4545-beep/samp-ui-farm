/* ==========================================
   SA-MP CEF Auto Farm - Carrot Script
   ==========================================
   กด N (หรือตามปุ่มใน config.js) เพื่อเริ่ม/หยุดฟาร์มออโต้
   ปรับเวลาเก็บและจำนวนต่อครั้งได้จาก config.js
   เก็บครบตามจำนวนที่กำหนด จะหยุดอัตโนมัติ
   ========================================== */

// ==========================================
// Setup configuration fallback if config.js is missing
// ==========================================
const CONFIG = typeof FARM_CONFIG !== 'undefined' ? FARM_CONFIG : {
    toggleKey: 'n',
    maxCount: 60,
    harvestTime: 3,
    harvestAmount: 1
};

// ==========================================
// State
// ==========================================

let state = {
    isFarming: false,
    currentCount: 0,
    harvestTime: CONFIG.harvestTime,      // ดึงจาก config.js
    harvestAmount: CONFIG.harvestAmount,  // ดึงจาก config.js
    timerInterval: null,
    timeLeft: 0,
};

// ==========================================
// DOM Elements
// ==========================================

const elements = {
    panel: document.getElementById('farm-panel'),
    currentCount: document.getElementById('current-count'),
    maxCount: document.getElementById('max-count'),
    progressBar: document.getElementById('progress-bar'),
    statusText: document.getElementById('status-text'),
    actionText: document.getElementById('action-text'),
    carrotImg: document.getElementById('carrot-img'),
    toast: document.getElementById('toast'),
    toastText: document.getElementById('toast-text'),
    keyBadge: document.querySelector('.key-badge') // ดึงปุ่มใน UI เพื่อเปลี่ยนตัวอักษรตามปุ่มที่ตั้งค่า
};

// ==========================================
// Toast Notification
// ==========================================

let toastTimeout = null;

function showToast(message, duration = 2500) {
    elements.toastText.textContent = message;
    elements.toast.classList.remove('hidden');
    elements.toast.classList.add('show');

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        elements.toast.classList.remove('show');
        elements.toast.classList.add('hidden');
    }, duration);
}

// ==========================================
// Particle Effects
// ==========================================

function createParticles(count = 6) {
    const container = document.querySelector('.carrot-container');
    const rect = container.getBoundingClientRect();

    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.textContent = '🥕';
        particle.style.fontSize = `${14 + Math.random() * 10}px`;
        particle.style.left = `${rect.width / 2}px`;
        particle.style.top = `${rect.height / 2}px`;

        const angle = (Math.PI * 2 / count) * i + (Math.random() * 0.5);
        const distance = 40 + Math.random() * 60;
        particle.style.setProperty('--tx', `${Math.cos(angle) * distance}px`);
        particle.style.setProperty('--ty', `${Math.sin(angle) * distance}px`);

        container.appendChild(particle);

        setTimeout(() => particle.remove(), 1000);
    }
}

// ==========================================
// Update UI
// ==========================================

function updateCounterDisplay() {
    elements.currentCount.textContent = state.currentCount;

    // Pulse animation
    elements.currentCount.classList.remove('pulse');
    void elements.currentCount.offsetWidth; // Force reflow
    elements.currentCount.classList.add('pulse');

    // Progress bar
    const progress = (state.currentCount / CONFIG.maxCount) * 100;
    elements.progressBar.style.width = `${progress}%`;
}

function updateStatus(text, className = '') {
    elements.statusText.textContent = text;
    elements.statusText.className = 'status-text ' + className;
}

// ==========================================
// Harvest Logic
// ==========================================

function doHarvest() {
    if (!state.isFarming) return;

    // เพิ่มจำนวน
    const remaining = CONFIG.maxCount - state.currentCount;
    const addAmount = Math.min(state.harvestAmount, remaining);
    state.currentCount += addAmount;

    // อัพเดท UI
    updateCounterDisplay();
    createParticles(4);

    // ===================================
    // SA-MP CEF Event: ส่งข้อมูลไปยังเซิร์ฟเวอร์
    // ===================================
    // ถ้าใช้ใน SA-MP CEF จริง ให้ uncomment บรรทัดนี้:
    // cef.emit('onHarvest', state.currentCount, addAmount);

    // ตรวจสอบครบ 60
    if (state.currentCount >= CONFIG.maxCount) {
        completeFarming();
        return;
    }

    // แสดงสถานะ
    updateStatus(`กำลังเก็บ... (${state.currentCount}/${CONFIG.maxCount})`, 'active');
}

function startCountdown() {
    state.timeLeft = state.harvestTime;

    if (state.timerInterval) clearInterval(state.timerInterval);

    state.timerInterval = setInterval(() => {
        state.timeLeft--;

        if (state.timeLeft <= 0) {
            doHarvest();

            // ถ้ายังฟาร์มอยู่ ให้เริ่มนับใหม่
            if (state.isFarming) {
                state.timeLeft = state.harvestTime;
            } else {
                clearInterval(state.timerInterval);
            }
        }

        if (state.isFarming) {
            updateStatus(`เก็บใน ${state.timeLeft} วินาที... (${state.currentCount}/${CONFIG.maxCount})`, 'active');
        }
    }, 1000);
}

// ==========================================
// Farm Control
// ==========================================

function startFarming() {
    if (state.currentCount >= CONFIG.maxCount) {
        // รีเซ็ตถ้าเก็บครบแล้ว
        state.currentCount = 0;
        updateCounterDisplay();
        elements.panel.classList.remove('complete');
    }

    state.isFarming = true;

    // Update UI
    elements.panel.classList.add('farming');
    elements.panel.classList.remove('complete');
    elements.carrotImg.classList.add('farming');
    elements.carrotImg.classList.remove('complete');
    elements.actionText.textContent = 'เพื่อหยุดฟาร์มออโต้';
    updateStatus(`เริ่มฟาร์ม! เก็บทุก ${state.harvestTime} วินาที`, 'active');

    showToast('เริ่มฟาร์มออโต้แล้ว!');

    // Start harvest loop
    startCountdown();

    // ===================================
    // SA-MP CEF Event: แจ้งเซิร์ฟเวอร์ว่าเริ่มฟาร์ม
    // ===================================
    // cef.emit('onFarmStart', state.harvestTime, state.harvestAmount);
}

function stopFarming() {
    state.isFarming = false;

    // Clear intervals
    if (state.timerInterval) {
        clearInterval(state.timerInterval);
        state.timerInterval = null;
    }

    // Update UI
    elements.panel.classList.remove('farming');
    elements.carrotImg.classList.remove('farming');
    elements.actionText.textContent = 'เพื่อเริ่มฟาร์มออโต้';
    updateStatus('⏸ หยุดฟาร์มแล้ว', '');

    showToast('⏸ หยุดฟาร์มออโต้');

    // ===================================
    // SA-MP CEF Event: แจ้งเซิร์ฟเวอร์ว่าหยุดฟาร์ม
    // ===================================
    // cef.emit('onFarmStop', state.currentCount);
}

function completeFarming() {
    state.isFarming = false;

    // Clear intervals
    if (state.timerInterval) {
        clearInterval(state.timerInterval);
        state.timerInterval = null;
    }

    // Update UI
    elements.panel.classList.remove('farming');
    elements.panel.classList.add('complete');
    elements.carrotImg.classList.remove('farming');
    elements.carrotImg.classList.add('complete');
    elements.actionText.textContent = 'เพื่อเริ่มฟาร์มใหม่';
    updateStatus('✅ เก็บครบ 60 แล้ว! ยกเลิกฟาร์มอัตโนมัติ', 'complete');

    showToast('✅ เก็บครบ 60 แล้ว! ยกเลิกฟาร์มอัตโนมัติ', 4000);

    // สร้าง particles พิเศษ
    createParticles(12);

    // ===================================
    // SA-MP CEF Event: แจ้งเซิร์ฟเวอร์ว่าเก็บครบ
    // ===================================
    // cef.emit('onFarmComplete', state.currentCount);
}

function toggleFarming() {
    if (state.isFarming) {
        stopFarming();
    } else {
        startFarming();
    }
}

// ==========================================
// Keyboard Listener
// ==========================================

document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === CONFIG.toggleKey) {
        e.preventDefault();
        toggleFarming();
    }
});

// ==========================================
// SA-MP CEF Integration (ถ้าใช้ใน SA-MP จริง)
// ==========================================

/*
    สำหรับใช้ใน SA-MP CEF จริง:

    1. ใน client-side script (.js):
    
    const browser = cef.create_browser(1920, 1080, "package://cef/carrot_farm/carrot_farm.html", true);
    
    cef.on('onHarvest', (count, amount) => {
        // ส่งไปยัง server
        mp.trigger('server:onCarrotHarvest', count, amount);
    });
    
    cef.on('onFarmStart', (time, amount) => {
        mp.trigger('server:onCarrotFarmStart', time, amount);
        // ล็อคตัวละครให้ยืนนิ่ง
        mp.game.controls.disable(0, true);
    });
    
    cef.on('onFarmStop', (count) => {
        mp.trigger('server:onCarrotFarmStop', count);
        // ปลดล็อคตัวละคร
        mp.game.controls.enable(0, true);
    });
    
    cef.on('onFarmComplete', (count) => {
        mp.trigger('server:onCarrotFarmComplete', count);
        // ปลดล็อคตัวละคร
        mp.game.controls.enable(0, true);
    });

    2. ใน server-side script:
    
    mp.events.add('server:onCarrotHarvest', (player, count, amount) => {
        // อัพเดทจำนวนแครอทของผู้เล่น
        player.setVariable('carrots', count);
    });
    
    mp.events.add('server:onCarrotFarmComplete', (player, count) => {
        // ให้รางวัลผู้เล่น
        player.setVariable('carrots', count);
        player.outputChatBox('คุณเก็บแครอทครบ 60 อันแล้ว!');
    });
*/

// ==========================================
// Initialize
// ==========================================

function init() {
    // กำหนดจำนวนสูงสุดใน UI ตามที่ตั้งใน config.js
    elements.maxCount.textContent = CONFIG.maxCount;
    
    // แสดงปุ่มคีย์ลัดใน UI ตามปุ่มที่ตั้งใน config.js
    if (elements.keyBadge) {
        elements.keyBadge.textContent = CONFIG.toggleKey.toUpperCase();
    }
    
    updateCounterDisplay();

    console.log('[AutoFarm] 🥕 Carrot Auto Farm loaded from config.js!');
    console.log(`[AutoFarm] Settings: MaxCount=${CONFIG.maxCount}, Time=${CONFIG.harvestTime}s, Amount=${CONFIG.harvestAmount}`);
    console.log(`[AutoFarm] Press ${CONFIG.toggleKey.toUpperCase()} to start/stop farming`);
}

// Run
init();
