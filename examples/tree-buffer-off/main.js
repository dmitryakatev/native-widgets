
var data = data1.filter(function(d, i) { return i < 100; });
var root = {
    id: "root",
    expanded: true,
    children: [{
        id: 1000000000,
        company: 'Users',
        expanded: true,
        children: []
    }]
};

(function() {
    var companyHash = {};
    var companyList = [];
    var id = 1000000000;

    data.forEach(function(user) {
        var group;

        if (companyHash.hasOwnProperty(user.company)) {
            group = companyHash[user.company];
        } else {
            group = {
                id: ++id,
                company: user.company,
                expanded: true,
                children: []
            };

            companyHash[user.company] = group;
            companyList.push(group);
        }
        
        group.children.push(user);
    });

    root.children[0].children = companyList;
})();


var tree = new nw.Tree({
    data: root,
    width: '40%',
    height: 450,
    syncCheckbox: true,
    rootVisible: false,
    bufferEnable: false,
    plugins: [{
        type: "treeFilter"
    }, /*{
        type: "viewColumns" // пока не доделал
    },*/ {
        type: "pinRow"
    }],
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

            var colLn = meta.view.getView().props.columns.length;
            meta.attr.colspan = colLn.toString();

            return node.company + " (" + node.children.length + ")";
        }
    }, {
        text: 'First Name',
        minWidth: 100,
        flex: 1,
        dataIndex: "firstName",
        settings: {
            access: true,
            allowSetting: true,
            allowAdditional: true,
            allowDraggable: true,
            additional: false,
            hidden: false
        }
    }, {
        text: "Last Name",
        minWidth: 100,
        flex: 1,
        dataIndex: "lastName",
        settings: {
            access: true,
            allowSetting: true,
            allowAdditional: true,
            allowDraggable: true,
            additional: false,
            hidden: false
        }
    }, {
        text: "Address",
        minWidth: 100,
        flex: 1,
        dataIndex: "address",
        settings: {
            access: true,
            allowSetting: true,
            allowAdditional: true,
            allowDraggable: true,
            additional: false,
            hidden: false
        }
    }]
});

tree.getPlugin('pinRow').setMode(2);

var div = document.querySelector('.el-content');
tree.appendChild(div);
