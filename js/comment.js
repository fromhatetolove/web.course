// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const usernameInput = document.getElementById('username');
    const commentContentInput = document.getElementById('comment-content');
    const submitBtn = document.getElementById('submit-comment');
    const commentContainer = document.getElementById('comment-container');
    // 新增：获取当前文章的唯一ID（从 comment-section 的 data-article-id 属性中读取）
    const commentSection = document.querySelector('.comment-section');
    const articleId = commentSection.dataset.articleId; // 拿到文章唯一标识（如 article_nginx）
    // 新增：拼接当前文章的 localStorage 键名（核心：用文章ID区分存储）
    const storageKey = `${articleId}_comments`; // 最终键名：如 article_nginx_comments

    // 初始化：加载当前文章的本地存储评论
    loadComments();

    // 提交评论按钮点击事件
    submitBtn.addEventListener('click', function() {
        const username = usernameInput.value.trim();
        const commentContent = commentContentInput.value.trim();

        // 验证输入是否为空
        if (!username || !commentContent) {
            alert('昵称和评论内容不能为空，请填写完整！');
            return;
        }

        // 创建评论对象
        const commentObj = {
            id: Date.now(), // 用时间戳作为唯一ID
            username: username,
            content: commentContent,
            time: getCurrentTime() // 获取当前时间
        };

        // 保存评论到当前文章的本地存储
        saveComment(commentObj);

        // 清空输入框
        usernameInput.value = '';
        commentContentInput.value = '';

        // 重新加载当前文章的评论列表
        loadComments();

        alert('评论提交成功！');
    });

    // 保存评论到本地存储（修改：使用拼接后的 storageKey，不再固定 blogComments）
    function saveComment(comment) {
        // 获取当前文章已有的评论列表（用 storageKey 读取）
        let comments = JSON.parse(localStorage.getItem(storageKey)) || [];
        // 添加新评论
        comments.unshift(comment); // 新增评论放在最前面
        // 重新存储到当前文章的本地存储（用 storageKey 存储）
        localStorage.setItem(storageKey, JSON.stringify(comments));
    }

    // 加载本地存储的评论并展示（修改：使用拼接后的 storageKey，不再固定 blogComments）
    function loadComments() {
        // 清空现有评论列表
        commentContainer.innerHTML = '';
        // 获取当前文章的本地评论（用 storageKey 读取）
        let comments = JSON.parse(localStorage.getItem(storageKey)) || [];

        if (comments.length === 0) {
            commentContainer.innerHTML = '<p style="color:#999;">暂无评论，欢迎发表你的看法~</p>';
            return;
        }

        // 遍历评论，创建DOM元素并添加到页面
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

    // 获取当前格式化时间（无需修改）
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