Module.register("MMM-CalendarExt3Swipe", {
    touchStartXy: 0,
    touchEndX: 0,

    start: function () {
        Log.log("Starting module: " + this.name);
    },

    notificationReceived: function (notification, payload, sender) {
        if (notification === "DOM_OBJECTS_CREATED") {
            this.sendNotification('CX3_GET_CONFIG', {
                callback: (current) => {
                    this.config = current;
                    this.sendSocketNotification("SET_CONFIG", this.config);
                }
            });

            window.addEventListener("keydown", this.keydownHandler.bind(this));
            window.addEventListener("touchstart", this.touchStartHandler.bind(this));
            window.addEventListener("touchend", this.touchEndHandler.bind(this));
        }
    },

    keydownHandler: function (event) {
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
            this.sendSwipeNotification(event.key);
        }
    },

    touchStartHandler: function (event) {
        this.touchStartX = event.changedTouches[0].screenX;
    },

    touchEndHandler: function (event) {
        this.touchEndX = event.changedTouches[0].screenX;
        this.handleSwipe();
    },

    socketNotificationReceived: function (notification, payload) {
        if (notification === "SWIPE") {
            this.config.monthIndex = payload.monthIndex;
            this.sendNotification('CX3_SET_CONFIG', payload);
        }
    },

    handleSwipe: function () {
        var difference = this.touchEndX - this.touchStartX;
        var threshold = 50;

        if (difference > threshold) {
            this.sendSwipeNotification("ArrowLeft");
        } else if (difference < -threshold) {
            this.sendSwipeNotification("ArrowRight");
        }
    },

    sendSwipeNotification: function (direction) {
        var currentIndex = this.config.monthIndex;
        direction === "ArrowRight" ? currentIndex++ : currentIndex--;
        this.sendSocketNotification("SWIPE", currentIndex);
    },
});
