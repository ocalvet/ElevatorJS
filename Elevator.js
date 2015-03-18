(function() {
    // Private members

    self.Elevator = function(totalFloors) {
        this.floors = totalFloors || 4;
        this.currentFloor = 1;
        this.destinationFloor = undefined;
        this.queue = [];
        this.elevatorOpen = false;
        this.direction = 1;
    };

    self.Elevator.prototype = function () {

        var
            goToFloor = function (floor) {
                if (floor > this.floors) {
                    throw new Error("Elevator only has " + this.floors + " floors");
                } else if (floor < 1) {
                    throw new Error("Elevator lowest floor is 1");
                }

                this.queue.push({ floor: floor });
            },

            requestStopAt = function(requestObject) {
                this.queue.push(requestObject);
            },

            inQueue = function(floor, direction) {
                var queueElement = this.queue.filter(function(requestObject) {
                    return requestObject.floor === floor && (requestObject.direction === direction || requestObject.direction === undefined);
                });
                return queueElement.length > 0;
            },

            getNextStop = function() {
                var elevator = this;
                var requested = undefined;

                var itemsOnSameDirection = this.queue.filter(function(e, i) {
                    e.index = i;
                    return e.direction === elevator.direction;
                });

                if (itemsOnSameDirection && itemsOnSameDirection.length > 0) {
                    requested = itemsOnSameDirection[0];
                    // remove it from the queue
                    itemsOnSameDirection.splice(requested.index, 1);
                } else {
                    requested = this.queue.shift();
                }
                return  requested;
            },

            setDirection = function () {
                var floorsToGo = this.destinationFloor.floor - this.currentFloor;
                this.direction = floorsToGo / Math.abs(floorsToGo);
            },

            step = function() {
                // Check if I need to move
                if (this.queue.length > 0  || this.destinationFloor) {
                    // Check if the destination floor is set
                    this.destinationFloor = this.destinationFloor || getNextStop.call(this);

                    if (this.destinationFloor !== undefined) {
                        if (this.destinationFloor.floor === this.currentFloor) {
                            this.elevatorOpen = true;
                            this.destinationFloor = undefined;
                            return;
                        }
                        setDirection.call(this);
                        this.currentFloor += this.direction;
                        var curFloor = this.currentFloor;
                        var direction = this.direction;
                        if (inQueue.call(this, curFloor, direction)) {
                            // Open door
                            this.elevatorOpen = true;
                            // Clear stop
                            this.queue = this.queue.filter(function (requestObject) {
                                return !(requestObject.floor === curFloor && (requestObject.direction === undefined || requestObject.direction === direction))
                            })

                        } else if (this.destinationFloor.floor === curFloor) {
                            this.elevatorOpen = true;
                            this.destinationFloor = undefined;
                        } else {
                            this.elevatorOpen = false;
                        }
                    }
                } else {
                    this.elevatorOpen = false;
                }
            };

        return {
            goTo: goToFloor,
            requestStopAt: requestStopAt,
            step: step
        }
    }();
})();