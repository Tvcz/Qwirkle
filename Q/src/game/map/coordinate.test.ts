import Coordinate from "./coordinate";

describe("tests for coordinate class", () => {
  test("get coordinate returns the x and y values of the coordinate", () => {
    // Arrange
    const coord = new Coordinate(-1, 3);

    // Act
    const { x, y } = coord.getCoordinate();

    // Assert
    expect(x).toBe(-1);
    expect(y).toBe(3);
  });
  test("toString returns string representing the coordinate", () => {
    // Arrange
    const coord = new Coordinate(1, 11);

    // Act
    const string = coord.toString();

    // Assert
    expect(string).toBe("{x:1,y:11}");
  });
  test("toString returns string representing the coordinate with negatives", () => {
    // Arrange
    const coord = new Coordinate(-1, -1011);

    // Act
    const string = coord.toString();

    // Assert
    expect(string).toBe("{x:-1,y:-1011}");
  });
  test("getNeighbors returns all four neighbors of a coordinate", () => {
    // Arrange
    const coord = new Coordinate(0, 0);

    // Act
    const neighbors = coord.getNeighbors();

    // Assert
    expect(Object.keys(neighbors).length).toBe(4);

    expect(neighbors.left.getCoordinate().x).toBe(coord.getCoordinate().x - 1);
    expect(neighbors.left.getCoordinate().y).toBe(coord.getCoordinate().y);

    expect(neighbors.right.getCoordinate().x).toBe(coord.getCoordinate().x + 1);
    expect(neighbors.right.getCoordinate().y).toBe(coord.getCoordinate().y);

    expect(neighbors.bottom.getCoordinate().x).toBe(coord.getCoordinate().x);
    expect(neighbors.bottom.getCoordinate().y).toBe(
      coord.getCoordinate().y - 1
    );

    expect(neighbors.top.getCoordinate().x).toBe(coord.getCoordinate().x);
    expect(neighbors.top.getCoordinate().y).toBe(coord.getCoordinate().y + 1);
  });
});
