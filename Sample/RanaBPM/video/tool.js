// 手元展览馆 - 主逻辑
// 依赖外部 videos.json 文件

let timelineData = {
    updated: [],    // 已更新手元 { id, bvid, title, artist, game, date, description }
    planned: []     // 计划更新 { id, title, artist, game, description, plannedDate }
};

let currentActiveId = null;
let currentType = null; // 'updated' or 'planned'

// 获取dom元素
const timelineContainer = document.getElementById('timelineList');
const biliIframe = document.getElementById('biliIframe');
const infoPanelTitle = document.querySelector('#infoPanel .description-title');
const infoPanelDesc = document.querySelector('#infoPanel .description-text');

// 辅助函数: 构建时间线html（混合显示，按id倒序，用标识区分）
function renderTimeline(data) {
    if (!data) return '<div class="empty-state">暂无数据</div>';
    
    // 合并所有条目，并标记类型
    let allItems = [];
    
    if (data.updated && data.updated.length > 0) {
        data.updated.forEach(item => {
            allItems.push({
                ...item,
                _type: 'updated',
                _statusText: '已发布',
                _statusClass: 'updated',
                _dateField: item.date,
                _gameField: item.game,
                _displayDate: item.date || '未知日期'
            });
        });
    }
    
    if (data.planned && data.planned.length > 0) {
        data.planned.forEach(item => {
            allItems.push({
                ...item,
                _type: 'planned',
                _statusText: '计划中',
                _statusClass: 'planned',
                _dateField: item.plannedDate,
                _gameField: item.game,
                _displayDate: item.plannedDate || '待定'
            });
        });
    }
    
    // 按 id 倒序排序
    allItems.sort((a, b) => b.id - a.id);
    
    if (allItems.length === 0) {
        return '<div class="empty-state">暂无手元数据，请检查 JSON 文件</div>';
    }
    
    let html = `<div class="timeline-group">
                    <div class="group-title">全部手元 (${allItems.length})</div>`;
    
    allItems.forEach(item => {
        const activeClass = (currentActiveId === item.id && currentType === item._type) ? 'active' : '';
        html += `
            <div class="timeline-item ${activeClass}" data-type="${item._type}" data-id="${item.id}">
                <div class="item-title">
                    ${escapeHtml(item.title)}
                    <span class="badge-status ${item._statusClass}">${item._statusText}</span>
                </div>
                <div class="item-meta">
                    <div>${escapeHtml(item._gameField || '音游')}</div>
                    <div>${escapeHtml(item._displayDate)}</div>
                </div>
            </div>
        `;
    });
    
    html += `</div>`;
    return html;
}

// 根据id和type显示右侧视频
function displayVideoByItem(type, id, data) {
    if (type === 'updated') {
        const item = data.updated.find(i => i.id == id);
        if (item && item.bvid) {
            const embedUrl = `https://player.bilibili.com/player.html?bvid=${item.bvid}&page=1&high_quality=1&autoplay=0`;
            biliIframe.src = embedUrl;
            infoPanelTitle.innerText = `${item.title} - ${item.artist || '未知曲师'}`;
            let descText = item.description || '暂无简介。';
            if (item.game) descText = `游戏：${item.game}\n` + descText;
            if (item.date) descText = `日期：${item.date}\n` + descText;
            infoPanelDesc.innerText = descText;
            return;
        }
        // 如果没找到或没有bvid
        biliIframe.src = "about:blank";
        infoPanelTitle.innerText = `${item?.title || '视频'}`;
        infoPanelDesc.innerText = item?.description || '暂无简介，或 BV 号缺失。';
    } else if (type === 'planned') {
        const item = data.planned.find(i => i.id == id);
        if (item) {
            biliIframe.src = "about:blank";
            infoPanelTitle.innerText = `即将发布：${item.title}`;
            let descText = item.description || '该手元尚未发布，敬请期待！';
            if (item.game) descText = `游戏：${item.game}\n状态：未发布\n${descText}`;
            if (item.plannedDate) descText += `\n预计日期：${item.plannedDate}`;
            infoPanelDesc.innerText = descText;
            return;
        }
        // 没找到
        biliIframe.src = "about:blank";
        infoPanelTitle.innerText = "✨ 暂无预览";
        infoPanelDesc.innerText = "请从左侧时间线选择一个有效的手元视频。";
    } else {
        // 重置
        biliIframe.src = "about:blank";
        infoPanelTitle.innerText = "✨ 欢迎来到手元展览馆";
        infoPanelDesc.innerText = "点击左侧时间线中的任意视频，即可观看对应手元。\n已更新手元按时间倒序排列，计划手元展示未来录制清单~";
    }
}

// 绑定左侧点击事件
function bindTimelineEvents(data) {
    const items = document.querySelectorAll('.timeline-item');
    items.forEach(el => {
        el.removeEventListener('click', timelineClickHandler);
        el.addEventListener('click', timelineClickHandler);
    });
    
    function timelineClickHandler(e) {
        const targetItem = e.currentTarget;
        const type = targetItem.getAttribute('data-type');
        const id = parseInt(targetItem.getAttribute('data-id'));
        if (!type || !id) return;
        
        document.querySelectorAll('.timeline-item').forEach(item => item.classList.remove('active'));
        targetItem.classList.add('active');
        
        currentActiveId = id;
        currentType = type;
        displayVideoByItem(type, id, data);
    }
}

// 加载JSON数据
async function loadHandcamData() {
    try {
        const response = await fetch('videos.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const jsonData = await response.json();
        
        const mergedData = {
            updated: jsonData.updated || [],
            planned: jsonData.planned || []
        };
        
        // 确保有id和必要字段
        mergedData.updated = mergedData.updated.map((item, idx) => {
            if (!item.id) item.id = Date.now() + idx + 100;
            if (!item.date) item.date = "2025-01-01";
            return item;
        });
        mergedData.planned = mergedData.planned.map((item, idx) => {
            if (!item.id) item.id = Date.now() + idx + 200;
            if (!item.plannedDate) item.plannedDate = "即将推出";
            return item;
        });
        
        timelineContainer.innerHTML = renderTimeline(mergedData);
        bindTimelineEvents(mergedData);
        
        // 默认选中第一个（按id倒序后的第一个）
        const firstItem = document.querySelector('.timeline-item');
        if (firstItem) {
            const type = firstItem.getAttribute('data-type');
            const id = parseInt(firstItem.getAttribute('data-id'));
            if (type && id) {
                currentActiveId = id;
                currentType = type;
                displayVideoByItem(type, id, mergedData);
                firstItem.classList.add('active');
            }
        } else {
            timelineContainer.innerHTML = '<div class="empty-state" style="padding:1rem;">暂无手元记录，请补充videos.json</div>';
        }
    } catch (err) {
        console.error('加载手元数据失败:', err);
        timelineContainer.innerHTML = `<div class="empty-state">❌ 加载失败，请确保 videos.json 文件存在且格式正确。<br>${err.message}</div>`;
        biliIframe.src = "about:blank";
        infoPanelTitle.innerText = "数据加载错误";
        infoPanelDesc.innerText = "请检查 videos.json 是否与页面同目录，并且格式为 { updated: [], planned: [] }。";
    }
}

// 辅助防XSS
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// 启动
loadHandcamData();