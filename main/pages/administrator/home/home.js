const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderArray: null,
    inputVal: "",
    inputShowed: false,
    unloginUrl: '../../../image/user-unlogin.png',

    userInfo: {},
    hasUserInfo: false,
    isAdministrator: false,
    list: [{
        path: 'createOrder',
        title: '批量生成',
      },
      {
        path: 'completeOrder',
        title: '批量完成',
      },
      // {
      //   path: 'orderList',
      //   title: '订单列表',
      // },
      {
        path: 'dayOrder',
        title: '每日订单',
      },
      {
        path: 'monthOrder',
        title: '每月订单'
      },
      {
        path: 'warningOrder',
        title: '预警订单'
      },
      {
        path: 'progress',
        title: '进度管理',
      },
      {
        path: 'limit',
        title: '权限管理',
      },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  onShow() {
    wx.cloud.callFunction({
      name: 'getUser',
      success: res => {
        console.log('[云函数] [getUser] ', res.result)
        this.setData({
          userInfo: res.result.user,
          isAdministrator: res.result.isAdministrator,
          hasUserInfo: res.result.user ? true : false
        })
      },
      fail: err => {
        console.error('[云函数] [getUser] 调用失败', err)
      }
    })
  },

  bindViewTap() {
  },

  searchInputing(e) {
    this.setData({
      inputVal: e.detail.value
    })
  },

  searchBtnClicked(e) {
    if (this.data.inputVal == "") return;
    wx.showLoading({
      title: '正在查询',
    })

    const db = wx.cloud.database()
    db.collection('order').where({
      order_id: this.data.inputVal,
    }).get({
      success: res => {
        if (!res.data[0]) {
          wx.showToast({
            icon: 'none',
            title: '无此订单'
          })
        } else {
          wx.hideLoading();
          wx.navigateTo({
            url: '../orderDetail/orderDetail?_id=' + res.data[0]._id,
          })
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