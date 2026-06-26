/* ═══════════════════════════════════════════════════════
   data.js - 塔罗牌 + 星座数据
   ═══════════════════════════════════════════════════════ */

// ── 星座数据 ──────────────────────────────────────────
const ZODIAC_SIGNS = [
    { name:'白羊座', symbol:'♈', date_range:'3.21-4.19', element:'火', ruling_planet:'火星',
      traits:'热情、勇敢、冲动、直接、领导力强', lucky_colors:['红色','橙色'],
      compatible:['双子座','狮子座','射手座'] },
    { name:'金牛座', symbol:'♉', date_range:'4.20-5.20', element:'土', ruling_planet:'金星',
      traits:'可靠、耐心、实用、固执、享受物质', lucky_colors:['绿色','粉色'],
      compatible:['处女座','摩羯座','巨蟹座'] },
    { name:'双子座', symbol:'♊', date_range:'5.21-6.21', element:'风', ruling_planet:'水星',
      traits:'好奇、善沟通、适应力强、善变、多才', lucky_colors:['黄色','蓝色'],
      compatible:['水瓶座','天秤座','白羊座'] },
    { name:'巨蟹座', symbol:'♋', date_range:'6.22-7.22', element:'水', ruling_planet:'月亮',
      traits:'敏感、直觉强、保护欲、恋家、情绪化', lucky_colors:['银色','白色'],
      compatible:['天蝎座','双鱼座','金牛座'] },
    { name:'狮子座', symbol:'♌', date_range:'7.23-8.22', element:'火', ruling_planet:'太阳',
      traits:'自信、有魅力、慷慨、霸道、爱表现', lucky_colors:['金色','橙色'],
      compatible:['白羊座','射手座','天秤座'] },
    { name:'处女座', symbol:'♍', date_range:'8.23-9.22', element:'土', ruling_planet:'水星',
      traits:'细致、分析力强、完美主义、挑剔、务实', lucky_colors:['棕色','灰色'],
      compatible:['金牛座','摩羯座','天蝎座'] },
    { name:'天秤座', symbol:'♎', date_range:'9.23-10.23', element:'风', ruling_planet:'金星',
      traits:'优雅、公平、社交、犹豫、追求和谐', lucky_colors:['粉色','蓝色'],
      compatible:['双子座','水瓶座','狮子座'] },
    { name:'天蝎座', symbol:'♏', date_range:'10.24-11.22', element:'水', ruling_planet:'冥王星',
      traits:'神秘、直觉强、忠诚、占有欲、深刻', lucky_colors:['深红色','黑色'],
      compatible:['巨蟹座','双鱼座','处女座'] },
    { name:'射手座', symbol:'♐', date_range:'11.23-12.21', element:'火', ruling_planet:'木星',
      traits:'乐观、冒险、自由、粗心、哲学思维', lucky_colors:['紫色','蓝色'],
      compatible:['白羊座','狮子座','水瓶座'] },
    { name:'摩羯座', symbol:'♑', date_range:'12.22-1.19', element:'土', ruling_planet:'土星',
      traits:'自律、野心、可靠、严肃、传统', lucky_colors:['黑色','棕色'],
      compatible:['金牛座','处女座','双鱼座'] },
    { name:'水瓶座', symbol:'♒', date_range:'1.20-2.18', element:'风', ruling_planet:'天王星',
      traits:'独特、独立、创新、疏离、人道主义', lucky_colors:['电蓝色','银色'],
      compatible:['双子座','天秤座','射手座'] },
    { name:'双鱼座', symbol:'♓', date_range:'2.19-3.20', element:'水', ruling_planet:'海王星',
      traits:'梦幻、直觉强、富有同情心、逃避现实、艺术', lucky_colors:['海绿色','紫色'],
      compatible:['巨蟹座','天蝎座','摩羯座'] }
];

