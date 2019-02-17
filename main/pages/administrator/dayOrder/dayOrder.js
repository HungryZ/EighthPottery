// pages/administrator/dayOrder/dayOrder.js
const app = getApp()
Page({

  data: {
    dateString: '',
    orderArray: null,
  },
  
  onLoad: function (options) {
    const nowDateString = this.dateToString(new Date())
    this.setData({
      dateString: nowDateString
    })
    this.selectOrderByDateString(nowDateString)
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

  completeBtnClicked(e) {
    var btnIndex = e.currentTarget.id;
    this.completeOrderById(this.data.orderArray[btnIndex]._id);
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
          title: '请求失败'
        })
      }
    })
  },

  completeOrderById(_id) {
    wx.showLoading()
    wx.cloud.callFunction({
      name: 'updateOrder',
      data: {
        orderModel: {
          _id: _id,
          isDone: true,
          doneDate: this.dateToString(new Date())
        }
      },
      success: res => {
        wx.hideLoading()
        console.log('[云函数] [updateOrder] 调用成功：', res.result)
        this.selectOrderByDateString(this.data.dateString)
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

  dateToString(date) {
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
  }

})