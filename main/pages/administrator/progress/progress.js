// pages/administrator/progress/progress.js
// <import src="/databaseDAO/databaseDAO.js" />
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    progressArray: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  onShow: function (options) {
    this.getAllProgress();
  },

  addBtnClicked(e) {
    wx.showLoading({
      title: '正在创建',
    })
    const db = wx.cloud.database()
    db.collection('progress').add({
      data: {
        description: '新增状态',
        index: this.data.progressArray.length,
      },
      success: res => {
        this.getAllProgress();
        wx.showToast({
          title: '新增成功',
        })
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  },

  getAllProgress(e) {
    wx.showLoading({
      title: '',
    })
    const db = wx.cloud.database();
    db.collection('progress').get({
      success: res => {
        wx.hideLoading();
        this.setData({
          progressArray: res.data
        })
        app.globalData.progress = res.data;
      }
    })
  },

})