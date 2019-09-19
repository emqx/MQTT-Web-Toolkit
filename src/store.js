import Vue from 'vue';
import Vuex from 'vuex';


Vue.use(Vuex);

const CREATE_CONNECTION = 'CREATE_CONNECTION'
const EDIT_CONNECTION = 'EDIT_CONNECTION'
const DELETE_CONNECTION = 'DELETE_CONNECTION'
const CHANGE_ACTIVE_CONNECTION = 'CHANGE_ACTIVE_CONNECTION'


const storageConnections = JSON.parse(localStorage.getItem('connections')) || []

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
      const editIndex = state.connections.findIndex(item => item.name === connection.name)
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
    [DELETE_CONNECTION]({ commit }, connectionName) {
      commit(DELETE_CONNECTION, connectionName)
    },
    [CHANGE_ACTIVE_CONNECTION]({ commit }, connection) {
      commit(CHANGE_ACTIVE_CONNECTION, connection)
    },
  },
});
