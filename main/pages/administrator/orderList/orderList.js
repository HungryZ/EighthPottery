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
    tabs: ["未完成订单", "全部订单"],
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

  onPullDownRefresh: function (options) {
    this.refreshData();
  },

  completeBtnClicked(e) {
    var btnIndex = e.currentTarget.id;
    this.completeOrderById(this.data.orderArray[btnIndex]._id);
  },
  
  cellClicked(e) {
    // 判断是否点击的是完成、删除按钮（它们文字长度2）
    // if (e._relatedInfo.anchorTargetText.length == 2) return;
    var _id = this.data.orderArray[e.currentTarget.id]._id;
    wx.navigateTo({
      url: '../orderDetail/orderDetail?_id=' + _id,
    })
  },

  getAllOrder() {
    const db = wx.cloud.database()
    db.collection('order').get({
      success: res => {
        wx.hideLoading();
        // 隐藏导航栏加载框
        // wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
        app.configOrder(res.data);
        this.setData({
          orderArray: res.data
        })
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

  getUndoneOrder() {
    const db = wx.cloud.database()
    db.collection('order').where({
      isDone: false,
    }).get({
      success: res => {
        wx.hideLoading();
        wx.stopPullDownRefresh();

        app.configOrder(res.data);
        this.setData({
          orderArray: res.data
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

  completeOrderById(_id) {
    wx.showLoading({
      title: '',
    })
    const db = wx.cloud.database()
    db.collection('order').doc(_id).update({
      data: {
        isDone: true,
        doneDate:  new Date()
      },
      success: res => {
        this.refreshData();
        wx.showToast({
          title: '状态已修改',
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

  refreshData() {
    wx.showLoading({
      title: '正在加载',
    })
    if (this.data.activeIndex == 0) {
      this.getUndoneOrder();
    } else {
      this.getAllOrder();
    }
  }

})