const defaultAvatarUrl = '../../../image/user-unlogin.png'

Page({
  data: {
    avatarUrl: defaultAvatarUrl,
    nickName: '',
  },
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail 
    this.setData({
      avatarUrl,
    })
  },
  loginBtnClicked() {
    if (this.data.avatarUrl == defaultAvatarUrl) {
      wx.showToast({
        icon: 'none',
        title: '请点击头像进行选择',
      })
      return;
    }
    if (!this.data.nickName) {
      wx.showToast({
        icon: 'none',
        title: '请输入昵称',
      })
      return;
    }
    wx.cloud.callFunction({
      name: 'saveUser',
      data: {
        avatarUrl: this.data.avatarUrl,
        nickName: this.data.nickName
      },
      success: res => {
        console.log('[云函数] [saveUser] ', res.result)
        wx.navigateBack()
      },
      fail: err => {
        console.error('[云函数] [saveUser] 调用失败', err)
      }
    })
  },

  nicknameInputting(e) {
    this.data.nickName = e.detail.value
  }, 

  bindnicknamereview(e) {
    console.log('bindnicknamereview ', e)
  },
})