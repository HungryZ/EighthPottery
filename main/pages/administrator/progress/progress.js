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
    this.getAllProgress();
  },

  updateBtnClicked(e) {
    var index = e.currentTarget.id;
    this.updateProgressByIndex(index);
  }, 

  addBtnClicked(e) {
    wx.showLoading({
      title: '正在创建',
    })
    const db = wx.cloud.database()
    db.collection('progress').add({
      data: {
        description: '新增状态',
        index: this.data.progressArray.length
      },
      success: res => {
        this.updateGlobalProgressData();
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
      title: '正在加载',
    })
    const db = wx.cloud.database();
    db.collection('progress').get({
      success: res => {
        wx.hideLoading();
        this.setData({
          progressArray: res.data
        })
      }
    })
  },

  updateProgressByIndex(e) {
    wx.showLoading({
      title: '正在加载',
    })
    var progressId = this.data.progressArray[e]._id;
    var newDescription = this.data.progressArray[e].description;

    const db = wx.cloud.database()
    db.collection('progress').doc(progressId).update({
      data: {
        description: newDescription
      },
      success: res => {
        this.updateGlobalProgressData();
        wx.showToast({
          title: '修改成功',
        })
      },
      fail: err => {
        wx.showToast({
          title: '修改失败',
          icon: 'none'
        })
        console.error('[数据库] [更新记录] 失败：', err)
      }
    })
  },

  inputing(e) {
    var index = e.currentTarget.id;
    this.data.progressArray[index].description = e.detail.value;
  },

  updateGlobalProgressData(e) {
    // 获取progress表
    const db = wx.cloud.database();
    db.collection('progress').get({
      success: res => {
        app.globalData.progress = res.data;
        console.log('[progress] [查询记录] 成功: ', res)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  }

})