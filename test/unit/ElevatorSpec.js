describe("Elevator",function() {

    var elevator, UP = 1, DOWN = -1;

    beforeEach(function(){
        elevator = new Elevator(10);
    });

    it ("should be created with 10 floors", function() {
        expect(elevator.floors).toBe(10);
    });

    it ("should default to 4 floors if not floor is passed at initialization", function() {
        var suite = new Elevator();
        expect(suite.floors).toBe(4);
    });

    it ("should start at the first floor", function() {
        expect(elevator.currentFloor).toBe(1);
    });

    it ("should throw an error if called to go to a floor larger than the total number of floors", function() {
        expect(function() {
            elevator.goTo(11);
        }).toThrow(new Error("Elevator only has 10 floors"));
    });

    it ("should throw an error if called to go to a floor less than 1", function() {
        expect(function() {
            elevator.goTo(0);
        }).toThrow(new Error("Elevator lowest floor is 1"));
    });

    it("should open door when arrived at requested floor", function() {
        elevator.goTo(3);
        expect(elevator.elevatorOpen).toBe(false);
        elevator.step(); // Go to floor 2
        elevator.step(); // Go to floor 3
        expect(elevator.elevatorOpen).toBe(true);
    });

    it("should open door at a requested floor between current location and destination", function() {
        elevator.goTo(8);
        expect(elevator.elevatorOpen).toBe(false);
        elevator.step(); // Go to floor 2
        elevator.requestStopAt({ floor: 6, direction: UP });
        elevator.step(); // Go to floor 3
        elevator.step(); // Go to floor 4
        elevator.step(); // Go to floor 5
        elevator.step(); // Go to floor 6
        expect(elevator.elevatorOpen).toBe(true);
        elevator.step(); // Go to floor 7
        elevator.step(); // Go to floor 8
        expect(elevator.elevatorOpen).toBe(true);
    });

    it ("should go to the next floor when step is run", function() {
        elevator.goTo(3);
        elevator.step();
        expect(elevator.currentFloor).toBe(2);
        elevator.step();
        expect(elevator.currentFloor).toBe(3);
    });

    it("should open door at a requested floor between current location and destination when coming down", function() {
        elevator.goTo(8);
        // move it to eight
        for(var i = 2; i < 9; i ++) { elevator.step() }
        expect(elevator.elevatorOpen).toBe(true);
        elevator.goTo(2);
        elevator.step(); // Go to floor 7
        expect(elevator.elevatorOpen).toBe(false);
        elevator.step(); // Go to floor 6
        elevator.requestStopAt({ floor: 4, direction: UP });
        elevator.requestStopAt({ floor: 5, direction: DOWN });
        elevator.step(); // Go to floor 5
        expect(elevator.elevatorOpen).toBe(true);
        elevator.step(); // Go to floor 4
        expect(elevator.elevatorOpen).toBe(false);
        elevator.step(); // Go to floor 3
        elevator.step(); // Go to floor 2
        expect(elevator.elevatorOpen).toBe(true);
    });

    it("should finish all the stops in the same direction before changing direction", function() {
        expect(elevator.elevatorOpen).toBe(false);
        elevator.goTo(7);
        elevator.requestStopAt({ floor: 2, direction: DOWN });
        elevator.step(); // Go to floor 2
        expect(elevator.elevatorOpen).toBe(false);
        elevator.step(); // Go to floor 3
        elevator.requestStopAt({ floor: 4, direction: UP });
        elevator.requestStopAt({ floor: 3, direction: DOWN });
        elevator.step(); // Go to floor 4
        expect(elevator.elevatorOpen).toBe(true);
        elevator.requestStopAt({ floor: 9, direction: UP });
        elevator.step(); // Go to floor 5
        elevator.step(); // Go to floor 6
        expect(elevator.elevatorOpen).toBe(false);
        elevator.step(); // Go to floor 7
        expect(elevator.elevatorOpen).toBe(true);
        elevator.step(); // Go to floor 8
        elevator.step(); // Go to floor 9
        expect(elevator.elevatorOpen).toBe(true);
        expect(elevator.currentFloor).toBe(9);
    });
});
