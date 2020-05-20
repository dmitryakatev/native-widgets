
var data = Array.prototype.concat([], data1, data2, data3);
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
    plugins: [{
        type: "treeFilter"
    }, {
        type: "viewColumns" // пока не доделал
    }, {
        type: "resizeColumns"
    }, {
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

            let colLn = meta.view.getView().props.columns.length;
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

var wrap = document.querySelector('.el-wrap');
var div = document.querySelector('.el-content');

wrap.style.display = "none";
tree.appendChild(div);
wrap.style.display = "block";

// filter
(function () {
    var filter = document.querySelector('.el-filter input');
    var pinRow = document.querySelector('.el-pin-row');
    var timer = null;

    filter.addEventListener('keyup', function (e) {
        if (timer !== null) {
            clearTimeout(timer);
        }

        timer = setTimeout(function () {
            var value = e.target.value;
            var plugin = tree.getPlugin('treeFilter');

            plugin.filter(value, function (data) { return data.address || '' });
        }, 500)
    });

    pinRow.addEventListener('change', function (e) {
        var mode = parseInt(e.target.value);
        var plugin = tree.getPlugin('pinRow');

        plugin.setMode(mode);
    });
})();
