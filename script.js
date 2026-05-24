window.addEventListener('message', function(event) {
    let item = event.data;

    // สั่งแสดงผล UI (สไลด์เข้ามาจากฝั่งซ้าย)
    if (item.action === "showUI") {
        let container = document.getElementById('farm-container');
        container.classList.remove('ui-hidden');
        container.classList.add('ui-show');
        
        document.getElementById('max-count').innerText = item.maxCount;
        document.querySelector('.item-title').innerText = item.itemName; 
    } 
    
    // สั่งปิดและซ่อน UI (สไลด์เก็บกลับไปฝั่งซ้าย)
    else if (item.action === "hideUI") {
        let container = document.getElementById('farm-container');
        container.classList.remove('ui-show');
        container.classList.add('ui-hidden');
    } 
    
    // อัปเดตตัวเลขจำนวนไอเทมปัจจุบัน
    else if (item.action === "updateCount") {
        document.getElementById('current-count').innerText = item.current;
    }
    
    // อัปเดตสถานะการกดสลับสีปุ่มฟาร์ม (สีแดง/สีส้ม)
    else if (item.action === "updateStatus") {
        let footer = document.querySelector('.footer-button');
        if (item.farming) {
            footer.innerHTML = `กำลังฟาร์มออโต้... กด <span class="key-trigger">N</span> เพื่อหยุด`;
            footer.style.backgroundColor = "#e67e22"; 
            footer.style.color = "#ffffff";
            footer.style.boxShadow = "0 6px 20px rgba(230, 126, 34, 0.3)";
        } else {
            footer.innerHTML = `กด <span class="key-trigger">N</span> เพื่อเริ่มฟาร์มออโต้`;
            footer.style.backgroundColor = "#ff1a40"; 
            footer.style.color = "#0d0d11";
            footer.style.boxShadow = "0 6px 20px rgba(255, 26, 64, 0.3)";
        }
    }
});
