// pages/administrator/limit/limit.js
Page({
  data: {

  },
  onLoad: function (options) {
    wx.cloud.callFunction({
      name: 'saveUser',
      data: {},
      success: res => {
        console.log('[云函数] [saveUser] 调用成功：', res);
      },
      fail: err => {
        console.error('[云函数] [saveUser] 调用失败：', err)
      }
    })
  }
})