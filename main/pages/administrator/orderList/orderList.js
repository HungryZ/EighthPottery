// pages/administrator/orderList/orderList.js
const app = getApp()
var sliderWidth = 100; // 需要设置slider的宽度，用于计算中间位置

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderArray: null,
    filterBool: false,  // 控制筛选按钮
    tabs: ["未完成订单", "已完成订单", "全部订单"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },

  onShow: function (options) {
    this.refreshData();
  }, 
  
  tabClick: function (e) {
    if (this.data.activeIndex == e.currentTarget.id) return;
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
    this.refreshData();
  },

  // onPullDownRefresh: function (options) {
  //   this.refreshData();
  // },

  completeBtnClicked(e) {
    var btnIndex = e.currentTarget.id;
    this.completeOrderById(this.data.orderArray[btnIndex]._id);
  },
  
  cellClicked(e) {
    var _id = this.data.orderArray[e.currentTarget.id]._id;
    wx.navigateTo({
      url: '../orderDetail/orderDetail?_id=' + _id,
    })
  },
  
  refreshData() {
    let parameters = {}
    if (this.data.activeIndex == 0) {
      parameters.isDone = false
    } else if (this.data.activeIndex == 1) {
      parameters.isDone = true
    }
    this.getOrder(parameters)
  },

  getOrder(parameters) {
    wx.showLoading()
    wx.cloud.callFunction({
      name: 'getOrder',
      data: {
        parameters: parameters
      },
      success: res => {
        wx.hideLoading()
        console.log('[云函数] [getOrder] 调用成功：', res.result)
        app.configOrder(res.result.data);
        this.setData({
          orderArray: res.result.data
        })
      },
      fail: err => {
        console.error('[云函数] [getOrder] 调用失败', err)
        wx.showToast({
          icon: 'none',
          title: '请求失败'
        })
      }
    })
  },

  completeOrderById(_id) {
    wx.showLoading()
    wx.cloud.callFunction({
      name: 'updateOrder',
      data: {
        orderModel: {
          _id: _id,
          isDone: true,
          doneDate: app.dateToString(new Date())
        }
      },
      success: res => {
        wx.hideLoading()
        console.log('[云函数] [updateOrder] 调用成功：', res.result)
        this.refreshData()
      },
      fail: err => {
        console.error('[云函数] [completeOrder] 调用失败', err)
        wx.showToast({
          icon: 'none',
          title: '请求失败'
        })
      }
    })
  },

})