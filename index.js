const fs = require("fs/promises");
const { json } = require("stream/consumers");

// ========== 任務一：讀取會員清單 ==========
/**
 * 讀取指定路徑的 JSON 檔案，回傳解析後的會員陣列。
 *
 * @param {string} filePath - 會員 JSON 檔案的路徑（相對或絕對都可以）
 * @returns {Promise<Array<Object>>} 會員物件陣列
 *
 * @example
 *   const members = await readMembers('./fixtures/members.json');
 *   console.log(members[0].name); // '小華'
 */
/**
 * [NOTE]
 * fs.readFile(filePath, encoding)
 * 讀取指定路徑的檔案，回傳 Promise<string>(加了 encoding) 或 Promise<Buffer>(沒加)
 * encoding 一定要給 'utf-8'，這樣拿到的才是字串，不是原始 binary Buffer。
 *
 * JSON.parse(string)
 * 把 JSON 格式的字串解析成 JavaScript 物件 / 陣列。
 */
async function readMembers(filePath) {
	// 提示：用 fs/promises 的 readFile，記得加 'utf-8'，再用 JSON.parse 轉成物件
	const raw = await fs.readFile(filePath, "utf-8");
	return JSON.parse(raw);
}

// ========== 任務二：篩選 VIP 會員 ==========
/**
 * 從會員陣列中篩選出 level 為 "VIP" 的會員。
 *
 * @param {Array<Object>} members - 會員陣列
 * @returns {Array<Object>} 只包含 VIP 會員的新陣列
 *
 * @example
 *   filterVIP([
 *     { name: '小華', level: 'VIP' },
 *     { name: '小美', level: 'normal' }
 *   ]); // [{ name: '小華', level: 'VIP' }]
 */
/**
 * [NOTE]
 * const newArr = arr.filter((element) => (回傳 true 即保留) );
 * 對陣列的每個元素執行一個判斷函式（callback）, 只把「回傳 true」的元素收集成新陣列後回傳。
 *
 * 為何「不修改原陣列」？
 * 如果在 callback 裡直接對 members 做 push / splice / 修改屬性，
 * 呼叫端拿到的原始資料就會被悄悄改掉，可能會產生難以追蹤的 bug。 * filter 本身不會修改原陣列，只要不在 callback 裡亂動元素就安全。
 */
function filterVIP(members) {
	// 提示：用 Array.prototype.filter，不要修改原陣列
	return members.filter((member) => member.level === "VIP");
}

// ========== 任務三：計算會員剩餘點數總和 ==========
/**
 * 加總會員陣列中所有人的 credits 欄位。
 *
 * @param {Array<{credits: number}>} members - 會員陣列
 * @returns {number} credits 總和，空陣列回傳 0
 *
 * @example
 *   sumCredits([{ credits: 120 }, { credits: 30 }]); // 150
 *   sumCredits([]);                                  // 0
 */
/**
 *  [NOTE]
 *  arr.reduce((accumulator, currentElement) => {
    return (新的累積值) ; 
    }, 初始值);
 *  把陣列「摺疊」成單一值（數字、字串、物件都行）。每次迭代會把「目前的累積值（accumulator）」和「當前元素」傳給 callback，callback 回傳的結果就成為下一次的累積值。
 *
 *  初始值（第二個參數）為什麼重要？
 *  如果省略初始值，reduce 會把「第一個元素」當成初始值，空陣列呼叫時會發生 TypeError
 *  給初始值 0，空陣列才會安全地回傳 0，才會符合規格。
 * 
 *  取物件的 credits 屬性：current 是單一會員物件，用 current.credits 取數字。
 */

function sumCredits(members) {
	// 提示：用 reduce，初始值給 0
	return members.reduce((acc, member) => acc + member.credits, 0);
}

