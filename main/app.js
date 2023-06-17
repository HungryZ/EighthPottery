App({
  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function() {
    this.globalData = {}

    this.configCloud();
    this.queryProgressDescription();
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

  configOrder(e) {
    // 单个order转为数组
    if (!Array.isArray(e)) {
      let oneOrder = e
      e = [oneOrder]
    }

    e.forEach(order => {
      // 小程序端与服务器端返回的Date数据类型不一样
      if (!(order.createDate instanceof Date)) {
        order.createDate = new Date(order.createDate)
      }
      
      const progressArray = this.globalData.progress;

      if (order.isTook) {
        // 已领取
        order.progress = '已领取';
        // 小程序端与服务器端返回的Date数据类型不一样
        if (!(order.tookDate instanceof Date)) {
          order.tookDate = new Date(order.tookDate)
        }
      }

      if (order.isDone) {
        // 已完成
        order.progress = progressArray[0].description; 
        if (progressArray[0].note) {
          order.progressNote = progressArray[0].note
        }
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

      order.createDate = this.dateToString(order.createDate);

      if (order.doneDate) {
        order.doneDate = this.dateToString(order.doneDate);
      }

      if (order.tookDate) {
        order.tookDate = this.dateToString(order.tookDate);
      }

    });
  },

  dateToString(date) {
    // 补零
    var month = (Array(2).join('0') + (date.getMonth() + 1)).slice(-2)
    var day = (Array(2).join('0') + date.getDate()).slice(-2)

    return date.getFullYear() + '-' + month + '-' + day;
  },
})