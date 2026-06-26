/* ═══════════════════════════════════════════════════════
   lunar.js - 农历/黄历计算引擎
   纯算法实现，无外部依赖
   ═══════════════════════════════════════════════════════ */

const Lunar = (() => {

    // ── 基础数据 ──────────────────────────────────────
    const HEAVENLY_STEMS = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
    const EARTHLY_BRANCHES = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
    const ZODIACS = ['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪'];
    const WEEKDAYS = ['星期一','星期二','星期三','星期四','星期五','星期六','星期日'];
    const SHENGXIAO = ['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪'];

    // 农历数据表 (1900-2100)，每年用一个数字编码
    // bits 0-3:  闰月 (0=无闰)
    // bits 4-15: 12个月大小月 (0=29天, 1=30天), bit 4=正月
    // bit 16:    闰月大小 (0=29天, 1=30天)
    const LUNAR_INFO = [
        0x04bd8,0x04ae0,0x0a570,0x054d5,0x0d260,0x0d950,0x16554,0x056a0,0x09ad0,0x055d2, // 1900-1909
        0x04ae0,0x0a5b6,0x0a4d0,0x0d250,0x1d255,0x0b540,0x0d6a0,0x0ada2,0x095b0,0x14977, // 1910-1919
        0x04970,0x0a4b0,0x0b4b5,0x06a50,0x06d40,0x1ab54,0x02b60,0x09570,0x052f2,0x04970, // 1920-1929
        0x06566,0x0d4a0,0x0ea50,0x16a95,0x05ad0,0x02b60,0x186e3,0x092e0,0x1c8d7,0x0c950, // 1930-1939
        0x0d4a0,0x1d8a6,0x0b550,0x056a0,0x1a5b4,0x025d0,0x092d0,0x0d2b2,0x0a950,0x0b557, // 1940-1949
        0x06ca0,0x0b550,0x15355,0x04da0,0x0a5b0,0x14573,0x052b0,0x0a9a8,0x0e950,0x06aa0, // 1950-1959
        0x0aea6,0x0ab50,0x04b60,0x0aae4,0x0a570,0x05260,0x0f263,0x0d950,0x05b57,0x056a0, // 1960-1969
        0x096d0,0x04dd5,0x04ad0,0x0a4d0,0x0d4d4,0x0d250,0x0d558,0x0b540,0x0b6a0,0x195a6, // 1970-1979
        0x095b0,0x049b0,0x0a974,0x0a4b0,0x0b27a,0x06a50,0x06d40,0x0af46,0x0ab60,0x09570, // 1980-1989
        0x04af5,0x04970,0x064b0,0x074a3,0x0ea50,0x06b58,0x05ac0,0x0ab60,0x096d5,0x092e0, // 1990-1999
        0x0c960,0x0d954,0x0d4a0,0x0da50,0x07552,0x056a0,0x0abb7,0x025d0,0x092d0,0x0cab5, // 2000-2009
        0x0a950,0x0b4a0,0x0baa4,0x0ad50,0x055d9,0x04ba0,0x0a5b0,0x15176,0x052b0,0x0a930, // 2010-2019
        0x07954,0x06aa0,0x0ad50,0x05b52,0x04b60,0x0a6e6,0x0a4e0,0x0d260,0x0ea65,0x0d530, // 2020-2029
        0x05aa0,0x076a3,0x096d0,0x04afb,0x04ad0,0x0a4d0,0x1d0b6,0x0d250,0x0d520,0x0dd45, // 2030-2039
        0x0b5a0,0x056d0,0x055b2,0x049b0,0x0a577,0x0a4b0,0x0aa50,0x1b255,0x06d20,0x0ada0, // 2040-2049
        0x14b63,0x09370,0x049f8,0x04970,0x064b0,0x168a6,0x0ea50,0x06aa0,0x1a6c4,0x0aae0, // 2050-2059
        0x092e0,0x0d2e3,0x0c960,0x0d557,0x0d4a0,0x0da50,0x05d55,0x056a0,0x0a6d0,0x055d4, // 2060-2069
        0x052d0,0x0a9b8,0x0a950,0x0b4a0,0x0b6a6,0x0ad50,0x055a0,0x0aba4,0x0a5b0,0x052b0, // 2070-2079
        0x0b273,0x06930,0x07337,0x06aa0,0x0ad50,0x14b55,0x04b60,0x0a570,0x054e4,0x0d160, // 2080-2089
        0x0e968,0x0d520,0x0daa0,0x16aa6,0x056d0,0x04ae0,0x0a9d4,0x0a4d0,0x0d150,0x0f252, // 2090-2099
        0x0d520  // 2100
    ];

    // ── 方向映射 (根据天干地支定方位) ──────────────────
    const CAI_SHEN_DIR = {    // 财神方位 (依日干)
        '甲':'东北','乙':'东北','丙':'正西','丁':'正西','戊':'正北',
        '己':'正北','庚':'正东','辛':'正东','壬':'正南','癸':'正南'
    };
    const XI_SHEN_DIR = {     // 喜神方位 (依日干)
        '甲':'西北','乙':'西南','丙':'西南','丁':'正南','戊':'东南',
        '己':'东北','庚':'西北','辛':'西南','壬':'正南','癸':'东南'
    };
    const FU_SHEN_DIR = {     // 福神方位 (依日支)
        '子':'东北','丑':'东北','寅':'正东','卯':'正东','辰':'正南','巳':'正南',
        '午':'西南','未':'西南','申':'西北','酉':'西北','戌':'正北','亥':'正北'
    };

    // ── 二十八宿 (固定顺序) ────────────────────────────
    const STAR_28 = [
        '角木蛟','亢金龙','氐土貉','房日兔','心月狐','尾火虎','箕水豹',
        '斗木獬','牛金牛','女土蝠','虚日鼠','危月燕','室火猪','壁水貐',
        '奎木狼','娄金狗','胃土雉','昴日鸡','毕月乌','觜火猴','参水猿',
        '井木犴','鬼金羊','柳土獐','星日马','张月鹿','翼火蛇','轸水蚓'
    ];

    // ── 十二建除 (值日) ────────────────────────────────
    const JIANCHU = ['建','除','满','平','定','执','破','危','成','收','开','闭'];
    const OFFICER_MAP = { // 建除对应的吉神/凶神
        '建':['建日','青龙','黄道日'],
        '除':['除日','明堂','黄道日'],
        '满':['满日','天刑','黑道日'],
        '平':['平日','朱雀','黑道日'],
        '定':['定日','金匮','黄道日'],
        '执':['执日','天德','黄道日'],
        '破':['破日','白虎','黑道日'],
        '危':['危日','玉堂','黄道日'],
        '成':['成日','天牢','黑道日'],
        '收':['收日','玄武','黑道日'],
        '开':['开日','司命','黄道日'],
        '闭':['闭日','勾陈','黑道日']
    };

    // ── 宜忌表 (基于十二建除) ──────────────────────────
    const YI_MAP = {
        '建':['开业','开工','动土','安床','嫁娶'],
        '除':['扫除','治病','修造','安床','出行'],
        '满':['祭祀','祈福','求嗣','订婚','安床'],
        '平':['出行','求医','交易','栽种','牧养'],
        '定':['订婚','安床','嫁娶','入宅','移徙'],
        '执':['嫁娶','安床','入宅','移徙','安门'],
        '破':['安床','搬家','出行','求医','修造'],
        '危':['祭祀','祈福','求嗣','订婚','安床'],
        '成':['结婚','开业','搬家','动土','出行'],
        '收':['收获','纳财','安床','移徙','入宅'],
        '开':['开业','开工','出行','嫁娶','安门'],
        '闭':['安葬','修坟','祭祀','祈福','求嗣']
    };
    const JI_MAP = {
        '建':['安葬','词讼','伐木','作梁','动土'],
        '除':['嫁娶','安葬','开市','词讼','动土'],
        '满':['安葬','词讼','伐木','作梁','开市'],
        '平':['安葬','词讼','伐木','作梁','开市'],
        '定':['动土','安葬','开市','词讼','出行'],
        '执':['安葬','词讼','伐木','作梁','开市'],
        '破':['嫁娶','安葬','开市','词讼','出行'],
        '危':['动土','安葬','开市','词讼','出行'],
        '成':['安葬','词讼','伐木','作梁','开市'],
        '收':['动土','安葬','开市','词讼','出行'],
        '开':['安葬','词讼','伐木','作梁','动土'],
        '闭':['开业','开工','动土','嫁娶','出行']
    };

    // ── 节气近似日期 (每月两个节气) ─────────────────────
    // 每月固定取两个节气日期（简化，实际每年有±1天偏移）
    const SOLAR_TERMS = [
        [6,'小寒'],[20,'大寒'],[4,'立春'],[19,'雨水'],[6,'惊蛰'],[21,'春分'],
        [5,'清明'],[20,'谷雨'],[6,'立夏'],[21,'小满'],[6,'芒种'],[21,'夏至'],
        [7,'小暑'],[23,'大暑'],[7,'立秋'],[23,'处暑'],[8,'白露'],[23,'秋分'],
        [8,'寒露'],[23,'霜降'],[7,'立冬'],[22,'小雪'],[7,'大雪'],[22,'冬至']
    ];

    // ── 辅助函数 ──────────────────────────────────────

    /** 获取某年的农历数据 */
    function getLunarYearInfo(year) {
        if (year < 1900 || year > 2100) return null;
        return LUNAR_INFO[year - 1900];
    }

    /** 正月对应的农历年总天数 */
    function yearDays(year) {
        let sum = 348; // 12个月 * 29天基础
        const info = getLunarYearInfo(year);
        if (!info) return 0;
        for (let i = 0x8000; i > 0x8; i >>= 1) {
            sum += (info & i) ? 1 : 0;
        }
        // 只在有闰月时加闰月天数
        const leapM = info & 0xf;
        if (leapM > 0) {
            sum += (info & 0x10000) ? 30 : 29;
        }
        return sum;
    }

    /** 闰月天数 */
    function leapMonthDays(year) {
        const info = getLunarYearInfo(year);
        if (!info) return 0;
        return (info & 0x10000) ? 30 : 29;
    }

    /** 闰月月份 (0=无闰) */
    function leapMonth(year) {
        const info = getLunarYearInfo(year);
        if (!info) return 0;
        return info & 0xf;
    }

    /** 某月天数 */
    function monthDays(year, month) {
        const info = getLunarYearInfo(year);
        if (!info) return 0;
        // (0x10 << (month-1)): bit4=正月, bit5=二月... bit15=十二月
        return (info & (0x10 << (month - 1))) ? 30 : 29;
    }

    // ── 公历转农历 ────────────────────────────────────

    /**
     * 公历转农历
     * @param {number} year  - 公历年份
     * @param {number} month - 公历月份 (1-12)
     * @param {number} day   - 公历日期
     * @returns {object} { lunarYear, lunarMonth, lunarDay, isLeap, leapMonth }
     */
    function solarToLunar(year, month, day) {
        // 以 1900年1月31日 = 农历庚子年正月初一 为基准
        const baseDate = new Date(1900, 0, 31); // Jan 31
        const targetDate = new Date(year, month - 1, day);
        let offset = Math.floor((targetDate - baseDate) / 86400000);

        if (offset < 0) return null;

        // 计算农历年
        let lunarYear, i, temp = 0;
        for (i = 1900; i < 2101 && offset > 0; i++) {
            temp = yearDays(i);
            offset -= temp;
        }
        if (offset < 0) {
            offset += temp;
            i--;
        }
        lunarYear = i;

        const leapM = leapMonth(lunarYear);
        let isLeap = false;

        // 计算农历月
        let lunarMonth = 1;
        while (lunarMonth <= 12 && offset > 0) {
            const md = monthDays(lunarYear, lunarMonth);
            if (offset < md) break;
            offset -= md;
            // 闰月
            if (leapM > 0 && lunarMonth === leapM && !isLeap) {
                const lmd = leapMonthDays(lunarYear);
                if (offset < lmd) { isLeap = true; break; }
                offset -= lmd;
                isLeap = true;
            }
            lunarMonth++;
        }

        return {
            year: lunarYear,
            month: lunarMonth > 12 ? 12 : lunarMonth,
            day: offset + 1,
            isLeap: isLeap,
            leapMonth: leapM
        };
    }

    // ── 干支计算 ──────────────────────────────────────

    /** 年柱天干 */
    function yearStem(year) { return (year - 4) % 10; }

    /** 年柱地支 */
    function yearBranch(year) { return (year - 4) % 12; }

    /** 年柱干支 */
    function yearGanzhi(year) {
        return HEAVENLY_STEMS[yearStem(year)] + EARTHLY_BRANCHES[yearBranch(year)];
    }

    /** 月柱干支 (依年干定月干) */
    function monthGanzhi(year, month) {
        // 正月寅，二月卯...
        const mBranch = (month + 1) % 12;
        // 年上起月法：甲己之年丙作首，乙庚之岁戊为头
        const yStem = yearStem(year);
        const startTable = [2, 4, 6, 8, 0]; // 丙戊庚壬甲 对应的正月天干
        const mStem = (startTable[yStem % 5] + month - 1) % 10;
        return { stem: HEAVENLY_STEMS[mStem], branch: EARTHLY_BRANCHES[mBranch],
                 full: HEAVENLY_STEMS[mStem] + EARTHLY_BRANCHES[mBranch] };
    }

    /** 日柱干支 (基于基准日: 1900年1月1日 = 甲戌日) */
    function dayGanzhi(year, month, day) {
        const base = new Date(1900, 0, 1); // Jan 1, 1900
        const target = new Date(year, month - 1, day);
        const offset = Math.floor((target - base) / 86400000);
        const stem = (offset + 10) % 10; // 甲=0, 1900-01-01是甲戌日，天干10→甲
        const branch = (offset + 10) % 12;
        return { stem: HEAVENLY_STEMS[stem], branch: EARTHLY_BRANCHES[branch],
                 full: HEAVENLY_STEMS[stem] + EARTHLY_BRANCHES[stem] };
    }

    // ── 十二建除 (值日) ──────────────────────────────

    /**
     * 计算十二建除
     * 正月寅日建，二月卯日建... 建日起后推
     */
    function getJianchu(year, month, day) {
        const dg = dayGanzhi(year, month, day);
        const dBranch = EARTHLY_BRANCHES.indexOf(dg.branch);
        // 月建: 正月建寅, 二月建卯...
        const monthJian = (month + 1) % 12; // 正月=寅=2, 二月=卯=3...

        // 计算建日位置偏移
        let offset = (dBranch - monthJian + 12) % 12;
        const jc = JIANCHU[offset];
        return { name: jc, ...OFFICER_MAP[jc] };
    }

    // ── 二十八宿 ──────────────────────────────────────

    /** 计算某日的二十八宿 (基于基准日) */
    function getStar28(year, month, day) {
        // 基准: 2024年1月1日 = 角木蛟 (第0宿)
        const base = new Date(2024, 0, 1);
        const target = new Date(year, month - 1, day);
        const offset = Math.floor((target - base) / 86400000);
        const idx = ((offset % 28) + 28) % 28;
        return STAR_28[idx];
    }

    // ── 节气 ──────────────────────────────────────────

    /** 获取节气 (简化版) */
    function getSolarTerm(year, month, day) {
        const idx = (month - 1) * 2;
        const t1 = SOLAR_TERMS[idx];
        const t2 = SOLAR_TERMS[idx + 1];
        if (day === t1[0]) return t1[1];
        if (day === t2[0]) return t2[1];
        return '';
    }

    // ── 方位 ──────────────────────────────────────────

    function getCaiShen(year, month, day) {
        const dg = dayGanzhi(year, month, day);
        return CAI_SHEN_DIR[dg.stem] || '未知';
    }

    function getXiShen(year, month, day) {
        const dg = dayGanzhi(year, month, day);
        return XI_SHEN_DIR[dg.stem] || '未知';
    }

    function getFuShen(year, month, day) {
        const dg = dayGanzhi(year, month, day);
        return FU_SHEN_DIR[dg.branch] || '未知';
    }

    // ── 神煞系统 ──────────────────────────────────────

    /** 地支六冲 */
    function chong(a, b) { return (a + 6) % 12 === b; }

    /** 地支三合组 */
    const SAN_HE = [[0,3,7],[1,4,10],[2,6,8],[5,9,11]];

    /** 计算当天所有神煞 */
    function calcGods(year, month, day) {
        const dg = dayGanzhi(year, month, day);
        const mg = monthGanzhi(year, month);
        const yg = yearGanzhi(year);
        const jc = getJianchu(year, month, day);

        const dS = HEAVENLY_STEMS.indexOf(dg.stem);
        const dB = EARTHLY_BRANCHES.indexOf(dg.branch);
        const mB = EARTHLY_BRANCHES.indexOf(mg.branch);
        const yS = HEAVENLY_STEMS.indexOf(yg[0]);
        const yB = EARTHLY_BRANCHES.indexOf(yg[1]);
        const season = Math.floor((month - 1) / 3);
        const gods = [];

        // ── 天德 (吉) — 按月支查日支 ──
        // 正月午 二月申 三月亥 四月酉 五月亥 六月寅
        // 七月子 八月寅 九月巳 十月卯 十一月巳 十二月申
        const tianDe = [6,8,11,9,11,2,0,2,5,3,5,8];
        if (dB === tianDe[month - 1]) gods.push({name:'天德',type:'吉'});

        // ── 月德 (吉) — 按三合局查日干 ──
        // 寅午戌→丙, 亥卯未→甲, 申子辰→壬, 巳酉丑→庚
        const yueDe = {1:2,5:2,9:2, 2:0,6:0,10:0, 3:8,7:8,11:8, 4:6,8:6,12:6};
        if (yueDe[month] === dS) gods.push({name:'月德',type:'吉'});

        // ── 天赦 (吉) — 四季特有日 ──
        // 春戊寅 夏甲午 秋戊申 冬甲子
        const ts = [[4,2],[0,6],[4,8],[0,0]];
        if (dS === ts[season][0] && dB === ts[season][1]) gods.push({name:'天赦',type:'吉'});

        // ── 三合 (吉) — 日月支三合 ──
        for (const g of SAN_HE) {
            if (g.includes(mB) && g.includes(dB) && mB !== dB) {
                gods.push({name:'三合',type:'吉'}); break;
            }
        }

        // ── 六合 (吉) — 日月支六合 ──
        const liuHe = [[0,1],[2,11],[3,10],[4,9],[5,8],[6,7]];
        for (const [a,b] of liuHe) {
            if ((mB===a&&dB===b)||(mB===b&&dB===a)) { gods.push({name:'六合',type:'吉'}); break; }
        }

        // ── 天喜 (吉) — 春戌夏丑秋辰冬未 ──
        const xi = [10,1,4,7];
        if (dB === xi[season]) gods.push({name:'天喜',type:'吉'});

        // ── 驿马 (吉) — 三合局马星位 ──
        const yiMa = [0,3,7].includes(dB)?2: [1,4,10].includes(dB)?5: [2,6,8].includes(dB)?8: [5,9,11].includes(dB)?11:-1;
        if (yiMa === mB || yiMa === dB) gods.push({name:'驿马',type:'吉'});

        // ── 月破 (凶) — 日冲月 ──
        if (chong(mB, dB)) gods.push({name:'月破',type:'凶'});

        // ── 大耗 (凶) — 日冲年 ──
        if (chong(yB, dB)) gods.push({name:'大耗',type:'凶'});

        // ── 小耗 (凶) — 年支后一位 ──
        if (dB === (yB + 1) % 12) gods.push({name:'小耗',type:'凶'});

        // ── 月厌 (凶) — 正月戌逆推 ──
        const yueYan = (11 - (month - 1)) % 12;
        if (dB === yueYan) gods.push({name:'月厌',type:'凶'});

        // ── 四废 (凶) — 季节废日 ──
        const sf = [[[6,8],[7,9]], [[8,0],[9,11]], [[0,2],[1,3]], [[2,6],[3,5]]];
        for (const [s,b] of sf[season]) {
            if (dS===s && dB===b) { gods.push({name:'四废',type:'凶'}); break; }
        }

        // ── 福星 (吉) — 日干生月干 ──
        // 木生火(0→2),火生土(2→4),土生金(4→6),金生水(6→8),水生木(8→0)
        const fuMap = {0:2,1:3,2:4,3:5,4:6,5:7,6:8,7:9,8:0,9:1};
        if (fuMap[dS] === yS) gods.push({name:'福星',type:'吉'});

        // ── 值日神煞 ──
        const zhiRiGods = {
            '青龙':'吉','明堂':'吉','金匮':'吉','玉堂':'吉','司命':'吉',
            '天刑':'凶','朱雀':'凶','白虎':'凶','天牢':'凶','玄武':'凶','勾陈':'凶'
        };
        if (zhiRiGods[jc[1]]) gods.push({name:jc[1], type:zhiRiGods[jc[1]]});

        const score = gods.reduce((s, g) => s + (g.type === '吉' ? 1 : -1), 0);
        return { gods, score, jianchu: jc.name };
    }

    /** 根据神煞推荐宜忌 */
    function recommendYiJi(year, month, day) {
        const { gods, score } = calcGods(year, month, day);
        const jc = getJianchu(year, month, day);

        // 基础宜忌 (来自建除)
        let yi = [...(YI_MAP[jc.name] || [])];
        let ji = [...(JI_MAP[jc.name] || [])];

        // 神煞推荐的额外宜忌
        const addYi = new Set(), addJi = new Set();
        for (const g of gods) {
            switch (g.name) {
                case '天德': case '月德': case '值日天德': addYi.add('祭祀'); addYi.add('祈福'); break;
                case '天赦': addYi.add('求嗣'); addYi.add('祭祀'); break;
                case '三合': addYi.add('嫁娶'); addYi.add('签约'); addYi.add('会友'); break;
                case '六合': addYi.add('订婚'); addYi.add('会友'); addYi.add('签约'); break;
                case '天喜': addYi.add('嫁娶'); addYi.add('订婚'); break;
                case '驿马': addYi.add('出行'); addYi.add('旅游'); addYi.add('搬家'); break;
                case '青龙': case '明堂': case '玉堂': case '司命': case '金匮':
                    addYi.add('开业'); addYi.add('交易'); break;
                case '福星': addYi.add('祈福'); addYi.add('求嗣'); break;
                case '月破': addJi.add('出行'); addJi.add('嫁娶'); addJi.add('搬家'); break;
                case '大耗': case '小耗': addJi.add('交易'); addJi.add('纳财'); break;
                case '月厌': addJi.add('嫁娶'); addJi.add('订婚'); break;
                case '四废': addJi.add('开业'); addJi.add('开工'); break;
                case '天刑': case '白虎': addJi.add('词讼'); addJi.add('出行'); break;
                case '天牢': addJi.add('交易'); addJi.add('签约'); break;
                case '勾陈': case '玄武': addJi.add('出行'); addJi.add('会友'); break;
            }
        }

        // 根据评分调整数量
        const addYiCount = score >= 3 ? 3 : score >= 1 ? 2 : score >= -1 ? 1 : 0;
        const addJiCount = score <= -3 ? 3 : score <= -1 ? 2 : score <= 1 ? 1 : 0;

        // 合并 (去重)
        const yb = [...yi];
        for (const item of addYi) {
            if (!yb.includes(item)) yb.push(item);
        }
        for (const item of addJi) {
            if (!ji.includes(item)) ji.push(item);
        }

        return { yi: yb, ji };
    }

    // ── 神煞等级判定 ────────────────────────────────
    function getScoreLevel(score) {
        if (score >= 5) return '大吉';
        if (score >= 2) return '吉';
        if (score >= -1) return '平';
        if (score >= -4) return '凶';
        return '大凶';
    }

    /**
     * 获取完整黄历信息
     * @param {Date} date - 日期对象
     * @returns {object} 黄历数据
     */
    function getAlmanac(date) {
        const d = date || new Date();
        const year = d.getFullYear();
        const month = d.getMonth() + 1;
        const day = d.getDate();

        const lunar = solarToLunar(year, month, day);
        const yg = yearGanzhi(year);
        const mg = monthGanzhi(year, month);
        const dg = dayGanzhi(year, month, day);
        const jc = getJianchu(year, month, day);
        const star = getStar28(year, month, day);
        const term = getSolarTerm(year, month, day);

        const { gods, score } = calcGods(year, month, day);
        const rec = recommendYiJi(year, month, day);

        return {
            solar_date: `${year}年${month}月${day}日`,
            solar_weekday: WEEKDAYS[d.getDay() === 0 ? 6 : d.getDay() - 1],
            lunar_year_cn: yg,
            lunar_month: lunar ? lunar.month : 0,
            lunar_day: lunar ? lunar.day : 0,
            lunar_date: lunar ? `农历${lunar.month}月${lunar.day}日` : '',
            year_ganzhi: yg,
            month_ganzhi: mg.full,
            day_ganzhi: dg.full,
            shengxiao: ZODIACS[yearBranch(year)],
            jieqi: term || '无',
            yi: rec.yi,
            ji: rec.ji,
            gods: gods.map(g => g.name),
            god_score: score,
            chong: `${dg.branch}日冲${EARTHLY_BRANCHES[(EARTHLY_BRANCHES.indexOf(dg.branch) + 6) % 12]}`,
            cai_fang: getCaiShen(year, month, day),
            xi_shen: getXiShen(year, month, day),
            fu_shen: getFuShen(year, month, day),
            day_officer: [jc.name, jc[1] || '', jc[2] || ''],
            zhou_ri: jc[1] || jc[2] || '',
            star_28: star,
            fetal_god: '',
            fortune_level: getScoreLevel(score),
        };
    }

    // ── 公开 API ──────────────────────────────────────
    return {
        getAlmanac,
        solarToLunar,
        yearGanzhi,
        monthGanzhi,
        dayGanzhi,
        getZodiac: (year) => ZODIACS[(year - 4) % 12],
        getJianchu,
        getStar28,
        getSolarTerm,
        calcGods,
        recommendYiJi,
        getScoreLevel,
    };
})();
