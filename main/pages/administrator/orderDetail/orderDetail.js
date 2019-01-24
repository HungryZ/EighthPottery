// pages/administrator/orderDetail/orderDetail.js
const app = getApp()

Page({

  data: {
    _id: null,
    orderModel: null,
    orderModel_progress: null
  },

  onLoad: function (options) {
    this.data._id = options._id;
    this.getOrderById(this.data._id);
  },

  noteInputing(e) {
    this.data.orderModel.note = e.detail.value;
  },

  selectProgress() {
    var that = this
    var progressArray = app.globalData.progress;
    var descriptionArray = [];
    var _idArray = [];
    progressArray.forEach(progress => {
      _idArray.push(progress._id);
      descriptionArray.push(progress.description);
    });
    wx.showActionSheet({
      itemList: descriptionArray,
      success: function (res) {
        if (!res.cancel) {
          console.log(res.tapIndex)
          var newOrderModel = that.data.orderModel;
          newOrderModel.progress_id = _idArray[res.tapIndex];
          newOrderModel.progress = descriptionArray[res.tapIndex];
          that.setData({
            orderModel: newOrderModel
          })
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
      data: {
        progress_id: this.data.orderModel.progress_id,
        note: this.data.orderModel.note
      },
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