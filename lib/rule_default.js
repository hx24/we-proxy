'use strict';

const fs = require('fs')
const certMgr = require("../proxy.js").utils.certMgr

module.exports = {
  
  summary() {
    return 'the default rule for AnyProxy';
  },
  
  /**
   * 
   * 
   * @param {object} requestDetail
   * @param {string} requestDetail.protocol
   * @param {object} requestDetail.requestOptions
   * @param {object} requestDetail.requestData
   * @param {object} requestDetail.response
   * @param {number} requestDetail.response.statusCode
   * @param {object} requestDetail.response.header
   * @param {buffer} requestDetail.response.body
   * @returns
   */
  *beforeSendRequest(requestDetail) {
    // TODO 会被自定义规则覆盖，应该与mock逻辑一样进行合并
    const fileType = "crt" // TODO cer格式支持
    const _crtFilePath = certMgr.getRootCAFilePath() // 根证书的全路径
    let localResponse = {}
    debugger
    if (_crtFilePath) {
      // TODO stream
      const crtBuffer = fs.readFileSync(_crtFilePath);
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
    if (requestDetail.url.includes("we.pro/cert")) {
      return {
        response: localResponse,
      }
    }
    return null;
  },


  /**
   * 
   * 
   * @param {object} requestDetail
   * @param {object} responseDetail
   */
  *beforeSendResponse(requestDetail, responseDetail) {
    return null;
  },


  /**
   * 
   * 
   * @param {any} requestDetail 
   * @returns 
   */
  *beforeDealHttpsRequest(requestDetail) {
    return false;
  },

  /**
   * 
   * 
   * @param {any} requestDetail 
   * @param {any} error 
   * @returns 
   */
  *onError(requestDetail, error) {
    return null;
  },


  /**
   * 
   * 
   * @param {any} requestDetail 
   * @param {any} error 
   * @returns 
   */
  *onConnectError(requestDetail, error) {
    return null;
  },
};
