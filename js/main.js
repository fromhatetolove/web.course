// 旧版浏览器兼容JS功能
window.onload = function () {
    // 获取about和contact模块的H2元素
    var targetH2List = document.querySelectorAll('.about-section h2, .contact-section h2');

    // 颜色数组
    var colorList = [
        '#cc0000',
        '#003366',
        '#009900',
        '#ff6600',
        '#9900cc',
        '#0066cc'
    ];

    // 颜色索引
    var colorIndex = 0;

    // 定时切换颜色
    setInterval(function () {
        // 更新循环颜色索引
        colorIndex = (colorIndex + 1) % colorList.length;
        var currentColor = colorList[colorIndex];

        // 遍历设置H2下划线颜色
        for (var i = 0; i < targetH2List.length; i++) {
            targetH2List[i].style.borderBottomColor = currentColor;
        }
    }, 50);
};