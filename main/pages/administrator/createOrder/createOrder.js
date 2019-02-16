// pages/administrator/createOrder/createOrder.js
const app = getApp()

Page({

  data: {
    addInputValue: null,
    createDate: null,
    dateString: '',
    successIDArray: [],
    failureIDArray: [],
    isResultShow: false,
  },

  onLoad: function (options) {
    // 将时间默认调整为 08:00,因为不知道云函数Date类型如何传递
    this.data.createDate = new Date(this.dateToString(new Date()) + ' 08:00')
    let dateString = this.dateToString(new Date())
    this.setData({
      dateString: dateString
    })
  },

  idInputing(e) {
    this.setData({
      addInputValue: e.detail.value
    })
  },

  addBtnClicked(e) {
    // 全局替换中文逗号
    var idString = this.data.addInputValue.replace(/，/g, ",");
    var orderIdArray = idString.split(',');
    this.createOrderByOrderIdArray(orderIdArray)
  },

  createOrderByOrderIdArray(orderIdArray) {
    wx.showLoading()
    wx.cloud.callFunction({
      name: 'insertOrderArray',
      data: {
        orderIDArray: orderIdArray,
        dateString: this.data.dateString
      },
      success: res => {
        wx.hideLoading()
        console.log('[云函数] [insertOrderArray] 调用成功：', res.result)
        this.setData({
          isResultShow: true,
          successIDArray: res.result.successIDs,
          failureIDArray: res.result.failureIDs
        })
      },
      fail: err => {
        console.error('[云函数] [insertOrderArray] 调用失败', err)
        wx.showToast({
          icon: 'none',
          title: '请求失败'
        })
      }
    })
  },

  bindDateChange(e) {
    this.setData({
      createDate: new Date(e.detail.value)
    })
    let dateString = this.dateToString(this.data.createDate)
    this.setData({
      dateString: dateString
    })
  },

  dateToString(date) {
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
  }

})