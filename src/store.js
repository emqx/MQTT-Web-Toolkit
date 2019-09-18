import Vue from 'vue';
import Vuex from 'vuex';


Vue.use(Vuex);

const CREATE_CONNECTION = 'CREATE_CONNECTION'
const DELETE_CONNECTION = 'DELETE_CONNECTION'
const CHANGE_ACTIVE_CONNECTION = 'CHANGE_ACTIVE_CONNECTION'


const storageConnections = JSON.parse(localStorage.getItem('connections')) || []

export default new Vuex.Store({
  state: {
    connections: storageConnections,
    activeConnection: storageConnections.length > 0 ? storageConnections[0].name : '',
  },
  mutations: {
    [CREATE_CONNECTION](state, connection) {
      const connections = [...state.connections]
      connections.push(connection)
      state.connections = connections
      state.activeConnection = connection.name
      localStorage.setItem('connections', JSON.stringify(connections))
    },
    [DELETE_CONNECTION](state, connectionName) {
      const connections = state.connections.filter(({ name }) => name !== connectionName)
      state.connections = connections
      localStorage.setItem('connections', connections)
    },
    [CHANGE_ACTIVE_CONNECTION](state, connectionName) {
      state.activeConnection = connectionName
    },
  },
  actions: {
    [CREATE_CONNECTION]({ commit }, connection) {
      commit(CREATE_CONNECTION, connection)
    },
    [DELETE_CONNECTION]({ commit }, connectionName) {
      commit(CREATE_CONNECTION, connectionName)
    },
    [CHANGE_ACTIVE_CONNECTION]({ commit }, connectionName) {
      commit(CHANGE_ACTIVE_CONNECTION, connectionName)
    },
  },
});
