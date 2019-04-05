// pages/administrator/dayOrder/dayOrder.js
const app = getApp()
Page({

  data: {
    dateString: '',
    orderArray: null,
  },
  
  onLoad: function (options) {
    const nowDateString = app.dateToString(new Date())
    this.setData({
      dateString: nowDateString
    })
  },

  onShow: function (options) {
    this.selectOrderByDateString(this.data.dateString)
  },

  cellClicked(e) {
    var _id = this.data.orderArray[e.currentTarget.id]._id;
    wx.navigateTo({
      url: '../orderDetail/orderDetail?_id=' + _id,
    })
  },

  bindDateChange(e) {
    this.setData({
      dateString: e.detail.value
    })
    this.selectOrderByDateString(e.detail.value)
  },

  selectOrderByDateString(dateString) {
    console.log('Select By date : ', dateString)
    wx.showLoading()
    wx.cloud.callFunction({
      name: 'getOrder',
      data: {
        parameters: {
          createDate: dateString
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
          title: '该日期无订单'
        })
        this.setData({
          orderArray: null
        })
      }
    })
  },

})