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
graph.root = new Node(1);
graph.root.left = new Node(2);
graph.root.right = new Node(3);
graph.root.left.left = new Node(4);
graph.root.left.right = new Node(5);
graph.root.right.right = new Node(6);
```

이제 여기에 각 순회 방법을 구현해주면 된다.

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
전위 순회는 1인 경우 기록하고 중위 순회는 2인 경우, 후위 순회는 3인 경우를 각각 기록하다.
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
전위 순회는 위에서 내려오는 순간에 기록하므로, left나 right를 한 단계에 추가해도 괜찮았다.
그런데 위 코드를 중위 순회로 바꾸려고 하면 문제가 생긴다.
left를 탐색하고 돌아오는 순간에 기록해야 하는데, 스택에 쌓인 순서만으로는 left 노드인지 right 노드인지 알 수 없기 때문이다.
굳이 하자면 stack에 데이터를 쌓을 때 어떤 방향으로 만들었는지 추가 정보를 주면 가능하다.
하지만 이 역시 추후에 가지가 많은 경우로 확장하기 어려워 별로 좋은 방법은 아니다.

새 아이디어를 소개하기 전에 기존 아이디어의 단점을 보자.
기존의 아이디어는 오른쪽 노드를 추가하고 왼쪽 노드를 추가했다.
이로 인해 순서를 스택에 저장해서 자연스럽게 해결할 수 있었다.
하지만 문제가 있는데 추가한 오른쪽 노드가 한참 후에 사용된다는 것이다.
다시 말해 스택에 추가하는 순간과 사용되는 순간의 차이가 많이 날 수 있다.
이로 인해 스택이 불필요하게 커지는 경우가 있을 수 있다.

새로운 아이디어는 왼쪽 노드로 최대한 깊이 탐색하며 내려간다.
이때 분기점이 생기면 해당 노드를 스택에 추가해준다.
그러다가 왼쪽 트리 탐방을 끝내는 순간 오른쪽 트리를 탐색한다.
왜 스택이 분기점을 기록하는지는, 나중에 마지막 노드에서의 일을 알아볼 때 자세히 설명하겠다.

왼쪽 노드가 존재하면 계속해서 내려가야 한다.
이는 "curNode.left !== null"인 경우 계속 스택에 추가하며 내려간다는 것이다.
스택에 추가한 다음엔 "curNode = curNode.left"로 현재 노드를 왼쪽 노드로 갱신시켜준다.
그리고 스택에는 갱신된 현재 노드를 기록한다.
아래는 반복문 내부만 고친 것으로 아직 stack이나 curNode의 값을 수정하지 않은 것이다.

```javascript
function Preorder2(root) {
	let stack = [root];
	let curNode;
	let path = [];

	while (stack.length > 0) {
		if (curNode.left !== null) {
			curNode = curNode.left;
			stack.push(curNode);
		}
	}
}
```

위 코드를 처음 실행하는 경우를 생각해보자.
스택의 값을 꺼내서 사용하는 것이 아니므로, 스택에 값이 차있으면 안 된다.
또한 curNode의 값을 사용하고 있으므로, curNode가 지정되어 있어야 한다.
그러므로 stack을 비우고 curNode를 root로 초기값을 정해야 한다.
그리고 이에 맞춰서 while문 내부의 조건을 바꿔준다.

```javascript
function Preorder2(root) {
	let stack = [];
	let curNode = root;
	let path = [];

	while (curNode !== null || stack.length > 0) {
		if (curNode.left !== null) {
			curNode = curNode.left;
			stack.push(curNode);
		}
	}
}
```

right를 탐색하는 코드를 진행하기 전에 노드의 구조를 살펴보자.
노드는 4가지 종류가 있을 수 있다.

1. left와 right가 존재하는 경우
2. left만 존재하는 경우
3. right만 존재하는 경우
4. left, right 모두 null인 경우

여기서 1, 2의 경우는 "curNode.left !== null"이므로 위 코드가 해결해준다.
나머지 3, 4를 다루는 코드를 살펴봐야 하는데, else와 curNode.right의 값으로 아래처럼 작성할 수 있다.

```javascript
function Preorder2(root) {
    ...
	while (curNode !== null || stack.length > 0) {
		if (curNode.left !== null) {
			curNode = curNode.left;
			stack.push(curNode);
		} else {
            if (curNode.right !== null) {
                // this case is 3
            } else {
                // this case is 4
            }
        }
	}
}
```

3의 경우 오른쪽 노드를 탐색해야 하므로 curNode = curNode.right로 업데이트 해줘야 한다.

```javascript
function Preorder2(root) {
    ...
	while (curNode !== null || stack.length > 0) {
		if (curNode.left !== null) {
			curNode = curNode.left;
			stack.push(curNode);
		} else {
            if (curNode.right !== null) {
                curNode = curNode.right;
                stack.push(curNode)
            } else {
                // this case is 4
            }
        }
	}
}
```

4는 노드의 가장 밑 바닥으로 더 이상 이어질 곳이 없으므로, 앞의 노드로 돌아가야 한다.
그런데 각 노드는 윗 노드와 연결되어 있지 않으므로 돌아갈 수 없다.
이때 사용하는 것이 스택으로, 스택에 기록된 앞의 노드를 사용해 현재 노드를 갱신해야 한다.
부모 노드로 돌아갔을 때 2가지 경우가 있다.
자식 노드가 left였던 경우와 right인 경우다.
left인 경우 부모 노드의 right로 탐색해야 하고, right인 경우는 다시 그 부모 노드로 가야 한다.
다시 말해 left인 경우 3이 실행되어야 하고, right는 4가 실행되어야 한다.
문제는 부모 노드의 left가 존재하므로 1이나 2로 빠진다는 것이다.
이를 해결하려면 flag를 하나 만들어서 3, 4쪽으로 빠지도록 만들어주면 된다.

```javascript
function Preorder2(root) {
    ...
    let flag = true;

	while (curNode !== null || stack.length > 0) {
		if (flag && curNode.left !== null) {
			curNode = curNode.left;
			stack.push(curNode);
            flag = true;
		} else {
            if (curNode.right !== null) {
                curNode = curNode.right;
                stack.push(curNode)
                flag = true;
            } else {
                curNode = stack.pop();
                flag = false;
            }
        }
	}
}
```

마지막으로 path에 추가하는 경우를 살펴보자.
각 노드를 처음 만난 순간에 기록해야 한다.
이전에 말했듯이 스택은 예약하는 과정이고, 노드를 방문하는 순간은 스택에서 꺼내는 순간이다.
그러므로 3, 4의 경우만 기록해야 한다.

```javascript
function Preorder2(root) {
    ...
    let path = [];
    let flag = true;

	while (curNode !== null || stack.length > 0) {
		if (curNode.left !== null) {
			stack.push(curNode);
			curNode = curNode.left;
            flag = true;
		} else {
            if (curNode.right !== null) {
                path.push(curNode.val);
                curNode = stack.pop();
                stack.push(curNode.right);
                flag = true;
            } else {
                path.push(curNode.val);
                curNode = stack.pop();
                flag = false;
            }
        }
	}

    return path;
}
```

현재 코드가 굉장히 복잡해졌다.
코드가 복잡해진 원인을 살펴보려면 코드에서 부자연스러운 부분을 살펴봐야 한다.
우선 flag를 사용해서 코드를 진행한 것에서 문제가 있다.
flag를 쓴다는 것 자체가 조건문 안의 내용이 분기점을 제대로 가르지 못한다는 뜻이다.
다시 말해 "curNode.left !== null"이 문제가 되는 부분이다.
결국 "curNode.left !== null" 외에 왼쪽 노드를 다 탐색했는지 확인할 방법이 필요하다.

앞서 우리는 트리 그래프를 아래처럼 그렸었다.

```
        1
       / \
      2   3
     / \   \
    4   5   6
