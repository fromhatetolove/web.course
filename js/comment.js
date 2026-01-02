// 页面加载完成后执行初始化
document.addEventListener('DOMContentLoaded', function () {
    // 获取DOM元素
    const usernameInput = document.getElementById('username');
    const commentContentInput = document.getElementById('comment-content');
    const submitBtn = document.getElementById('submit-comment');
    const commentContainer = document.getElementById('comment-container');
    // 获取评论区及当前文章唯一ID
    const commentSection = document.querySelector('.comment-section');
    const articleId = commentSection.dataset.articleId;
    // 根目录评论JSON文件路径（全局评论表）
    const commentJsonPath = '../comments.json'; // 对应根目录，若js在根目录直接写 'comments.json'

    // 初始化加载当前文章的评论
    loadComments();

    // 提交评论按钮点击事件绑定
    submitBtn.addEventListener('click', function () {
        const username = usernameInput.value.trim();
        const commentContent = commentContentInput.value.trim();

        // 验证昵称和评论内容非空
        if (!username || !commentContent) {
            alert('昵称和评论内容不能为空，请填写完整！');
            return;
        }

        // 创建评论对象
        const commentObj = {
            id: Date.now(), // 时间戳作为唯一ID
            username: username,
            content: commentContent,
            time: getCurrentTime() // 获取格式化当前时间
        };

        // 保存评论并重新加载列表
        saveComment(articleId, commentObj);
        // 清空输入框
        usernameInput.value = '';
        commentContentInput.value = '';
        // 刷新评论列表
        loadComments();

        alert('评论提交成功！');
    });

    /**
     * 保存评论到根目录JSON文件（按文章ID分组存储）
     * @param {string} articleId - 文章唯一标识
     * @param {object} comment - 评论对象
     */
    function saveComment(articleId, comment) {
        // 先读取现有评论文件（若无则初始化空对象）
        let commentsData = {};
        try {
            // 读取本地JSON文件
            const xhr = new XMLHttpRequest();
            xhr.open('GET', commentJsonPath, false); // 同步请求，确保读取完成再操作
            xhr.send(null);
            if (xhr.status === 200) {
                commentsData = JSON.parse(xhr.responseText);
            }
        } catch (err) {
            // 文件不存在时，初始化空对象（后续会自动创建）
            commentsData = {};
        }

        // 初始化当前文章的评论数组（若无则创建空数组）
        if (!commentsData[articleId]) {
            commentsData[articleId] = [];
        }

        // 新评论插入到列表头部（最新评论在前）
        commentsData[articleId].unshift(comment);

        // 将更新后的评论数据写入JSON文件
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', commentJsonPath, false); // 同步写入
        xhr.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
        xhr.send(JSON.stringify(commentsData, null, 2)); // 格式化JSON，便于查看
    }

    /**
     * 加载对应文章的评论并渲染到页面
     */
    function loadComments() {
        // 清空现有评论容器
        commentContainer.innerHTML = '';
        // 初始化当前文章评论列表
        let articleComments = [];

        try {
            // 读取根目录JSON评论文件
            const xhr = new XMLHttpRequest();
            xhr.open('GET', commentJsonPath, false);
            xhr.send(null);
            if (xhr.status === 200) {
                const commentsData = JSON.parse(xhr.responseText);
                // 获取当前文章的评论（若无则为空数组）
                articleComments = commentsData[articleId] || [];
            }
        } catch (err) {
            // 文件不存在或读取失败时，评论列表为空
            articleComments = [];
        }

        // 无评论时显示提示文本
        if (articleComments.length === 0) {
            commentContainer.innerHTML = '<p style="color:#999;">暂无评论，欢迎发表你的看法~</p>';
            return;
        }

        // 遍历评论列表，创建DOM并添加到容器
        articleComments.forEach(comment => {
            const commentItem = document.createElement('div');
            commentItem.className = 'single-comment';
            commentItem.innerHTML = `
                <div class="comment-username">${comment.username}</div>
                <div class="comment-time">${comment.time}</div>
                <div class="comment-text">${comment.content}</div>
            `;
            commentContainer.appendChild(commentItem);
        });
    }

    /**
     * 获取格式化的当前时间（年-月-日 时:分:秒）
     * @returns {string} 格式化后的时间字符串
     */
    function getCurrentTime() {
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
});