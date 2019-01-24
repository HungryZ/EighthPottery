App({

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    this.globalData = {}

    this.configCloud();
    this.queryProgressDescription();
    this.configUserinfo();
  },

  configCloud() {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
        env: 'test-aa70dd',
      })
    }
  },

  queryProgressDescription() {
    // 获取progress表
    const db = wx.cloud.database();
    db.collection('progress').get({
      success: res => {
        this.globalData.progress = res.data;
        console.log('[progress] [查询记录] 成功: ', res)
      },
      fail: err => {
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },

  configUserinfo() {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },

  configOrder(e) {
    e.forEach(order => {
      // 根据progressId查询对应中文描述
      var progressId = order.progress_id;
      this.globalData.progress.forEach(progress => {
        if (progress._id == progressId) {
          order.progress = progress.description;
        }
      })
      // date转string
      if (order.createDate) {
        var date = order.createDate;
        var dateString = date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日';
        order.createDate = dateString;
      }
      if (order.doneDate) {
        var date = order.doneDate;
        var dateString = date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日';
        order.doneDate = dateString;
      }

    });
  },
})
