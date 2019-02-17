// pages/administrator/limit/limit.js
Page({
  data: {
    userArray: [],
  },

  onLoad: function(options) {},

  onShow: function(options) {
    this.getAllAdministrator()
  },

  userClicked(e) {
    const selectedAdmin = this.data.userArray[e.currentTarget.id]
    // 暂时写死，后期考虑加一个superAdmin表
    if (selectedAdmin._openid == 'oLi_N4hWJfH-ViYWyJE83MS88yq4') return
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

  deleteAdministratorByOpenid(_openid) {
    wx.showLoading()
    wx.cloud.callFunction({
      name: 'deleteAdministrator',
      data: {
        _openid: _openid
      },
      success: res => {
        wx.hideLoading()
        console.log('[云函数] [deleteAdministrator] 调用成功：', res.result)
        this.getAllAdministrator()
      },
      fail: err => {
        console.error('[云函数] [deleteAdministrator] 调用失败', err)
        wx.showToast({
          icon: 'none',
          title: '请求失败'
        })
      }
    })
  },

  openConfirm: function(admin) {
    let that = this
    wx.showModal({
      title: '删除确认',
      content: '即将删除管理员：' + admin.nickName,
      confirmText: "删除",
      confirmColor: "#e64340",
      cancelText: "取消",
      success: function(res) {
        if (res.confirm) {
          that.deleteAdministratorByOpenid(admin._openid)
        } else {
          console.log('取消')
        }
      }
    });
  },

})