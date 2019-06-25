var columnDefs = [
    {
        headerName: 'CONDITION',
        field: 'reg1',
        editable: true,
    },
    {
        headerName: 'EDITABLE IF CONDITION > 10',
        field: 'ed1',
        editable: params => params.data.reg1 > 10,
    },
    {
        headerName: 'REGULAR',
        field: 'reg2',
        editable: true,
    },
];

var rowData = [
    { reg1: 10, ed1: 10, reg2: 10 },
    { reg1: 10, ed1: 10, reg2: 10 },
    { reg1: 10, ed1: 10, reg2: 10 },
];

var gridOptions = {
    columnDefs: columnDefs,
    rowData: rowData
};

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);
});