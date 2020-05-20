
var data = data1.filter((d, i) => i < 100);

var grid = new nw.Grid({
    data: data,
    width: '40%',
    height: 450,
    bufferEnable: false,
    syncCheckbox: true,
    rootVisible: false,
    plugins: [{
        type: 'total'
    }, {
        type: 'dragDropGrid'
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

