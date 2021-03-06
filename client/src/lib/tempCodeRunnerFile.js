const monitorHostReg = /track\w+\.guahao/ // 匹配挂号的埋点[测试和线上都是https://trackh5.guahao.cn域名上报的]

function formatMonitorUrl(url, time) {
  if (!monitorHostReg.test(url)) return false
  url = url.replace(/(pdata=)([^&]+)(&.*)?/, (match, p1, p2, p3) => p1 + decodeURIComponent(p2) + (p3 || ''))
  const baseData = url.match(/pdata=([^|&]+)[|&]?/)
  console.log('baseData', baseData)
  let pageUrl = url.match(/url=([^|&]+)[|&]?/)
  pageUrl = pageUrl?.[1] ? decodeURIComponent(pageUrl[1]) : ''
  let event = url.match(/click_event=([^&]+)/)
  let params = url.match(/&data=([^&]+)&?/) // /data=(%7B.+%7D)&?/ 只是匹配对象，monitor.visit()会传字符串
  let clickId = ''
  if (event && event[1]) {
    const splitArr = event[1].split('|click_id=')
    event = splitArr[0]
    clickId = (splitArr[1] || '').replace(/\|.*/, '')
    if (event.indexOf('%') > -1) {
      event = decodeURIComponent(event)
    }
  } else {
    event = null
  }
  params = params && params[1] ? params[1] : null
  const isPageMonitor = !event && !clickId && pageUrl
  return {
    event,
    clickId,
    time,
    isPageMonitor,
    pageUrl,
    params: JSON.parse(decodeURIComponent(params))
  }
}

const url = 'https://trackh5.guahao.cn/blank.gif?pdata=pv_sid%3D1%7Cpv_seq%3D89%7Cpersession_id%3D1626426278074133396360445004%7Cshortsession_id%3D1626426278075%7Cchannel%3Dmpguahao%7Cuuid%3DoR3MJ0U-7bgBG-1BApTpqCn7f71o%7Cenc_user_id%3D60168112322394840%7Copen_id%3DoR3MJ0U-7bgBG-1BApTpqCn7f71o%7Creport_time%3D1627310737226%7Cclick_event%3Dmy_tools%7Cclick_id%3DDH6Bn7x7LAsh8mTn_33%7Curl%3Dmp%253A%252F%252Fweiyi_guahao_miniprogram%252Fwx%252Fpages%252Fmy%252Findex%7Ctest%3D123&data=%7B%22click_rank%22%3A0%2C%22tools_name%22%3A%22%E5%AE%A2%E6%9C%8D%E4%B8%AD%E5%BF%83%22%7D'

formatMonitorUrl(url)