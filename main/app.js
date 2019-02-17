App({
  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function() {
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
        // env: 'test-aa70dd', 
        env: 'release-c4723b', 
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
      // 小程序端与服务器端返回的Date数据类型不一样
      if (!(order.createDate instanceof Date)) {
        order.createDate = new Date(order.createDate)
      }
      
      const progressArray = this.globalData.progress;
      if (order.isDone) {
        // 已完成
        order.progress = progressArray[0].description;
        // 小程序端与服务器端返回的Date数据类型不一样
        if (!(order.doneDate instanceof Date)) {
          order.doneDate = new Date(order.doneDate)
        }
      } else {
        let days = (new Date() - order.createDate) / 1000 / 60 / 60 / 24
        let tdays = 0 // 所需时间
        var isConfig = false
        // 第一个为完成状态，跳过。（可以，但没必要）
        for (var i = 1; i < progressArray.length; i++) {
          let progress = progressArray[i]
          tdays += progress.time
          if (tdays > days) {
            order.progress = progress.description;
            if (progress.note) {
              order.progressNote = progress.note
            }
            isConfig = true
            break;
          }
        }
        if (!isConfig) {
          const lastProgress = progressArray[progressArray.length - 1]
          order.progress = lastProgress.description
          if (lastProgress.note) {
            order.progressNote = lastProgress.note
          }
        }

      }

      // date转string
      var date = order.createDate;
      var dateString = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
      order.createDate = dateString;

      if (order.doneDate) {
        var date = order.doneDate;
        var dateString = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
        order.doneDate = dateString;
      }


    });
  },
})