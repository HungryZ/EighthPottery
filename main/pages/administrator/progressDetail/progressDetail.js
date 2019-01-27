// pages/administrator/progressDetail/progressDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _id: null,
    progressModel: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data._id = options._id
    this.queryProgress()
  },

  descriptInputing(e) {
    this.data.progressModel.description = e.detail.value
  },

  timeInputing(e) {
    this.data.progressModel.time = Number(e.detail.value)
  },

  noteInputing(e) {
    this.data.progressModel.note = e.detail.value
  },

  submitBtnClicked() {
    this.updateProgress()
  },

  deleteBtnClicked() {
    this.openConfirm()
  },

  queryProgress() {
    const db = wx.cloud.database()
    db.collection('progress').doc(this.data._id).get({
      success: res => {
        console.log(res)
        this.setData({
          progressModel: res.data
        })
      }
    })
  },

  updateProgress() {
    wx.showLoading()
    wx.cloud.callFunction({
      name: 'updateProgress',
      data: {
        progressModel: this.data.progressModel
      },
      success: res => {
        wx.showToast({
          title: '修改成功'
        })
        console.log('[云函数] [updateProgress] 调用成功：', res.result)
      },
      fail: err => {
        console.error('[云函数] [updateProgress] 调用失败', err)
        wx.showToast({
          icon: 'none',
          title: '请求失败'
        })
      }
    })
  },

  deleteProgress() {
    wx.showLoading()
    wx.cloud.callFunction({
      name: 'deleteProgress',
      data: {
        _id: this.data._id
      },
      success: res => {
        console.log('[云函数] [deleteProgress] 调用成功：', res.result)
        wx.navigateBack()
        wx.showToast({
          title: '刪除成功'
        })
      },
      fail: err => {
        console.error('[云函数] [deleteProgress] 调用失败', err)
        wx.showToast({
          icon: 'none',
          title: '请求失败'
        })
      }
    })
  },

  openConfirm() {
    let that = this
    wx.showModal({
      title: '删除确认',
      content: '将要删除该条记录',
      confirmText: "删除",
      confirmColor: "#e64340",
      cancelText: "取消",
      success: function (res) {
        console.log(res);
        if (res.confirm) {
          that.deleteProgress()
        } else {
          console.log('取消')
        }
      }
    });
  },

})