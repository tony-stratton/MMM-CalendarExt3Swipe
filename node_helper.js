const NodeHelper = require('node_helper');

module.exports = NodeHelper.create({
  socketNotificationReceived: function (notification, payload) {
    if (notification === 'SET_CONFIG') {
      this.config = payload;
    }

    if (notification === 'SWIPE') {
      this.config.monthIndex = payload;
      this.sendSocketNotification('SWIPE', {
        monthIndex: payload
      });
    }
  },
});