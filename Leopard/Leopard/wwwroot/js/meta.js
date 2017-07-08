var phoneWidth = parseInt(window.screen.width);
var phoneScale = phoneWidth / 960;
var ua = navigator.userAgent;
if (/Android (\d+\.\d+)/.test(ua)) {
    var version = parseFloat(RegExp.$1);
    // andriod 2.3
    if (version > 2.3) {
        document.write('<meta name="viewport" content="width=960, minimum-scale = ' + phoneScale + ', maximum-scale = ' + phoneScale + ', target-densitydpi=device-dpi">');
        // andriod 2.3浠ヤ笂
    } else {
        document.write('<meta name="viewport" content="width=960">');
    }
    // 鍏朵粬绯荤粺
} else {
	//document.write('<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, user-scalable=no">');
    
	document.write('<meta name="viewport" content="width=960, minimum-scale = ' + phoneScale + ', maximum-scale = ' + phoneScale + ',user-scalable=no">');
    //document.write('<meta name="viewport" content="width=640, user-scalable=no">');
}