// ========== 任務四：讀取環境變數 ==========
/**
 * 從 process.env 讀取健身房設定，組成設定物件。
 *
 * 規則：
 *   - GYM_NAME 未設定 → 預設 '未命名健身房'
 *   - ADMIN_NAME 未設定 → 預設 '尚未指派'
 *   - DEFAULT_MEMBERS_PATH → 原樣回傳（沒有預設值）
 *
 * @returns {{gymName: string, adminName: string, defaultMembersPath: string | undefined}}
 *
 * @example
 *   process.env.GYM_NAME = 'FitClub';
 *   process.env.ADMIN_NAME = 'Leo';
 *   getGymConfig();
 *   // { gymName: 'FitClub', adminName: 'Leo', defaultMembersPath: undefined }
 */
/**
 * [NOTE]
 *  Node.js 的全域物件 process.env 是一個普通 JS 物件，Key 是環境變數名稱（字串），Value 永遠是「字串」或「undefined」（沒設定時）。
 *  process.env.GYM_NAME   // 有設定  →'FitClub'（字串）
 *  process.env.NOT_SET    // 沒設定  → undefined
 *
 *  || 是「邏輯 OR」
 *  當左側是「falsy 值」（undefined、null、''、0、false、NaN）時，整個運算式回傳「右側的值」，否則回傳「左側的值」。
 *  process.env.GYM_NAME || '未命名健身房'
 *  有設定時：'FitClub'（左側非 falsy，直接回傳左側）
 *  沒設定時：'未命名健身房'（左側是 undefined，回傳右側）
 *
 *  DEFAULT_MEMBERS_PATH 沒有預設值，直接回傳 process.env 的值即可（可能是 undefined）。
 *
 *  用 { key: value, ... } 語法直接建立並回傳物件。
 *  Key 名稱要符合規格（gymName、adminName、defaultMembersPath），不是環境變數的大寫名稱。
 */
function getGymConfig() {
	// 提示：用 || 給預設值
	return {
		gymName: process.env.GYM_NAME || "未命名健身房",
		adminName: process.env.ADMIN_NAME || "尚未指派",
		defaultMembersPath: process.env.DEFAULT_MEMBERS_PATH,
	};
}

// ========== 任務五：VIP 會員統計摘要（綜合題）==========
/**
 * 讀取會員檔案、篩出 VIP、回傳統計摘要。
 *
 * 可以（也建議）呼叫前面寫好的 readMembers / filterVIP / sumCredits。
 *
 * @param {string} filePath - 會員 JSON 檔案的路徑
 * @returns {Promise<{count: number, totalCredits: number, names: string[]}>}
 *
 * @example
 *   await getVIPSummary('./fixtures/members.json');
 *   // { count: 2, totalCredits: 320, names: ['小華', '阿強'] }
 */
/**
 * [NOTE]
 * readMembers 回傳 Promise，所以要 await；filterVIP / sumCredits 是同步函式，直接呼叫即可。
 * 
 * map 和 filter 很像，差別在於：
 * filter 決定「哪些元素留下」，元素本身不變
 * map 決定「每個元素轉換成什麼」，回傳等長的新陣列
 * 把 VIP 會員物件陣列轉成姓名字串陣列：
 * vips.map((member) => member.name)
  //   [{ name: '小華', ... }, { name: '阿強', ... }]
  // → ['小華', '阿強']
 * 
 * 取陣列元素個數，直接用 array.length，是數字。
 *  vips.length → 2（有幾位 VIP）
 * 
 * 規格要求 { count, totalCredits, names }，key 名稱要完全對應，測試才會過。	
 */
async function getVIPSummary(filePath) {
	// 步驟：
	//   1. 讀會員資料
	//   2. 篩出 VIP
	//   3. 算總點數、收集姓名
	//   4. 回傳 { count, totalCredits, names }
	const members = await readMembers(filePath);
	const vips = filterVIP(members);
	return {
		count: vips.length,
		totalCredits: sumCredits(vips),
		names: vips.map((member) => member.name),
	};
}

module.exports = {
	readMembers,
	filterVIP,
	sumCredits,
	getGymConfig,
	getVIPSummary,
};
