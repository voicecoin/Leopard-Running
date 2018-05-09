/*
 用途：检查输入字符串是否只由英文字母和数字和文字和下划线组成
 输入：
 s：字符串
 返回：
 如果通过验证返回true,否则返回false

 */
function isNumberOr_Letter(s) {
	var regu = "^[\a-\z\A-\Z0-9\u4E00-\u9FA5\_\-]+$";
	var re = new RegExp(regu);
	if (re.test(s)) {
		return true;
	} else {
		return false;
	}
}

function isLimitNumberOr_Letter(s) {
	var regu = "^[\a-\z\A-\Z0-9\u4E00-\u9FA5\@\#\$\%\^\&\*]+$";
	var re = new RegExp(regu);
	if (re.test(s)) {
		return true;
	} else {
		return false;
	}
}
/*
 用途：检查输入字符串是否只由英文字母和数字和文字组成
 输入：
 s：字符串
 返回：
 如果通过验证返回true,否则返回false

 */
function noSpecialSymbols(s) {
	var regu = "^[\a-\z\A-\Z0-9\u4E00-\u9FA5\_\:\.\{\} ]+$";
	var re = new RegExp(regu);
	if (re.test(s)) {
		return true;
	} else {
		return false;
	}
}

/*
 用途：检查输入字符串是否只由英文字母和数字和文字组成
 输入：
 s：字符串
 返回：
 如果通过验证返回true,否则返回false

 */
function isNumber_Letter(s) {
	var regu = "^[\a-\z\A-\Z0-9\_]+$";
	var re = new RegExp(regu);
	if (re.test(s)) {
		return true;
	} else {
		return false;
	}
}
/*
 用途：检查输入字符串是否为空或者全部都是空格
 输入：str
 返回：
 如果全是空返回true,否则返回false
 */
//function isNull(str) {
//	if (str == "") return true;
//	var regu = "^[ ]+$";
//	var re = new RegExp(regu);
//	return re.test(str);
//}
function isNull( str )
{
	if ( str == "" ) return true;
	var regu = "^[ ]+$";
	var re = new RegExp(regu);
	return re.test(str);
}

/*
 用途：检查输入字符串是否为手机号码
 输入：
 s：字符串
 返回：
 如果通过验证返回true,否则返回false

 */
function isMobile(s) {
	var reg = /^0?1[3|4|7|5|8][0-9]\d{8}$/;
	if (reg.test(s) || s=="") {
		return true;
	} else {
		return false;
	}
}
//验证密码格式  大写字母、小写字母、数字、任意组合
function chkPwd(s){
	var reg = /^[0-9a-zA-Z\.@_\$%&^#\*\!]{6,16}$/;
//	var reg = /^(?![a-zA-Z0-9]+$)(?![^a-zA-Z/D]+$)(?![^0-9/D]+$).{8,16}$/;
	if (reg.test(s)) {
		return true;
	} else {
		return false;
	}
}
//验证邮箱
function chkEmail(s){
	var reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,4}$/;
	if(reg.test(s) || s==""){
		return true;
	} else {
		return false;
	}
}
// 验证密码相等
function isEqual(v1, v2) {
	if (v1 == v2) {
		return true;
	} else {
		return false;
	}
}

// 验证用户名
function checkUserName(s) {
	var reg = /^[a-zA-Z0-9\_]+$/;
	if(reg.test(s)){
		return true;
	} else {
		return false;
	}
}
//验证注册密码 必须包含大写、小写、和数字
function chkPwd1(s) {
	var reg = /(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])[a-zA-Z0-9]{8,16}/
	if(reg.test(s)){
		return true;
	} else {
		return false;
	}
}