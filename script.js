// 紫微斗数核心数据
const PALACES = ["命宫", "兄弟", "夫妻", "子女", "财帛", "疾厄", "迁移", "交友", "事业", "田宅", "福德", "父母"];
const MAIN_STARS = ["紫微", "天机", "太阳", "武曲", "天同", "廉贞", "天府", "太阴", "贪狼", "巨门", "天相", "天梁", "七杀", "破军"];
const MINOR_STARS = ["文昌", "文曲", "左辅", "右弼", "天魁", "天钺", "禄存", "擎羊", "陀罗", "火星", "铃星", "地空", "地劫"];

// 时辰对应命宫位置
const HOUR_PALACE_MAP = {
    "23-1": 0,   // 子时 -> 命宫
    "1-3": 1,    // 丑时 -> 兄弟
    "3-5": 2,    // 寅时 -> 夫妻
    "5-7": 3,    // 卯时 -> 子女
    "7-9": 4,    // 辰时 -> 财帛
    "9-11": 5,   // 巳时 -> 疾厄
    "11-13": 6,  // 午时 -> 迁移
    "13-15": 7,  // 未时 -> 交友
    "15-17": 8,  // 申时 -> 事业
    "17-19": 9,  // 酉时 -> 田宅
    "19-21": 10, // 戌时 -> 福德
    "21-23": 11  // 亥时 -> 父母
};

// 初始化 - DOM加载完成后绑定事件
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('birth-form').addEventListener('submit', handleFormSubmit);
});

// 处理表单提交
function handleFormSubmit(e) {
    e.preventDefault();
    
    // 获取输入值
    const birthDate = document.getElementById('birth-date').value;
    const birthTime = document.getElementById('birth-time').value;
    const gender = document.querySelector('input[name="gender"]:checked').value;
    
    // 验证输入
    if (!birthDate || !birthTime || !gender) {
        alert('请填写完整的出生信息');
        return;
    }
    
    // 计算命盘
    const destinyChart = calculateDestinyChart(birthDate, birthTime, gender);
    
    // 渲染命盘
    renderDestinyChart(destinyChart);
    
    // 显示结果区域
    document.querySelector('.result-section').classList.remove('hidden');
}

// 计算命盘（简化版）
function calculateDestinyChart(birthDate, birthTime, gender) {
    const date = new Date(birthDate);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    // 1. 计算八字（简化）
    const heavenlyStems = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
    const earthlyBranches = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
    
    const yearStem = heavenlyStems[(year - 4) % 10];
    const yearBranch = earthlyBranches[(year - 4) % 12];
    const monthStem = heavenlyStems[((year % 5) * 2 + month) % 10];
    const monthBranch = earthlyBranches[(month + 1) % 12];
    
    // 2. 确定命宫位置
    const lifePalaceIndex = HOUR_PALACE_MAP[birthTime];
    
    // 3. 生成十二宫位
    const palaces = [];
    for (let i = 0; i < 12; i++) {
        const palaceIndex = (lifePalaceIndex + i) % 12;
        palaces.push({
            name: PALACES[palaceIndex],
            stars: []
        });
    }
    
    // 4. 分布主星（简化随机分布）
    const shuffledStars = [...MAIN_STARS].sort(() => Math.random() - 0.5);
    palaces.forEach((palace, index) => {
        if (index < shuffledStars.length) {
            palace.stars.push(shuffledStars[index]);
        }
    });
    
    // 5. 分布辅星（随机选择2-3个）
    const minorCount = Math.floor(Math.random() * 2) + 2;
    const shuffledMinor = [...MINOR_STARS].sort(() => Math.random() - 0.5).slice(0, minorCount);
    palaces[lifePalaceIndex].stars.push(...shuffledMinor);
    
    // 6. 生成命理解析
    const fortuneText = generateFortuneText(palaces[lifePalaceIndex], year, gender);
    
    return {
        birthDate: `${year}年${month}月${day}日`,
        birthTime: Object.keys(HOUR_PALACE_MAP).find(key => HOUR_PALACE_MAP[key] === lifePalaceIndex),
        gender: gender === 'male' ? '男' : '女',
        palaces,
        fortuneText
    };
}

// 生成命理解析文本
function generateFortuneText(lifePalace, birthYear, gender) {
    const adjectives = ["充满变数", "平稳顺利", "机遇连连", "挑战重重"];
    const domains = ["事业", "感情", "财运", "健康"];
    const outcomes = ["大有可为", "需谨慎行事", "将获贵人相助", "宜守不宜攻"];
    
    const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomDomain = domains[Math.floor(Math.random() * domains.length)];
    const randomOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];
    
    const starsDesc = lifePalace.stars.join('、');
    const animalSigns = ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"];
    const animalSign = animalSigns[(birthYear - 4) % 12];
    
    return `身为${animalSign}年${gender}性，命宫主星${starsDesc}。${birthYear}年运势${randomAdj}，尤其在${randomDomain}领域${randomOutcome}。需注意人际关系维护，把握秋季关键机遇。`;
}

