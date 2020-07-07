require('core-js/modules/es.promise');
require('core-js/modules/es.string.includes');
require('core-js/modules/es.object.assign');
require('core-js/modules/es.object.keys');
require('core-js/modules/es.symbol');
require('core-js/modules/es.symbol.async-iterator');
require('regenerator-runtime/runtime');
const ExcelJS = require('exceljs/dist/es5');
const fs = require('fs');

const formatDate = function (s){
    var dateObj = s ? new Date(s) : new Date();
	var formatObj = {
		y: dateObj.getFullYear(),
		m: (dateObj.getMonth() + 1).toString().padStart(2, '0'),
		d: dateObj.getDate().toString().padStart(2, '0'),
		h: dateObj.getHours().toString().padStart(2, '0'),
		i: dateObj.getMinutes().toString().padStart(2, '0'),
		s: dateObj.getSeconds().toString().padStart(2, '0'),
		w: dateObj.getDay()
	}

	return formatObj;
}

console.log('excel export start!');
let stream = fs.createReadStream("./usergamerecords.json", { encoding: 'utf8' });
let _curIndex = 1;//行号

let _now = Date.now();
let _formatDate = formatDate();
let _time = `${_formatDate.y}-${_formatDate.m}-${_formatDate.d}&&${_formatDate.h}-${_formatDate.i}-${_formatDate.s}`;
let _outFileName = `./${_time}.xlsx`;


const options = {
    filename: _outFileName,
    useStyles: false,
    useSharedStrings: false
};
const workbook = new ExcelJS.stream.xlsx.WorkbookWriter(options);
const sheet = workbook.addWorksheet(_now);
sheet.columns = [
    { header: '序号', key: 'index', width: 10 },
    { header: '玩家ID', key: 'uid', width: 10 },
    { header: 'nickname', key: 'nickname', width: 10 },
    { header: 'roomLevel', key: 'roomLevel', width: 10 },
    { header: 'consumeGold', key: 'consumeGold', width: 10 },
    { header: 'getGold', key: 'getGold', width: 10 },
    { header: 'curGold', key: 'curGold', width: 10 },
    { header: 'createTime', key: 'createTime', width: 10 }
];

let remain = "";
stream.on('data', async function (item) {
    stream.pause();//暂停
    item = remain + item;
    let _dataArr = item.split("\n");
    let _length = _dataArr[0].length;
    let _last = _dataArr[_dataArr.length - 1];
    if (_length !== _last.length) {
        remain = _last;
        _dataArr.pop();
    }
    //写入 xlsx
    formatData(_dataArr, sheet);

    await sleep(0);
    stream.resume();//恢复
});
stream.on('end', function () {
    workbook.commit();
});
stream.on('close', function () {
    console.log('excel export complete!');
});



const sleep = function (time) {
    return new Promise(function (resolve, reject) {
        setTimeout(() => {
            resolve();
        }, time);
    });
}

const formatData = function (data, sheet) {
    let _object = sheet.columns;
    for (let i = 0; i < data.length; i++) {
        let _row = {};
        let _item = data[i];
        _item = JSON.parse(_item);

        for (let k = 0; k < _object.length; k++) {
            const element = _object[k].key;
            if (element === "index") {
                _row[element] = _curIndex;
                continue;
            }
            if (element === "startTime" || element === "createTime") {
                _row[element] = new Date( _item[element]).toLocaleString();
                continue;
            }
            _row[element] = _item[element];
        }
        _curIndex += 1;
        sheet.addRow(_row).commit();
    }
    return;
}