```

사실 위 트리를 정확히 모습은 아래와 같다.(n은 null이다.)

```
            1
         /      \
        2        3
     /     \    / \
    4       5  n   6
   / \     / \    /  \
  n   n   n   n  n    n
```

여기서 알 수 있는 것은 트리의 바닥 노드는 null이란 것이다.
그러므로 "curNode !== null"인 동안 왼쪽을 탐방하도록 하면 된다.
이제 여기에 맞춰 앞의 코드를 수정해보자.
if 안의 조건을 바꾸고 flag를 없앴다.

```javascript
function Preorder3(root) {
	let stack = [];
	let curNode = root;
	let path = [];

	while (curNode !== null || stack.length > 0) {
		if (curNode !== null) {
			stack.push(curNode);
			curNode = curNode.left;
		} else {
			/*
            if (curNode.right !== null) {
                path.push(curNode.val);
                curNode = curNode.right;
                stack.push(curNode)
                flag = true;
            } else {
                path.push(curNode.val);
                curNode = stack.pop();
                flag = false;
            }
            */
		}
	}
}
```

else안의 코드는 이전에 curNode.left !== null에 맞춰진 코드이므로 바꿔줘야 한다.
이전에는 else 안의 내용이 3이거나 4일 수 있었기 때문에 if로 나눠줬다.
하지만 지금은 "curNode === null"인 경우 즉, 4인 경우 뿐이다.
현재 null에 있으므로 윗 노드로 옮겨야 하므로 "curNode = stack.pop()"이 필요하다.
그러면 현재 노드는 null을 제외한 마지막 노드가 된다.
이때 왼쪽은 이미 탐색했으므로 오른쪽을 탐색해야 한다.
만약 오른쪽이 있으면 다시 "curNode !== null"로 탐색을 해야 하고, 없으면 다시 위로 올라가야 한다.
즉, curNode.right !== null 이면 curNode = curNode.right가 되어야 하고, curNode.right === null 이면 curNode = null로 반복문을 실행시켜서 윗 노드로 가야 한다.

```javascript
function Preorder3(root) {
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

위 코드는 좀 더 간단히 줄여서 아래처럼 만들 수 있다.

```javascript
function Preorder3(root) {
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
function Preorder3(root) {
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
