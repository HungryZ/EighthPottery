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
    this.getOrderById(this.data._id);
  },

  noteInputing(e) {
    this.data.updateParameters.note = e.detail.value;
  },

  selectProgress() {
    var that = this
    var doneDescription = app.globalData.progress[app.globalData.progress.length - 1].description;
    wx.showActionSheet({
      itemList: [doneDescription],
      success: function (res) {
        if (!res.cancel) {
          console.log(res.tapIndex)
          var newOrderModel = that.data.orderModel;
          newOrderModel.progress = doneDescription;

          that.setData({
            orderModel: newOrderModel
          })
          that.data.updateParameters.isDone = true;
          that.data.updateParameters.doneDate = new Date()
        }
      }
    });
  },

  submitBtnClicked(e) {
    this.updateOrderById(this.data._id)
  },

  getOrderById(_id) {
    wx.showLoading({
      title: '正在加载',
    })
    const db = wx.cloud.database()
    db.collection('order').where({
      _id: _id
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

  updateOrderById(_id) {
    wx.showLoading({
      title: '正在更新',
    })
    const db = wx.cloud.database()
    db.collection('order').doc(_id).update({
      data: this.data.updateParameters,
      success: res => {
        wx.showToast({
          title: '修改成功',
        })
      },
      fail: err => {
        wx.showToast({
          title: '修改失败',
          icon: 'none'
        })
        console.error('[数据库] [更新记录] 失败：', err)
      }
    })
  },

})