// 渲染命盘到页面
function renderDestinyChart(destinyChart) {
    const chartContainer = document.getElementById('destiny-chart');
    chartContainer.innerHTML = '';
    
    destinyChart.palaces.forEach(palace => {
        const cell = document.createElement('div');
        cell.className = 'chart-cell';
        cell.dataset.palace = palace.name;
        
        const title = document.createElement('h4');
        title.textContent = palace.name;
        cell.appendChild(title);
        
        const starList = document.createElement('ul');
        starList.className = 'star-list';
        palace.stars.forEach(star => {
            const starItem = document.createElement('li');
            starItem.textContent = star;
            starList.appendChild(starItem);
        });
        cell.appendChild(starList);
        
        chartContainer.appendChild(cell);
    });
    
    document.getElementById('fortune-text').textContent = destinyChart.fortuneText;
    
    // 添加宫位连线动画
    addConstellationLines();
}

// 添加宫位连线动画
function addConstellationLines() {
    const container = document.querySelector('.destiny-chart-container');
    if (!container) return;
    
    // 移除现有canvas
    const oldCanvas = document.getElementById('constellation-canvas');
    if (oldCanvas) oldCanvas.remove();
    
    // 创建新canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'constellation-canvas';
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    container.insertBefore(canvas, container.firstChild);
    
    const ctx = canvas.getContext('2d');
    const cells = document.querySelectorAll('.chart-cell');
    const centerPoints = [];
    
    // 获取所有宫位的中心点
    cells.forEach(cell => {
        const rect = cell.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        centerPoints.push({
            x: rect.left + rect.width/2 - containerRect.left,
            y: rect.top + rect.height/2 - containerRect.top,
            palace: cell.dataset.palace
        });
    });
    
    // 定义连接关系（简化版）
    const connections = [
        {from: "命宫", to: "迁移"},
        {from: "兄弟", to: "交友"},
        {from: "夫妻", to: "事业"},
        {from: "子女", to: "田宅"},
        {from: "财帛", to: "福德"},
        {from: "疾厄", to: "父母"}
    ];
    
    // 绘制连接线
    function drawLines() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
        ctx.lineWidth = 1;
        
        connections.forEach(conn => {
            const fromPoint = centerPoints.find(p => p.palace === conn.from);
            const toPoint = centerPoints.find(p => p.palace === conn.to);
            
            if (fromPoint && toPoint) {
                ctx.beginPath();
                ctx.moveTo(fromPoint.x, fromPoint.y);
                ctx.lineTo(toPoint.x, toPoint.y);
                ctx.stroke();
                
                // 添加光点效果
                const gradient = ctx.createRadialGradient(
                    toPoint.x, toPoint.y, 0,
                    toPoint.x, toPoint.y, 5
                );
                gradient.addColorStop(0, 'rgba(212, 175, 55, 0.8)');
                gradient.addColorStop(1, 'rgba(212, 175, 55, 0)');
                
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(toPoint.x, toPoint.y, 5, 0, Math.PI * 2);
                ctx.fill();
            }
        });
    }
    
    // 初始绘制
    drawLines();
    
    // 添加流动动画
    let animationPhase = 0;
    function animateLines() {
        animationPhase = (animationPhase + 0.01) % (Math.PI * 2);
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
        ctx.lineWidth = 1;
        
        connections.forEach(conn => {
            const fromPoint = centerPoints.find(p => p.palace === conn.from);
            const toPoint = centerPoints.find(p => p.palace === conn.to);
            
            if (fromPoint && toPoint) {
                // 基础线条
                ctx.beginPath();
                ctx.moveTo(fromPoint.x, fromPoint.y);
                ctx.lineTo(toPoint.x, toPoint.y);
                ctx.stroke();
                
                // 流动光效
                const dx = toPoint.x - fromPoint.x;
                const dy = toPoint.y - fromPoint.y;
                const length = Math.sqrt(dx * dx + dy * dy);
                const progress = Math.sin(animationPhase) * 0.5 + 0.5;
                
                const movingX = fromPoint.x + dx * progress;
                const movingY = fromPoint.y + dy * progress;
                
                const gradient = ctx.createRadialGradient(
                    movingX, movingY, 0,
                    movingX, movingY, 8
                );
                gradient.addColorStop(0, 'rgba(255, 215, 0, 1)');
                gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
                
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(movingX, movingY, 8, 0, Math.PI * 2);
                ctx.fill();
            }
        });
        
        requestAnimationFrame(animateLines);
    }
    
    animateLines();
    
    // 窗口大小变化时重置canvas
    window.addEventListener('resize', () => {
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
        drawLines();
    });
}
