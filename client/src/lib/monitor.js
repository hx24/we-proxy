/**
 * 埋点相关
 */

const monitorHostReg = /track\w+\.guahao/ // 匹配挂号的埋点[测试和线上都是https://trackh5.guahao.cn域名上报的]

export function formatMonitorUrl(url, time) {
  if (!monitorHostReg.test(url)) return false

  let event = url.match(/click_event=([^&]+)/)
  let params = url.match(/&data=([^&]+)&?/) // /data=(%7B.+%7D)&?/ 只是匹配对象，monitor.visit()会传字符串
  let clickId = ''
  if (event && event[1]) {
    const splitArr = event[1].split('|click_id=')
    event = splitArr[0]
    clickId = splitArr[1] || ''
    if (event.indexOf('%') > -1) {
      event = decodeURIComponent(event)
    }
  } else {
    event = null
  }
  params = params && params[1] ? params[1] : null
  return {
    event,
    clickId,
    time,
    params: JSON.parse(decodeURIComponent(params))
  }
}

// 小程序埋点地址格式： https://trackh5.guahao.cn/blank.gif?pdata=pv_sid%3D1%7Cpv_seq%3D184%7Cpersession_id%3D1624439849462865435109411195%7Cshortsession_id%3D1624439849463%7Cchannel%3Dmpguahao%7Cuuid%3DoR3MJ0U-7bgBG-1BApTpqCn7f71o%7Cenc_user_id%3D60168112322394840%7Copen_id%3DoR3MJ0U-7bgBG-1BApTpqCn7f71o%7Creport_time%3D1624589544578%7Cclick_event%3Dmy_oneclick%7Cclick_id%3DDH6Bn7x7LAsh8mTn_38%7Curl%3Dmp%253A%252F%252Fweiyi_guahao_miniprogram%252Fwx%252Fpages%252Fmy%252Findex%7Cnum%3D10&data=
// h5格式： https://trackh5.guahao.cn/blank.gif?pdata=pv_sid=26|pv_seq=2|channel=|inchannel=|enc_user_id=|uuid=727d3649a06b77d0da8be4e8e8f764e3|persession_id=16243684170411502732229|shortsession_id=1624501580112|tk=|user_id=|open_id=|uid_cat=|language=zh-cn|report_time=1624523488599|url=http%3A%2F%2Fr.guahao-test.com%2Fmy%2Fprofile%3Fdegrade%3D1|unique_id=1624523488599-13|click_event=my_vipcard_ads_exp|click_id=DH6Bn7x7LAsh8mTn_35&data=%7B%22exp_rank%22%3A1%2C%22url%22%3A%22https%3A%2F%2Fhd.guahao.com%2Fu%2F28872%22%7D