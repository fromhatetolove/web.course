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
    // 拼接当前文章的本地存储键名（按文章ID区分）
    const storageKey = `${articleId}_comments`;

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
        saveComment(commentObj);
        // 清空输入框
        usernameInput.value = '';
        commentContentInput.value = '';
        // 刷新评论列表
        loadComments();

        alert('评论提交成功！');
    });

    // 保存评论到对应文章的本地存储
    function saveComment(comment) {
        // 获取当前文章已存评论，无则返回空数组
        let comments = JSON.parse(localStorage.getItem(storageKey)) || [];
        // 新评论插入到列表头部
        comments.unshift(comment);
        // 重新存储评论到本地
        localStorage.setItem(storageKey, JSON.stringify(comments));
    }

    // 加载对应文章的本地评论并渲染到页面
    function loadComments() {
        // 清空现有评论容器
        commentContainer.innerHTML = '';
        // 获取当前文章的评论列表
        let comments = JSON.parse(localStorage.getItem(storageKey)) || [];

        // 无评论时显示提示文本
        if (comments.length === 0) {
            commentContainer.innerHTML = '<p style="color:#999;">暂无评论，欢迎发表你的看法~</p>';
            return;
        }

        // 遍历评论列表，创建DOM并添加到容器
        comments.forEach(comment => {
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

    // 获取格式化的当前时间（年-月-日 时:分:秒）
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