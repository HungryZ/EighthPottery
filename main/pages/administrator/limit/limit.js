// pages/administrator/limit/limit.js
Page({
  data: {
    userArray: [],
  },

  onLoad: function (options) {
    this.getAllAdministrator()
  },

  getAllAdministrator() {
    wx.cloud.callFunction({
      name: 'getAllAdministrator',
      data: {},
      success: res => {
        console.log('[云函数] [getAllAdministrator] ', res)
        this.setData({
          userArray: res.result.userArray
        })
      },
      fail: res => {
        console.log('[云函数] [getAllAdministrator] 调用失败', res)
      }
    })
  }
})