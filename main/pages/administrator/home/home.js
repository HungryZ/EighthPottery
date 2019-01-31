const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderArray: null,
    searchInputValue: null,
    inputVal: "",
    inputShowed: false, 
    unloginUrl: '../../../image/user-unlogin.png',

    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isAdministrator: false,
    list: [
      {
        path: 'createOrder',
        title: '批量生成',
      }, 
      {
        path: 'completeOrder',
        title: '批量完成',
      },
      {
        path: 'orderList',
        title: '订单列表',
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
    this.configUserinfo();
  },

  configUserinfo() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      this.onGetOpenid();
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        app.globalData.userInfo = res.userInfo
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        this.onGetOpenid();
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
          this.onGetOpenid();
        }
      })
    }
  },

  getUserInfo: function (e) {
    console.log(e)
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
      this.onGetOpenid();
      this.saveUser();
    }
  },

  saveUser() {
    // if
    this.addNewUser();
    // else
    // update
  },

  addNewUser() {
    const db = wx.cloud.database()
    db.collection('user').add({
      data: {
        avatarUrl: this.data.userInfo.avatarUrl,
        nickName: this.data.userInfo.nickName,
        createDate: new Date()
      },
      success: res => {
        console.log('[数据库] [添加新用户] 成功')
      },
      fail: err => {
        console.error('[数据库] [添加新用户] 失败')
      }
    })
  },

  updateUser() {

  },

  onGetOpenid: function () {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        this.setData({
          openid: res.result.openid
        })
        this.checkOpenid();
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },

  checkOpenid() {
    const db = wx.cloud.database()
    db.collection('administrator').where({
      admin_openid: this.data.openid
    }).get({
      success: res => {
        if (res.data[0]) {
          this.setData({
            isAdministrator: true
          })
        }
      }
    })
  },

  searchInputing(e) {
    this.setData({
      inputText: e.detail.value
    })
  },

  searchBtnClicked(e) {
    wx.showLoading({
      title: '正在查询',
    })

    const db = wx.cloud.database()
    db.collection('order').where({
      order_id: this.data.inputText,
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