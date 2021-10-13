/**
 * 时间格式化
 */

/**
 * @param {String} fmt  YYYY-mm-dd HH:MM:SS
 * @param {Date} timeNum
 */
export function dateFormat(fmt, timeNum) {
  let ret;
  let date = new Date(timeNum);
  const opt = {
    "Y+": date.getFullYear().toString(),        // 年
    "m+": (date.getMonth() + 1).toString(),     // 月
    "d+": date.getDate().toString(),            // 日
    "H+": date.getHours().toString(),           // 时
    "M+": date.getMinutes().toString(),         // 分
    "S+": date.getSeconds().toString()          // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (let k in opt) {
    ret = new RegExp("(" + k + ")").exec(fmt);
    if (ret) {
      fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k])
        : (opt[k].padStart(ret[1].length, "0")))
    };
  };
  return fmt;
}
export function formatTimeData(targetTime, data, targetData) {
  const invoiceOrderList = Object.assign([], data);
  const tripTimeArr = [];
  let listData = [];
  let maxTrips = 0;
  invoiceOrderList.forEach((item, index) => {
    const time = item[targetTime];
    const year = new Date(time).getFullYear();
    const month = new Date(time).getMonth() + 1;
    item.canInvoiceAmount = Number(item.canInvoiceAmount).toFixed(2);
    item.tripTime = `${year}年${month}月`;
    tripTimeArr.push(item.tripTime)
  })
  const newTripTimeArr = Array.from(new Set(tripTimeArr));
  const _invoiceOrderList = [];
  newTripTimeArr.forEach((_item, _index) => {
    const _invoiceOrderItem = {
      orderTime: _item,
      orderList: []
    }
    invoiceOrderList.forEach((item, index) => {
      if (item.tripTime === _item) {
        maxTrips += 1;
        _invoiceOrderItem.orderList.push(item);
      }
    })
    _invoiceOrderList.push(_invoiceOrderItem);
  })
  let deleteIndex = -1;
  if (_invoiceOrderList && _invoiceOrderList.length > 0 && targetData && targetData.length > 0) {
    _invoiceOrderList.forEach((item, index) => {
      const invoiceOrderTime = item.orderTime;
      targetData.forEach((targetItem, targetIndex) => {
        const targetTime = targetItem.orderTime;
        if (invoiceOrderTime === targetTime) {
          deleteIndex = targetIndex;
          item.orderList = [...targetItem.orderList, ...item.orderList]
        }
      })
    })
  }
  if (deleteIndex >= 0) {
    targetData.splice(deleteIndex, 1)
  }
  listData = [...targetData, ...Object.assign([], _invoiceOrderList)];

  return { listData, maxTrips }
}

// 日期转换为今天、明天、周几
export function formatTimeToText(date) {
  const tempDate = date.split('-').join('/')
  const targetDay = new Date(tempDate);

  const dateNow = new Date();
  const yy = dateNow.getFullYear();
  const mm = dateNow.getMonth() + 1;
  const dd = dateNow.getDate();

  const today = new Date(`${yy}/${mm}/${dd}`);
  const diffDay = parseInt((targetDay - today) / 1000 / 60 / 60 / 24);
  let result = ''
  switch (diffDay) {
    case 0:
      result = '今天'
      break;
    case 1:
      result = '明天'
      break;
    case 2:
      result = '后天'
      break
    default:
      result = formatTimeToWeek(tempDate)
      break;
  }
  return result
}
// 日期转换为星期数
export function formatTimeToWeek(date) {
  const num = new Date(date).getDay()
  const weekStr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return weekStr[num]
}
// 今天明天几月几日 config控制加不加后边的时间
export function formatTripTime(date, config = false) {
  const dateStr = new Date(date)
  const today = new Date()
  const hour = dateStr.getHours()
  const minute = dateStr.getMinutes()
  const year = dateStr.getFullYear()
  const day = dateStr.getDate()
  const month = dateStr.getMonth() + 1

  const nowYear = today.getFullYear()
  const nowDay = today.getDate()
  const nowMonth = today.getMonth() + 1
  let time = ''
  if (nowYear === year && nowMonth === month && nowDay - day === 0) {
    time = config ? "今天 " + add0(hour) + ":" + add0(minute) : "今天 "
    return time
  } else if (nowYear === year && nowMonth === month && nowDay - day === -1) {
    time = config ? "明天 " + add0(hour) + ":" + add0(minute) : "明天 "
    return time
  } else {
    time = config ? month + "月" + day + "日 " + add0(hour) + ":" + add0(minute) : month + "月" + day + "日 "
    return time
  }
}
export function add0(num) {
  if (num < 10) {
    return '0' + num;
  }
  return num;
}

// 日期转换为 hh:mm
export function formatTimeToHour(date) {
  const targetDay = new Date(date);
  const hh = (targetDay.getHours() < 10 ? '0' + targetDay.getHours() : targetDay.getHours()) + ':';
  const mm = (targetDay.getMinutes() < 10 ? '0' + targetDay.getMinutes() : targetDay.getMinutes());
  return hh + mm
}

