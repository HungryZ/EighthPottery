const app = getApp()

Page({

  data: {
    addInputValue: null,
    successIDArray: [],
    failureIDArray: [],
    dateString: ''
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
    // const db = wx.cloud.database()
    // db.collection('order').where({
    //   order_id: order_id
    // }).update({
    //   data: {
    //     isDone: true,
    //     doneDate: this.data.doneDate
    //   },
    //   success: res => {
    //     wx.showToast({
    //       title: '修改成功',
    //     })
    //     this.data.successIDArray.push(order_id)
    //     console.log(this.data.successIDArray)
    //   },
    //   fail: err => {
    //     wx.showToast({
    //       title: '修改失败',
    //       icon: 'none'
    //     })
    //     console.error('[数据库] [更新记录] 失败：', err)
    //     this.data.failureIDArray.push(order_id)
    //   }
    // })
    // 调用云函数
    wx.cloud.callFunction({
      name: 'completeOrderArray',
      data: {
        orderIDArray: orderIdArray,
        dateString: this.data.dateString
      },
      success: res => {
        wx.hideLoading()
        console.log('[云函数] [completeOrder] 调用成功：', res)
      },
      fail: err => {
        wx.hideLoading()
        console.error('[云函数] [completeOrder] 调用失败', err)
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