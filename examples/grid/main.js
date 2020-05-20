var data = Array.prototype.concat([], data1, data2, data3);

var grid = new nw.Grid({
    data: data,
    width: '40%',
    height: 450,
    syncCheckbox: true,
    rootVisible: false,
    plugins: [{
        type: 'total'
    }],
    columns: [{
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
        flex: 2,
        dataIndex: "address"
    }, {
        text: "Company",
        minWidth: 100,
        flex: 2,
        dataIndex: "company",
        totalRenderer: function(list) {
            return "total: " + list.length;
        }
    }]
});

var div = document.querySelector('.el-content');

grid.appendChild(div);

