/* ═══════════════════════════════════════════════════════
   app.js - beLucky 前端交互逻辑 (纯前端版)
   ═══════════════════════════════════════════════════════ */

const State = {
    user: null,
    almanacDate: new Date(),
    horoscopeDate: new Date(),
    tarotSpread: 'single',
};

// ── 初始化 ────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initSpreadButtons();
    loadAlmanac();
    loadUser();
});

// ── Tab 切换 ──────────────────────────────────────────
function initTabs() {
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });
    // URL hash 支持
    if (location.hash) {
        const tab = location.hash.replace('#','');
        switchTab(tab);
    }
}

function switchTab(tabName) {
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelector(`.nav-tab[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`tab-${tabName}`).classList.add('active');

    if (tabName === 'almanac') loadAlmanac();
    if (tabName === 'horoscope') loadHoroscope();
    if (tabName === 'tarot') {} // 用户点击占卜按钮才触发
    if (tabName === 'profile') refreshProfilePreview();

    location.hash = tabName;
}

// ── 用户信息 (localStorage) ────────────────────────────
function loadUser() {
    const saved = localStorage.getItem('belucky_user');
    if (saved) {
        try {
            State.user = JSON.parse(saved);
            populateProfile(State.user);
            document.getElementById('deleteBtn').style.display = 'inline-block';
        } catch (e) {
            State.user = null;
        }
    }
}

function saveToLocalStorage(user) {
    State.user = user;
    localStorage.setItem('belucky_user', JSON.stringify(user));
}

function saveProfile(event) {
    event.preventDefault();
    const name = document.getElementById('userName').value.trim();
    const birthDate = document.getElementById('birthDate').value;
    const birthTime = document.getElementById('birthTime').value;
    const gender = document.getElementById('gender').value;

    if (!name || !birthDate) return;

    const user = { name, birth_date: birthDate, birth_time: birthTime, gender };
    saveToLocalStorage(user);
    populateProfile(user);
    document.getElementById('deleteBtn').style.display = 'inline-block';
    refreshProfilePreview();
    alert('信息已保存！');
}

function deleteProfile() {
    if (!confirm('确定要删除个人信息吗？')) return;
    localStorage.removeItem('belucky_user');
    State.user = null;
    document.getElementById('profileForm').reset();
    document.getElementById('profilePreview').style.display = 'none';
    document.getElementById('deleteBtn').style.display = 'none';
    document.getElementById('horoscopeNoUser').style.display = 'block';
    document.getElementById('horoscopeContent').style.display = 'none';
}

function refreshProfilePreview() {
    if (!State.user) return;
    document.getElementById('profilePreview').style.display = 'block';
    document.getElementById('previewName').textContent = State.user.name;
    document.getElementById('previewBirth').textContent = State.user.birth_date;

    if (State.user.birth_date) {
        const sign = calcZodiacSign(State.user.birth_date);
        document.getElementById('previewSign').textContent = `${sign.symbol} ${sign.name}`;
        const d = new Date(State.user.birth_date);
        document.getElementById('previewZodiac').textContent = Lunar.getZodiac(d.getFullYear());
    }
}

// ── 星座计算 ──────────────────────────────────────────
function calcZodiacSign(birthDate) {
    const d = new Date(birthDate);
    const month = d.getMonth() + 1;
    const day = d.getDate();

    for (const sign of ZODIAC_SIGNS) {
        const [start, end] = sign.date_range.split('-');
        const [sm, sd] = start.split('.').map(Number);
        const [em, ed] = end.split('.').map(Number);
        if ((month === sm && day >= sd) || (month === em && day <= ed)) {
            return sign;
        }
    }
    return ZODIAC_SIGNS[9]; // 摩羯座 fallback
}

// ── 运势生成 (基于黄历) ──────────────────────────────

// 星座 → 五行
const SIGN_ELEMENT = {
    '白羊座':'火','狮子座':'火','射手座':'火',
    '金牛座':'土','处女座':'土','摩羯座':'土',
    '双子座':'木','天秤座':'木','水瓶座':'木',
    '巨蟹座':'水','天蝎座':'水','双鱼座':'水',
};

// 天干 → 五行
const STEM_ELEMENT = { '甲':'木','乙':'木','丙':'火','丁':'火','戊':'土','己':'土','庚':'金','辛':'金','壬':'水','癸':'水' };

// 地支 → 五行
const BRANCH_ELEMENT = { '寅':'木','卯':'木','巳':'火','午':'火','辰':'土','戌':'土','丑':'土','未':'土','申':'金','酉':'金','亥':'水','子':'水' };

// 生肖 → 地支
const ZODIAC_BRANCH = { '鼠':'子','牛':'丑','虎':'寅','兔':'卯','龙':'辰','蛇':'巳','马':'午','羊':'未','猴':'申','鸡':'酉','狗':'戌','猪':'亥' };

// 五行相生: 木→火→土→金→水→木
function isGenerate(sheng, bei) {
    const map = { '木':'火','火':'土','土':'金','金':'水','水':'木' };
    return map[sheng] === bei;
}

// 五行相克: 木→土→水→火→金→木
function isRestrict(ke, bei) {
    const map = { '木':'土','土':'水','水':'火','火':'金','金':'木' };
    return map[ke] === bei;
}

function calcAlmanacFortune(signName, birthDate, targetDate) {
    const d = targetDate || new Date();
    const almanac = Lunar.getAlmanac(d);

    // 用户五行
    const userElement = SIGN_ELEMENT[signName] || '土';

    // 日干五行、月干五行
    const dayStem = STEM_ELEMENT[almanac.day_ganzhi[0]] || '土';
    const monthStem = STEM_ELEMENT[almanac.month_ganzhi[0]] || '土';

    // 用户生肖
    const birthYear = new Date(birthDate).getFullYear();
    const userZodiac = Lunar.getZodiac(birthYear);
    const userBranch = ZODIAC_BRANCH[userZodiac] || '';

    // === 综合运势: 值日吉凶 + 日干生克 ===
    let overallLevel, overallText;
    const fortuneBase = almanac.fortune_level; // '吉' / '凶' / '平'
    const dayGen = isGenerate(dayStem, userElement);
    const dayRest = isRestrict(dayStem, userElement);

    if (fortuneBase === '大吉') { overallLevel = '上'; overallText = '众吉神齐聚，百无禁忌，运势极佳。'; }
    else if (fortuneBase === '吉' && dayGen) { overallLevel = '上'; overallText = '黄道吉日加日干相生，百事皆宜。'; }
    else if (fortuneBase === '吉') { overallLevel = '上'; overallText = '吉神较多，整体运势不错，适合大胆行事。'; }
    else if (fortuneBase === '大凶') { overallLevel = '下'; overallText = '凶神当道，诸事不宜，宜静不宜动。'; }
    else if (fortuneBase === '凶' && dayRest) { overallLevel = '下'; overallText = '黑道日加日干相克，诸事需谨慎。'; }
    else if (fortuneBase === '凶') { overallLevel = '中'; overallText = '凶神较多，低调行事，宜守不宜攻。'; }
    else if (dayGen) { overallLevel = '上'; overallText = '平日但日干相生，运势平稳中有上升之势。'; }
    else if (dayRest) { overallLevel = '下'; overallText = '平日逢日干相克，凡事三思而后行。'; }
    else { overallLevel = '中'; overallText = '运势平平，按部就班即可。'; }

    // === 事业运势: 月干生克 ===
    let careerLevel, careerText;
    const monthGen = isGenerate(monthStem, userElement);
    const monthRest = isRestrict(monthStem, userElement);
    if (monthGen) { careerLevel = '上'; careerText = '月干生你，工作上易得贵人相助，进展顺利。'; }
    else if (monthRest) { careerLevel = '下'; careerText = '月干克你，工作中需防小人，谨慎决策。'; }
    else { careerLevel = '中'; careerText = '事业运平顺，按计划推进即可。'; }

    // === 财运: 财神方位 + 五行 ===
    const isGood = fortuneBase === '吉' || fortuneBase === '大吉';
    const isBad = fortuneBase === '凶' || fortuneBase === '大凶';
    let wealthLevel, wealthText;
    if (isGood) { wealthLevel = '上'; wealthText = `财神在${almanac.cai_fang}，宜朝此方位求财。`; }
    else if (dayGen) { wealthLevel = '上'; wealthText = '日干相生，正财运佳，宜积极争取。'; }
    else if (dayRest || isBad) { wealthLevel = '下'; wealthText = '财运欠佳，避免投资和重大消费。'; }
    else { wealthLevel = '中'; wealthText = '财运平稳，适合保守理财。'; }

    // === 爱情运势: 喜神方位 + 值日 ===
    let loveLevel, loveText;
    const officer = almanac.day_officer[0]; // '建除满平定执破危成收开闭'
    const loveDays = ['定','成','开','满'];
    if (loveDays.includes(officer)) { loveLevel = '上'; loveText = `值日${officer}，喜神在${almanac.xi_shen}，感情运佳。`; }
    else if (officer === '破' || officer === '闭') { loveLevel = '下'; loveText = `值日${officer}，感情上避免争吵，多些耐心。`; }
    else { loveLevel = '中'; loveText = '感情运平稳，顺其自然。'; }

    // === 健康运势: 冲煞 + 五行 ===
    let healthLevel, healthText;
    const chongBranch = almanac.chong.replace('日冲', '');
    const isChongUser = chongBranch === userBranch;
    if (isChongUser) { healthLevel = '下'; healthText = `今日冲${userZodiac}，注意身体健康，避免过劳。`; }
    else if (dayRest) { healthLevel = '中'; healthText = '日干克你，需注意作息规律，适度休息。'; }
    else if (isGood) { healthLevel = '上'; healthText = '精力充沛，适合运动锻炼。'; }
    else { healthLevel = '中'; healthText = '健康无大碍，保持平常作息即可。'; }

    // 幸运数字（日柱天干地支数字）
    const stemIdx = '甲乙丙丁戊己庚辛壬癸'.indexOf(almanac.day_ganzhi[0]) + 1;
    const branchIdx = '子丑寅卯辰巳午未申酉戌亥'.indexOf(almanac.day_ganzhi[1]) + 1;

    return {
        sign: signName,
        date: `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日`,
        overall: `今日整体运势${overallLevel}，${overallText}`,
        love: `爱情运势${loveLevel}，${loveText}`,
        career: `事业运势${careerLevel}，${careerText}`,
        wealth: `财运${wealthLevel}，${wealthText}`,
        health: `健康运势${healthLevel}，${healthText}`,
        lucky_number: branchIdx * 10 + stemIdx,
        lucky_color: FortuneColors[almanac.day_ganzhi[0]] || '红',
    };
}

// 天干对应幸运颜色
const FortuneColors = {
    '甲':'青','乙':'绿','丙':'红','丁':'橙','戊':'黄','己':'棕','庚':'白','辛':'银','壬':'蓝','癸':'紫'
};

// ── 简单哈希 + 伪随机 ─────────────────────────────────
function hashString(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
        h = ((h << 5) - h) + str.charCodeAt(i);
        h |= 0;
    }
    return Math.abs(h);
}

function seededRandom(seed) {
    let s = seed % 2147483647;
    if (s <= 0) s += 2147483646;
    return function() {
        s = (s * 16807) % 2147483647;
        return s;
    };
}

// ── 日期工具 ──────────────────────────────────────────
function formatDate(d) {
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

// ── 牌阵选择 ──────────────────────────────────────────
function initSpreadButtons() {
    document.querySelectorAll('.spread-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.spread-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            State.tarotSpread = btn.dataset.spread;
        });
    });
}

// ── 黄历 ──────────────────────────────────────────────
function loadAlmanac() {
    document.getElementById('almanacDateDisplay').textContent = formatDate(State.almanacDate);
    const data = Lunar.getAlmanac(State.almanacDate);

    document.getElementById('almanacSolar').textContent = `${data.solar_date} ${data.solar_weekday}`;
    document.getElementById('almanacLunar').textContent = `${data.lunar_year_cn}年 ${data.lunar_date}`;
    document.getElementById('almanacGanzhi').textContent = `${data.year_ganzhi}年 ${data.month_ganzhi}月 ${data.day_ganzhi}日`;
    document.getElementById('almanacFortune').textContent = data.fortune_level;
    document.getElementById('almanacYi').textContent = data.yi.length ? data.yi.join('、') : '无';
    document.getElementById('almanacJi').textContent = data.ji.length ? data.ji.join('、') : '无';
    document.getElementById('almanacChong').textContent = data.chong;
    document.getElementById('almanacCai').textContent = data.cai_fang;
    document.getElementById('almanacXi').textContent = data.xi_shen;
    document.getElementById('almanacFu').textContent = data.fu_shen;
    document.getElementById('almanacOfficer').textContent = data.day_officer.filter(Boolean).join(' ');
    document.getElementById('almanacStar').textContent = data.star_28;
    document.getElementById('almanacFetal').textContent = data.fetal_god || '无';
    document.getElementById('almanacJieqi').textContent = data.jieqi || '无';
    document.getElementById('almanacShengxiao').textContent = data.shengxiao;
}

function changeAlmanacDate(delta) {
    State.almanacDate.setDate(State.almanacDate.getDate() + delta);
    loadAlmanac();
}

// ── 星座运势 ──────────────────────────────────────────
function loadHoroscope() {
    const birthDate = State.user?.birth_date;
    if (!birthDate) {
        document.getElementById('horoscopeNoUser').style.display = 'block';
        document.getElementById('horoscopeContent').style.display = 'none';
        return;
    }

    document.getElementById('horoscopeNoUser').style.display = 'none';
    document.getElementById('horoscopeContent').style.display = 'block';

    const dateStr = formatDate(State.horoscopeDate);
    document.getElementById('horoscopeDateDisplay').textContent = dateStr;

    const sign = calcZodiacSign(birthDate);
    const fortune = calcAlmanacFortune(sign.name, birthDate, State.horoscopeDate);

    document.getElementById('signSymbol').textContent = sign.symbol;
    document.getElementById('signName').textContent = sign.name;
    document.getElementById('signMeta').textContent =
        `${sign.date_range} · ${sign.element}象 · 守护星：${sign.ruling_planet}`;
    document.getElementById('fortuneOverall').textContent = fortune.overall;
    document.getElementById('fortuneLove').textContent = fortune.love;
    document.getElementById('fortuneCareer').textContent = fortune.career;
    document.getElementById('fortuneWealth').textContent = fortune.wealth;
    document.getElementById('fortuneHealth').textContent = fortune.health;
    document.getElementById('luckyNumber').textContent = fortune.lucky_number;
    document.getElementById('luckyColor').textContent = fortune.lucky_color;
}

function changeHoroscopeDate(delta) {
    State.horoscopeDate.setDate(State.horoscopeDate.getDate() + delta);
    loadHoroscope();
}

// ── 塔罗占卜 ──────────────────────────────────────────
function drawTarot() {
    const question = document.getElementById('tarotQuestion').value;
    const cardsContainer = document.getElementById('tarotCards');
    const readingContainer = document.getElementById('tarotReading');

    cardsContainer.innerHTML = '';
    readingContainer.style.display = 'none';

    const rng = seededRandom(Math.floor(Math.random() * 100000));
    let result;

    if (State.tarotSpread === 'single') {
        const card = ALL_TAROT_CARDS[rng() % ALL_TAROT_CARDS.length];
        const isReversed = rng() % 10 < 3;
        result = {
            spread: 'single', question,
            cards: [{
                name: card.name, type: card.type || 'major',
                suit: card.suit || '', element: card.element || '',
                numeral: card.numeral || '',
                is_reversed: isReversed,
                meaning: isReversed ? card.reversed : card.upright,
                position: '当前'
            }]
        };
    } else {
        const shuffled = [...ALL_TAROT_CARDS];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = rng() % (i + 1);
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        const cards = shuffled.slice(0, 3);
        const positions = ['过去', '现在', '未来'];
        result = {
            spread: 'three', question,
            cards: cards.map((card, i) => {
                const isReversed = rng() % 10 < 3;
                return {
                    name: card.name, type: card.type || 'major',
                    suit: card.suit || '', element: card.element || '',
                    numeral: card.numeral || '',
                    is_reversed: isReversed,
                    meaning: isReversed ? card.reversed : card.upright,
                    position: positions[i]
                };
            })
        };
    }

    // 渲染卡牌
    result.cards.forEach((card, i) => {
        const cardEl = document.createElement('div');
        cardEl.className = `tarot-card ${card.is_reversed ? 'reversed' : ''}`;
        cardEl.style.animationDelay = `${i * 0.2}s`;
        cardEl.innerHTML = `
            <div class="tarot-card-inner">
                <div class="tarot-card-front"></div>
                <div class="tarot-card-back">
                    <span class="card-position">${card.position}</span>
                    <div class="card-numeral">${card.numeral || ''}</div>
                    <div class="card-name">${card.name}</div>
                    <div class="card-meaning">${card.meaning}</div>
                </div>
            </div>
        `;
        cardEl.addEventListener('click', () => cardEl.classList.toggle('flipped'));
        cardsContainer.appendChild(cardEl);
    });

    // 自动翻牌
    setTimeout(() => {
        document.querySelectorAll('.tarot-card').forEach(c => c.classList.add('flipped'));
    }, 800);

    // 渲染解读
    let readingHTML = '<h4>✦ 牌面解读</h4>';
    if (result.question) readingHTML += `<p><em>问题：${result.question}</em></p>`;
    result.cards.forEach(card => {
        readingHTML += `
            <div class="card-interpretation">
                <p><strong>[${card.position}] ${card.name}</strong>
                ${card.is_reversed ? '（逆位）' : '（正位）'}</p>
                <p>${card.meaning}</p>
            </div>
        `;
    });
    readingContainer.innerHTML = readingHTML;
    readingContainer.style.display = 'block';
}

// ── 个人信息填充 ──────────────────────────────────────
function populateProfile(user) {
    if (!user) return;
    document.getElementById('userName').value = user.name || '';
    document.getElementById('birthDate').value = user.birth_date || '';
    document.getElementById('birthTime').value = user.birth_time || '';
    document.getElementById('gender').value = user.gender || '';
    refreshProfilePreview();
}

// ── 星座列表展开 ──────────────────────────────────────
function toggleSignList() {
    const list = document.getElementById('signList');
    list.style.display = list.style.display === 'none' ? 'grid' : 'none';
}