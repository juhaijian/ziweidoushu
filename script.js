// 紫微斗数核心计算模块
const ZiWeiCalculator = {
    // 主星列表
    stars: [
        "紫微", "天机", "太阳", "武曲", "天同", "廉贞",
        "天府", "太阴", "贪狼", "巨门", "天相", "天梁", "七杀", "破军"
    ],
    
    // 地支列表
    earthlyBranches: ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"],
    
    // 宫位名称
    palaces: [
        "命宫", "兄弟宫", "夫妻宫", "子女宫", "财帛宫", "疾厄宫",
        "迁移宫", "仆役宫", "官禄宫", "田宅宫", "福德宫", "父母宫"
    ],
    
    // 根据公历日期计算农历日期（简化版）
    getLunarDate: function(solarDate) {
        // 这里是简化实现，实际应用应该使用完整的农历算法
        // 返回格式: { year: 农历年, month: 农历月, day: 农历日 }
        return {
            year: solarDate.getFullYear(),
            month: solarDate.getMonth() + 1,
            day: solarDate.getDate()
        };
    },
    
    // 计算命宫
    calculateMingPalace: function(lunarMonth, earthlyBranchHour) {
        const branchIndex = this.earthlyBranches.indexOf(earthlyBranchHour);
        if (branchIndex === -1) return 0;
        
        // 命宫计算公式: (14 - 月支 - 时支) % 12
        return (14 - lunarMonth - branchIndex) % 12;
    },
    
    // 生成命盘
    generateChart: function(birthDate, birthTime) {
        const lunarDate = this.getLunarDate(birthDate);
        const mingPalace = this.calculateMingPalace(lunarDate.month, birthTime);
        
        // 生成12宫位
        const chart = [];
        for (let i = 0; i < 12; i++) {
            const palaceIndex = (mingPalace + i) % 12;
            chart.push({
                name: this.palaces[palaceIndex],
                stars: this.getStarsForPalace(palaceIndex, lunarDate.day)
            });
        }
        
        return chart;
    },
    
    // 为宫位分配主星（简化版）
    getStarsForPalace: function(palaceIndex, lunarDay) {
        // 这里是简化实现，实际紫微斗数有复杂的安星规则
        const starsInPalace = [];
        
        // 根据宫位和日期决定主星
        if (palaceIndex === 0) { // 命宫
            starsInPalace.push(this.stars[lunarDay % this.stars.length]);
        }
        
        // 每个宫位至少有一个主星
        if (starsInPalace.length === 0) {
            starsInPalace.push(this.stars[(palaceIndex + lunarDay) % this.stars.length]);
        }
        
        return starsInPalace;
    },
    
    // 生成命理分析
    generateAnalysis: function(chart) {
        const mingPalace = chart.find(p => p.name === "命宫");
        const mainStar = mingPalace.stars[0];
        
        // 简化的命理分析
        const analyses = {
            "紫微": "紫微星坐命，有领导才能，但需注意不要过于自负。",
            "天机": "天机星坐命，聪明机智，适合从事策划、研究类工作。",
            "太阳": "太阳星坐命，热情开朗，有领导魅力，但需注意锋芒太露。",
            // 其他主星分析...
        };
        
        return analyses[mainStar] || "命理分析需要结合更多星曜和宫位进行综合判断。";
    }
};

// DOM操作和交互逻辑
document.addEventListener('DOMContentLoaded', function() {
    const calculateBtn = document.getElementById('calculate-btn');
    const resultSection = document.getElementById('result-section');
    
    calculateBtn.addEventListener('click', function() {
        // 获取用户输入
        const birthDate = new Date(document.getElementById('birth-date').value);
        const birthTime = document.getElementById('birth-time').value;
        
        // 验证输入
        if (!birthDate || !birthTime) {
            alert('请填写完整的出生信息');
            return;
        }
        
        // 显示加载动画
        calculateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 测算中...';
        calculateBtn.disabled = true;
        
        // 模拟计算延迟
        setTimeout(function() {
            // 生成命盘
            const chart = ZiWeiCalculator.generateChart(birthDate, birthTime);
            const analysis = ZiWeiCalculator.generateAnalysis(chart);
            
            // 显示结果
            displayResults(chart, analysis);
            
            // 恢复按钮状态
            calculateBtn.innerHTML = '<i class="fas fa-calculator"></i> 重新测算';
            calculateBtn.disabled = false;
        }, 1500);
    });
    
    // 显示命盘结果
    function displayResults(chart, analysis) {
        const resultGrid = document.querySelector('.result-grid');
        resultGrid.innerHTML = '';
        
        // 生成宫位卡片
        chart.forEach(palace => {
            const card = document.createElement('div');
            card.className = 'palace-card';
            card.innerHTML = `
                <h3>${palace.name}</h3>
                <div class="stars">
                    ${palace.stars.map(star => `<span class="star">${star}</span>`).join('')}
                </div>
            `;
            resultGrid.appendChild(card);
        });
        
        // 添加命理分析
        const analysisDiv = document.createElement('div');
        analysisDiv.className = 'analysis';
        analysisDiv.innerHTML = `
            <h3>命理分析</h3>
            <p>${analysis}</p>
        `;
        resultGrid.appendChild(analysisDiv);
        
        // 显示结果区域
        resultSection.style.display = 'block';
        
        // 添加滚动动画
        resultSection.scrollIntoView({ behavior: 'smooth' });
    }
});

// 添加神秘交互效果
document.addEventListener('mousemove', function(e) {
    const mysticElements = document.querySelectorAll('.mystic-header, .mystic-form, .mystic-result');
    
    mysticElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // 创建微妙的视差效果
        el.style.transform = `perspective(1000px) rotateX(${(y - rect.height/2)/20}deg) rotateY(${(x - rect.width/2)/20}deg)`;
    });
});
