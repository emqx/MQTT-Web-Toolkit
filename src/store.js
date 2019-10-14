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


let storageConnections = JSON.parse(localStorage.getItem('connections')) || []
storageConnections = storageConnections.map((row) => {
  const { client, ...withoutClient } = row
  const newClient = { connected: false }
  return { ...withoutClient, client: newClient }
})

export default new Vuex.Store({
  state: {
    connections: storageConnections,
    activeConnection: storageConnections.length > 0 ? storageConnections[0] : '',
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
      const editIndex = state.connections.findIndex($ => $.id === connection.id)
      if (editIndex !== -1) {
        state.connections[editIndex] = connection
        localStorage.setItem('connections', JSON.stringify(state.connections))
      }
    },
    [DELETE_CONNECTION](state, id) {
      state.connections = state.connections.filter($ => $.id !== id)
      localStorage.setItem('connections', JSON.stringify(state.connections))
    },
    [PUSH_MESSAGE](state, payload) {
      const { id, message } = payload
      const connectionIndex = state.connections.findIndex($ => $.id === id)
      state.connections[connectionIndex].messages.unshift(message)
    },
    [CHANGE_CLIENT](state, payload) {
      const { id, client } = payload
      const connectionIndex = state.connections.findIndex($ => $.id === id)
      state.connections[connectionIndex].client = client
    },
    [CHANGE_SUBSCRIPTIONS](state, payload) {
      const { id, subscriptions } = payload
      const connectionIndex = state.connections.findIndex($ => $.id === id)
      state.connections[connectionIndex].subscriptions = subscriptions
    },
    [UNREAD_MESSAGE_COUNT_INCREMENT](state, payload) {
      const { id, count } = payload
      const connectionIndex = state.connections.findIndex($ => $.id === id)
      if (count !== undefined) {
        state.connections[connectionIndex].unreadMessageCount = count
      } else {
        state.connections[connectionIndex].unreadMessageCount += 1
      }
    },
    [CHANGE_ACTIVE_CONNECTION](state, connection) {
      state.activeConnection = connection
    },
  },
  actions: {
    [CREATE_CONNECTION]({ commit }, connection) {
      commit(CREATE_CONNECTION, connection)
    },
    [EDIT_CONNECTION]({ commit }, connection) {
      commit(EDIT_CONNECTION, connection)
    },
    [DELETE_CONNECTION]({ commit }, id) {
      commit(DELETE_CONNECTION, id)
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
  },
});
