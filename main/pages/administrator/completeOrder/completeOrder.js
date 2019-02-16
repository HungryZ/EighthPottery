const app = getApp()

Page({

  data: {
    addInputValue: null,
    dateString: '',
    successIDArray: [],
    failureIDArray: [],
    isResultShow: false,
  },

  onLoad: function (options) {
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

  completeBtnClicked() {
    wx.showLoading({
      title: '',
    })
    // 全局替换中文逗号
    var idString = this.data.addInputValue.replace(/，/g, ",");
    var orderIdArray = idString.split(',');
    this.updateOrderByOrderIdArray(orderIdArray);
  },

  updateOrderByOrderIdArray(orderIdArray) {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'completeOrderArray',
      data: {
        orderIDArray: orderIdArray,
        dateString: this.data.dateString
      },
      success: res => {
        wx.hideLoading()
        console.log('[云函数] [completeOrder] 调用成功：', res.result)
        this.setData({
          isResultShow: true,
          successIDArray: res.result.successIDs,
          failureIDArray: res.result.failureIDs
        })
      },
      fail: err => {
        console.error('[云函数] [completeOrder] 调用失败', err)
        wx.showToast({
          icon: 'none',
          title: '请求失败'
        })
      }
    })
  },

  bindDateChange(e) {
    this.setData({
      dateString: e.detail.value
    })
  },

  dateToString(date) {
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() ;
  }

})