---
title: Tree Traversal
date: 2022-06-15 13:39:46
layout: post
thumbnail: ../assets/images/networking.jpg
summary: Tree Traversal for pre, in, post order
categories: [Algorithm]
---

# Tree Traversal

선형 자료구조는 데이터를 탐색하는 방법이 하나뿐이다.
반면 트리 구조는 탐색 방법이 여러 가지가 있다.
예를 들어서 binary 트리 구조는 왼쪽을 먼저 검색할지, 오른쪽을 먼저 검색할지에 따라 방문하는 순서가 달라진다.
그렇기 때문에 트리 내의 모든 노드의 값을 출력하는 방법도 여러 가지가 있다.
그 중에서도 대표적인 3가지는 아래와 같다.

-   Preorder(전위 순회)
-   Inorder(중위 순회)
-   Postorder(후위 순회)

트리 탐색은 노드, 왼쪽 서브 트리, 오른쪽 서브 트리를 어떤 순서로 찾을지에 따라 결과가 달라진다.
그 중에서 특히 중요한 것은 노드를 언제 탐색할 것인지다.
위 3가지 방법은 노드를 탐색하는 순서에 따라서 이름이 붙었다.
전위 순회는 노드를 먼저 방문하고 나머지를 탐색한다.
중위 순회는 왼쪽 트리를 탐색하고, 중간에 노드를 거쳐서, 오른쪽 트리를 탐색한다.
후위 순회는 서브 트리를 먼저 탐색하고, 마지막에 노드를 탐색한다.

예를 들어 아래 같은 트리가 있다고 하자.

```
        1
       / \
      2   3
     / \   \
    4   5   6
```

전위 순회는 아래 순서로 작동한다.

1. root 노드를 탐색한다.
2. left subtree를 탐색한다.
3. right subtree를 탐색한다.

그래서 전위 순회로 탐색하면 1 2 4 5 3 6 순서로 탐색한다.

중위 순회는 노드를 중간에 탐색한다.

1. left subtree를 탐색한다.
2. root 노드를 탐색한다.
3. right subtree를 탐색한다.

중위 순회로 탐색하면 4 2 5 1 3 6 순서로 탐색한다.

마지막으로 후위 순회는 노드를 마지막에 탐색한다.

1. left subtree를 탐색한다.
2. right subtree를 탐색한다.
3. root 노드를 탐색한다.

후위 순회는 4 5 2 6 3 1 순서로 노드를 방문한다.

트리 순회의 중요한 점은 이 아이디어를 발전시켜서 DFS에서 활용할 수 있다는 것이다.
다시 말해 일반적인 그래프에서의 탐색을 하는데 도움이 된다.
트리가 어떤 순서로 각 노드를 방문하는지 이해하면, DFS의 방문 순서도 쉽게 상상할 수 있다.

## Recursive way

트리 순회를 구현하는 것은 굉장히 간단하다.
간단한 노드 선언과 재귀 함수를 사용해서 쉽게 만들 수 있다.
우선 아래처럼 노드를 만든다.

```javascript
var TreeNode = function (val, left, right) {
	this.val = val === undefined ? 0 : val;
	this.left = left === undefined ? null : left;
	this.right = right === undefined ? null : right;
};
```

위 노드를 사용해서 그래프를 만들 수 있다.

```javascript
var Graph = function () {
	this.root = null;
};

let graph = new Graph();
graph.root = new TreeNode(1);
graph.root.left = new TreeNode(2);
graph.root.right = new TreeNode(3);
graph.root.left.left = new TreeNode(4);
graph.root.left.right = new TreeNode(5);
graph.root.right.right = new TreeNode(6);
```

이제 여기에 각 순회 방법을 구현해주면 된다.
현재 노드의 값과 왼쪽, 오른쪽 트리를 탐색한 경로를 순서대로 합쳐주면 간단하게 만들 수 있다.

