<template>
<v-app top-toolbar footer>
  <v-toolbar>
    <v-toolbar-title>MQTT</v-toolbar-title>
    <p v-if="client.connected" class="linkTip">已连接至  {{host}}</p>
    <v-btn icon dark v-if="client.connected" @click.native="toggleConnectPart">
      <v-icon class="white--text text--darken-2">link</v-icon>
    </v-btn>
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
            <v-btn primary dark class="connectBtn" v-if="!client.connected" v-on:click.native="mqttConnect">Connect</v-btn>
            <v-btn primary dark class="connectBtn" v-if="client.connected" v-on:click.native="mqttDisconnect">Disconnect</v-btn>
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
    <v-card id="subtopicPart">
    <v-tabs scroll-bars>
      <v-tab-item v-for="i in subscriptions.length" v-bind:href="'#subtopicPart-' + i" slot="activators">
       <span v-if='subscriptions[i-1]'>{{subscriptions[i-1].subTopic}}</span>
       <span v-else><v-icon class="white--text text--darken-2" style="vertical-align:middle; font-size:24px;">add</v-icon><i  style="vertical-align:middle;">Subscribe Topics</i></span>
      </v-tab-item>
      <v-tab-content v-for="i in subscriptions.length" v-bind:id="'subtopicPart-' + i" slot="content" style="height:auto;">
        <v-card>
          <v-card-text v-if='subscriptions[i-1]'>{{ subscriptions[i-1].message }}</v-card-text>
          <v-card-text v-else>
          <h4>Subscription</h4>
            <v-container fluid>
              <v-row>
            <v-col xs4>
              <label>Subscription{{subscriptions.length}}</label>
              <input v-model="subTopic" />
          </v-col>
          <v-col xs4>
            <label>Qos</label>
            <v-select v-bind:items="subQosStatue" v-model="subQos" light single-line />
          </v-col>
          <v-col xs4>
            <v-btn primary dark class="subscribeBtn" v-on:click.native="mqttSubscribe">Subscribe</v-btn>
          </v-col>
          </v-row>
            </v-container>
          </v-card-text>
        </v-card>
      </v-tab-content>
      </v-tabs>
    </v-card>
    <v-card>
      <div>
        
      </div>
    </v-card>
    <v-snackbar :timeout="tips.timeout" :top="tips.top" :bottom="tips.bottom" :left="tips.left" :right="tips.right" class="multiline" v-model="tips.snackbar" >{{tips.content}}
      <v-btn flat class="pink--text" @click.native="tips.snackbar = false">Close</v-btn>
    </v-snackbar>
  </main>
  <v-footer>publish</v-footer>
</v-app>
</template>

<script>
import NProgress from 'nprogress'
import mqtt from 'mqtt'
import dateformat from 'dateformat'

export default {
  name: 'websocket-view',
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
      subQos: {text: 0, value: 0},
      publishTopic: '/World',
      publishQos: 0,
      publishMessage: 'Hello world!',
      publishRetain: false,
      receivedMessages: [],
      publishedMessages: [],
      subscriptions: ["",
        {
          subTopic:"topic1",
          qos:0,
          time:"2017/09/21",
          message:"lalallal",
        }, {
          subTopic:"topic2",
          qos:1,
          time:"2017/09/25",
          message:"666666",
        },
      ],
      client: {},
      connectPartCtl:false,
      tips: {
        snackbar: false,
        timeout: 6000,
        content: '',
        top:true,
        bottom:false,
        left:false,
        right:true,
      },
      subQosStatue:[
        {value: 0, text: 0},
        {value: 1, text: 1},
        {value: 2, text: 2},
      ],
    }
  },
  methods: {
    now() {
      return dateformat(new Date(), 'yyyy-mm-dd hh:MM:ss')
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
        const this_ =this;
      this.client = mqtt.connect(`ws://${this.host}:${this.port}/mqtt`, options)
      this.client.on('connect', () => {
        this.tips.content="连接成功！"
        //this.tips.snackbar=true
        this_.tips.snackbar=true;
        NProgress.done()
      })
      this.client.on('error', (error) => {
        this.tips.content="连接失败"
        this.tips.snackbar=true
        NProgress.done()
      })
      this.client.on('message', (topic, message, packet) => {
        this.receivedMessages.push({
          topic,
          message: message.toString(),
          qos: packet.qos,
          time: this.now(),
        })
      })
    },
    mqttDisconnect() {
      if (this.client.connected) {
        NProgress.start()
        this.client.end()
        this.client.on('close', () => {
          this.client.connected=false
          this.tips.content="已断开连接！"
          this.tips.snackbar=true
          NProgress.done()
        })
      } else {
        this.tips.content="操作失败！"
        this.tips.snackbar=true
      }
    },
    toggleConnectPart() {
      this.connectPartCtl=!this.connectPartCtl;
    },
    mqttSubscribe() {
      if (this.client.connected) {
        NProgress.start()
        this.client.subscribe(this.subTopic, { qos: this.subQos.value }, (error) => {
          if (error) {
            NProgress.done()
            this.tips.content=error
            this.tips.snackbar=true
          } else {
            this.subscriptions.push({
              subTopic: this.subTopic,
              qos: this.subQos,
              time: this.now(),
            })
            console.log(this.subscriptions)
            this.tips.content="订阅成功！"
            this.tips.snackbar=true
            NProgress.done()
          }
        })
      } else {
        this.tips.content="连接以后才能订阅"
        this.tips.snackbar=true
      }
    },
  },
}
</script>

<style lang="stylus">
  @import '../node_modules/vuetify/src/stylus/main'
  @import './css/main.css'
</style>

<style>
  main{
    padding:20px;
  }
  .linkTip{
    margin: 0;
    color: #fff;
  }
  .card{
    width:100%;
  }
  .row{
    margin-bottom:.5rem;
  }
  #connectInfo label ,#subtopicPart label{
    display:block;
    color:#4d4d4d;
  }
  #connectInfo input ,#subtopicPart input{
    width: 100%;
    padding: 6px;
    border: 1px solid #ddd;
    background: #fff;
    margin: 4px 0;
  }
  .connectBtn, .subscribeBtn{
  margin-top: 25px;
    height: 34px;
    margin-bottom: 0;
  }
  #subtopicPart .input-group{
    margin: 0;
  }
  #subtopicPart .tabs,#subtopicPart .tabs__items{
    height: 100%;
  }
  #subtopicPart .input-group__input{
    width: 100%;
    padding: 2px 6px;
    border: 1px solid #ddd;
    background: #fff;
    margin: 4px 0;
  }
  .input-group__details{
    display: none;
  }
</style>