// ── 运势模板 ──────────────────────────────────────────
const FORTUNE_TEMPLATES = {
    daily: {
        overall: ['今天整体运势{level}，{advice}','今日{level}，{advice}','运势{level}的一天，{advice}'],
        love: ['感情方面{level}，{advice}','爱情运势{level}，{advice}','今日桃花{level}，{advice}'],
        career: ['事业运势{level}，{advice}','工作方面{level}，{advice}','今日事业{level}，{advice}'],
        wealth: ['财运{level}，{advice}','今日财运{level}，{advice}','理财运势{level}，{advice}'],
        health: ['健康运势{level}，{advice}','身体方面{level}，{advice}','今日健康{level}，{advice}']
    },
    advice_pool: {
        good: ['把握机会，积极行动','贵人相助，顺势而为','心情愉悦，效率倍增','灵感涌现，创意无限','人际关系和谐，合作顺利','努力会有回报，继续加油','今天适合开启新计划','自信满满，一切顺利'],
        medium: ['保持平常心，稳扎稳打','注意细节，避免疏忽','适度放松，不要过于紧绷','与他人沟通时保持耐心','平衡工作与生活','谨慎决策，三思而后行','保持冷静，理性分析','今日宜守不宜攻'],
        bad: ['低调行事，避免冲突','注意情绪管理，保持冷静','谨慎投资，避免冒险','多休息，注意身体健康','避免重大决策','保持耐心，等待时机','注意人际关系，谨言慎行','今日宜静不宜动']
    }
};

