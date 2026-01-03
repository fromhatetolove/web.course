# server.py
import http.server
import socketserver
import json
import os
from urllib.parse import urlparse

# 定义端口（可自定义，如8080、5500）
PORT = 5500
# 评论文件路径（项目根目录的comments.json）
COMMENT_FILE = "comments.json"

# 自定义请求处理器，继承内置的SimpleHTTPRequestHandler
class CommentHandler(http.server.SimpleHTTPRequestHandler):
    # 处理GET请求（读取评论文件+托管静态文件）
    def do_GET(self):
        # 如果请求的是comments.json，单独处理
        if self.path == "/comments.json":
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            # 检查文件是否存在，不存在则返回空对象
            if os.path.exists(COMMENT_FILE):
                with open(COMMENT_FILE, "r", encoding="utf-8") as f:
                    self.wfile.write(f.read().encode("utf-8"))
            else:
                self.wfile.write(b"{}")
        # 其他请求（HTML/CSS/JS等），按默认静态文件托管处理
        else:
            super().do_GET()

    # 处理PUT请求（写入评论文件）
    def do_PUT(self):
        # 只处理comments.json的PUT请求
        if self.path == "/comments.json":
            try:
                # 获取请求体长度
                content_length = int(self.headers.get("Content-Length", 0))
                # 读取请求体数据
                post_data = self.rfile.read(content_length)
                # 解析为JSON（格式化写入，便于查看）
                comment_data = json.loads(post_data.decode("utf-8"))
                # 写入文件
                with open(COMMENT_FILE, "w", encoding="utf-8") as f:
                    json.dump(comment_data, f, ensure_ascii=False, indent=2)
                # 返回成功响应
                self.send_response(200)
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(b"Write success")
            except Exception as e:
                # 异常时返回500错误
                self.send_response(500)
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(f"Error: {str(e)}".encode("utf-8"))
        else:
            # 非comments.json的PUT请求，返回404
            self.send_response(404)
            self.end_headers()

    # 解决跨域问题（可选，增强兼容性）
    def end_headers(self):
        self.send_header("Access-Control-Allow-Methods", "GET, PUT, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        super().end_headers()

    # 处理OPTIONS预检请求（解决跨域）
    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

# 启动服务器
if __name__ == "__main__":
    with socketserver.TCPServer(("", PORT), CommentHandler) as httpd:
        print(f"Python服务器已启动，访问地址：http://localhost:{PORT}")
        print(f"评论文件路径：{os.path.abspath(COMMENT_FILE)}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            # 按Ctrl+C停止服务器
            httpd.server_close()
            print("服务器已停止")