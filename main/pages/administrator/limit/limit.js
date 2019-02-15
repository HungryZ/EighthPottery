// pages/administrator/limit/limit.js
Page({
  data: {
    userArray: [],
  },

  onLoad: function (options) {
    this.getAllAdministrator()
  },

  userClicked(e) {
    const selectedAdmin = this.data.userArray[e.currentTarget.id]
    this.openConfirm(selectedAdmin)
  },

  getAllAdministrator() {
    wx.showLoading()
    wx.cloud.callFunction({
      name: 'getAllAdministrator',
      data: {},
      success: res => {
        wx.hideLoading()
        console.log('[云函数] [getAllAdministrator] ', res)
        this.setData({
          userArray: res.result.userArray
        })
      },
      fail: res => {
        wx.hideLoading()
        console.log('[云函数] [getAllAdministrator] 调用失败', res)
      }
    })
  },

  openConfirm: function (admin) {
    let that = this
    wx.showModal({
      title: '删除确认',
      content: '即将删除管理员：' + admin.nickName,
      confirmText: "删除",
      confirmColor: "#e64340",
      cancelText: "取消",
      success: function (res) {
        console.log(res);
        if (res.confirm) {
          that.deleteAdministratorByID(admin._id)
        } else {
          console.log('取消')
        }
      }
    });
  },

})