
const container = document.getElementById('root')
const root = document.getElementById('root')
const searchWrapper = document.getElementById('searchWrapper');
const sortedWrapper = document.getElementById('sorted');


const binaryTree = []
class Tree {
    constructor() {
        this.root = null;
    }

    addValue(val) {
        const n = new Node(val)
        if (this.root === null) {
            this.root = n;
            container.append(createNode(n.value))
        }
        else {
            this.root.addNode(n, (value, parentNode) => container.append(createNode(value, parentNode)))
        }
    }


    visitEvery() {
        this.root.visit()
    }


    find(val) {
        const { node, visited } = this.root.search(val, [this.root.value]);
        if (node) {
            highlightFullPathToNode(visited, val)
        } else {
            console.log('Not a part of the binary tree');
            const span = document.createElement('span');
            span.innerText = 'Not a part of the binary tree!';
            searchWrapper.append(span);
            setTimeout(() => {
                span.remove()
            }, 3000)

        }
    }
}

class Node {
    constructor(value) {
        this.value = value;
        this.right = null;
        this.left = null
    }

    addNode(n, cb) {
        if (n.value < this.value) {
            if (this.left !== null) {
                this.left.addNode(n, cb)
            } else {
                this.left = n;
                cb?.(n.value, this)
            }
        } else if (n.value > this.value) {
            if (this.right !== null) {
                this.right.addNode(n, cb)
            } else {
                this.right = n;
                cb?.(n.value, this)

            }
        }
    }

    search(val, arr = []) {
        if (val === this.value) {
            return { node: this, visited: arr };
        } else if (val < this.value && this.left !== null) {
            arr.push(this.left.value)
            return this.left.search(val, arr)
        } else if (val > this.value && this.right !== null) {
            arr.push(this.right.value)
            return this.right.search(val, arr)
        }
        return { node: null, visited: [] }
    }

    visit() {
        if (this.left !== null) {
            this.left.visit()
        }
        console.log(this.value)
        createSorted(this.value)
        if (this.right !== null) {
            this.right.visit()
        }
    }

}


const tree = new Tree();

function createTree() {
    handleAddNode()
}

function createSorted(value) {
    const node = document.createElement('div');
    node.setAttribute('class', 'sortedNode');
    node.innerText = value;
    sortedWrapper.append(node);

}

function createNode(value, parentNode) {
    const node = document.createElement('div');
    node.setAttribute('class', 'node');

    if (!parentNode) {
        node.classList.add('center');
        node.setAttribute('id', value)
        node.innerText = value;
    } else {
        const { x, y } = document.getElementById(parentNode.value).getBoundingClientRect();
        const innerDiv = document.createElement('div');
        innerDiv.setAttribute('class', 'helper')
        const line = document.createElement('div');
        line.setAttribute('class', 'line')
        innerDiv.innerText = value;
        innerDiv.append(line);
        node.classList.add('animation')
        if (value < parentNode.value) {
            // const overlap = checkOverlap(`${x - 50}px`, `${y + 100}px`, parentNode.value)
            // if (overlap) {
            //     recalculateLeft(parentNode.value, node, { x: x - 50, y: y + 100 }, line)
            // } else {
                node.style.left = x - 50 + 'px';
                node.style.top = y + 100 + 'px';
                line.style.width = 65 + 'px';
                line.style.transform = 'rotate(-64deg)';
                line.style.top = '-27px';
                line.style.left = '17px'
            // }
        } else {
            // const overlap = checkOverlap(`${x + 50}px`, `${y + 100}px`, parentNode.value)
            // if (overlap) {
            //     recalculateLeft(parentNode.value, node, { x: x + 50, y: y + 100 }, line, "+")
            // } else {
                node.style.left = x + 50 + 'px';
                node.style.top = y + 100 + 'px';
                line.style.width = 63 + 'px';
                line.style.transform = 'rotate(63deg)';
                line.style.top = "-26px";
                line.style.right = '17px'
            // }

        }
        node.append(innerDiv)
        node.setAttribute('id', value)
    }
    return node;
}


function checkOverlap(x, y) {
    const nodes = root.querySelectorAll('.node');
    if (nodes?.length) {
        for (let n of Array.from(nodes)) {
            if (n.style.left === x && n.style.top === y) {
                return true;
            }
        }
    }
}



function recalculateLeft(parentId, node, { x, y }, line, operator) {
    const parentNode = document.getElementById(parentId);
    if (parentNode) {
        const currLeft = parentNode.style.left;
        parentNode.style.left = operator === '+' ? currLeft + 100 + 'px' : currLeft - 100 + 'px';
        node.style.left = operator === '+' ? x + 100 + 'px' : x - 100 + 'px';
        line.style.width = (63 * 2) + 'px'
        node.style.top = `${y + 100}px`
    }
}


createTree();

function handleAddNode() {
    // tmp solution for Max call stack size exceed 
    if (binaryTree.length < 20) {
        const rnInt = Math.floor(Math.random() * 20) + 1
        const node = document.getElementById(rnInt);
        if (node) {
            handleAddNode()
        } else {
            binaryTree.push(rnInt)
            tree.addValue(rnInt)
        }
    }
}



let disabled = false;

function searchForNode() {
    if (!disabled) {
        const val = search.value;
        if (val) {
            tree.find(+val);
            search.value = ""
            search.disabled = true;
            disabled = true;
        }
    }
    setTimeout(() => {
        disabled = false;
        search.disabled = false;
    }, 3000)
}


function displaySorted() {
    sortedWrapper.innerHTML = ""
    tree.visitEvery()
    setTimeout(() => {
        sortedWrapper.innerHTML = ''
    }, 10000)
}

function highlightFullPathToNode(visited, val) {
    visited.forEach(v => {
        const n = document.getElementById(v);
        const line = n.querySelector('.line');
        if (n) {
            if (val !== v) {
                n.classList.add('visited');
                if (line) {
                    line.classList.add('visited')
                }
            } else {
                n.classList.add('target');
                if (line) {
                    line.classList.add('target')
                }
            }
        };
    })
    setTimeout(() => {
        visited.forEach(v => {
            const n = document.getElementById(v);
            const line = n.querySelector('.line');
            if (n) {
                if (v !== val) {
                    n.classList.remove('visited')
                    if (line) {
                        line.classList.remove('visited')
                    }
                } else {
                    n.classList.remove('target');
                    if (line) {
                        line.classList.remove('target')
                    }
                }
            };
        })
    }, 3000)
}