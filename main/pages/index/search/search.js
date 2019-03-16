//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderModel: null,
    inputShowed: true,
    inputVal: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      inputVal: options.inputVal
    })
    this.searchBtnClicked()
  },

  searchBtnClicked(e) {
    if (this.data.inputVal == "") return;
    wx.showLoading({
      title: '正在查询',
    })

    const db = wx.cloud.database()
    db.collection('order').where({
      // 无条件时where可以省去
      // order_id: Number(this.data.inputVal),
      order_id: this.data.inputVal,
    }).get({
      success: res => {
        app.configOrder(res.data);
        this.setData({
          orderModel: res.data[0] ? res.data[0] : null
        })
        if (!this.data.orderModel) {
          wx.showToast({
            icon: 'none',
            title: '无此订单'
          })
        } else {
          wx.hideLoading();
        }
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },

  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },

})