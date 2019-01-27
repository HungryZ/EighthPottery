// pages/administrator/progress/progress.js
// <import src="/databaseDAO/databaseDAO.js" />
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    progressArray: null,
    nowStep: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAllProgress();
  },

  descriptInputing(e) {
    var index = e.currentTarget.id;
    this.data.progressArray[index].description = e.detail.value;
  },

  timeInputing(e) {
    var index = e.currentTarget.id;
    this.data.progressArray[index].time = e.detail.value;
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

  deleteBtnClicked(e) {
    let index = e.currentTarget.id;
    let _id = this.data.progressArray[index]._id;
    this.openConfirm(_id);
  },

  saveBtnClicked(e) {
    wx.showLoading({
      title: '正在保存',
    })
    this.data.nowStep = 0
    this.data.progressArray.forEach(progress => {
      this.updateProgress(progress)
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

  deleteProgressById(_id) {
    wx.showLoading({
      title: '',
    })
    const db = wx.cloud.database()
    db.collection('progress').doc(_id).remove({
      success: res => {
        this.getAllProgress();
        wx.hideLoading()
        this.setData({
          counterId: '',
          count: null,
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '删除失败',
        })
        console.error('[数据库] [删除记录] 失败：', err)
      }
    })
  },

  updateProgress(progress) {

    const db = wx.cloud.database()
    db.collection('progress').doc(progress._id).update({
      data: {
        description: progress.description,
        time: Number(progress.time)
      },
      success: res => {
        this.data.nowStep += 1
        if (this.data.nowStep == this.data.progressArray.length) {
          wx.showToast({
            title: '保存成功',
          })
          this.getAllProgress()
        }
      },
      fail: err => {
        wx.showToast({
          title: '保存失败',
          icon: 'none'
        })
        console.error('[数据库] [更新记录] 失败：', err)
      }
    })
  },

  openConfirm(_id) {
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
          that.deleteProgressById(_id)
        } else {
          console.log('取消')
        }
      }
    });
  },

})