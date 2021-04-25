import HOST from './host'
const commonPath = '../assets'

const {SSO,  KOALA, USER, FCBEE, FCREPORT, FCTRADE}: any = HOST


const API = {
  defaultImg: `${commonPath}/defaultImg.png`,

  /**
   * 公共附件上传（附件类型type）
   * 1.追花用户头像，2.追花菜单ICON，3.蜜源植物ICON图片，4.蜜源植物附件图片，5.蜜源点附件图片，6.中蜂保护区附件
   * 7.养蜂平台附件，8.摇蜜记录附件，9.互助信息附件，10.自有蜂场附件，11.外部蜂场附件，12.标准天气图标，13.标准天气背景，
   * 14.摇蜜日志附件，15.寻蜜日志附件，16.摇蜜申请单附件，17.质检记录附件，18.商品附件
  */
  // 公共接口
  base: {
    attachUpload: `${FCBEE}/config/common/pic-upload`, // 公开附件图片上传
    encryptionUpload: `${FCBEE}/config/common/encryption-upload`,//身份证、银行卡合同附件图片上传
    dictionaryConfigs: `${FCBEE}/config/common/get-config-list`,  // 字典配置-获取字典配置列表（动态）
    allEnumList: `${FCBEE}/config/common/get-all-enum-list`, // 字典配置-获取所有枚举字典列表（固定）
    accountExist: `${SSO}/admin/sso/account-exist`, // 账号注册校验
    heartBeat: `${SSO}/admin/sso/heart-beat`, // 心跳确认

    allTradeEnumList: `${FCTRADE}/config/common/get-all-enum-list`, // 交易所有枚举值
  },

  //列表导出汇总
  exportExcel: {
    exportProduct: `${FCTRADE}/admin/excel-export/product`, // 商品数据导出
  },
  // 导入
  importExcel: {
    importPayReceipt: `${FCTRADE}/admin/excel-import/pay-result`, // 导入银行卡回执单
  },

  // 用户操作
  user: {
    wxLogin: `${SSO}/admin/sso/login-by-wechat`, // 微信二维码登录
    smsLogin: `${SSO}/admin/sso/sms-login`, // 短信登录
    getLoginCode: `${SSO}/admin/sso/verify-code-get`, // 获取登录验证码
    permissionCheck: `${FCBEE}/admin/fc-user/permission-check`, // 获取登录权限校验
    autoLogin: `${SSO}/admin/sso/automatic-login`, // 自动登录
    userDetail: `${FCBEE}/admin/fc-user/current-info`, // 获取用户个人信息
    userRoles: `${FCBEE}/admin/fc-user/role`, // 用户拥有权限
  },

  // 首页
  dashboard: {
    boardCount: `${FCREPORT}/admin/dashboard/overview`, // 看板 统计概览
  },

  // 模块名称
  demoapi: {

  }
}

export default API
