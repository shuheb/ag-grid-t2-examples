var columnDefs = [
    {
        headerName: 'Number',
        field: 'val',
        valueFormatter: getNumberCellFormatter()
    },
    {
        headerName: 'Currency',
        field: 'val',
        valueFormatter: getCurrencyValueFormatter()
    },
    {
        headerName: 'Date',
        field: 'date',
        valueFormatter: dateValueFormatter
    }
];

var rowData = [
    { val: 6443.34, date: '13/12/2019' },
    { val: 354343, date: '12/11/2018' },
    { val: 4243.39, date: '11/10/2017' },
    { val: 14343, date: '10/09/2016' },
    { val: 345343434, date: '09/08/2015' },
    { val: 98324324234322, date: '08/07/2014' }
];

var gridOptions = {
    context: {
        reportingCountry: 'gb-GB'
    },
    columnDefs: columnDefs,
    rowData: rowData,
    localeTextFunc: (key, currValue) => {
        let currLocale = gridOptions.context.reportingCountry;
        if (translations[currLocale] && translations[currLocale][key]) return translations[currLocale][key];
        return currValue;
    }
};

let translations = {
    'de-DE': {
        autosizeThiscolumn: 'autosize this DE',
        autosizeAllColumns: 'autosize all DE'
    },
    'ja-JP': {
        autosizeThiscolumn: 'autosize this JP',
        autosizeAllColumns: 'autosize all JP'
    }
};

function getCurrencyValueFormatter() {
    var gbpFormatter = new Intl.NumberFormat('gb-GB', {
        style: 'currency',
        currency: 'GBP'
    });
    var eurFormatter = new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR'
    });
    var usdFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    });
    var jpyFormatter = new Intl.NumberFormat('ja-JP', {
        style: 'currency',
        currency: 'JPY'
    });

    return function(params) {
        switch (params.context.reportingCountry) {
            case 'de-DE':
                return eurFormatter.format(params.value);
            case 'en-US':
                return usdFormatter.format(params.value);
            case 'gb-GB':
                return gbpFormatter.format(params.value);
            case 'ja-JP':
                return jpyFormatter.format(params.value);
        }
    };
}

function getNumberCellFormatter() {
    var gbpFormatter = new Intl.NumberFormat('gb-GB');
    var eurFormatter = new Intl.NumberFormat('de-DE');
    var usdFormatter = new Intl.NumberFormat('en-US');
    var jpyFormatter = new Intl.NumberFormat('ja-JP');

    return function numberCellRenderer(params) {
        switch (params.context.reportingCountry) {
            case 'de-DE':
                return eurFormatter.format(params.value);
            case 'en-US':
                return usdFormatter.format(params.value);
            case 'gb-GB':
                return gbpFormatter.format(params.value);
            case 'ja-JP':
                return jpyFormatter.format(params.value);
        }
    };
}

function dateValueFormatter(params) {
    var dateAsString = params.value;
    var dateParts = dateAsString.split('/');
    var cellDate = new Date(Number(dateParts[2]), Number(dateParts[1]) - 1, Number(dateParts[0]));
    var country = params.context.reportingCountry;
    return cellDate.toLocaleDateString(country);
}

function countryChanged() {
    var value = document.getElementById('country').value;
    gridOptions.context = { reportingCountry: value };
    gridOptions.api.refreshCells({ force: true });
    gridOptions.api.refreshHeader();
}

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function() {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);
});