```javascript
preOrder = function (node) {
	if (node === null) {
		return [];
	}

	let left = preOrder(node.left);
	let right = preOrder(node.right);

	return [node.val, ...left, ...right];
};

inOrder = function (node) {
	if (node === null) {
		return [];
	}

	let left = inOrder(node.left);
	let right = inOrder(node.right);

	return [...left, node.val, ...right];
};

postOrder = function (node) {
	if (node === null) {
		return [];
	}

	let left = postOrder(node.left);
	let right = postOrder(node.right);

	return [...left, ...right, node.val];
};

console.log(preOrder(graph.root));
console.log(inOrder(graph.root));
console.log(postOrder(graph.root));
```

세 함수의 차이는 node.val의 위치 뿐이다.
보다시피 전위, 중위, 후위 순회는 탐색 순서의 차이만 있을 뿐, 기본적인 구조는 동일하다.
물론 위 방식으로 구현하면 배열을 복사하고 합치는데 상당한 낭비가 생긴다.
실제로 사용하려면 배열을 하나만 사용해서 아래처럼 고치는 것이 좋다.

```javascript
printPreOrder = function (graph) {
	let path = [];

	preOrder = function (node) {
		if (node === null) {
			return;
		}

		path.push(node.val);

		if (node.left) {
			preOrder(node.left);
		}

		if (node.right) {
			preOrder(node.right);
		}
	};

	preOrder(graph.root);
	console.log(path);
};
```

이제 여기서 path.push(node.val)의 위치에 따라서 순회 방법이 달라진다.

```javascript
printInOrder = function (graph) {
	let path = [];

	inOrder = function (node) {
		if (node === null) {
			return;
		}

		if (node.left) {
			inOrder(node.left);
		}

		path.push(node.val);

		if (node.right) {
			inOrder(node.right);
		}
	};

	inOrder(graph.root);
	console.log(path);
};

printPostOrder = function (graph) {
	let path = [];

	postOrder = function (node) {
		if (node === null) {
			return;
		}

		if (node.left) {
			postOrder(node.left);
		}

		if (node.right) {
			postOrder(node.right);
		}

		path.push(node.val);
	};

	postOrder(graph.root);
	console.log(path);
};
```

보다시피 재귀함수는 그다지 어렵지 않다.
아이디어가 굉장히 직관적이고, 코드 자체도 그 아이디어와 순서가 동일하다.
구현자체가 쉬울 뿐만 아니라 코드 한 줄만 바꿔줘도 다른 방식으로 순회가 가능하다.

### Iterative Way

재귀함수가 구현이 쉬웠던 것에 반해 반복문으로 만드는 것은 조금 더 까다롭다.
재귀함수는 콜스택을 사용해서 함수의 실행 순서를 조절했다.
이를 흉내내기 위해선 스택을 만들어서 노드를 쌓아줘야 한다.
그리고 콜스택이 비면 함수가 종료되듯이, 스택이 비는 순간 함수가 종료되어야 한다.

```javascript
function Iterative(root) {
	let stack = [root];

	while (stack.length > 0) {
		// do something here
	}
}
```

반복문 내에서 어떤 일을 할지 살펴보자.
재귀함수에서는 왼쪽, 오른쪽 노드를 살펴보고 이를 스택에 채워줬다.
이를 그대로 옮겨줄 수 있는데, 스택의 제일 윗 노드를 현재 노드로 사용해서 그 자식 노드를 스택에 추가한다.
이때 현재 노드의 left나 right가 null이면 스택에 추가하지 않는다.

```javascript
function Iterative(root) {
	let stack = [root];
	let curNode;

	while (stack.length > 0) {
		curNode = stack.pop();

		if (curNode.left !== null) {
			stack.push(curNode.left);
		}

		if (curNode.right !== null) {
			stack.push(curNode.right);
		}
	}
}
```

