window.addEventListener('message', function(event) {
    let item = event.data;

    // สั่งเปิด UI
    if (item.action === "showUI") {
        document.getElementById('farm-container').style.display = 'flex';
        document.getElementById('max-count').innerText = item.maxCount;
        document.querySelector('.item-title').innerText = item.itemName; 
    } 
    
    // สั่งปิด UI
    else if (item.action === "hideUI") {
        document.getElementById('farm-container').style.display = 'none';
    } 
    
    // อัปเดตจำนวนตัวเลขปัจจุบัน
    else if (item.action === "updateCount") {
        document.getElementById('current-count').innerText = item.current;
    }
    
    // อัปเดตสถานะเมื่อกดปุ่มเริ่มฟาร์ม / หยุดฟาร์ม (สลับเป็นสีส้ม/สีแดง)
    else if (item.action === "updateStatus") {
        let footer = document.querySelector('.footer-button');
        if (item.farming) {
            footer.innerHTML = `กำลังฟาร์มออโต้... กด <span class="key-trigger">N</span> เพื่อหยุด`;
            footer.style.backgroundColor = "#e67e22"; // เมื่อฟาร์มอยู่ปุ่มจะเปลี่ยนเป็นสีส้มแจ้งเตือน
            footer.style.color = "#ffffff";
            footer.style.boxShadow = "0 6px 20px rgba(230, 126, 34, 0.3)";
        } else {
            footer.innerHTML = `กด <span class="key-trigger">N</span> เพื่อเริ่มฟาร์มออโต้`;
            footer.style.backgroundColor = "#ff1a40"; // กลับเป็นสีแดงเมื่อหยุด
            footer.style.color = "#0d0d11";
            footer.style.boxShadow = "0 6px 20px rgba(255, 26, 64, 0.3)";
        }
    }
});