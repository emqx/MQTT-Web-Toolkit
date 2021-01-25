<template>
  <div class="about-view rightbar">
    <h1 class="titlebar">{{ $t('about.about') }}</h1>
    <div class="about-content">
      <img class="logo" :src="logo" alt="emqx" />

      <h1 class="title">MQTT WebSocket Toolkit</h1>

      <div class="emqx-desc">
        <i18n path="about.mqttToolkit.online" tag="p">
          <a :href="$t('about.mqttToolkit.emqLink')" target="_blank" rel="noopener noreferrer">EMQ</a>
        </i18n>
      </div>

      <div class="emqx-desc">
        <i18n path="about.emqxLocal.local" tag="span">
          <a href="https://github.com/emqx/emqx" target="_blank" rel="noopener noreferrer">
            {{ $t('about.emqxLocal.emqx') }}
          </a>
        </i18n>
        <a v-if="getterLang !== 'zh'" href="https://github.com/emqx/emqx" target="_blank" rel="noopener noreferrer"
          >EMQ X</a
        >
        {{ $t('about.emqxDesc') }}
      </div>

      <div class="emqx-desc">
        {{ $t('about.emqxDocker') }}
        <div class="docker-code">
          docker run -d --name emqx -p 1883:1883 -p 8083:8083 -p 8883:8883 -p 8084:8084 -p 18083:18083 emqx/emqx
        </div>
      </div>

      <el-button
        class="about-website github-btn"
        type="primary"
        @click="goToLink('https://github.com/emqx/MQTT-Web-Toolkit')"
      >
        <i class="iconfont icon-github"></i> {{ $t('about.followGithub') }}
      </el-button>
    </div>

    <div class="about-footer">
      <img class="emqx-logo" src="../../assets/images/emqx-logo.png" alt="emqx" width="35" />
      <span class="copyright"
        >Copyright &copy; 2020
        <a :href="emqxWebsite" target="_blank" rel="noopener noreferrer">EMQ</a>
      </span>
      <div class="follow-items">
        <a target="_blank" rel="noopener noreferrer" class="follow-link" href="https://twitter.com/emqtt">
          <i class="iconfont icon-ttww"></i>
        </a>
        <a target="_blank" rel="noopener noreferrer" class="follow-link" href="https://slack-invite.emqx.io/">
          <i class="iconfont icon-slack"></i>
        </a>
        <a target="_blank" rel="noopener noreferrer" class="follow-link" href="https://www.reddit.com/r/emqx/">
          <i class="iconfont icon-reddit"></i>
        </a>
        <template v-if="getterLang === 'zh'">
          <a target="_blank" rel="noopener noreferrer" class="follow-link" href="https://weibo.com/emqtt">
            <i class="iconfont icon-weibo"></i>
          </a>
          <el-popover placement="top-start" width="30" trigger="click">
            <img class="emqx-qq" src="../../assets/images/qq-qr_code.png" alt="qq" />
            <span class="follow-link" slot="reference">
              <i class="iconfont icon-qq"></i>
            </span>
          </el-popover>
          <el-popover placement="top-start" width="30" style="margin-left: 16px" trigger="click">
            <img class="emqx-qq" src="../../assets/images/wx_qr_code.png" alt="qq" />
            <span class="follow-link" slot="reference">
              <i class="iconfont icon-we-chat"></i>
            </span>
          </el-popover>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
// import { ipcRenderer } from 'electron'

@Component
export default class About extends Vue {
  @Getter('currentTheme') private getterTheme!: Theme
  @Getter('currentLang') private getterLang!: Language

  get logo(): string {
    if (this.getterTheme === 'light') {
      return require('../../assets/images/logo.svg')
    }
    return require('../../assets/images/logo.svg')
  }

  get emqxWebsite(): string {
    return this.getterLang === 'zh' ? 'https://www.emqx.cn/' : 'https://www.emqx.io/'
  }

  private checkUpdate(): void {
    // ipcRenderer.send('checkUpdate')
  }

  private goToLink(url: string) {
    const windowUrl = window.open(url)
    if (windowUrl) {
      windowUrl.opener = null
    }
  }
}
</script>

<style lang="scss" scope>
.about-view {
  position: relative;
  padding: 0 16px;

  & > .about-content {
    height: 78%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .logo {
    margin-bottom: 20px;
    width: 100px;
    height: 100px;
  }

  .title {
    margin-bottom: 48px;
  }

  .version {
    font-size: 1.25rem;
    margin-bottom: 15px;
  }

  .about-help {
    .web-link {
      margin-right: 25px;
      &:last-child {
        margin-right: 0px;
      }
    }
    margin-bottom: 35px;
  }

  .emqx-desc {
    max-width: 836px;
    width: 100%;
    line-height: 1.6;
    margin-bottom: 12px;
  }
  .docker-code {
    background: var(--color-bg-code);
    padding: 10px;
    border-radius: 4px;
    user-select: all;
    margin-top: 8px;
  }

  .github-btn {
    font-size: 1rem;
    margin-top: 35px;
  }

  .about-website {
    margin-bottom: 35px;
    .iconfont {
      font-size: 1.25rem;
      position: relative;
      top: 2px;
      margin-right: 3px;
    }
  }

  .about-footer {
    margin-top: 40px;
    position: absolute;
    bottom: 20px;
    left: 16px;
    right: 16px;
    .emqx-logo {
      position: absolute;
      top: 5px;
    }
    .copyright {
      position: absolute;
      left: 45px;
      top: 10px;
    }
    .follow-items {
      float: right;
      .follow-link {
        cursor: pointer;
        display: inline-block;
        width: 50px;
        height: 40px;
        text-align: center;
        line-height: 42px;
        background: var(--color-bg-follows);
        color: var(--color-text-default);
        margin-right: 16px;
        border-radius: 4px;
        &:last-child {
          margin-right: 0px;
        }
        .iconfont {
          font-size: 20px;
        }
      }
    }
  }
}
</style>
