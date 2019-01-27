// pages/administrator/orderDetail/orderDetail.js
const app = getApp()

Page({

  data: {
    _id: null,
    orderModel: null,
    updateParameters: {}
  },

  onLoad: function (options) {
    this.data._id = options._id;
    this.data.updateParameters._id = options._id
    this.getOrder();
  },

  noteInputing(e) {
    this.data.updateParameters.note = e.detail.value;
  },

  selectProgress() {
    var that = this
    var descriptions = [app.globalData.progress[0].description, '重置']
    wx.showActionSheet({
      itemList: descriptions,
      success: function (res) {
        if (!res.cancel) {
          console.log(res.tapIndex)
          var newOrderModel = that.data.orderModel;
          newOrderModel.progress = descriptions[res.tapIndex];
          that.setData({
            orderModel: newOrderModel
          })
          if (res.tapIndex == 0) {
            that.data.updateParameters.isDone = true;
            that.data.updateParameters.doneDate = that.dateToString(new Date())
          } else {
            that.data.updateParameters.isDone = false;
          }
        }
      }
    });
  },

  submitBtnClicked(e) {
    this.updateOrder()
  },

  deleteBtnClicked() {
    this.openConfirm();
  },

  getOrder() {
    wx.showLoading({
      title: '正在加载',
    })
    const db = wx.cloud.database()
    db.collection('order').where({
      _id: this.data._id
    }).get({
      success: res => {
        wx.hideLoading();
        app.configOrder(res.data);
        this.setData({
          orderModel: res.data[0]
        })
        console.log('[数据库] [查询记录] 成功: ', res)
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

  updateOrder() {
    wx.showLoading()
    wx.cloud.callFunction({
      name: 'updateOrder',
      data: {
        orderModel: this.data.updateParameters
      },
      success: res => {
        wx.hideLoading()
        console.log('[云函数] [updateOrder] 调用成功：', res.result)
        this.getOrder()
      },
      fail: err => {
        console.error('[云函数] [updateOrder] 调用失败', err)
        wx.showToast({
          icon: 'none',
          title: '请求失败'
        })
      }
    })
  },

  deleteOrder() {
    wx.showLoading()
    wx.cloud.callFunction({
      name: 'deleteOrder',
      data: {
        _id: this.data._id
      },
      success: res => {
        console.log('[云函数] [deleteOrder] 调用成功：', res.result)
        wx.navigateBack()
        wx.showToast({
          title: '刪除成功'
        })
      },
      fail: err => {
        console.error('[云函数] [deleteOrder] 调用失败', err)
        wx.showToast({
          icon: 'none',
          title: '请求失败'
        })
      }
    })
  },

  openConfirm: function () {
    let that = this
    wx.showModal({
      title: '删除确认',
      content: '将要删除该条记录',
      confirmText: "删除",
      confirmColor: "#e64340",
      cancelText: "取消",
      success: function (res) {
        console.log(res);
        if (res.confirm) {
          that.deleteOrder()
        } else {
          console.log('取消')
        }
      }
    });
  },

  dateToString(date) {
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
  },

  bindDateChange(e) {
    let newModel = this.data.orderModel
    newModel.createDate = e.detail.value
    this.setData({
      orderModel: newModel
    })
    this.data.updateParameters.createDate = e.detail.value
  },

})