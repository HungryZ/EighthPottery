//获取应用实例
const app = getApp()

Page({

  data: {
    inputShowed: false,
    inputVal: "",
    userArray: [],
  },

  onLoad: function (options) {
  },

  searchBtnClicked(e) {
    if (this.data.inputText == "") return;
    wx.showLoading()

    const db = wx.cloud.database()
    db.collection('user').where({
      // 正则表达式
      nickName: db.RegExp({
        //从搜索栏中获取的value作为规则进行匹配。
        regexp: this.data.inputVal,
        //大小写不区分
        options: 'i',
      })
    }).get({
      success: res => {
        wx.hideLoading();
        this.setData({
          userArray: res.data
        })
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

  addBtnClicked(e) {
    const selectedOpenID = this.data.userArray[e.currentTarget.id]._openid
    this.addAdministrator(selectedOpenID)
  },

  addAdministrator(openID) {
    wx.showLoading()
    const db = wx.cloud.database()
    db.collection('administrator').add({
      data: {
        admin_openid: openID
      },
      success: res => {
        wx.showToast({
          title: '添加成功'
        })
      },
      fail: err => {
        var toastTitle = err.errCode == '-502001' ? '该用户已是管理员' : '操作失败';
        wx.showToast({
          icon: 'none',
          title: toastTitle
        })
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