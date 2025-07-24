const Test = () => {
  //     class EncapExp = {
  //     #name = "Encapsulation Example";
  //     abc = '123'
  //     return Name(){
  //         return this.#name;
  //     }
  // }

  // const example = new EncapExp();
  // console.log(example.Name()); // Outputs: "Encapsulation Example"
  // console.log(example.#name); // Error: Private field '#name' must be declared in an enclosing class
  // console.log(example.abc); // Outputs: "123"

  // class animal {
  //     constructor(name) {
  //         this.name = name;
  //     }
  //     speak(){
  //         console.log(`${this.name} makes a sound.`);
  //     }
  // }

  // class Dog extends animal {
  //     speak(){
  //         console.log(`${this.name} barks.`);
  //     }
  // }

  // const dog = new Dog('Rex');
  // dog.speak(); // Outputs: "Rex barks."

  class Animal {
    constructor(name) {
      this.name = name;
    }

    speak() {
      console.log(`${this.name} makes a sound.`);
    }
  }

  class Dog extends Animal {
    speak() {
      console.log(`${this.name} barks.`);
    }
  }

  const dog = new Dog("Tom");
  console.log(dog.speak());

  const list = [
    {
      name: "ABC",
      age: 25,
      isActive: true,
    },
    {
      name: "XYZ",
      age: 30,
      isActive: false,
    },
    {
      name: "PQR",
      age: 22,
      isActive: true,
    },
    {
      name: "LMN",
      age: 28,
      isActive: false,
    },
  ];
  //   let list1 = list
  //     .filter((li) => li.isActive)
  //     .sort((a, b) => a.age - b.age)
  //     .map((li) => li.name);
  //   console.log(list);
  //   console.log(list1);
  for (let i = 0; i < list.length; i++) {
    for (let j = 0; j < list.length - 1; j++) {
      if (list[j].age > list[j + 1].age) {
        let temp = list[j + 1];
        list[j + 1] = list[j];
        list[j] = temp;
      }
    }
  }
  console.log(list);
  //duplicacy in object string {abcc,defc,bcd}  find c in object output - {2,1,1}
  // abc* bef concatenate
  //
  return <div>{dog.speak()}</div>;
};

export default Test;
