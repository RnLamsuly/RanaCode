#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
XMUOJ 通用题目爬虫
支持爬取任意题单下的题目内容，生成 HTML 文件保存到 ./Problem 目录。
所有参数（账号、密码、题单ID、题单密码、题目范围）均在运行时手动输入，
代码中不含任何硬编码凭据，可安全提交到版本控制系统。
"""

import time
from getpass import getpass
import requests
from pathlib import Path

# ==================== 配置 ====================
BASE_URL = "http://xmuoj.com"

# 输出目录（脚本所在目录下的 Problem 文件夹）
SCRIPT_DIR = Path(__file__).resolve().parent
OUTPUT_DIR = SCRIPT_DIR / "Problem"

# ==================== 会话管理 ====================
session = requests.Session()
session.headers.update({
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "application/json, text/plain, */*",
    "Referer": f"{BASE_URL}/login",
})


def get_csrf_token():
    """从 cookie 中获取 CSRF token"""
    csrf = session.cookies.get("csrftoken")
    if not csrf:
        raise RuntimeError("无法获取 CSRF token，请先调用 login()")
    return csrf


def login(username, password):
    """登录 XMUOJ，登录后 CSRF token 会自动存入 cookie"""
    print("[1/5] 正在登录...")

    resp = session.post(
        f"{BASE_URL}/api/login",
        json={"username": username, "password": password},
        headers={"Content-Type": "application/json"},
    )
    data = resp.json()
    if data.get("error") is not None or data.get("data") != "Succeeded":
        raise RuntimeError(f"登录失败: {data}")
    csrf = get_csrf_token()
    print(f"  CSRF Token: {csrf[:20]}...")
    print("  登录成功！")


def verify_contest_password(contest_id, password):
    """验证题单密码"""
    print("[2/5] 正在验证题单密码...")
    csrf = get_csrf_token()

    resp = session.post(
        f"{BASE_URL}/api/contest/password",
        json={"contest_id": contest_id, "password": password},
        headers={
            "X-CSRFToken": csrf,
            "Content-Type": "application/json",
        },
    )
    data = resp.json()
    if data.get("error") is not None or data.get("data") is not True:
        raise RuntimeError(f"题单密码验证失败: {data}")
    print("  题单密码验证成功！")


def fetch_problem(contest_id, problem_code):
    """获取单个题目的数据"""
    csrf = get_csrf_token()
    resp = session.get(
        f"{BASE_URL}/api/contest/problem",
        params={"contest_id": contest_id, "problem_id": problem_code},
        headers={"X-CSRFToken": csrf},
    )
    data = resp.json()
    if data.get("error") is not None:
        raise RuntimeError(f"获取题目 {problem_code} 失败: {data}")
    return data["data"]


def build_html(problem_data, problem_code, contest_id):
    """将题目 JSON 数据构建为完整的 HTML 页面（玻璃拟态风格，匹配 solutionStyle.css）"""
    title = problem_data.get("title", problem_code)
    description = problem_data.get("description", "")
    input_desc = problem_data.get("input_description", "")
    output_desc = problem_data.get("output_description", "")
    hint = problem_data.get("hint", "")
    samples = problem_data.get("samples", [])
    time_limit = problem_data.get("time_limit", "N/A")
    memory_limit = problem_data.get("memory_limit", "N/A")
    difficulty = problem_data.get("difficulty", "N/A")
    languages = problem_data.get("languages", [])
    source = problem_data.get("source", "")
    total_score = problem_data.get("total_score", "N/A")

    # 构建元信息标签
    tags_html = f"""
        <span class="meta-tag">⏱ {time_limit} ms</span>
        <span class="meta-tag">📦 {memory_limit} MB</span>
        <span class="meta-tag">📊 {difficulty}</span>
        <span class="meta-tag">📝 {total_score} 分</span>"""
    if source:
        tags_html += f'\n        <span class="meta-tag">📂 {source}</span>'
    tags_html += f'\n        <span class="meta-tag">💻 {", ".join(languages)}</span>'

    # 构建样例 HTML
    samples_html = ""
    if samples:
        for i, sample in enumerate(samples, 1):
            samples_html += f"""
                <div class="sample-group">
                    <h4>样例 {i}</h4>
                    <div class="sample-row">
                        <div class="sample-col">
                            <div class="sample-label">输入</div>
                            <pre><code>{sample.get("input", "")}</code></pre>
                        </div>
                        <div class="sample-col">
                            <div class="sample-label">输出</div>
                            <pre><code>{sample.get("output", "")}</code></pre>
                        </div>
                    </div>
                </div>"""

    html = f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">
    <title>{problem_code} - {title} | RanaCode</title>
    <link rel="stylesheet" href="../../shared/solutionStyle.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11/build/styles/github.min.css">
    <link rel="icon" href="../../Sample/RanaBPM/logo.png">
    <script src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11/build/highlight.min.js"></script>
    <script>
        // MathJax 配置
        window.MathJax = {{
            tex: {{
                inlineMath: [['$', '$']],
                displayMath: [['$$', '$$']],
                processEscapes: true,
                macros: {{ "&": "{{\\\\unicode{{x26}}}}" }}
            }},
            options: {{ skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'] }}
        }};
    </script>
    <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
    <script>hljs.highlightAll();</script>
    <style>
        /* ===== 题目页面专属样式（补充 solutionStyle.css） ===== */

        .top-bar {{
            position: sticky;
            top: 1rem;
            z-index: 10;
        }}

        .problem-card {{
            background: var(--glass-bg);
            backdrop-filter: blur(12px) saturate(160%);
            -webkit-backdrop-filter: blur(12px) saturate(160%);
            border-radius: 1.2rem;
            border: 1px solid var(--glass-border);
            box-shadow: var(--glass-shadow);
            padding: 2rem 2.5rem;
            margin-bottom: 1.5rem;
        }}

        .problem-title {{
            font-size: 1.8rem;
            font-weight: 700;
            background: linear-gradient(120deg, #f36f7c, #5bc8a8);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            margin-bottom: 1rem;
        }}

        /* 元信息标签栏 */
        .meta-tags {{
            display: flex;
            flex-wrap: wrap;
            gap: 0.6rem;
            margin-bottom: 2rem;
            padding-bottom: 1.5rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.4);
        }}

        .meta-tag {{
            font-size: 0.85rem;
            font-weight: 600;
            color: #1e2f35;
            background: rgba(255, 255, 255, 0.45);
            padding: 0.3rem 0.8rem;
            border-radius: 20px;
            border: 1px solid rgba(255, 255, 255, 0.5);
            white-space: nowrap;
            backdrop-filter: blur(4px);
        }}

        .meta-tag:first-child {{
            background: rgba(91, 200, 168, 0.3);
        }}

        .meta-tag:nth-child(2) {{
            background: rgba(243, 111, 124, 0.22);
        }}

        /* 板块标题 */
        .section-title {{
            font-size: 1.25rem;
            font-weight: 700;
            margin: 2rem 0 0.8rem;
            color: #2c4b3a;
            border-left: 3px solid var(--accent-green);
            padding-left: 0.7rem;
        }}

        /* 样例区域 */
        .sample-group {{
            margin: 1.2rem 0;
        }}

        .sample-group h4 {{
            font-size: 0.95rem;
            font-weight: 650;
            color: #3a5a48;
            margin-bottom: 0.5rem;
        }}

        .sample-row {{
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
        }}

        .sample-col {{
            background: rgba(255, 255, 255, 0.35);
            border-radius: 0.8rem;
            border: 1px solid rgba(255, 255, 255, 0.5);
            overflow: hidden;
        }}

        .sample-label {{
            font-size: 0.8rem;
            font-weight: 700;
            color: #ffffff;
            background: rgba(91, 200, 168, 0.55);
            padding: 0.3rem 1rem;
            letter-spacing: 0.04em;
        }}

        .sample-col pre {{
            margin: 0;
            padding: 0.8rem 1rem;
            background: transparent;
            border-radius: 0;
            border: none;
            font-size: 0.95rem;
            white-space: pre-wrap;
            word-wrap: break-word;
            color: #1e2f35;
        }}

        .sample-col pre code {{
            background: none;
            padding: 0;
            font-size: inherit;
            color: inherit;
        }}

        /* 提示区域 */
        .hint-block {{
            background: rgba(243, 111, 124, 0.1);
            border-left: 3px solid var(--accent-pink);
            margin: 1rem 0;
            padding: 1rem 1.2rem;
            border-radius: 0 0.8rem 0.8rem 0;
        }}

        /* 页脚 */
        .page-footer {{
            text-align: center;
            font-size: 0.85rem;
            padding: 20px 0;
            color: #FFFFFF;
        }}

        .footer-link {{
            color: inherit;
            text-decoration: none;
        }}

        .footer-link:hover {{
            color: #90EE90;
        }}

        /* 响应式 */
        @media (max-width: 700px) {{
            .problem-card {{
                padding: 1.2rem 1rem;
            }}
            .problem-title {{
                font-size: 1.4rem;
            }}
            .sample-row {{
                grid-template-columns: 1fr;
            }}
        }}
    </style>
</head>
<body>
    <div class="main-container">
        <!-- 顶部导航条 -->
        <div class="top-bar">
            <a href="../../index.html" class="back-link">返回首页</a>
            <span class="page-title">{problem_code}</span>
            <span class="page-subtitle">{title}</span>
        </div>

        <!-- 题目内容卡片 -->
        <div class="problem-card">
            <div class="solution-content">
                <h1 class="problem-title">{problem_code} - {title}</h1>

                <div class="meta-tags">{tags_html}
                </div>

                <div class="section-title">题目描述</div>
                {description}

                <div class="section-title">输入格式</div>
                {input_desc}

                <div class="section-title">输出格式</div>
                {output_desc}
{""
                if not samples else f'''
                <div class="section-title">样例</div>
                {samples_html}
'''}{""
                if not hint else f'''
                <div class="section-title">提示</div>
                <div class="hint-block">{hint}</div>
'''}
            </div>
        </div>
    </div>

    <footer class="page-footer">
        Developed by <a href="https://space.bilibili.com/1896204321" target="_blank" class="footer-link">RnLamsuly</a>
        &middot; 爬取自 XMUOJ Contest #{contest_id}
        &middot; <a href="https://github.com/RnLamsuly/RanaCode" target="_blank" class="footer-link">Repositories</a>
    </footer>
</body>
</html>"""
    return html


