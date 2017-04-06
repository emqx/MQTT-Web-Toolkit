<template>
  <div class="home-view">
    <v-app top-toolbar footer>
      <v-toolbar>
        <v-toolbar-title>MQTT</v-toolbar-title>
        <p v-if="client.connected" class="linkTip">Connected to&nbsp;{{host}}</p>
        <v-btn class="pink darken-1" dark v-if="client.connected" @click.native="mqttDisconnect">Disconnect</v-btn>
        <v-btn class="blue darken-1" dark v-if="client.connected" @click.native="clearMessage">Clear Message</v-btn>
      </v-toolbar>
      <main>
        <v-card id="connectInfo" v-if="!client.connected||connectPartCtl" class="grey lighten-4">
          <v-card-text>
            <h4>Connection</h4>
            <v-container fluid>
              <v-row>
                <v-col xs4>
                  <label>Host</label>
                  <input v-model="host" />
                </v-col>
                <v-col xs2>
                  <label>Port</label>
                  <input v-model="port" />
                </v-col>
                <v-col xs4>
                  <label>Client ID</label>
                  <input v-model="clientId" />
                </v-col>
                <v-col xs2>
                  <v-btn primary dark class="connect-btn" v-on:click.native="mqttConnect">Connect</v-btn>
                </v-col>
              </v-row>
              <v-row>
                <v-col xs3>
                  <label>User Name</label>
                  <input v-model="username" />
                </v-col>
                <v-col xs3>
                  <label>Password</label>
                  <input v-model="password" />
                </v-col>
                <v-col xs2>
                  <label>Keep Alive</label>
                  <input v-model="keepalive" />
                </v-col>
                <v-col xs2>
                  <v-checkbox label="Clean Session" v-model="clean" primary light style="height: 30px; margin-top: 26px;" />
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-card>
        <v-card id="subscription" v-if="client.connected">
          <v-row>
            <v-col xs3 class="tabs-tab">
              <ul>
                <li v-bind:class="{active:(activeStatus=='addtopic')}">
                  <a v-on:click="tabToggle('addtopic')"><i class="" style="vertical-align:middle;font-weight:bold;">Subscribe Topics</i><v-icon class="blue--text text--darken-2">add</v-icon></a>
                </li>
                <li v-for="(item,index) in subscriptions" v-bind:class="{active:(activeStatus==index)}">
                  <a v-on:click="tabToggle(index)">
                    <i v-if="item.news" class="pink--text" style="margin-right:4px;font-style:normal;">•</i>
                    {{item.subTopic}}
                  </a>
                  <v-btn icon dark @click.native="deleteTopic(index)">
                    <v-icon class="grey--text text--darken-2">clear</v-icon>
                  </v-btn>
                </li>
              </ul>
            </v-col>
            <v-col xs9 class="tabs-item">
              <ul>
                <li v-show="activeStatus=='addtopic'">
                  <h4>Subscription</h4>
                  <v-container fluid>
                    <v-row>
                      <v-col xs4>
                        <label>Subscription</label>
                        <input v-model="subTopic" />
                      </v-col>
                      <v-col xs4>
                        <label>Qos</label>
                        <v-select class="selector" v-bind:items="subQosStatue" v-model="subQos" light single-line />
                      </v-col>
                      <v-col xs4>
                        <v-btn primary dark class="subscribe-btn" v-on:click.native="mqttSubscribe">Subscribe</v-btn>
                      </v-col>
                    </v-row>
                  </v-container>
                </li>
                <li v-for="(items,index) in subscriptions" v-show="activeStatus==index">
                  <v-card class="grey  lighten-4" v-for="(messages,index) in receivedMessages" v-show="messages.topic==items.subTopic" :key="messages.index">
                    <v-card-text>
                      <p style="overflow:hidden;"><span>Qos : {{messages.qos}}</span><span class="grey--text" style="float:right;">{{messages.time}}</span></p>
                      <p style="font-size:18px;margin-bottom:0;">{{messages.message}}</p>
                    </v-card-text>
                  </v-card>
                </li>
              </ul>
            </v-col>
          </v-row>
        </v-card>
        <v-card id="sendmessage" v-if="client.connected">
          <v-card-text style="padding-right:7px;">
            <v-row style="margin-bottom:0;">
              <v-col xs6 style="padding-right:16px;">
                <h5>Send Message</h5>
                <v-row>
                  <v-col xs6>
                    <label>Topic</label>
                    <input v-model="publishTopic" />
                  </v-col>
                  <v-col xs6>
                    <label>Qos</label>
                    <v-select class="selector" v-bind:items="subQosStatue" v-model="publishQos" light single-line />
                  </v-col>
                </v-row>
                <label>Message</label>
                <input v-model="publishMessage" />
                <v-row>
                  <v-col xs6>
                    <v-checkbox label="Retained" v-model="publishRetain" primary light style="height: 30px; margin-top: 10px;" />
                  </v-col>
                  <v-col xs6>
                    <v-btn primary dark class="sendmessage-btn" style="float:right; margin-right:0;" v-on:click.native="mqttPublish">send message</v-btn>
                  </v-col>
                </v-row>
              </v-col>
              <v-col xs6 class="grey lighten-4" style="margin:-16px 0;height:320px;overflow-y:scroll;padding:16px;">
                <v-card class="" v-for="(messages,index) in publishedMessages" :key="messages.index">
                  <v-card-text>
                    <p style="overflow:hidden;"><span class="pink--text text--darken-2">[{{messages.topic}}]</span>&nbsp;<span>Qos : {{messages.qos}}</span><span class="grey--text" style="float:right;">{{messages.time}}</span></p>
                    <p style="font-size:18px;margin-bottom:0;">{{messages.message}}</p>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <v-snackbar :timeout="tips.timeout" :top="tips.top" :bottom="tips.bottom" :left="tips.left" :right="tips.right" class="multiline" v-model="tips.snackbar">{{tips.content}}
          <v-btn flat class="pink--text" @click.native="tips.snackbar = false">Close</v-btn>
        </v-snackbar>
      </main>
    </v-app>
  </div>