여기서 중요한 것은 스택은 해당 노드를 예약할 뿐이라는 것이다.
스택에 curNode.left를 추가하는 것은 해당 노드를 방문할 순서를 정한 것이다.
다시 말해 스택에 추가한 것은 해당 노드를 방문한 것이 아니다.
노드를 방문하는 것은 해당 노드를 스택에서 꺼낸 순간이다.
그러므로 위에서 curNode에 stack.pop() 값을 전달하는 순간이 노드를 방문하는 순간이다.
현재 노드와 스택에 예약된 노드를 구분하는 것은 굉장히 중요하다.

경로를 기록하는 것은 언제 해야 할까?
탐색 중에 노드를 방문하는 경우는 아래 3가지 경우가 있다.

1. 위에서 내려오며 노드를 방문한다.
2. 왼쪽 트리를 순회한 후 노드를 방문한다.
3. 오른족 트리를 순회한 후 노드를 방문한다.

전위, 중위, 후위 순회에 따라서 기록하는 경우가 다르다.
전위 순회는 1인 경우 기록하고 중위 순회는 2인 경우, 후위 순회는 3인 경우를 각각 기록한다.
여기서부터 코드의 분기점이 생기므로 각 경우를 나눠서 설명하겠다.

#### Preorder Traversal

전위 순회는 가장 간단한데, 노드를 처음 방문하는 순간을 기록하면 되기 때문이다.
그러므로 스택의 값을 꺼내는 순간을 기록하면 된다.

```javascript
function Preorder(root) {
	let stack = [root];
	let curNode;
	let path = [];

	while (stack.length > 0) {
		curNode = stack.pop();
		path.push(curNode.val);

		if (curNode.left !== null) {
			stack.push(curNode.left);
		}

		if (curNode.right !== null) {
			stack.push(curNode.right);
		}
	}
}
```

코드를 보면 재귀함수의 코드와 사실상 동일한 것을 알 수 있다.
하지만 우리는 전위 순회를 만드는 다른 방법을 알아볼 것이다.
왜냐하면 위 방법을 중위, 후위 순회에 그대로 적용할 수 없기 때문이다.
전위 순회는 위에서 내려오는 순간에 기록하므로, left나 right를 같은 단계에서 스택에 추가해줬다.
그런데 위 코드를 중위 순회로 바꾸려고 하면 문제가 생긴다.
left를 탐색하고 돌아오는 순간에 기록해야 하는데, 스택에 쌓인 순서만으로는 left 노드인지 right 노드인지 알 수 없기 때문이다.
굳이 하자면 stack에 데이터를 쌓을 때 어떤 방향으로 만들었는지 추가 정보를 주면 가능하다.
하지만 이 역시 추후에 가지가 많은 경우로 확장하기 어려워 별로 좋은 방법은 아니다.

새 아이디어를 소개하기 전에 기존 아이디어의 단점을 보자.
기존의 아이디어는 오른쪽 노드를 추가하고 왼쪽 노드를 추가했다.
이로 인해 순서를 스택에 저장해서 자연스럽게 해결할 수 있었다.
하지만 문제가 있는데 추가한 오른쪽 노드가 한참 후에 사용된다는 것이다.
다시 말해 스택에 추가하는 순간과 사용되는 순간의 차이가 많이 날 수 있다.
이로 인해 스택이 불필요하게 커질 수 있다.

새로운 아이디어는 왼쪽 노드로 최대한 깊이 탐색하며 내려간다.
이때 분기점이 생기면 해당 노드를 스택에 추가해준다.
그러다가 왼쪽 트리 탐방을 끝내는 순간 오른쪽 트리를 탐색한다.
왜 스택이 분기점을 기록하는지는 나중에 마지막 노드에서의 일을 알아볼 때 자세히 설명하겠다.

왼쪽 노드가 존재하면 계속해서 내려가야 한다.
처음 생각할 수 있는 방법은 "curNode.left !== null"인 경우 계속 스택에 추가하며 내려가는 것이다.
하지만 이 방법으로 하면 굉장히 어려워진다.
left, right로 노드를 구분하면 아래 4가지 종류가 있다.

1. left와 right가 존재하는 경우
2. left만 존재하는 경우
3. right만 존재하는 경우
4. left, right 모두 null인 경우

