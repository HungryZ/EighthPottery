// pages/administrator/createOrder/createOrder.js
const app = getApp()

Page({

  data: {
    addInputValue: null,
    targetNumber: 0,
    nowNumber: 0,
  },

  onLoad: function (options) {

  },

  addInputing(e) {
    this.setData({
      addInputValue: e.detail.value
    })
  },

  addBtnClicked(e) {
    wx.showLoading({
      title: '创建中',
    })
    var firstProgressId = app.globalData.progress[0]._id;
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
        progress_id: app.globalData.progress[0]._id,
        note: '自动生成订单',
        createDate: new Date()
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

})