</template>
<script>
import NProgress from 'nprogress'
import mqtt from 'mqtt'
import dateformat from 'dateformat'

export default {
  name: 'home-view',
  data() {
    return {
      loading: false,
      host: '127.0.0.1',
      port: '8083',
      username: '',
      password: '',
      keepalive: 60,
      clean: true,
      clientId: `mqttjs_${Math.random().toString(16).substr(2, 10)}`,
      subTopic: '/World',
      subQos: {
        text: 0,
        value: 0,
      },
      publishTopic: '/World',
      publishQos: {
        text: 0,
        value: 0,
      },
      publishMessage: 'Hello world!',
      publishRetain: false,
      receivedMessages: [],
      publishedMessages: [],
      subscriptions: [],
      client: {},
      connectPartCtl: false,
      tips: {
        snackbar: false,
        timeout: 2000,
        content: '',
        top: true,
        bottom: false,
        left: false,
        right: false,
      },
      subQosStatue: [
        {
          value: 0,
          text: 0,
        }, {
          value: 1,
          text: 1,
        }, {
          value: 2,
          text: 2,
        },
      ],
      activeStatus: 'addtopic',
    }
  },
  methods: {
    now() {
      return dateformat(new Date(), 'yyyy-mm-dd HH:MM:ss')
    },
    mqttConnect() {
      NProgress.start()
      const options = {
        keepalive: this.keepalive,
        username: this.username,
        password: this.password,
        clientId: this.clientId,
        clean: this.clean,
      }
      this.client = mqtt.connect(`ws://${this.host}:${this.port}/mqtt`, options)
      this.client.on('connect', () => {
        this.tips.content = 'Connected！'
        this.tips.snackbar = true
          // this_.tips.snackbar = true;
        NProgress.done()
      })
      this.client.on('error', () => {
        this.tips.content = 'Connection failure!'
        this.tips.snackbar = true
        NProgress.done()
      })
      this.client.on('message', (topic, message, packet) => {
        this.receivedMessages.unshift({
          topic,
          message: message.toString(),
          qos: packet.qos,
          time: this.now(),
        })
        this.subscriptions.forEach((element) => {
          if (element.subTopic === topic) {
            element.news = true
          }
        })
      })
    },
    mqttDisconnect() {
      if (this.client.connected) {
        NProgress.start()
        this.client.end()
        this.client.on('close', () => {
          this.client.connected = false
          this.tips.content = 'Disconnected！'
          this.tips.snackbar = true
          NProgress.done()
        })
        this.connectPartCtl = false
        this.receivedMessages = []
        this.publishedMessages = []
        this.subscriptions = []
        this.activeStatus = 'addtopic'
      } else {
        this.tips.content = 'Operation failure！'
        this.tips.snackbar = true
      }
    },
    toggleConnectPart() {
      this.connectPartCtl = !this.connectPartCtl;
    },
    mqttSubscribe() {
      if (this.client.connected) {
        NProgress.start()
        this.client.subscribe(this.subTopic, {
          qos: this.subQos.value,
        }, (error) => {
          if (error) {
            NProgress.done()
            this.tips.content = error
            this.tips.snackbar = true
          } else {
            let coverIndex = -1
            this.subscriptions.forEach((element, index) => {
              if (element.subTopic === this.subTopic) {
                coverIndex = index
              }
            })
            if (coverIndex === -1) {
              this.subscriptions.unshift({
                subTopic: this.subTopic,
                qos: this.subQos.value,
                time: this.now(),
                news: false,
              })
            } else {
              this.subscriptions[coverIndex].qos = this.subQos.value;
              this.subscriptions[coverIndex].time = this.now();
            }
            this.tips.content = 'Subscription successful!'
            this.tips.snackbar = true
            NProgress.done()
          }
        })
      } else {
        this.tips.content = 'Please connect!'
        this.tips.snackbar = true
      }
    },
    tabToggle(tabIndex) {
      this.activeStatus = tabIndex
      if (tabIndex !== 'addtopic') {
        this.subscriptions[tabIndex].news = false
      }
    },
    deleteTopic(curIndex) {
      if (this.activeStatus === curIndex) {
        if (curIndex === 0) {
          this.activeStatus = 'addtopic'
        } else {
          this.activeStatus = this.activeStatus - 1
        }
      }
      this.receivedMessages.forEach((element, index) => {
        if (element.topic === this.subscriptions[curIndex].subTopic) {
          this.receivedMessages.splice(index, 1)
        }
      })
      this.subscriptions.splice(curIndex, 1)
    },
    mqttPublish() {
      if (this.client.connected) {
        NProgress.start()
        const options = {
          qos: this.publishQos.value,
          retain: this.publishRetain,
        }
        this.client.publish(this.publishTopic, this.publishMessage, options, (error) => {
          if (error) {
            NProgress.done()
            this.tips.content = error
            this.tips.snackbar = true
          } else {
            this.publishedMessages.unshift({
              message: this.publishMessage,
              topic: this.publishTopic,
              qos: this.publishQos.value,
              time: this.now(),
            })
            this.tips.content = 'Publish success!'
            this.tips.snackbar = true
            NProgress.done()
          }
        })
      } else {
        this.tips.content = 'Please connect!'
        this.tips.snackbar = true
      }
    },
    clearMessage() {
      this.receivedMessages = []
      this.publishedMessages = []
    },
  },
}
</script>
<style>
a {
  color: #424242;
}

