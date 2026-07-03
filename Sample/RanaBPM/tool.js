function timeEvent()
{
    const now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var date = now.getDate();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    
    // 定义欢迎语
    var welcome = '';
    if (hours >= 5 && hours < 7) {
        welcome = '早上好！<br>欢迎来到RanaBPM！';      // 05:00-06:59
    } else if (hours >= 7 && hours < 12) {
        welcome = '上午好！<br>欢迎来到RanaBPM！';      // 07:00-11:59
    } else if (hours >= 12 && hours < 14) {
        welcome = '中午好！<br>欢迎来到RanaBPM！';      // 12:00-13:59
    } else if (hours >= 14 && hours < 18) {
        welcome = '下午好！<br>欢迎来到RanaBPM！';      // 14:00-17:59
    } else if (hours >= 18 && hours < 22) {
        welcome = '晚上好！<br>欢迎来到RanaBPM！';      // 18:00-21:59
    } else {
        welcome = '夜深了。欢迎来到RanaBPM！';      // 22:00-04:59
    }

    var timer = "现在是"+year+"年"+month+"月"+date+"日"+hours+"时"+minutes+"分";

    document.getElementById('welcome').innerHTML = welcome;
    document.getElementById('timer').innerHTML = timer;

    setTimeout(timeEvent, 1000);  // 去掉括号，传递函数本身
}

// 启动定时器
timeEvent();