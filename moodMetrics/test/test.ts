class Context {

  private strategy: Strategy;

  constructor(strategy: Strategy) {
    this.strategy = strategy
  }

  public setStrategy(strategy: Strategy) {
    this.strategy = strategy
  }

  public doSomeBusinessLogic(): void {
    console.log(
      "Context: Sorting data using the strategy (not sure how it'll do it)"
    )
    const result = this.strategy.doAlgorithm(['a', 'b', 'c', 'd', 'e'])
    console.log(result.join(','))
  }

  private doSomething(): void {
    console.log('do something');
  }
}

interface Strategy {
  doAlgorithm(data: string[]): string[]
}

class ConcreteStrategyA implements Strategy {
  public doAlgorithm(data: string[]): string[] {
    return data.sort()
  }
}

class ConcreteStrategyB implements Strategy {
  public doAlgorithm(data: string[]): string[] {
    return data.reverse()
  }
}

class Animal {
  public name: string;
  public age: number;
  constructor(theName: string) {
    this.name = theName;
  }
  move(distanceInMeters: number = 0) {
    console.log(`${this.name} moved ${distanceInMeters}m.`);
  }
}

class Snake extends Animal {
  constructor(name: string) {
    super(name);
  }
  move(distanceInMeters = 5) {
    console.log("Slithering...");
    super.move(distanceInMeters);
  }
}

class Horse extends Animal {
  constructor(name: string) {
    super(name);
  }
  move(distanceInMeters = 45) {
    console.log("Galloping...");
    super.move(distanceInMeters);
  }
}