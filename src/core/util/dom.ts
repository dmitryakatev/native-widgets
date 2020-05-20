
export function appendChild(parent: Node, node: Node): void {
    parent.appendChild(node);
}

export function insertBefore(node: Node, target: Node): void {
    node.parentNode.insertBefore(target, node);
}

export function insertAfter(node: Node, target: Node): void {
    if (node.nextSibling) {
        insertBefore(node.nextSibling, target);
    } else {
        appendChild(node.parentNode, target);
    }
}

export function removeChild(node: Node): void {
    node.parentNode.removeChild(node);
}
