---
title: Linked List
date: 2022-06-12 14:59:31
layout: post
thumbnail: ../assets/images/networking.jpg
summary: Linked List
categories: [Algorithm]
---

# Linked List

## Overview

배열은 데이터를 선형으로 저장하는 대표적인 자료구조다.
배열은 메모리 상으로 연속적으로 데이터를 저장한다.
이 때문에 메모리 주소를 일정한 크기만큼 변경해서 값을 쉽게 찾을 수 있다.
하지만 읽기가 쉬운 대신에, 데이터의 유연성이 떨어지는 방법이다.
배열을 확장하려고 하는데 뒤의 메모리가 차있다면, 저장 위치를 통채로 옮겨야 한다.
그리고 사이에 값을 추가하거나 삭제하려면, 해당 위치 뒤를 모두 밀거나 당겨야 한다.
큰 데이터를 저장 할 수록 옮겨야 하는 양이 많아지므로, 데이터 변경에 오랜 시간이 걸린다.
그래서 배열은 가급적이면 선언한 이후에 중간의 데이터를 변경해서는 안 된다.

중간의 값을 자주 변경할 경우 연결 리스트를 사용하는 것이 좋다.
연결 리스트도 배열처럼 데이터를 선형으로 저장한다.
차이점은 저장 위치가 연속적이지 않다는 것이다.
무슨 의미인지 알기 위해 잠시 두 방법의 데이터 저장 방법 차이를 설명하겠다.
배열은 연속적이기 때문에 index만으로도 저장 위치를 찾을 수 있다.
그래서 각 위치는 값만 저장한다.

반면 연결 리스트는 각 위치에 값을 저장하고, 다음 위치를 저장한다.
여기서 값과 위치를 저장하는 단위를 노드라고 한다.
각 노드는 다음 위치를 저장하므로 이를 따라가며 검색할 수 있다.
현실에서 비슷한 예를 찾아보자면 게임북이 있다.
게임북은 A를 고르면 17 페이지로 가고, B를 고르면 29 페이지로 가는 등 선택지를 따라가는 책이다.
해당 페이지에 어떤 내용이 있는지는 모르지만, 내용을 따라가다보면 하나의 스토리가 완성된다.
연결 리스트 역시 노드에 저장된 위치를 따라가다보면 데이터를 모두 검색할 수 있다.

게임북이 첫 페이지부터 시작해서 스토리를 따라갈 수 있는 것처럼, 연결 리스트 역시 1번 노드만 알고 있으면 모든 데이터를 찾을 수 있다.
그래서 연결 리스트는 1번 노드만 기억하면 되는데, 이를 헤드라고 한다.
정리하자면 연결 리스트는 첫 노드인 헤드만 기억한다.
그리고 각 노드는 값과 위치를 저장하는데, 위치를 이어가며 내용을 저장한다.

그런데 이 검색 과정을 보면 알겠지만 전체 과정을 검색하는 것이 상당히 오래 걸린다.
배열은 해당 위치의 값을 곧바로 알 수 있지만, 연결 리스트는 헤더에서 한참을 거슬러가서 찾아야 한다.
이처럼 배열과 연결 리스트는 각기 장점이 다르다.
데이터를 읽는 경우가 많으면 배열을 사용하는 것이 좋고, 중간에 삽입, 삭제를 자주하는 경우 연결 리스트를 사용하는 것이 좋다.

## Singly Linked List

연결 리스트 중 가장 간단한 단일 연결 리스트부터 살펴보자.
단일 연결 리스트는 각 노드가 다음 데이터의 위치를 저장하고 있다.
이때 다음 노드에서 이전의 노드의 위치를 모르기 때문에, 한쪽 방향으로만 검색이 가능하다.
당연하게도 노드를 양방향으로 연결하면 더 쉽겠지만, 일단은 가장 간단한 아이디어를 구현하는 것부터 시작해보자.

### Add & Delete

각 노드는 값과 다음 위치를 저장하고 있어야 한다.
이를 자바스크립트 코드로 나타내면 아래처럼 적을 수 있다.