main {
  padding: 20px;
  display: block;
}

.linkTip {
  margin: 0;
  color: #fff;
  margin-right: 20px;
}

.card {
  width: 100%;
  margin-bottom: 1rem;
}

main > .card {
  margin-bottom: 2rem;
}

.row {
  margin-bottom: .5rem;
}

label {
  display: block;
  color: #4d4d4d;
}

input {
  width: 100%;
  padding: 6px;
  border: 1px solid #ddd;
  background: #fff;
  margin: 4px 0;
}

.connect-btn,
.subscribe-btn {
  margin-top: 25px;
  height: 34px;
  margin-bottom: 0;
}

.input-group {
  margin: 0;
}

.selector .input-group__input {
  width: 100%;
  padding: 2px 6px;
  border: 1px solid #ddd;
  background: #fff;
  margin: 4px 0;
}

.input-group__details {
  display: none;
}

#connectInfo {
  /*  margin-bottom: 20px; 
*/
}

#subscription li {
  list-style: none;
}

#subscription .tabs-tab {
  /*text-align: center;*/
  height: 320px;
  overflow-x: hidden;
  overflow-y: scroll;
  padding-right: 0;
  border-right: 1px solid #ddd;
}

#subscription .tabs-item {
  height: 320px;
  overflow-x: hidden;
  overflow-y: scroll;
}

#subscription .tabs-tab a {
  display: block;
  cursor: pointer;
  margin-right: 20px;
}

#subscription .tabs-tab ul {
  font-size: 16px;
}

#subscription .tabs-tab ul li {
  position: relative;
  height: 45px;
  line-height: 45px;
  padding: 0 16px;
}

#subscription .tabs-tab ul li.active {
  background: #f9f9f9;
  border-left: 3px solid #39f;
  color: #1976d2;
}

#subscription .tabs-tab .icon {
  position: absolute;
  font-size: 20px;
  right: 10px;
  top: 50%;
  margin-top: -10px;
}

#subscription .tabs-tab .btn {
  position: absolute;
  right: -5px;
  top: 50%;
  margin-top: -18px;
  z-index: 1;
}

#subscription .tabs-item ul {
  padding: 10px;
}
</style>
