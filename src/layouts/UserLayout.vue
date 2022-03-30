<template>

  <div id="userLayout" :class="['user-layout-wrapper']">
    <div class="container">
      <div class="user-layout-content">
        <div class="top">
          <div class="header">
            <a href="/">
              <span class="title">Student Score Management</span>
            </a>
          </div>
          <div class="desc">
            林佳锐的学生成绩管理系统
          </div>
        </div>
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'UserLayout',
  components: {
  },
  mounted () {
    document.body.classList.add('userLayout')
  },
  beforeDestroy () {
    document.body.classList.remove('userLayout')
  }
}
</script>

<style lang="less" scoped>
#userLayout.user-layout-wrapper {
  height: 100%;

  .container {
    width: 100%;
    min-height: 100%;
    background: #f0f2f5 url(~@/assets/background.svg) no-repeat 80%;
    background-size: 100%;
    //padding: 100px 0 84px;
    position: relative;


    .user-layout-content {
      padding: 32px 0 24%;

      .top {
        text-align: center;

        .header {
          height: 44px;
          line-height: 44px;

          .badge {
            position: absolute;
            display: inline-block;
            line-height: 1;
            vertical-align: middle;
            margin-left: -12px;
            margin-top: -10px;
            opacity: 0.8;
          }

          .logo {
            height: 44px;
            vertical-align: top;
            margin-right: 16px;
            border-style: none;
          }

          .title {
            font-size: 33px;
            color: rgba(0, 0, 0, .85);
            font-family: Avenir, 'Helvetica Neue', Arial, Helvetica, sans-serif;
            font-weight: 600;
            position: relative;
            top: 2px;
          }
        }
        .desc {
          font-size: 14px;
          color: rgba(0, 0, 0, 0.45);
          margin-top: 12px;
          margin-bottom: 40px;
        }
      }

      .main {
        padding: 24px 0;
        min-width: 260px;
        width: 368px;
        margin: 0 auto;
      }


    }

    a {
      text-decoration: none;
    }

  }
}
</style>