```javascript
var Node = function (val) {
	this.val = val;
	this.next = null;
};
```

연결 리스트는 헤드의 값을 저장해야 하므로 아래처럼 적어준다.

```javascript
var LinkedList = function () {
	this.head = null;
};
```

이제 여기에 메소드를 추가해주면 되는데, 기본적인 데이터를 추가하고 삭제하는 경우를 알아보자.
새로운 노드를 기존 리스트의 i번째에 추가하려고 한다고 하자.
그러면 i번 노드를 뒤로 미루고 그 사이에 새로운 노드를 끼워 넣어야 한다.
다시 말해 i-1노드의 next에 새로운 노드를 연결하고, 새로운 노드의 next에 기존 노드를 연결해야 한다.
그런데 이때 우리가 알아야 할 것은 i-1노드만 필요하다는 것이다.
왜냐하면 i의 위치는 i-1.next로 알 수 있고, 새 노드를 연결하는 일도 i-1.next의 값을 수정하기만 하면 되기 때문이다.

이를 좀 더 간결하게 설명하기 위해 i-1 노드를 prev, i 노드를 next, 새 노드를 cur라고 하자.
중간에 노드를 추가하려면 아래처럼 하면 된다.

1. prev 노드를 찾는다.
2. cur.next = prev.next
3. prev.next = cur

삭제하는 일은 더 간단하다.

1. prev 노드를 찾는다.
2. prev.next = cur.next를 해주기만 하면 된다.

결론적으로 데이터를 삭제하고 추가하는 일은 노드의 주소를 변경해주는 것만으로 충분하다.
이때 대상 위치보다 하나 앞의 노드가 필요하다.

### Design Sigly Linked List

연결 리스트에 필요한 메소드는 다음과 같다.

1. addAtHead
2. addAtTail
3. addAtIndex
4. deleteAtIndex
5. getAtIndex

여기서 1,2는 3에 포함될 수도 있다.
그렇지만 별도로 만드는 것이 이후에 더 편하므로 나눴다.

먼저 addAtHead를 구현해보자.
addAtHead는 head가 비어 있는 경우와 아닌 경우로 나뉜다.
비어 있을 땐 새 노드가 헤드에 그대로 들어가면 되지만, 아니라면 새 노드의 주소에 기존 헤드의 주소를 적어줘야 한다.

```javascript
LinkedList.prototype.addAtHead = function (val) {
	const newHead = new Node(val);

	if (this.head !== null) {
		newHead.next = this.head;
	}
	this.head = newHead;
};
```

addAtTail은 연결 리스트가 비어 있으면, 새 노드가 헤드가 되어야 한다.
아니라면 마지막 노드까지 검색한 다음 뒤에 노드를 추가해줘야 한다.
검색은 node.next가 null일 때까지 해야 하므로 while을 사용해줬다.

```javascript
LinkedList.prototype.addAtTail = function (val) {
	const newTail = new Node(val);

	if (this.head !== null) {
		let curNode = this.head;

		while (curNode.next !== null) {
			curNode = curNode.next;
		}

		curNode.next = newTail;

		return;
	}

	this.head = newTail;
};
```

addAtIndex는 index와 val을 변수로 받는다.
이때 index가 연결 리스트의 범위를 벗어나면 작동하지 않아야 한다.
여러 경우가 있는데, 우선 연결 리스트가 비어 있을 수 있다.
이 경우 index가 0인 경우에만 헤드에 노드를 추가해줘야 한다.
연결 리스트가 비어 있지 않을 때도 index가 0이면 addAtHead를 실행한다.

그 외의 경우는 index - 1에 있는 노드를 찾아야 한다.
이는 while을 사용해서 간단하게 할 수 있다.
해당 index가 존재한다면 새 노드를 추가해주고, 아니라면 아무런 일도 하지 않는다.

