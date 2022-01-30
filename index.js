
const container = document.getElementById('root')
const error = document.getElementById('error');
const root = document.getElementById('root')
const searchWrapper = document.getElementById('searchWrapper');
const sortedWrapper = document.getElementById('sorted')
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
        const node = this.root.search(val);
        if (node) {
            const n = document.getElementById(node.value);
            if (n) n.classList.add('visited');
            setTimeout(() => {
                n.classList.remove('visited')
            }, 3000)
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

    search(val) {
        if (val === this.value) {
            return this;
        } else if (val < this.value && this.left !== null) {
            return this.left.search(val)
        } else if (val > this.value && this.right !== null) {
            return this.right.search(val)
        }
        return null
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
    sortedWrapper.append(node)
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
            node.style.left = x - 100 + 'px';
            node.style.top = y + 50 + 'px';
            line.style.width = x - (x - 62) + 'px';
            line.style.transform = 'rotate(-29deg)';
            line.style.top = '0';
            line.style.left = '44px'

        } else {
            node.style.left = x + 100 + 'px';
            node.style.top = y + 50 + 'px';
            line.style.width = x - (x - 62) + 'px';
            line.style.transform = 'rotate(29deg)';
            line.style.top = '0';
            line.style.right = '44px'
        }
        node.append(innerDiv)
        node.setAttribute('id', value)
    }
    return node;
}


createTree();

function handleAddNode() {
    const rnInt = Math.floor(Math.random() * 30)
    const node = document.getElementById(rnInt);
    if (node) {
        if (error.classList.contains('none')) error.classList.remove('none');
        setTimeout(() => {
            error.classList.add('none')
        }, 3000)
    } else tree.addValue(rnInt)
}




function searchForNode() {
    const val = search.value;
    if (val) {
        tree.find(+val);
        search.value = ""
    }
}


function displaySorted() {
    sortedWrapper.innerHTML = ""
    tree.visitEvery()
}

