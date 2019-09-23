import Vue from 'vue';
import Vuex from 'vuex';


Vue.use(Vuex);

const CREATE_CONNECTION = 'CREATE_CONNECTION'
const EDIT_CONNECTION = 'EDIT_CONNECTION'
const DELETE_CONNECTION = 'DELETE_CONNECTION'
const PUSH_MESSAGE = 'PUSH_MESSAGE'
const CHANGE_CLIENT = 'CHANGE_CLIENT'
const CHANGE_SUBSCRIPTIONS = 'CHANGE_SUBSCRIPTIONS'
const UNREAD_MESSAGE_COUNT_INCREMENT = 'UNREAD_MESSAGE_COUNT_INCREMENT'
const CHANGE_ACTIVE_CONNECTION = 'CHANGE_ACTIVE_CONNECTION'
const CHANGE_PUBLISH_FOCUS = 'CHANGE_PUBLISH_FOCUS'


const storageConnections = JSON.parse(localStorage.getItem('connections')) || []

export default new Vuex.Store({
  state: {
    connections: storageConnections,
    activeConnection: storageConnections.length > 0 ? storageConnections[0] : '',
    publishFocus: false,
  },
  mutations: {
    [CREATE_CONNECTION](state, connection) {
      const connections = [...state.connections]
      connections.push(connection)
      state.connections = connections
      state.activeConnection = connection
      localStorage.setItem('connections', JSON.stringify(connections))
    },
    [EDIT_CONNECTION](state, connection) {
      const editIndex = state.connections.findIndex(item => item.clientId === connection.clientId)
      if (editIndex !== -1) {
        state.connections[editIndex] = connection
        localStorage.setItem('connections', JSON.stringify(state.connections))
      }
    },
    [DELETE_CONNECTION](state, connectionName) {
      const connections = state.connections.filter(({ name }) => name !== connectionName)
      state.connections = connections
      localStorage.setItem('connections', connections)
    },
    [PUSH_MESSAGE](state, payload) {
      const { name, message } = payload
      const connectionIndex = state.connections.findIndex($ => $.name === name)
      state.connections[connectionIndex].messages.push(message)
    },
    [CHANGE_CLIENT](state, payload) {
      const { name, client } = payload
      const connectionIndex = state.connections.findIndex($ => $.name === name)
      state.connections[connectionIndex].client = client
    },
    [CHANGE_SUBSCRIPTIONS](state, payload) {
      const { name, subscriptions } = payload
      const connectionIndex = state.connections.findIndex($ => $.name === name)
      state.connections[connectionIndex].subscriptions = subscriptions
    },
    [UNREAD_MESSAGE_COUNT_INCREMENT](state, payload) {
      const { name, count } = payload
      const connectionIndex = state.connections.findIndex($ => $.name === name)
      if (count !== undefined) {
        state.connections[connectionIndex].unreadMessageCount = count
      } else {
        state.connections[connectionIndex].unreadMessageCount += 1
      }
    },
    [CHANGE_ACTIVE_CONNECTION](state, connection) {
      state.activeConnection = connection
    },
    [CHANGE_PUBLISH_FOCUS](state, isFocus) {
      state.publishFocus = isFocus
    },
  },
  actions: {
    [CREATE_CONNECTION]({ commit }, connection) {
      commit(CREATE_CONNECTION, connection)
    },
    [EDIT_CONNECTION]({ commit }, connection) {
      commit(EDIT_CONNECTION, connection)
    },
    [DELETE_CONNECTION]({ commit }, connectionName) {
      commit(DELETE_CONNECTION, connectionName)
    },
    [PUSH_MESSAGE]({ commit }, payload) {
      commit(PUSH_MESSAGE, payload)
    },
    [CHANGE_CLIENT]({ commit }, payload) {
      commit(CHANGE_CLIENT, payload)
    },
    [CHANGE_SUBSCRIPTIONS]({ commit }, payload) {
      commit(CHANGE_SUBSCRIPTIONS, payload)
    },
    [UNREAD_MESSAGE_COUNT_INCREMENT]({ commit }, payload) {
      commit(UNREAD_MESSAGE_COUNT_INCREMENT, payload)
    },
    [CHANGE_ACTIVE_CONNECTION]({ commit }, connection) {
      commit(CHANGE_ACTIVE_CONNECTION, connection)
    },
    [CHANGE_PUBLISH_FOCUS]({ commit }, isFocus) {
      commit(CHANGE_PUBLISH_FOCUS, isFocus)
    },
  },
});