즉 4가지 경우를 모두 고려해서 코드를 작성해야 하는데, 이는 매우 까다롭다.
뿐만 아니라 경로를 탐색하고 돌아오는 경우도 문제가 된다.
왼쪽 노드를 모두 탐색하면 오른쪽 노드를 탐색해야 한다.
그리고 오른쪽 노드를 모두 탐색하면 상위 노드로 돌아가야 한다.
그런데 이는 left와 right의 null 여부로 알 수 있는 것이 아니다.
예를 들어 현재 노드의 left가 null이고 right가 있다고 하자.
이 노드의 탐색을 끝내고 상위 노드로 돌아갔을 때, 위 정보만으론 이 노드가 왼쪽에 있던 노드인지 오른쪽에 있던 노드인지 알 수가 없다.

이처럼 left, right로 케이스를 나눠서 진행하는 것은 상당히 어렵다.
그러므로 노드를 탐색할 다른 조건이 필요하다.
다른 방법을 소개하기 전에 트리를 제대로 이해해야 한다.
앞서 우리는 트리 그래프를 아래처럼 그렸었다.

```
        1
       / \
      2   3
     / \   \
    4   5   6
```

위 트리에서 마지막 노드의 특징은 무엇인지 질문한다면, 대부분 left와 right가 null인 경우라 생각할 것이다.
이 때문에 노드를 탐색할 때 lefr와 right의 null 여부에 집중하게 된다.
하지만 실제 트리의 모습을 보면 다른 것에 집중해야 함을 알 수 있다.
위 트리를 정확히 모습은 아래와 같다.(n은 null이다.)

```
            1
         /     \
        2        3
     /     \    / \
    4       5  n   6
   / \     / \    / \
  n   n   n   n  n   n
```

여기서 알 수 있는 것은 트리의 마지막 노드는 null이란 것이다.
그러므로 우리가 왼쪽 노드를 계속 탐색할 때, curNode가 null이 될때까지 탐색해야 한다.
이제 이 조건으로 코드를 작성해보자.
앞서 작성한 코드에서 if문 내부만 바꿔줘보았다.

```javascript
function Preorder2(root) {
	let stack = [root];
	let curNode;
	let path = [];

	while (stack.length > 0) {
		if (curNode !== null) {
			stack.push(curNode);
			curNode = curNode.left;
		} else {
			//
		}
	}
}
```

그런데 위처럼 curNode로 진행하려면, curNode가 지정되어 있어야 한다.
그러므로 curNode의 초기값이 root가 되어야 하고, stack이 비어 있어야 한다.
while문의 조건 역시 curNode !== null이 추가되어서 아래처럼 만들어야 한다.

```javascript
function Preorder2(root) {
	let stack = [];
	let curNode = root;
	let path = [];

	while (curNode !== null || stack.length > 0) {
		if (curNode !== null) {
			stack.push(curNode);
			curNode = curNode.left;
		} else {
			//
		}
	}
}
```

else 안에 들어가게 될 코드를 생각해보자.
우선 else 안의 코드는 트리의 마지막 노드인 경우만 다룬다.
이때 현재는 null이므로 위의 노드로 옮겨가야 한다.
하지만 노드의 연결 관계에서 앞의 노드로 이동하는 방법이 없다.
이때 사용하는 것이 스택으로, 스택에 이전의 노드를 기억해두면 그 값으로 앞의 노드로 옮겨갈 수 있다.
"curNode = stack.pop()"을 사용하면 curNode는 상위 노드로 옮겨진다.
이때 왼쪽은 이미 탐색했으므로 오른쪽을 탐색해야 한다.
만약 오른쪽이 있으면 현재 노드를 업데이트 해서 탐색을 해야 하고, 없으면 상위 노드로 올라가야 한다.
여기서 상위 노드로 올라간다는 것은 else문 안의 내용을 다시 실행시켜야 한다는 것이다.
그러므로 curNode = null가 되어야 한다.
즉, curNode.right !== null 이면 curNode = curNode.right가 되어야 하고, curNode.right === null 이면 curNode = null을 해줘야 한다.

