import time from './time'

export const getClientId = () => `mqttx_${Math.random().toString(16).substr(2, 8)}`

const setMQTT5Properties = (option) => {
  if (option === undefined) {
    return undefined
  }
  const properties = {}
  if (option.sessionExpiryInterval
    || option.sessionExpiryInterval === 0) {
    properties.sessionExpiryInterval = option.sessionExpiryInterval
  }
  if (option.receiveMaximum
    || option.sessionExpiryInterval === 0) {
    properties.receiveMaximum = option.receiveMaximum
  }
  if (option.topicAliasMaximum
    || option.topicAliasMaximum === 0) {
    properties.topicAliasMaximum = option.topicAliasMaximum
  }
  return properties
}

export const getClientOptions = (record) => {
  const mqttVersionDict = {
    '3.1.1': 4,
    '5.0': 5,
  }
  const {
    clientId, username, password, keepalive, clean, connectTimeout,
    mqttVersion, reconnect, will,
  } = record
  // reconnectPeriod = 0 disabled automatic reconnection in the client
  const reconnectPeriod = reconnect ? 4000 : 0
  const protocolVersion = mqttVersionDict[mqttVersion]
  const options = {
    clientId,
    keepalive,
    clean,
    reconnectPeriod,
    protocolVersion,
  }
  options.connectTimeout = time.convertSecondsToMs(connectTimeout)
  // Auth
  if (username !== '') {
    options.username = username
  }
  if (password !== '') {
    options.password = password
  }
  // MQTT Version
  if (protocolVersion === 5) {
    const { sessionExpiryInterval, receiveMaximum, topicAliasMaximum } = record
    const properties = setMQTT5Properties({
      sessionExpiryInterval,
      receiveMaximum,
      topicAliasMaximum,
    })
    if (properties && Object.keys(properties).length > 0) {
      options.properties = properties
    }
  }
  // Will Message
  if (will) {
    const {
      lastWillTopic: topic,
      lastWillPayload: payload,
      lastWillQos: qos,
      lastWillRetain: retain,
    } = will
    if (topic) {
      options.will = {
        topic, payload, qos, retain,
      }
    }
  }
  return options
}

export default {}
