document.addEventListener('DOMContentLoaded', function() {
    // 获取元素
    const targetH2List = document.querySelectorAll('.about-section h2, .contact-section h2');
    
    // 定义一组丰富的导航栏背景颜色
    const colorList = [
        '#2c3e50',   // 初始默认色
        '#34495e',
        '#1abc9c',
        '#2ecc71',
        '#3498db',
        '#9b59b6',
        '#e67e22',
        '#e74c3c',
        '#16a085',
        '#27ae60'
    ];

    // 定义颜色索引，用于切换颜色列表中的值
    let colorIndex = 0;

    
    setInterval(function() {
        // 切换到下一个颜色，超出列表长度则重置为0
        colorIndex = (colorIndex + 1) % colorList.length;

        const currentColor = colorList[colorIndex];

        // 给所有目标h2设置border-bottom颜色
        targetH2List.forEach(h2 => {
            h2.style.borderBottomColor = currentColor;
        });
    }, 50); // 50毫秒
});