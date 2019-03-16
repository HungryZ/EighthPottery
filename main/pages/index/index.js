//获取应用实例
const app = getApp()

Page({

  data: {
    inputShowed: false,
    inputVal: "",
  },

  onLoad: function (options) {
  },

  searchBtnClicked(e) {
    if (this.data.inputVal == "") {
      wx.showToast({
        title: '请输入订单号',
        icon: 'none'
      })
      return;
    }
    wx.navigateTo({
      url: 'search/search?inputVal=' + this.data.inputVal,
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