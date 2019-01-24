const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderArray: null,
    searchInputValue: null,
    inputVal: "",
    inputShowed: false,
    list: [
      {
        path: 'createOrder',
        title: '批量生成订单',
      },
      {
        path: 'orderList',
        title: '订单列表',
      },
      {
        path: 'progress',
        title: '状态管理',
      },
      {
        path: 'limit',
        title: '权限管理',
      },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
  },

  searchInputing(e) {
    this.setData({
      inputText: e.detail.value
    })
  },

  searchBtnClicked(e) {
    wx.showLoading({
      title: '正在查询',
    })

    const db = wx.cloud.database()
    db.collection('order').where({
      order_id: this.data.inputText,
    }).get({
      success: res => {
        if (!res.data[0]) {
          wx.showToast({
            icon: 'none',
            title: '无此订单'
          })
        } else {
          wx.hideLoading();
          wx.navigateTo({
            url: '../orderDetail/orderDetail?_id=' + res.data[0]._id,
          })
        }
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
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },

})