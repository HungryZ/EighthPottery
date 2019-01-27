// pages/administrator/createOrder/createOrder.js
const app = getApp()

Page({

  data: {
    addInputValue: null,
    targetNumber: 0,
    nowNumber: 0,
    createDate: null,
    dateString: ''
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
    wx.showLoading({
      title: '创建中',
    })
    // 全局替换中文逗号
    var idString = this.data.addInputValue.replace(/，/g, ",");
    var orderIdArray = idString.split(',');
    this.setData({
      targetNumber: orderIdArray.length
    })
    orderIdArray.forEach(orderId => {
      this.addOrderByOrderId(orderId);
    })
  },

  addOrderByOrderId(e) {
    const db = wx.cloud.database()
    db.collection('order').add({
      data: {
        order_id: e,
        // note: '自动生成订单',
        createDate: this.data.createDate,
        isDone: false
      },
      success: res => {
        this.data.nowNumber += 1;
        if (this.data.nowNumber == this.data.targetNumber) {
          wx.showToast({
            title: '添加订单成功',
          })
        }
      },
      fail: err => {
        var toastTitle = err.errCode == '-502001' ? '订单号重复' : '新增记录失败';
        wx.showToast({
          icon: 'none',
          title: toastTitle
        })
        console.error('[数据库] [新增记录] 失败：', err)
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