```javascript
function Preorder2(root) {
	let stack = [];
	let curNode = root;
	let path = [];

	while (curNode !== null || stack.length > 0) {
		if (curNode !== null) {
			stack.push(curNode);
			curNode = curNode.left;
		} else {
			curNode = stack.pop();
			if (curNode.right !== null) {
				curNode = curNode.right;
			} else {
				curNode = null;
			}
		}
	}
}
```

그런데 else문은 curNode.right === null인 경우에 실행되므로 null 대신에 curNode.right를 적어줘도 된다.

```javascript
function Preorder2(root) {
	let stack = [];
	let curNode = root;
	let path = [];

	while (curNode !== null || stack.length > 0) {
		if (curNode !== null) {
			stack.push(curNode);
			curNode = curNode.left;
		} else {
			curNode = stack.pop();
			if (curNode.right !== null) {
				curNode = curNode.right;
			} else {
				curNode = curNode.right;
			}
		}
	}
}
```

위 코드는 좀 더 간단히 줄여서 아래처럼 만들 수 있다.

```javascript
function Preorder2(root) {
	let stack = [];
	let curNode = root;
	let path = [];

	while (curNode !== null || stack.length > 0) {
		if (curNode !== null) {
			stack.push(curNode);
			curNode = curNode.left;
		} else {
			curNode = stack.pop();
			curNode = curNode.right;
		}
	}
}
```

이제 여기서 경로를 찾는 코드를 추가해야 한다.
처음 노드를 마주치는 순간은 "curNode !== null"인 경우이므로 아래처럼 하면 된다.

```javascript
function Preorder2(root) {
	let stack = [];
	let curNode = root;
	let path = [];

	while (curNode !== null || stack.length > 0) {
		if (curNode !== null) {
			path.push(curNode.val);
			stack.push(curNode);
			curNode = curNode.left;
		} else {
			curNode = stack.pop();
			curNode = curNode.right;
		}
	}

	return path;
}
```

지금까지 한 내용의 핵심은 아래 3가지다.

-   stack으로 노드를 기억한다.
-   curNode로 현재 노드를 기록한다.
-   트리의 마지막은 null이다.

그리고 우리가 작성하는 코드도 3종류가 있다.

1. 왼쪽을 최대한 탐색하는 코드
2. 왼쪽 탐색을 끝내고 오른쪽을 탐색하는 코드
3. 트리의 바닥에 도착하면 스택에 기억한 노드로 돌아가는 코드(상위 노드로 돌아가는 것이 아니라, 탐색하지 않은 오른쪽 노드가 존재하는 노드로 이동하는 것)

이 중에서 2와 3이 운 좋게 겹쳤기 때문에 이를 하나로 만들 수 있었다.

```
    1
    ↓   ↖
    2    ↖
 ↙        ↖
3   →      4
```

#### Inorder Traversal

중위 순회시 트리 전체를 탐색하는 코드는 전위 순회와 동일하므로 코드를 거의 그대로 사용할 수 있다.
유일한 차이점은 경로를 기록하는 시점이 다르다는 것이다.
중위 순회는 왼쪽 노드를 탐색하고 돌아오는 순간에 기록해야 한다.
다시 말해 스택에서 노드를 꺼내는 순간에 기록을 해야 한다.

```javascript
function Inorder(root) {
	let stack = [];
	let curNode = root;
	let path = [];

	while (curNode !== null || stack.length > 0) {
		if (curNode !== null) {
			stack.push(curNode);
			curNode = curNode.left;
		} else {
			curNode = stack.pop();
			path.push(curNode.val);
			curNode = curNode.right;
		}
	}

	return path;
}
```

#### Postorder Traversal