```javascript
LinkedList.prototype.addAtIndex = function (index, val) {
	if (index < 0) {
		return;
	}

	if (index === 0) {
		this.addAtHead(val);
		return;
	}

	if (this.head === null) {
		return;
	}

	let count = 0;
	let curNode = this.head;
	let newNode = new Node(val);

	while (count < index - 1 && curNode.next !== null) {
		++count;
		curNode = curNode.next;
	}

	if (count === index - 1) {
		newNode.next = curNode.next;
		curNode.next = newNode;
	}
};
```

deleteAtIndex는 addAtIndex와 유사한데, 2가지만 다르다.
연결 리스트가 비어 있을 경우 아무것도 하지 않고, index - 1의 next가 존재할 때만 지운다.

```javascript
LinkedList.prototype.deleteAtIndex = function (index) {
	if (index < 0) {
		return;
	}

	if (this.head === null) {
		return;
	}

	if (index === 0) {
		this.head = this.head.next;
		return;
	}

	let count = 0;
	let curNode = this.head;

	while (count < index - 1 && curNode.next !== null) {
		++count;
		curNode = curNode.next;
	}

	if (count === index - 1) {
		if (curNode.next !== null) {
			curNode.next = curNode.next.next;
		}
	}
};
```

마지막으로 getAtIndex인데, 연결 리스트가 비었거나 index이 값이 없는 경우 -1이 반환되도록 만들었다.
그 외에 노드를 따라가며 검색하는 부분을 while로 구현하면 되는데, 이는 앞서 살펴본 것과 유사하다.

```javascript
LinkedList.prototype.getAtIndex = function (index) {
	if (this.head === null || index < 0) {
		return -1;
	}

	let count = 0;
	let curNode = this.head;

	while (count !== index && curNode.next !== null) {
		curNode = curNode.next;
		++count;
	}

	if (count !== index) {
		return -1;
	}

	return curNode.val;
};
```

지금까지 코드를 보면 그다지 깔끔하다곤 할 수 없다.
문제점을 살펴보면 2가지가 있다.

1. index가 연결 리스트 범위를 벗어났는지 일일이 확인해야 한다.
2. 연결 리스트의 끝 부분까지 일일이 찾아야 한다.

위 문제는 연결 리스트가 size와 tail을 사용하면 개선할 수 있다.
다음 절에서는 이를 살펴보겠다.

### Tail & Size

연결 리스트에 size와 tail을 추가하면 코드가 얼마나 간결해지는지 알아보자.
우선은 LinkedList를 아래처럼 수정한다.

```javascript
var LinkedList = function () {
	this.head = null;
	this.tail = null;
	this.size = 0;
};
```

addAtHead는 큰 변화는 없다.
size가 0일 때, tail에 값을 추가한다는 점만 다르다.
그 외에 연결 리스트가 비어 있을 때, size를 사용해서 좀 더 이해하기 편하다.

```javascript
LinkedList.prototype.addAtHead = function (val) {
	const newHead = new Node(val);

	if (this.size !== 0) {
		newHead.next = this.head;
	} else {
		this.tail = newHead;
	}

	this.head = newHead;
	++this.size;
};
```

addAtTail은 큰 변화가 있다.
기존에 연결 리스트의 끝을 찾으려면 헤드에서 검색을 시작했다.
그런데 tail이 추가되어서 끝에 바로 연결할 수 있다.

```javascript
LinkedList.prototype.addAtTail = function (val) {
	const newTail = new Node(val);

	if (this.size !== 0) {
		this.tail.next = newTail;
	} else {
		this.head = newTail;
	}

	this.tail = newTail;
	++this.size;
};
```

addAtIndex는 size가 추가되어서 index가 범위 밖으로 나갔을 경우 바로 취소할 수 있다.
이때 index가 size까지 허용되는데, 마지막 위치에 노드를 추가할 수 있기 때문이다.
특히 index가 size와 같으면 addAtTail로 간단하게 해결할 수 있다.
마지막으로 index가 범위 내에 있을 것이 확실하므로, while과 count를 사용하던 코드에서 for로 바꿔줄 수 있다.

