//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      'cloud://test-aa70dd.7465-test-aa70dd/Banner/timg-4.jpeg',
      'cloud://test-aa70dd.7465-test-aa70dd/Banner/timg-5.jpeg',
      'cloud://test-aa70dd.7465-test-aa70dd/Banner/timg-6.jpeg'
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  // getPhoneNumber: function (e) {
  //   console.log(e.detail.errMsg)
  //   console.log(e.detail.iv)
  //   console.log(e.detail.encryptedData)
  // },

})