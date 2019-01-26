//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputText: '',
    orderModel: null,
    inputShowed: false,
    inputVal: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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

  inputing(e) {
    this.setData({
      inputText: e.detail.value
    })
  },

  searchBtnClicked(e) {
    if (this.data.inputText == "") return;
    wx.showLoading({
      title: '正在查询',
    })

    const db = wx.cloud.database()
    db.collection('order').where({
      // 无条件时where可以省去
      // order_id: Number(this.data.inputText),
      order_id: this.data.inputText,
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

  adminBtnClicked(e) {
    wx.navigateTo({
      url: '../administrator/home/home',
    })
  },

  saveUser() {
    // const db = wx.cloud.database()
    // console.log('111111111111111')
    // var count = db.collection('user').where({
    //   _openid: this.data.openid
    // }).count();
    // console.log('111111111111111', count)
    this.addNewUser();
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

  bindDateChange(e) {
    console.log(e)
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

  // getPhoneNumber: function (e) {
  //   console.log(e.detail.errMsg)
  //   console.log(e.detail.iv)
  //   console.log(e.detail.encryptedData)
  // },

})