// ── 塔罗牌数据 ────────────────────────────────────────
const TAROT_DATA = {
    major_arcana: [
        { name:'愚者', numeral:'0', upright:'新的开始、冒险、纯真、自发性、无限可能', reversed:'鲁莽、冒险过度、缺乏计划、天真、冒失' },
        { name:'魔术师', numeral:'I', upright:'创造力、技能、意志力、自信、资源充足', reversed:'欺骗、操控、才能未用、缺乏方向、虚伪' },
        { name:'女祭司', numeral:'II', upright:'直觉、神秘、内在智慧、潜意识、静观', reversed:'隐藏真相、缺乏直觉、过度分析、冷漠' },
        { name:'皇后', numeral:'III', upright:'丰饶、母性、自然、感官享受、创造力', reversed:'过度依赖、创造阻塞、忽视自我、占有欲' },
        { name:'皇帝', numeral:'IV', upright:'权威、结构、控制、稳定、领导力', reversed:'专制、僵化、缺乏纪律、过度控制、滥用权力' },
        { name:'教皇', numeral:'V', upright:'传统、精神指引、信仰、从众、教育', reversed:'打破传统、个人信仰、质疑权威、非传统' },
        { name:'恋人', numeral:'VI', upright:'爱情、和谐、关系、价值观一致、选择', reversed:'不和谐、失衡、价值观冲突、错误选择' },
        { name:'战车', numeral:'VII', upright:'胜利、意志力、决心、自律、克服障碍', reversed:'失控、攻击性、方向错误、缺乏自律' },
        { name:'力量', numeral:'VIII', upright:'勇气、耐心、控制、同情心、内在力量', reversed:'自我怀疑、缺乏勇气、原始冲动、软弱' },
        { name:'隐士', numeral:'IX', upright:'内省、独处、寻求真理、内在指引、智慧', reversed:'孤立、孤独、拒绝帮助、迷失方向' },
        { name:'命运之轮', numeral:'X', upright:'变化、循环、转折点、命运、好运', reversed:'厄运、缺乏控制、抗拒变化、打破循环' },
        { name:'正义', numeral:'XI', upright:'公正、真相、因果、责任、法律', reversed:'不公正、缺乏责任、歪曲真相、偏见' },
        { name:'倒吊人', numeral:'XII', upright:'牺牲、等待、新视角、放手、暂停', reversed:'不必要的牺牲、拖延、抗拒、固执' },
        { name:'死神', numeral:'XIII', upright:'结束、转变、重生、放手、重大变化', reversed:'抗拒变化、恐惧结束、停滞、拖延转变' },
        { name:'节制', numeral:'XIV', upright:'平衡、耐心、调和、中庸、自我控制', reversed:'失衡、过度、冲突、缺乏耐心' },
        { name:'恶魔', numeral:'XV', upright:'束缚、沉迷、物质主义、阴影、诱惑', reversed:'释放、重获自由、面对阴影、打破束缚' },
        { name:'高塔', numeral:'XVI', upright:'突变、崩溃、觉醒、真相大白、灾难', reversed:'避免灾难、恐惧变化、延迟崩溃、内在转变' },
        { name:'星星', numeral:'XVII', upright:'希望、信心、更新、宁静、灵感', reversed:'缺乏信心、绝望、disconnected、悲观' },
        { name:'月亮', numeral:'XVIII', upright:'幻觉、恐惧、潜意识、不安、迷惑', reversed:'释放恐惧、真相浮现、清晰、克服不安' },
        { name:'太阳', numeral:'XIX', upright:'快乐、成功、活力、积极、清晰', reversed:'暂时挫折、缺乏成功、过度乐观、幼稚' },
        { name:'审判', numeral:'XX', upright:'重生、内心召唤、宽恕、评判、觉醒', reversed:'自我怀疑、拒绝召唤、未解决、遗憾' },
        { name:'世界', numeral:'XXI', upright:'完成、成就、整合、旅行、圆满', reversed:'未完成、缺乏closure、延迟、空虚' }
    ],
    minor_arcana: {
        wands: { name:'权杖', element:'火', keywords:'行动、热情、创造力、冒险、事业',
            cards: [
                { name:'权杖王牌', upright:'新灵感、创造力爆发、新事业开端、热情', reversed:'延迟、缺乏灵感、能量受阻' },
                { name:'权杖二', upright:'计划、决策、未来展望、野心', reversed:'缺乏计划、恐惧未知、拖延' },
                { name:'权杖三', upright:'扩张、远见、合作、进展', reversed:'阻碍、延迟、缺乏远见' },
                { name:'权杖四', upright:'庆祝、和谐、稳定、里程碑', reversed:'不稳定、缺乏和谐、延迟庆祝' },
                { name:'权杖五', upright:'竞争、冲突、挑战、张力', reversed:'回避冲突、内在挣扎、妥协' },
                { name:'权杖六', upright:'胜利、认可、自信、成功', reversed:'自我怀疑、缺乏认可、延迟成功' },
                { name:'权杖七', upright:'坚持、防御、挑战、毅力', reversed:'被压倒、放弃、缺乏支持' },
                { name:'权杖八', upright:'快速行动、进展、沟通、旅行', reversed:'延迟、挫折、混乱、匆忙' },
                { name:'权杖九', upright:'坚韧、决心、警惕、最后防线', reversed:'疲惫、脆弱、过度防御' },
                { name:'权杖十', upright:'负担、责任、压力、重担', reversed:'释放负担、学会委托、解脱' },
                { name:'权杖侍从', upright:'探索、冒险、新消息、热情', reversed:'缺乏方向、坏消息、冲动' },
                { name:'权杖骑士', upright:'行动、冒险、激情、冲动', reversed:'愤怒、攻击性、鲁莽、精力分散' },
                { name:'权杖王后', upright:'自信、独立、热情、魅力', reversed:'嫉妒、专制、缺乏自信' },
                { name:'权杖国王', upright:'领导力、远见、荣誉、企业家', reversed:'专制、冲动、不切实际、暴怒' }
            ]
        },
        cups: { name:'圣杯', element:'水', keywords:'情感、关系、直觉、爱、灵性',
            cards: [
                { name:'圣杯王牌', upright:'新感情、爱、直觉、情感开端', reversed:'情感空虚、压抑感情、错失机会' },
                { name:'圣杯二', upright:'伙伴关系、吸引、和谐、连接', reversed:'失衡、断裂、不信任、分离' },
                { name:'圣杯三', upright:'友谊、庆祝、社区、喜悦', reversed:'过度社交、孤立、八卦、过度放纵' },
                { name:'圣杯四', upright:'沉思、不满、冷漠、内省', reversed:'觉醒、新机会、接受、动机' },
                { name:'圣杯五', upright:'失落、悲伤、失望、遗憾', reversed:'接受、前进、找到希望、复原' },
                { name:'圣杯六', upright:'怀旧、童年、纯真、善意', reversed:'活在过去、不切实际、自私' },
                { name:'圣杯七', upright:'幻想、选择、白日梦、诱惑', reversed:'清晰、做出选择、面对现实' },
                { name:'圣杯八', upright:'放弃、寻求更深、失望、离开', reversed:'恐惧改变、停滞、逃避' },
                { name:'圣杯九', upright:'满足、愿望成真、幸福、自满', reversed:'不满、贪婪、物质主义' },
                { name:'圣杯十', upright:'家庭和谐、情感满足、幸福、完整', reversed:'破碎的家庭、不和谐、情感混乱' },
                { name:'圣杯侍从', upright:'创意、直觉、新感情、信息', reversed:'情绪化、不成熟、幻想' },
                { name:'圣杯骑士', upright:'浪漫、魅力、想象力、追求', reversed:'情绪化、不切实际、欺骗' },
                { name:'圣杯王后', upright:'同理心、直觉、关怀、情感稳定', reversed:'情绪化、依赖、缺乏同理心' },
                { name:'圣杯国王', upright:'情感平衡、智慧、同理心、成熟', reversed:'情绪操控、冷漠、不稳定' }
            ]
        },
        swords: { name:'宝剑', element:'风', keywords:'思想、沟通、冲突、挑战、理性',
            cards: [
                { name:'宝剑王牌', upright:'清晰思维、真相、突破、新想法', reversed:'混乱、伤害、错误信息' },
                { name:'宝剑二', upright:'僵局、困难选择、回避、平衡', reversed:'信息过载、焦虑、做出决定' },
                { name:'宝剑三', upright:'心碎、悲伤、痛苦、背叛', reversed:'复原、宽恕、走出伤痛' },
                { name:'宝剑四', upright:'休息、恢复、冥想、暂停', reversed:'焦虑、停滞、休息不足' },
                { name:'宝剑五', upright:'冲突、竞争、胜利、不道德', reversed:'和解、放下、学习教训' },
                { name:'宝剑六', upright:'过渡、离开、恢复、新开始', reversed:'停滞、未解决的过去、困难过渡' },
                { name:'宝剑七', upright:'策略、欺骗、回避、不诚实', reversed:'良心发现、面对真相、诚实' },
                { name:'宝剑八', upright:'限制、囚禁、无助、自我设限', reversed:'解放、新视角、走出困境' },
                { name:'宝剑九', upright:'焦虑、噩梦、担忧、痛苦', reversed:'希望、面对恐惧、释放' },
                { name:'宝剑十', upright:'结束、痛苦、背叛、低谷', reversed:'重生、复苏、无法更糟' },
                { name:'宝剑侍从', upright:'好奇、新想法、沟通、警惕', reversed:'八卦、欺骗、批评' },
                { name:'宝剑骑士', upright:'行动、冲动、决心、保卫', reversed:'鲁莽、攻击性、缺乏方向' },
                { name:'宝剑王后', upright:'独立、清晰、诚实、理性', reversed:'冷酷、苛刻、过度批判' },
                { name:'宝剑国王', upright:'权威、理性、结构、清晰思维', reversed:'专制、残忍、操控' }
            ]
        },
        pentacles: { name:'星币', element:'土', keywords:'物质、财富、工作、健康、稳定',
            cards: [
                { name:'星币王牌', upright:'新机会、财富、繁荣、稳定', reversed:'错失机会、缺乏规划、浪费' },
                { name:'星币二', upright:'平衡、优先级、适应、多任务', reversed:'失衡、超负荷、混乱' },
                { name:'星币三', upright:'团队合作、技能、学习、认可', reversed:'缺乏团队、技能不足、不和谐' },
                { name:'星币四', upright:'稳定、安全、保守、控制', reversed:'贪婪、吝啬、过度控制' },
                { name:'星币五', upright:'困难、贫困、孤立、损失', reversed:'恢复、援助、走出困境' },
                { name:'星币六', upright:'给予、分享、慷慨、慈善', reversed:'债务、自私、不平衡' },
                { name:'星币七', upright:'耐心、投资、成长、等待', reversed:'缺乏回报、不耐烦、错误投资' },
                { name:'星币八', upright:'勤奋、技能、承诺、工匠', reversed:'缺乏激情、完美主义、低质量' },
                { name:'星币九', upright:'独立、自给自足、奢侈、成就', reversed:'过度依赖、财务问题、不独立' },
                { name:'星币十', upright:'财富、遗产、家庭、长期成功', reversed:'家庭冲突、财务损失、不稳定' },
                { name:'星币侍从', upright:'学习、机会、成长、务实', reversed:'缺乏进展、短视、浪费' },
                { name:'星币骑士', upright:'可靠、勤奋、耐心、责任', reversed:'停滞、懒惰、缺乏激情' },
                { name:'星币王后', upright:'务实、关怀、富足、安全', reversed:'自我关怀不足、过度依赖、不安全' },
                { name:'星币国王', upright:'财富、商业、安全、纪律', reversed:'贪婪、物质主义、腐败' }
            ]
        }
    }
};

// 构建完整塔罗牌列表
const ALL_TAROT_CARDS = [];
for (const card of TAROT_DATA.major_arcana) {
    ALL_TAROT_CARDS.push({ ...card, type: 'major' });
}
for (const suitKey of Object.keys(TAROT_DATA.minor_arcana)) {
    const suitData = TAROT_DATA.minor_arcana[suitKey];
    for (const card of suitData.cards) {
        ALL_TAROT_CARDS.push({
            ...card, type: 'minor', suit: suitData.name, element: suitData.element
        });
    }
}
