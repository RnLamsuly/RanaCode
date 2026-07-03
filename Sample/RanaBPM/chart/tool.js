// 全局变量存储谱面数据
let chartsData = [];

// 获取容器元素
const chartsContainer = document.getElementById('chartsList');
const filterChips = document.querySelectorAll('.filter-chip');
const resetBtn = document.getElementById('resetFiltersBtn');

// 存储当前选中的筛选值
let activeFilters = new Set();

// 下载函数
function downloadFile(url, filename) {
    if (!url || !filename) {
        console.error('下载链接或文件名缺失');
        return;
    }
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// 渲染谱面列表
function renderChartList() {
    if (!chartsData.length) return;
    
    let filteredData = chartsData;
    
    if (activeFilters.size > 0) {
        filteredData = chartsData.filter(chart => {
            return activeFilters.has(chart.game);
        });
    }
    filteredData = [...filteredData].reverse();
    
    if (filteredData.length === 0) {
        chartsContainer.innerHTML = `<div class="empty-message">没有找到符合条件的谱面</div>`;
        return;
    }
    
    let cardsHtml = '';
    for (let chart of filteredData) {
        cardsHtml += `
            <div class="chart-card" data-id="${chart.id}" data-download="${chart.download}" data-filename="${chart.Filename}">
                <div class="chart-info">
                    <div class="song-title">${escapeHtml(chart.title)}</div>
                    <div class="artist"><span>曲师</span> ${escapeHtml(chart.artist)}</div>
                    <div class="meta-grid">
                        <div class="meta-item"><strong>类别</strong> ${chart.game}</div>
                        <div class="meta-item"><strong>难度</strong> ${chart.difficulty}</div>
                        <div class="meta-item"><strong>BPM</strong> ${chart.bpm}</div>
                    </div>
                </div>
                <div class="description-area">
                    <div class="description-text">${escapeHtml(chart.description || '暂无简介')}</div>
                </div>
                <div class="jacket-area">
                    <img class="jacket" src="${chart.cover}" alt="曲绘" loading="lazy" onerror="this.src='https://picsum.photos/id/114/300/300'">
                </div>
            </div>
        `;
    }
    chartsContainer.innerHTML = cardsHtml;
    
    document.querySelectorAll('.chart-card').forEach(card => {
        card.addEventListener('click', (e) => {
            const url = card.dataset.download;
            const filename = card.dataset.filename;
            if (url && filename) {
                downloadFile(url, filename);
            }
        });
    });
}

// 从 JSON 文件加载数据
async function loadChartsData() {
    try {
        const response = await fetch('charts.json');
        if (!response.ok) throw new Error('加载失败');
        chartsData = await response.json();
        renderChartList();
    } catch (error) {
        console.error('加载谱面数据失败:', error);
        chartsContainer.innerHTML = `<div class="empty-message">加载谱面数据失败，请刷新重试</div>`;
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

// 更新按钮激活样式
function updateButtonsActiveState() {
    filterChips.forEach(btn => {
        const filterValue = btn.getAttribute('data-filter');
        if (activeFilters.has(filterValue)) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// 处理筛选按钮点击
function onFilterClick(event) {
    const btn = event.currentTarget;
    const filterValue = btn.getAttribute('data-filter');
    if (!filterValue) return;
    
    if (activeFilters.has(filterValue)) {
        activeFilters.delete(filterValue);
    } else {
        activeFilters.add(filterValue);
    }
    
    updateButtonsActiveState();
    renderChartList();
}

// 重置所有筛选
function resetAllFilters() {
    activeFilters.clear();
    updateButtonsActiveState();
    renderChartList();
}

// 绑定筛选按钮事件
function bindFilterEvents() {
    filterChips.forEach(btn => {
        btn.removeEventListener('click', onFilterClick);
        btn.addEventListener('click', onFilterClick);
    });
    if (resetBtn) {
        resetBtn.removeEventListener('click', resetAllFilters);
        resetBtn.addEventListener('click', resetAllFilters);
    }
}

// 初始化
function init() {
    bindFilterEvents();
    loadChartsData();  // 从 JSON 加载数据
}

document.addEventListener('DOMContentLoaded', init);