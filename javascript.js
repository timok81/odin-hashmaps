class Node {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.nextNode = null;
  }
}

class LinkedList {
  size = 0;
  head = null;
  tail = null;

  append(key, value) {
    const newNode = new Node(key, value);

    if (this.head === null) {
      this.head = newNode;
    }
    if (this.tail === null) {
      this.tail = newNode;
    } else {
      this.tail.nextNode = newNode;
      this.tail = newNode;
    }
    this.size++;
  }

  prepend(key, value) {
    const newNode = new Node(key, value);

    newNode.nextNode = this.head;
    this.head = newNode;

    if (this.tail === null) {
      this.tail = newNode;
    }
    this.size++;
  }

  size() {
    return this.size;
  }

  head() {
    return this.head;
  }

  tail() {
    return this.tail;
  }

  at(index) {
    let searchIndex = 0;
    let current = this.head;

    while (current) {
      if (index === searchIndex) {
        return current;
      }
      current = current.nextNode;
      searchIndex++;
    }
  }

  pop() {
    let secondToLastNode;

    if (this.size >= 3) {
      secondToLastNode = this.at(this.size - 2);
      secondToLastNode.nextNode = null;
      this.tail = secondToLastNode;
    } else if (this.size === 2) {
      secondToLastNode = this.head;
      secondToLastNode.nextNode = null;
      this.tail = secondToLastNode;
    } else {
      this.head.nextNode = null;
      this.head = null;
      this.tail = null;
    }
    this.size--;
  }

  contains(key) {
    let current = this.head;

    while (current) {
      if (current.key === key) {
        return true;
      }
      current = current.nextNode;
    }
    return false;
  }

  find(key) {
    let current = this.head;
    let searchIndex = 0;

    while (current) {
      if (current.key === key) {
        return searchIndex;
      }
      searchIndex++;
      current = current.nextNode;
    }
    return null;
  }

  insertAt(key, value, index) {
    if (index >= this.size) {
      this.append(key, value);
    } else if (index === 0) {
      this.prepend(key, value);
    } else {
      const newNode = new Node(key, value);
      const oldNode = this.at(index);
      this.at(index - 1).nextNode = newNode;
      newNode.nextNode = oldNode;
    }
    this.size++;
  }

  removeAt(index) {
    if (index === this.size - 1) {
      this.pop();
    } else if (index > 0 && index < this.size - 1) {
      this.at(index - 1).nextNode = this.at(index + 1);

      if (this.at(index.nextNode) != null) {
        this.at(index).nextNode = null;
      }
      this.size--;
    } else if (index === 0) {
      const oldHead = this.head;
      this.head = this.at(1);
      oldHead.nextNode = null;
      this.size--;
    } else {
      return;
    }
  }

  toString() {
    if (this.size > 0) {
      let current = this.head;
      let output = "";

      while (current) {
        let key = current.key;
        let value = current.value;
        if (current != this.tail) output += `( ${key} / ${value} ) -> `;
        else output += `( ${value} )`;
        current = current.nextNode;
      }
      console.log(output);
    } else {
      console.log("List is empty");
    }
  }
}

////////////////////////////////////////

class Hashmap {
  buckets = [];
  filledBuckets = 0;
  capacity = 16;
  loadFactor = 0.75;

  //Checks if given index is within array range
  checkIndex(index) {
    if (index < 0 || index >= this.capacity) {
      throw new Error("Trying to access index out of bound");
    }
  }

  //Doubles the size of buckets
  growBuckets() {
    let cloneBuckets = [...this.buckets];
    this.buckets.length = 0;
    this.filledBuckets = 0;
    this.capacity = this.capacity * 2;

    cloneBuckets.forEach((element) => {
      if (element != null || element != undefined) {
        let currentNode = element.head;

        while (currentNode) {
          this.set(currentNode.key, currentNode.value);
          if (currentNode.nextNode != null) currentNode = currentNode.nextNode;
          else return;
        }
      }
    });
    cloneBuckets.length = 0;
  }

  //Creates a hash code based on given key
  hash(key) {
    let hashCode = 0;
    const primeNumber = 31;

    for (let i = 0; i < key.length; i++) {
      hashCode = (primeNumber * hashCode + key.charCodeAt(i)) % this.capacity;
    }
    return hashCode;
  }

  //Inserts a new key/value pair into buckets array
  set(key, value) {
    const keyHash = this.hash(key);
    this.checkIndex(keyHash);
    let targetBucket = this.buckets[keyHash];

    //if array index is unoccupied
    if (targetBucket === null || targetBucket === undefined) {
      const list = new LinkedList();
      this.buckets[keyHash] = list;
      list.append(key, value);
      this.filledBuckets++;
    } else if (targetBucket) {
      //if duplicate key exists at index
      if (targetBucket.contains(key)) {
        targetBucket.at(targetBucket.find(key)).value = value;
      }
      //if duplicate key doesn't exist at index
      else {
        targetBucket.append(key, value);
        this.filledBuckets++;
      }
    }
    if (this.filledBuckets > this.capacity * this.loadFactor) {
      this.growBuckets();
    }
  }

  //Returns the value of given key
  get(key) {
    const keyHash = this.hash(key);
    this.checkIndex(keyHash);

    if (this.buckets[keyHash]) {
      if (this.buckets[keyHash].head.key === key) {
        return this.buckets[keyHash].head.value;
      }
    } else {
      return null;
    }
  }

  //Returns true if given key exists
  has(key) {
    const keyHash = this.hash(key);
    this.checkIndex(keyHash);

    return this.buckets[keyHash] != null;
  }

  //Removes key at index
  remove(key) {
    const keyHash = this.hash(key);
    this.checkIndex(keyHash);

    if (this.buckets[keyHash]) {
      //in case of multiple keys at index, remove specified key only
      let currentNode = this.buckets[keyHash].head;
      let index = 0;

      while (currentNode) {
        if (currentNode.key === key) {
          this.buckets[keyHash].removeAt(index);
        }
        if (currentNode.nextNode != null) {
          index++;
          currentNode = currentNode.nextNode;
        } else return true;
      }
      //in case of only one list element, clear bucket entirely
      this.buckets[keyHash] = null;
      this.filledBuckets--;
      return true;
    } else {
      return false;
    }
  }

  //Returns number of buckets
  length() {
    return this.filledBuckets;
  }

  //Clears buckets array
  clear() {
    this.buckets.length = 0;
    this.filledBuckets = 0;
  }

  //Returns all keys in buckets
  keys() {
    let array = [];
    this.iterateBuckets((currentNode) => array.push(currentNode.key));
    return array;
  }

  //Returns all values in buckets
  values() {
    let array = [];
    this.iterateBuckets((currentNode) => array.push(currentNode.value));
    return array;
  }

  //Returns all key/value pairs in buckets
  entries() {
    let array = [];
    this.iterateBuckets((currentNode) =>
      array.push([currentNode.key, currentNode.value])
    );
    return array;
  }

  iterateBuckets(callback) {
    this.buckets.forEach((element) => {
      if (element != null || element != undefined) {
        let currentNode = element.head;
        while (currentNode) {
          callback(currentNode);
          if (currentNode.nextNode != null) currentNode = currentNode.nextNode;
          else return;
        }
      }
    });
  }
}

const test = new Hashmap();

test.set("apple", "red");
test.set("banana", "yellow");
test.set("carrot", "orange");
test.set("dog", "brown");
test.set("elephant", "gray");
test.set("frog", "green");
test.set("grape", "purple");
test.set("hat", "black");
test.set("ice cream", "white");
test.set("jacket", "blue");
test.set("kite", "pink");
test.set("lion", "golden");