```javascript
LinkedList.prototype.addAtIndex = function (index, val) {
	if (index > this.size || 0 > index) {
		return;
	}

	if (index === 0) {
		this.addAtHead(val);
		return;
	}

	if (index === this.size) {
		this.addAtTail(val);
		return;
	}

	let curNode = this.head;
	let newNode = new Node(val);

	for (let i = 0; i < index - 1; ++i) {
		curNode = curNode.next;
	}

	newNode.next = curNode.next;
	curNode.next = newNode;
	++this.size;
};
```

deleteAtIndex 역시 index를 바로 판별이 가능하고, while과 count를 for로 대체했다.
주의할 것은 tail의 노드가 지워질 때, tail을 업데이트 해줘야 한다.
tail이 지워지면 curNode.next에 null이 들어있을 것이다.
이 경우만 tail을 업데이트 해줬다.

```javascript
LinkedList.prototype.deleteAtIndex = function (index) {
	if (index > this.size - 1 || 0 > index) {
		return;
	}

	if (index === 0) {
		this.head = this.head.next;
		--this.size;
		return;
	}

	let curNode = this.head;

	for (let i = 0; i < index - 1; ++i) {
		curNode = curNode.next;
	}

	curNode.next = curNode.next.next;
	if (curNode.next === null) {
		this.tail = curNode;
	}
	--this.size;
};
```

마지막으로 getAtIndex 역시 size를 사용해서 간결하게 바꿀 수 있다.
index가 범위 밖으로 벗어난 경우와 size가 0인 경우는 실패로 판정해 -1을 반환한다.
그 외에 while과 count로 찾던 것을 for문으로 바꿔줬다.

```javascript
LinkedList.prototype.getAtIndex = function (index) {
	if (index > this.size - 1 || 0 > index || this.size === 0) {
		return -1;
	}

	let curNode = this.head;

	for (let i = 0; i < index; ++i) {
		curNode = curNode.next;
	}

	return curNode.val;
};
```

전체적으로 범위 밖으로 벗어난 경우를 size로 간단하게 해결할 수 있었다.
또한 size가 추가되었으므로 while과 count를 사용해서 노드 위치를 찾지 않아도 된다.
대신에 for문으로 정해진 위치를 찾는다.
tail 역시 addAtTail을 굉장히 간단하게 만들어줬다.
다만 tail의 추가는 장단점이 존재한다.
addAtIndex나 deleteAtIndex는 tail을 변경한 경우 tail을 별도로 바꿔줘야 한다.
이 때문에 추가적인 코드가 필요하고 실수할 가능성이 커진다.

아래는 지금까지 작성한 전체 코드다.

```javascript
var Node = function (val) {
	this.val = val;
	this.next = null;
};

var MyLinkedList = function () {
	this.head = null;
	this.tail = null;
	this.size = 0;
};

LinkedList.prototype.addAtHead = function (val) {
	const newHead = new Node(val);

	if (this.size !== 0) {
		newHead.next = this.head;
	} else {
		this.tail = newHead;
	}

	this.head = newHead;
	++this.size;
};

LinkedList.prototype.addAtTail = function (val) {
	const newTail = new Node(val);

	if (this.size !== 0) {
		this.tail.next = newTail;
	} else {
		this.head = newTail;
	}

	this.tail = newTail;
	++this.size;
};

LinkedList.prototype.addAtIndex = function (index, val) {
	if (index > this.size || 0 > index) {
		return;
	}

	if (index === 0) {
		this.addAtHead(val);
		return;
	}

	if (index === this.size) {
		this.addAtTail(val);
		return;
	}

	let curNode = this.head;
	let newNode = new Node(val);

	for (let i = 0; i < index - 1; ++i) {
		curNode = curNode.next;
	}

	newNode.next = curNode.next;
	curNode.next = newNode;
	++this.size;
};

LinkedList.prototype.deleteAtIndex = function (index) {
	if (index > this.size - 1 || 0 > index) {
		return;
	}

	if (index === 0) {
		this.head = this.head.next;
		--this.size;
		return;
	}

	let curNode = this.head;

	for (let i = 0; i < index - 1; ++i) {
		curNode = curNode.next;
	}

	curNode.next = curNode.next.next;
	if (curNode.next === null) {
		this.tail = curNode;
	}
	--this.size;
};

LinkedList.prototype.getAtIndex = function (index) {
	if (index > this.size - 1 || 0 > index || this.size === 0) {
		return -1;
	}

	let curNode = this.head;

	for (let i = 0; i < index; ++i) {
		curNode = curNode.next;
	}

	return curNode.val;
};
```

