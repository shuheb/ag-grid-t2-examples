let translations = {
    'de-DE': {
        autosizeThiscolumn: 'autosize this DE',
        autosizeAllColumns: 'autosize all DE',
        _columnHeaderName_Number: 'Number DE',
        _columnHeaderName_Currency: 'Currency DE',
        _columnHeaderName_Date: 'Date DE'
    },
    'ja-JP': {
        autosizeThiscolumn: 'autosize this JP',
        autosizeAllColumns: 'autosize all JP',
        _columnHeaderName_Number: 'Number JP',
        _columnHeaderName_Currency: 'Currency JP',
        _columnHeaderName_Date: 'Date JP'
    },
};

function translate(key, currLocale, defaultValue) {
    if (translations[currLocale] && translations[currLocale][key]) {
        return translations[currLocale][key];
    }
    return defaultValue;
}

var columnDefs = (reportingCountry) => [
    {
        headerName: translate('_columnHeaderName_Number', reportingCountry, 'Number'),
        field: 'val',
        valueFormatter: getNumberCellFormatter(),
        colId: 'val-number',
    },
    {
        headerName: translate('_columnHeaderName_Currency', reportingCountry, 'Currency'),
        field: 'val',
        valueFormatter: getCurrencyValueFormatter(),
        colId: 'val-currency',
    },
    {
        headerName: translate('_columnHeaderName_Date', reportingCountry, 'Date'),
        field: 'date',
        valueFormatter: dateValueFormatter,
        colId: 'val-date',
    },
];

var rowData = [
    { val: 6443.34, date: '13/12/2019' },
    { val: 354343, date: '12/11/2018' },
    { val: 4243.39, date: '11/10/2017' },
    { val: 14343, date: '10/09/2016' },
    { val: 345343434, date: '09/08/2015' },
    { val: 98324324234322, date: '08/07/2014' },
];

var gridOptions = {
    context: {
        reportingCountry: 'gb-GB',
    },
    columnDefs: columnDefs('gb-GB'),
    rowData: rowData,
    localeTextFunc: (key, currValue) => {
        let currLocale = gridOptions.context.reportingCountry;
        return translate(key, currLocale, currValue);
    },
    deltaColumnMode: true,
};

function getCurrencyValueFormatter() {
    var gbpFormatter = new Intl.NumberFormat('gb-GB', {
        style: 'currency',
        currency: 'GBP',
    });
    var eurFormatter = new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR',
    });
    var usdFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });
    var jpyFormatter = new Intl.NumberFormat('ja-JP', {
        style: 'currency',
        currency: 'JPY',
    });

    return function (params) {
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
    var cellDate = new Date(
        Number(dateParts[2]),
        Number(dateParts[1]) - 1,
        Number(dateParts[0])
    );
    var country = params.context.reportingCountry;
    return cellDate.toLocaleDateString(country);
}

function countryChanged() {
    let reportingCountry = document.getElementById('country').value;
    gridOptions.context = { reportingCountry: reportingCountry };
    gridOptions.api.setColumnDefs(columnDefs(reportingCountry))
    gridOptions.api.refreshCells({ force: true });
}

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);
});