def main():
    print("=" * 60)
    print("  XMUOJ 题目爬虫")
    print(f"  输出目录: {OUTPUT_DIR}")
    print("=" * 60)
    print()

    # ==================== 手动输入所有参数，避免硬编码泄露 ====================

    # --- 凭据 ---
    username = input("请输入账号: ").strip()
    password = getpass("请输入密码: ")
    if not username or not password:
        print("错误: 账号和密码不能为空！")
        return

    # --- 题单信息 ---
    contest_id_str = input("请输入题单 ID (如 362): ").strip()
    try:
        contest_id = int(contest_id_str)
    except ValueError:
        print("错误: 题单 ID 必须是数字！")
        return

    contest_password = getpass("请输入题单密码 (无密码直接回车): ")

    # --- 题目范围 ---
    prefix = input("请输入题目编号前缀 (如 LinK): ").strip()
    if not prefix:
        print("错误: 题目编号前缀不能为空！")
        return

    start_str = input("请输入起始编号 (如 1): ").strip()
    end_str = input("请输入结束编号 (如 49): ").strip()
    try:
        start = int(start_str)
        end = int(end_str)
    except ValueError:
        print("错误: 起始/结束编号必须是数字！")
        return

    # 推断编号的补零位数（如 LinK01 是 2 位）
    digits_str = input("请输入编号补零位数 (如 2 表示 01~99，直接回车则自动推断): ").strip()
    if digits_str:
        try:
            digits = int(digits_str)
        except ValueError:
            print("错误: 补零位数必须是数字！")
            return
    else:
        digits = len(end_str)

    print()
    print(f"配置确认:")
    print(f"  账号: {username}")
    print(f"  题单 ID: {contest_id}")
    print(f"  题目范围: {prefix}{start:0{digits}d} ~ {prefix}{end:0{digits}d}")
    print(f"  共 {end - start + 1} 道题目")
    print()

    # ==================== 执行爬取 ====================

    # 创建输出目录
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # 登录
    login(username, password)

    # 验证题单密码（如果有）
    if contest_password:
        verify_contest_password(contest_id, contest_password)
    else:
        print("[2/5] 未提供题单密码，跳过验证")

    # 爬取题目
    total = end - start + 1
    print(f"[3/5] 正在爬取题目 {prefix}{start:0{digits}d} ~ {prefix}{end:0{digits}d}...")
    success_count = 0
    fail_list = []

    for i in range(start, end + 1):
        problem_code = f"{prefix}{i:0{digits}d}"
        try:
            print(f"  正在获取: {problem_code}...", end=" ")
            problem_data = fetch_problem(contest_id, problem_code)
            html_content = build_html(problem_data, problem_code, contest_id)

            file_path = OUTPUT_DIR / f"{problem_code}.html"
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(html_content)

            print(f"[OK] 已保存 ({problem_data.get('title', 'N/A')})")
            success_count += 1

            # 请求间隔，避免给服务器造成压力
            time.sleep(0.5)

        except Exception as e:
            print(f"[FAIL] 失败: {e}")
            fail_list.append(problem_code)
            time.sleep(0.5)

    # 结果汇总
    print()
    print("[5/5] 爬取完成!")
    print(f"  成功: {success_count}/{total}")
    if fail_list:
        print(f"  失败: {fail_list}")
    print(f"  文件保存在: {OUTPUT_DIR.resolve()}")
    print("=" * 60)


if __name__ == "__main__":
    main()