## Doubly Linked List

앞서 단일 연결 리스트를 알아봤다.
단일 연결 리스트는 한 방향으로만 연결된다.
그래서 노드를 추가하거나 제거할 때, index의 위치를 찾는 것이 아니라 그 앞의 노드를 찾았다.
각 노드가 양쪽 방향으로 모두 연결된 리스트를 이중 연결 리스트라고 한다.
이중 연결 리스트를 사용하면 index를 탐색하기 좀 더 쉬워진다.
그렇지만 노드를 추가하거나 삭제하면 두 방향을 모두 고려해야 해서 코드가 좀 더 복잡해진다.
그러므로 선형 구조에서는 단일 연결 리스트를 사용하길 권장한다.
하지만 연결 관계가 복잡하다면 이중 연결 리스트가 더 좋다.
예를 들어 데이터를 트리 구조로 저장한다면, 경로를 되돌아오기 위해 양방향으로 연결돼야 한다.

트리 구조와 연결 리스트의 차이는 next가 여러 개일 수 있다는 것이다.
반면 이전 노드로 돌아가는 prev는 1개라서 그다지 다를 것이 없다.
그러므로 앞의 단일 연결 리스트의 노드에 prev를 추가하는 것만 해보겠다.
우선 노드에 prev를 추가한다.

```javascript
var Node = function (val) {
	this.val = val;
	this.prev = null;
	this.next = null;
};
```

addAtHead는 size가 0이 아닐 때, 새 헤드와 기존 헤드를 연결해야 한다.
이때 기존 헤드의 prev가 새 헤드가 되어야 하므로 이를 추가해줬다.

```javascript
LinkedList.prototype.addAtHead = function (val) {
	const newHead = new Node(val);

	if (this.size !== 0) {
		newHead.next = this.head;
		this.head.prev = newHead;
	} else {
		this.tail = newHead;
	}

	this.head = newHead;
	++this.size;
};
```

addAtTail 역시 size가 0이 아니면 연결할 때 prev를 설정해줘야 한다.

```javascript
LinkedList.prototype.addAtTail = function (val) {
	const newTail = new Node(val);

	if (this.size !== 0) {
		newTail.prev = this.tail;
		this.tail.next = newTail;
	} else {
		this.head = newTail;
	}

	this.tail = newTail;
	++this.size;
};
```

addAtIndex에서 기존에는 prev가 없었기 때문에 index보다 한 칸 앞의 노드를 찾아줬었다.
이제는 prev가 존재하므로 index 위치를 찾을 수 있고, 코드를 좀 더 직관적으로 만들 수 있다.

```javascript
LinkedList.prototype.addAtIndex = function (index, val) {
	if (index > this.size || 0 > index) {
		return;
	}

	if (index === 0) {
		this.addAtHead(val);
		return;
	}

	if (index === this.size) {
		this.addAtTail(val);
		return;
	}

	let nextNode = this.head;
	let newNode = new Node(val);

	for (let i = 0; i < index; ++i) {
		nextNode = nextNode.next;
	}

	let prevNode = nextNode.prev;

	newNode.next = nextNode;
	newNode.prev = prevNode;
	nextNode.prev = newNode;
	prevNode.next = newNode;
	++this.size;
};
```

deleteAtIndex 역시 코드가 좀 더 간결해진다.
노드를 지울 때 문제가 되는 부분은 tail을 지울 때다.
addAtIndex는 곧 바로 tail에서 노드를 추가해줬다.
하지만 deleteAtIndex에선 이것이 불가능했는데, prev가 없어서 앞의 노드의 값을 변경할 수 없었기 때문이다.
그래서 tail에 추가하는 경우를 따로 빼지 못하고, for문으로 index - 1을 찾아줘야 했다.
이렇게 되면서 nextNode를 curNode.next.next로 찾아줘야 했는데, 이는 그다지 직관적이지 못한 코드다.
또한 tail을 지우는 경우는 curNode.next.next가 null인 경우라서 이를 따로 처리해줘야만 했다.

