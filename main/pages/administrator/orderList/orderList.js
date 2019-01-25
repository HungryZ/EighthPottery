// pages/administrator/orderList/orderList.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderArray: null,
    filterBool: false,  // 控制筛选按钮
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.refreshData();
  },

  onPullDownRefresh: function (options) {
    this.refreshData();
  },

  undoneBtnClicked() {
    if (!this.data.filterBool) return;
    this.setData({
      filterBool: false
    })
    this.refreshData();
  },

  allBtnClicked() {
    if (this.data.filterBool) return;
    this.setData({
      filterBool: true
    })
    this.refreshData();
  },

  completeBtnClicked(e) {
    var btnIndex = e.currentTarget.id;
    this.completeOrderById(this.data.orderArray[btnIndex]._id);
  },

  deleteBtnClicked(e) {
    var btnIndex = e.currentTarget.id;
    this.deleteOrderById(this.data.orderArray[btnIndex]._id);
  },
  
  cellClicked(e) {
    // 判断是否点击的是完成、删除按钮（它们文字长度2）
    if (e._relatedInfo.anchorTargetText.length == 2) return;
    var _id = this.data.orderArray[e.currentTarget.id]._id;
    wx.navigateTo({
      url: '../orderDetail/orderDetail?_id=' + _id,
    })
  },

  getAllOrder() {
    const db = wx.cloud.database()
    db.collection('order').get({
      success: res => {
        wx.hideLoading();
        // 隐藏导航栏加载框
        // wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
        app.configOrder(res.data);
        this.setData({
          orderArray: res.data
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },

  getUndoneOrder() {
    const db = wx.cloud.database()
    db.collection('order').where({
      isDone: false,
    }).get({
      success: res => {
        wx.hideLoading();
        wx.stopPullDownRefresh();

        app.configOrder(res.data);
        this.setData({
          orderArray: res.data
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },

  completeOrderById(_id) {
    wx.showLoading({
      title: '',
    })
    const db = wx.cloud.database()
    db.collection('order').doc(_id).update({
      data: {
        isDone: true,
        doneDate:  new Date()
      },
      success: res => {
        this.refreshData();
        wx.showToast({
          title: '状态已修改',
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

  deleteOrderById(_id) {
    wx.showLoading({
      title: '',
    })
    const db = wx.cloud.database()
    db.collection('order').doc(_id).remove({
      success: res => {
        this.refreshData();
        wx.showToast({
          title: '',
        })
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

  refreshData() {
    wx.showLoading({
      title: '正在加载',
    })
    if (this.data.filterBool) {
      this.getAllOrder();
    } else {
      this.getUndoneOrder();
    }
  }

})