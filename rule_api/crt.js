const fs = require('fs')
const certMgr = require("../proxy.js").utils.certMgr

module.exports = {
  *beforeSendRequest(requestDetail) {
    // TODO 创建api语法糖
    const fileType = "crt" // TODO cer格式支持
    const _crtFilePath = certMgr.getRootCAFilePath() // 根证书的全路径
    let localResponse = {}
    if (_crtFilePath) {
      // TODO stream
      const crtBuffer = fs.readFileSync(_crtFilePath)
      localResponse = {
        statusCode: 200,
        header: {
          "Content-Type": "application/x-x509-ca-cert",
          "Content-Disposition": `attachment; filename="rootCA.${fileType}"`,
          "Access-Control-Allow-Origin": "*",
        },
        body: crtBuffer,
      }
    } else {
      localResponse = {
        statusCode: 200,
        header: { "Content-Type": "plain/text" },
        body: "还未生成根证书，请先生成",
      }
    }
    if (requestDetail.url.includes("we.pro/crt")) {
      return {
        response: localResponse,
      }
    }
    return null
  },
}
