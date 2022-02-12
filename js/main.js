
deviceCheck()

function deviceCheck() {
    // 디바이스 종류 설정
    var pcDevice = "win16|win32|win64|mac|macintel";
 
    // 접속한 디바이스 환경
    if ( navigator.platform ) {
        if ( pcDevice.indexOf(navigator.platform.toLowerCase()) < 0 ) {
            location.href = "./mobile.html";
        } else {
            // location.href = "./mobile.html";
            location.href = "./pc.html";
        }
    }
}