후위 순회는 왼쪽 트리와 오른쪽 트리를 모두 탐색한 후에 노드를 기록해야 한다.
그런데 앞서 사용했던 탐색 코드로는 이것이 불가능하다.
오른쪽 트리를 탐색할 때 부모 노드를 스택에서 꺼내와서 없애버리기 때문이다.
결국 오른쪽 트리를 모두 탐색한 후에는 어디에도 해당 노드의 값을 구할 수가 없다.

앞서 우리는 스택을 분기점을 표시하기 위해 사용한다고 했다.
정확히 표현하면 스택은 2가지 일을 하고 있다.

1. 분기점이 나타나면 해당 노드를 스택에 쌓는다.
2. curNode를 기억하고, 해당 값을 꺼내서 상위 노드로 돌아갈 수 있게 한다.

지금까지는 현재 노드를 기록하는 일과 분기점을 기록하는 일이 일치했고 하나의 스택을 사용했다.
그래서 오른쪽 노드를 탐색하거나, 상위 노드로 돌아갈 때 같은 코드를 사용했다.
하지만 지금은 오른쪽 트리의 탐색시에 루트 노드를 소모하고 있으므로, 탐색이 종료된 후에 루트 노드의 값을 찾을 수 없게 되었다.
그러므로 이 둘의 기능을 나눠서 스택을 2가지 사용해서 표현하겠다.

stack은 기존처럼 현재 노드를 기록하는 용도로 사용한다.
그리고 rightStack은 오른쪽 노드가 있는 분기점을 기록한다.

```javascript
function Postorder(root) {
	let stack = [];
	let rightStack = [];
	let curNode = root;
	let path = [];

	while (curNode !== null || stack.length > 0) {
		if (curNode !== null) {
			if (curNode.right !== null) {
				rightStack.push(curNode.right);
			}
			stack.push(curNode);
			curNode = curNode.left;
		} else {
			//
		}
	}
}
```

위 코드에서 다른 점은 rightStack에 curNode의 right을 저장하고 있다는 것이다.
나중에 오른쪽 노드를 탐색해야 하는 순간이 오면 rightStack의 노드로 탐색하면 된다.
그런데 우리는 right가 null인 경우 rightStack에 추가하지 않는다.
그래서 stack에 기록된 현재 노드의 right가 비어 있을 경우가 있을 수 있다.
그러므로 stack.top().right와 rightStack.top()을 비교해서 같은 경우에만 오른쪽 노드를 탐색해야 한다.
추가로 rightStack이 비어 있는 경우도 고려해줘야 한다.

```javascript
function Postorder(root) {
    ...
	while (curNode !== null || stack.length > 0) {
		if (curNode !== null) {
			if (curNode.right !== null) {
				rightStack.push(curNode.right);
			}
			stack.push(curNode);
			curNode = curNode.left;
		} else {
			curNode = stack[stack.length - 1];
            if (
                rightStack.length > 0 &&
                curNode.right === rightStack[rightStack.length - 1]
            ) {
                curNode = rightStack.pop();
            } else {
                //
            }
		}
	}
}
```

다음으로 stack.top().right과 rightStack.top()이 다른 경우를 살펴보자.
이 경우는 오른쪽 노드가 없으므로 탐색이 완료된 경우다.
그러므로 현재 노드의 값을 기록하고, 해당 노드를 stack에서 제거해야 한다.
위 과정이 끝나면 상위 노드로 돌아가서 다시 판별을 해야 하므로 else문으로 돌아와야 한다.
그래서 curNode = null로 초기화 해준다.

```javascript
function Postorder(root) {
    ...
	while (curNode !== null || stack.length > 0) {
		if (curNode !== null) {
			if (curNode.right !== null) {
				rightStack.push(curNode.right);
			}
			stack.push(curNode);
			curNode = curNode.left;
		} else {
			curNode = stack[stack.length - 1];
            if (
                rightStack.length > 0 &&
                curNode.right === rightStack[rightStack.length - 1]
            ) {
                curNode = rightStack.pop();
            } else {
                path.push(curNode.val);
                stack.pop();
                curNode = null;
            }
		}
	}

    return path;
}
```

## Level-order Traversal
