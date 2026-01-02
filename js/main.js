// 保留原有JS功能，适配旧版浏览器语法（零几年浏览器兼容写法）
window.onload = function() { // 用window.onload替代DOMContentLoaded，旧版浏览器兼容更好
    // 获取元素
    var targetH2List = document.querySelectorAll('.about-section h2, .contact-section h2');
    
    // 定义一组复古颜色（零几年常见颜色）
    var colorList = [
        '#cc0000',   // 大红色（旧版主流）
        '#003366',   // 深蓝色
        '#009900',   // 草绿色
        '#ff6600',   // 橙色
        '#9900cc',   // 紫色
        '#0066cc'    // 天蓝色
    ];

    // 定义颜色索引
    var colorIndex = 0;

    setInterval(function() {
        // 切换到下一个颜色
        colorIndex = (colorIndex + 1) % colorList.length;
        var currentColor = colorList[colorIndex];

        // 给所有目标h2设置border-bottom颜色（用for循环替代forEach，旧版兼容更好）
        for(var i=0; i<targetH2List.length; i++) {
            targetH2List[i].style.borderBottomColor = currentColor;
        }
    }, 50);
};