Warning! Unstable version!

# example creating Tree

```javascript
var root = {
    id: "root",
    expanded: true,
    children: [ /* ... */]
};

var tree = new nw.Tree({
    data: root,
    width: '40%',
    height: 450,
    syncCheckbox: true,
    rootVisible: false,
    columns: [{
        xtype: "treecolumn",
        showLine: true,
        hideIcon: true,
        text: "#",
        width: 80,
        renderer: function(value, meta, node) {
            if (node.leaf) {
                return "";
            }

            let colLn = meta.view.getView().props.columns.length;
            meta.attr.colspan = colLn.toString();

            return node.company + " (" + node.children.length + ")";
        }
    }, {
        text: 'First Name',
        minWidth: 100,
        flex: 1,
        dataIndex: "firstName"
    }, {
        text: "Last Name",
        minWidth: 100,
        flex: 1,
        dataIndex: "lastName"
    }, {
        text: "Address",
        minWidth: 100,
        flex: 1,
        dataIndex: "address"
    }]
});

tree.appendChild(document.body);
```
