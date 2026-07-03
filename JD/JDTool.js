// ========== 全局状态 ==========
var allProblems = [];           // 全部题目数据
var expandedCardId = null;      // 当前展开的卡片 ID
var loadedContent = {};         // 已加载的题解内容缓存

// ========== 页面初始化 ==========
document.addEventListener('DOMContentLoaded', function () {
    fetchFileList();
    bindSearchEvent();
});

// ========== 获取文件列表 ==========
function fetchFileList() {
    fetch('./filelist.json')
        .then(function (res) {
            if (!res.ok) throw new Error('文件列表加载失败');
            return res.json();
        })
        .then(function (files) {
            allProblems = files.map(function (filename, index) {
                return {
                    id: 'problem-' + index,
                    filename: filename,
                    title: filename.replace(/\.md$/, ''),
                    index: index
                };
            });
            renderList(allProblems);
            updateTotalCount(allProblems.length);
        })
        .catch(function (err) {
            console.error('加载文件列表出错:', err);
            document.getElementById('listContainer').innerHTML =
                '<div class="empty-hint">题目列表加载失败，请检查 filelist.json 是否存在</div>';
        });
}

// ========== 渲染列表 ==========
function renderList(problems) {
    var container = document.getElementById('listContainer');
    var emptyHint = document.getElementById('emptyHint');

    if (problems.length === 0) {
        container.innerHTML = '';
        emptyHint.style.display = 'block';
        return;
    }

    emptyHint.style.display = 'none';

    var html = '';
    for (var i = 0; i < problems.length; i++) {
        var p = problems[i];
        var indexLabel = p.title.match(/JD(\d+)/);
        var indexText = indexLabel ? '#' + indexLabel[1] : '';

        html += '<div class="problem-card" data-id="' + p.id + '" data-filename="' + escapeHtml(p.filename) + '">';
        html += '  <div class="card-header">';
        html += '    <span class="card-index">' + indexText + '</span>';
        html += '    <span class="card-title">' + escapeHtml(p.title) + '</span>';
        html += '    <button class="expand-btn" onclick="toggleExpand(\'' + p.id + '\', \'' + escapeHtml(p.filename) + '\')">展开</button>';
        html += '  </div>';
        html += '  <div class="expand-area" id="expand-' + p.id + '">';
        html += '    <div class="expand-inner solution-content" id="inner-' + p.id + '"></div>';
        html += '  </div>';
        html += '</div>';
    }

    container.innerHTML = html;
}

// ========== 展开/折叠题解 ==========
function toggleExpand(problemId, filename) {
    var expandArea = document.getElementById('expand-' + problemId);
    var innerArea = document.getElementById('inner-' + problemId);
    var btn = getExpandBtn(problemId);
    var isOpening = !expandArea.classList.contains('open');

    // 如果点击的是已展开的卡片 -> 折叠
    if (!isOpening) {
        collapseCard(problemId, expandArea, btn);
        return;
    }

    // 先折叠之前展开的卡片
    if (expandedCardId && expandedCardId !== problemId) {
        var prevArea = document.getElementById('expand-' + expandedCardId);
        var prevBtn = getExpandBtn(expandedCardId);
        if (prevArea) collapseCard(expandedCardId, prevArea, prevBtn);
    }

    // 展开当前卡片
    expandedCardId = problemId;
    expandArea.classList.add('open');
    btn.textContent = '收起';
    btn.classList.add('active');

    // 显示加载动画
    innerArea.innerHTML = '<div class="loading-spinner"><div class="spinner-dot"></div><div class="spinner-dot"></div><div class="spinner-dot"></div></div>';

    // 加载并渲染 .md 内容
    loadAndRender(filename, innerArea, problemId);
}

function collapseCard(problemId, expandArea, btn) {
    expandArea.classList.remove('open');
    btn.textContent = '展开';
    btn.classList.remove('active');
    if (expandedCardId === problemId) {
        expandedCardId = null;
    }
}

function getExpandBtn(problemId) {
    var card = document.querySelector('.problem-card[data-id="' + problemId + '"]');
    return card ? card.querySelector('.expand-btn') : null;
}

