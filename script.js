// สคริปต์ควบคุมการอัปเดตจำนวนจากเซิร์ฟเวอร์ SA-MP
document.addEventListener("DOMContentLoaded", function() {
    console.log("Auto Farm UI Script Loaded and Ready.");
    
    // บังคับให้ Container แสดงผลแน่ๆ ผ่าน JavaScript อีกชั้นหนึ่ง
    const container = document.getElementById("farm-container");
    if(container) {
        container.style.display = "block";
        container.style.opacity = "1";
        container.style.visibility = "visible";
    }
});

// ฟังก์ชันรอรับค่า Event จากสคริปต์ Pawn (เช่น อัปเดตยอดแครอท)
if (typeof cef !== 'undefined') {
    cef.on("UpdateCarrotCount", (current, max) => {
        document.getElementById("current-count").innerText = current;
        document.getElementById("max-count").innerText = max;
    });
}
