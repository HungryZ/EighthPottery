
const app = getApp()
Page({

  data: {
    inputVal: "23",
    orderArray: null,
    isFocus: false,
  },

  onLoad: function (options) {
  },

  onShow: function (options) {
    this.selectOrderByDateString(this.data.dateString)
  },

  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },

  titleClicked() {
    this.setData({
      isFocus: !this.data.isFocus
    })
  },

  cellClicked(e) {
    var _id = this.data.orderArray[e.currentTarget.id]._id;
    wx.navigateTo({
      url: '../orderDetail/orderDetail?_id=' + _id,
    })
  },

  selectOrderByDateString(dateString) {
    wx.showLoading()
    wx.cloud.callFunction({
      name: 'getOrder',
      data: {
        parameters: {
          spentDays: this.data.inputVal,
          isDone: false
        }
      },
      success: res => {
        wx.hideLoading()
        console.log('[云函数] [getOrder] 调用成功：', res.result)
        app.configOrder(res.result.data);
        this.setData({
          orderArray: res.result.data
        })
      },
      fail: err => {
        console.error('[云函数] [getOrder] 调用失败', err)
        wx.showToast({
          icon: 'none',
          title: '无匹配订单'
        })
        this.setData({
          orderArray: null
        })
      }
    })
  },

})