// ========== 加载并渲染 Markdown ==========
function loadAndRender(filename, container, problemId) {
    // 检查缓存
    if (loadedContent[filename]) {
        container.innerHTML = loadedContent[filename];
        typesetMath(container);
        return;
    }

    var encodedFilename = encodeURIComponent(filename);

    fetch('./' + encodedFilename)
        .then(function (res) {
            if (!res.ok) throw new Error('文件加载失败: ' + res.status);
            return res.text();
        })
        .then(function (mdText) {
            var html = renderMarkdown(mdText);
            loadedContent[filename] = html;
            container.innerHTML = html;
            // highlight.js 语法高亮
            var codeBlocks = container.querySelectorAll('pre code');
            for (var i = 0; i < codeBlocks.length; i++) {
                hljs.highlightElement(codeBlocks[i]);
            }
            typesetMath(container);
        })
        .catch(function (err) {
            console.error('加载题解出错:', err);
            container.innerHTML = '<p style="color:#f36f7c;padding:1rem 0;">题解加载失败: ' + escapeHtml(err.message) + '</p>';
        });
}

// ========== Markdown 渲染 ==========
function renderMarkdown(mdText) {
    if (typeof marked !== 'undefined') {
        // 配置 marked
        marked.setOptions({
            breaks: true,
            gfm: true
        });

        // 保护 LaTeX 数学块，避免 marked.js 转义其中的 & \< 等字符
        var mathBlocks = [];
        var protectedText = mdText;

        // 1. 保护 $$...$$ 块级公式
        protectedText = protectedText.replace(/\$\$([\s\S]*?)\$\$/g, function (match, content) {
            mathBlocks.push({ type: 'display', content: content });
            return '%%MATHBLOCK' + (mathBlocks.length - 1) + '%%';
        });

        // 2. 保护 $...$ 行内公式（至少一个非$字符，不跨行）
        protectedText = protectedText.replace(/\$([^\$\n]+?)\$/g, function (match, content) {
            mathBlocks.push({ type: 'inline', content: content });
            return '%%MATHBLOCK' + (mathBlocks.length - 1) + '%%';
        });

        // 3. 用 marked 解析被保护的文本
        var html = marked.parse(protectedText);

        // 4. 还原数学块
        for (var i = 0; i < mathBlocks.length; i++) {
            var block = mathBlocks[i];
            var delimiter = block.type === 'display' ? '$$' : '$';
            html = html.replace('%%MATHBLOCK' + i + '%%', delimiter + block.content + delimiter);
        }

        return html;
    }

    // 简易 fallback
    return fallbackRender(mdText);
}

function fallbackRender(mdText) {
    var html = escapeHtml(mdText);
    html = html.replace(/\n\n/g, '</p><p>');
    html = '<p>' + html + '</p>';
    return html;
}

// ========== MathJax 重新排版 ==========
function typesetMath(container) {
    if (window.MathJax && MathJax.typesetPromise) {
        MathJax.typesetPromise([container]).catch(function (err) {
            console.warn('MathJax 渲染错误:', err);
        });
    }
}

// ========== 搜索过滤 ==========
function bindSearchEvent() {
    var input = document.getElementById('searchInput');
    input.addEventListener('input', function () {
        var keyword = input.value.trim().toLowerCase();
        filterList(keyword);
    });
}

function filterList(keyword) {
    var cards = document.querySelectorAll('.problem-card');
    var visibleCount = 0;

    for (var i = 0; i < cards.length; i++) {
        var card = cards[i];
        var filename = card.getAttribute('data-filename') || '';
        var title = filename.replace(/\.md$/, '').toLowerCase();

        if (keyword === '' || title.indexOf(keyword) !== -1) {
            card.style.display = '';
            visibleCount++;
        } else {
            // 如果正在展开，先折叠
            var cardId = card.getAttribute('data-id');
            if (cardId === expandedCardId) {
                var expandArea = document.getElementById('expand-' + cardId);
                var btn = getExpandBtn(cardId);
                if (expandArea) collapseCard(cardId, expandArea, btn);
            }
            card.style.display = 'none';
        }
    }

    updateTotalCount(visibleCount);

    var emptyHint = document.getElementById('emptyHint');
    emptyHint.style.display = visibleCount === 0 ? 'block' : 'none';
}

function updateTotalCount(count) {
    document.getElementById('totalCount').textContent = count;
}

// ========== 工具函数 ==========
function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}