prev를 추가하면 바로 지울 노드를 찾아주고, 이 노드를 기준으로 prev와 next를 찾을 수 있다.
특히 tail에서 지울 경우는 "index === this.size - 1"로 쉽게 판별 가능하다.
이 방식으로 정리하면 tail을 따로 처리해주는 if문을 지울 수 있다.
또한 addAtIndex 코드와 비슷한 코드를 만들 수 있으므로, 코드의 일관성이 높아진다.

```javascript
LinkedList.prototype.deleteAtIndex = function (index) {
	if (index > this.size - 1 || 0 > index) {
		return;
	}

	if (index === 0) {
		this.head = this.head.next;
		--this.size;
		return;
	}

	if (index === this.size - 1) {
		this.tail = this.tail.prev;
		this.tail.next = null;
		--this.size;
		return;
	}

	let deletedNode = this.head;

	for (let i = 0; i < index; ++i) {
		deletedNode = deletedNode.next;
	}

	let prevNode = deletedNode.prev;
	let nextNode = deletedNode.next;

	prevNode.next = nextNode;
	nextNode.prev = prevNode;

	--this.size;
};
```

get은 prev를 추가해도 굳이 바꿀 필요는 없다.
약간 더 효율적이게 만든다면, size와 index를 비교해서 head와 tail 중 가까운 곳에서 값을 찾을 수는 있다.
아래는 이중 연결 리스트 코드 전문이다.

```javascript
var Node = function (val) {
	this.val = val;
	this.prev = null;
	this.next = null;
};

var MyLinkedList = function () {
	this.head = null;
	this.tail = null;
	this.size = 0;
};

LinkedList.prototype.getAtIndex = function (index) {
	if (index > this.size - 1 || 0 > index || this.size === 0) {
		return -1;
	}

	let curNode = this.head;

	for (let i = 0; i < index; ++i) {
		curNode = curNode.next;
	}

	return curNode.val;
};

LinkedList.prototype.addAtHead = function (val) {
	const newHead = new Node(val);

	if (this.size !== 0) {
		newHead.next = this.head;
		this.head.prev = newHead;
	} else {
		this.tail = newHead;
	}

	this.head = newHead;
	++this.size;
};

LinkedList.prototype.addAtTail = function (val) {
	const newTail = new Node(val);

	if (this.size !== 0) {
		newTail.prev = this.tail;
		this.tail.next = newTail;
	} else {
		this.head = newTail;
	}

	this.tail = newTail;
	++this.size;
};

LinkedList.prototype.addAtIndex = function (index, val) {
	if (index > this.size || 0 > index) {
		return;
	}

	if (index === 0) {
		this.addAtHead(val);
		return;
	}

	if (index === this.size) {
		this.addAtTail(val);
		return;
	}

	let nextNode = this.head;
	let newNode = new Node(val);

	for (let i = 0; i < index; ++i) {
		nextNode = nextNode.next;
	}

	let prevNode = nextNode.prev;

	newNode.next = nextNode;
	newNode.prev = prevNode;
	nextNode.prev = newNode;
	prevNode.next = newNode;
	++this.size;
};

LinkedList.prototype.deleteAtIndex = function (index) {
	if (index > this.size - 1 || 0 > index) {
		return;
	}

	if (index === 0) {
		this.head = this.head.next;
		--this.size;
		return;
	}

	if (index === this.size - 1) {
		this.tail = this.tail.prev;
		this.tail.next = null;
		--this.size;
		return;
	}

	let deletedNode = this.head;

	for (let i = 0; i < index; ++i) {
		deletedNode = deletedNode.next;
	}

	let prevNode = deletedNode.prev;
	let nextNode = deletedNode.next;

	prevNode.next = nextNode;
	nextNode.prev = prevNode;

	--this.size;
};
```
