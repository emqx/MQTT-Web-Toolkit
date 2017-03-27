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
        <v-snackbar :timeout="tips.timeout" :top="tips.top" :bottom="tips.bottom" :left="tips.left" :right="tips.right" v-model="tips.snackbar">{{tips.content}}
          <v-btn flat class="pink--text" @click.native="tips.snackbar = false">Close</v-btn>
        </v-snackbar>
      </v-card-text>
    </v-card>
    <v-tabs id="subtopicPart" scroll-bars>
      <v-tab-item v-for="i in subTopicList.length" v-bind:href="'#subtopicPart-' + i" slot="activators">
       <span v-if='subTopicList[i-1]'>{{subTopicList[i-1]}}</span>
       <span v-else><v-icon class="white--text text--darken-2" style="vertical-align:middle;">add</v-icon><i>订阅主题</i></span>
      </v-tab-item>
      <v-tab-content v-for="i in subTopicList.length" v-bind:id="'subtopicPart-' + i" slot="content">
        <v-card>
          <v-card-text>{{ subTopicList[i-1] }}</v-card-text>
        </v-card>
      </v-tab-content>
      </v-tabs>
  </main>
  <v-footer>publish</v-footer>
</v-app>
</template>

<script>
import NProgress from 'nprogress'
import mqtt from 'mqtt'

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
      subQos: 0,
      publishTopic: '/World',
      publishQos: 0,
      publishMessage: 'Hello world!',
      publishRetain: false,
      receivedMessages: [],
      publishedMessages: [],
      subscriptions: [],
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
      subTopicList:['','topic1','topic2'],
      subTopicMessage:['0','message1','message2']
    }
  },
  methods: {
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
        console.log("ok");
        this.tips.content="连接成功！"
        //this.tips.snackbar=true
        this_.tips.snackbar=true;
        console.log(this_.tips);
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
    }
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
  #connectInfo label{
    display:block;
    color:#4d4d4d;
  }
  #connectInfo input{
    width: 100%;
    padding: 6px;
    border: 1px solid #ddd;
    background: #fff;
    margin: 4px 0;
  }
  .connectBtn{
  margin-top: 25px;
    height: 34px;
    margin-bottom: 0;
  }
</style>