// 日期转换为几月几日
export function formatTimeToMonthDay(date, type = '') {
  const targetDay = new Date(date);
  const YYYY = targetDay.getFullYear();
  const MM = (targetDay.getMonth() + 1 < 10 ? '0' + (targetDay.getMonth() + 1) : targetDay.getMonth() + 1);
  const DD = (targetDay.getDate() < 10 ? '0' + (targetDay.getDate()) : targetDay.getDate());
  if (type === 'MM-DD') {
    return `${MM}-${DD}`
  } else if (type === 'MM/DD') {
    return `${MM}/${DD}`
  } else if (type === 'YYYY/MM/DD') {
    return `${YYYY}/${MM}/${DD}`
  }else if (type === 'YYYY-MM-DD') {
    return `${YYYY}-${MM}-${DD}`
  }
  return `${MM}月${DD}日`
}

// 时间差
export function getAllDateCN(start, end) {
  const startTime = new Date(start)
  const endTime = new Date(end)
  const date_all = [];
  let i = 0;
  while (endTime - startTime >= 0) {
    const year = startTime.getFullYear();
    const day = formatTimeToMonthDay(startTime, 'MM-DD');  // MM-DD
    const week = formatTimeToText(`${year}-${day}`) // 周几
    date_all[i] = {
      ts: startTime.valueOf(), // 时间戳
      week,
      year, // 年
      day
    };
    startTime.setDate(startTime.getDate() + 1);
    i += 1;
  }
  return date_all;
}


// 获取任意一天的开始时间
export function getHours(time, appoint = [0, 0, 0, 0]) {
  // time为某一天的时间戳
  const nowTimeDate = new Date(time)
  return nowTimeDate.setHours(appoint[0], appoint[1], appoint[2], appoint[3])
}

// 分钟转小时
export function handleMinuteToHours(estimateTime) {
  if (!estimateTime) return ''
  const hours = Math.floor(estimateTime / 60);
  const minute = estimateTime % 60;
  if (hours > 0) {
    if (minute > 0) {
      return `${hours}小时${minute}分钟`
    } else {
      return `${hours}小时`
    }
  } else {
    return `${minute}分钟`
  }
}

// 分钟
export function handleMinute(start, end) {
  const _start = new Date(start).getTime();
  const _ende = new Date(end).getTime()
  const interval = _start - _ende
  if (interval > 0) {
    return interval / 60000
  }
  return ''
}

// 根据开始、结束时间返回倒计时XX分XX钟
export function getTimeLeft(start,end){
  let ss = ''
  let time_now_server, time_now_client, time_end, time_server_client
  time_end = end // 结束时间
  time_now_server = start // 开始时间
  time_now_client = new Date();
  time_now_client = time_now_client.getTime(); // 当前时间
  time_server_client = time_now_server - time_now_client;// 开始时间-当前时间
  let time_now, time_distance
  time_now = new Date()
  time_now = time_now.getTime() + time_server_client // 现在当前时间 + 时间差
  time_distance = time_end - time_now; // 结束时间-当前时间
  if (time_distance > 0) {
    let h = Math.floor(time_distance / 3600000)
    time_distance -= h * 3600000;
    let m = Math.floor(time_distance / 60000)
    time_distance -= m * 60000;
    let s = Math.floor(time_distance / 1000)
    if (h < 10)h = "0" + h;
    if (m < 10)m = "0" + m;
    if (s < 10)s = "0" + s;
    ss = `${m}:${s}`
  } 
  return ss
}
// 分钟
export function handleBetweenHour(start, end) {
  const log = 60 * 60 * 1000
  const _start = new Date(start).getTime();
  const _ende = new Date(end).getTime();
  const hour = (_ende - _start) / log;
  const day = hour / 24
  if (!hour) {
    return ''
  }
  if (day < 1) {
    if (hour < 1) {
      return `约${parseInt(hour * 60)}分钟`
    }
    if (Number.isInteger(hour)) {
      return `约${hour}小时`
    }
    return `约${Math.floor(hour)}-${Math.ceil(hour)}小时`
  } else {
    return `约${Math.floor(day)}-${Math.ceil(day)}天`
  }
}
 
// 判断选择时间是否是今天
// 当前时间, 选择时间
export function istoday( nowTime, selectTime) { 
  return new Date(nowTime).toDateString() === new Date(selectTime).toDateString();
}

// 日期转换为 次日、MM-DD
export function formatTimeToPaperwork(date) {
  const targetDay = new Date(date);

  const dateNow = new Date();
  const yy = dateNow.getFullYear();
  const mm = dateNow.getMonth() + 1;
  const dd = dateNow.getDate();

  const today = new Date(`${yy}/${mm}/${dd}`);
  const diffDay = parseInt((targetDay - today) / 1000 / 60 / 60 / 24);
  let result = ''
  switch (diffDay) {
    case 0:
      result = ''
      break;
    case 1:
      result = '次日'
      break;
    default:
      result = formatTimeToMonthDay(date,'MM-DD')
      break;
  }
  return result
}

