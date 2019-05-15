// eslint-disable-next-line no-unused-vars
export function export_json_to_excel({
  multiHeader = [],
  header,
  data,
  filename,
  merges = [],
  autoWidth = true,
  bookType = 'xlsx'
} = {}) {
  /**
   * Created by alex on 17-2-23.
   */
  const Excel = require('exceljs')

  // cell style
  const fills = {
    solid: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFAAAA' }}
  }

  // 创建一个工作簿
  const workbook = new Excel.Workbook()

  // add header
  const ws1 = workbook.addWorksheet('测试一')
  ws1.addRow(['地址', '地面'])
  ws1.addRow(['总人口', '不可计数'])
  ws1.addRow(['类型', '动物', '非动物'])
  ws1.addRow(['统计日期', '1111-11-11 11:11:11'])
  ws1.addRow()

  // A6:E6
  ws1.addRow(['你', '在', '说些', '神马', '呢？'])
  ws1.getCell('A6').fill = fills.solid
  ws1.getCell('B6').fill = fills.solid
  ws1.getCell('C6').fill = fills.solid
  ws1.getCell('D6').fill = fills.solid
  ws1.getCell('E6').fill = fills.solid

  // 7 - 13(A7:A13) - 7
  ws1.addRow(['什么跟神马', 10, 1, '凡人修仙传', 7])
  ws1.addRow(['', '', '', '一号遗迹', 2])
  ws1.addRow(['', '', '', '六号遗迹', 0])
  ws1.addRow(['', '', '', '古国一号', 0])
  ws1.addRow(['', '', '', '锻体期', 0])
  ws1.addRow(['', '', '', '合体期', 0])
  ws1.addRow(['', '', '', '没资质', 1])

  ws1.mergeCells('A7:A13')
  ws1.mergeCells('B7:B13')
  ws1.mergeCells('C7:C13')

  // a6-e13 a b c d e
  // ws1.getCell('A7').alignment = { vertical: 'middle', horizontal: 'center' };

  rowCenter(ws1, 6, 13)
  colWidth(ws1, [1, 2, 3, 4, 5], 20)

  // eslint-disable-next-line no-unused-vars
  const ws2 = workbook.addWorksheet('测试二')

  // eslint-disable-next-line no-unused-vars
  const ws3 = workbook.addWorksheet('测试三')

  // eslint-disable-next-line no-irregular-whitespace
  // 设置　start-end　行单元格水平垂直居中/添加边框
  function rowCenter(arg_ws, arg_start, arg_end) {
    // eslint-disable-next-line no-undef,no-unmodified-loop-condition
    var i = arg_start
    for (; i <= arg_end; i++) {
      arg_ws.findRow(i).alignment = { vertical: 'middle', horizontal: 'center' }
      // eslint-disable-next-line no-irregular-whitespace
      // 循环 row 中的　cell，给每个 cell添加边框
      arg_ws.findRow(i).eachCell(function(cell, index) {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        }
      })
    }
  }

  // eslint-disable-next-line no-irregular-whitespace
  // 设置　start-end 列的宽度
  function colWidth(arg_ws, arg_cols, arg_width) {
    for (const i in arg_cols) {
      arg_ws.getColumn(arg_cols[i]).width = arg_width
    }
  }

  //
  workbook.xlsx.writeFile('test2.xlsx')
    .then(function() {
      console.log('生成 xlsx')
    })

  // /* original data */
  // filename = filename || 'excel-list'
  // data = [...data]
  // data.unshift(header);
  //
  // for (let i = multiHeader.length-1; i > -1; i--) {
  //   data.unshift(multiHeader[i])
  // }
  //
  // var ws_name = 'SheetJS'
  // // eslint-disable-next-line no-undef
  // var wb = new Workbook(),
  //   ws = sheet_from_array_of_arrays(data);
  //
  // if (merges.length > 0) {
  //   if (!ws['!merges']) ws['!merges'] = [];
  //   merges.forEach(item => {
  //     ws['!merges'].push(XLSX.utils.decode_range(item))
  //   })
  // }
  //
  // if (autoWidth) {
  //   /*设置worksheet每列的最大宽度*/
  //   const colWidth = data.map(row => row.map(val => {
  //     /*先判断是否为null/undefined*/
  //     if (val == null) {
  //       return {
  //         'wch': 10
  //       };
  //     }
  //     /*再判断是否为中文*/
  //     else if (val.toString().charCodeAt(0) > 255) {
  //       return {
  //         'wch': val.toString().length * 2
  //       };
  //     } else {
  //       return {
  //         'wch': val.toString().length
  //       };
  //     }
  //   }))
  //   /*以第一行为初始值*/
  //   let result = colWidth[0];
  //   for (let i = 1; i < colWidth.length; i++) {
  //     for (let j = 0; j < colWidth[i].length; j++) {
  //       if (result[j]['wch'] < colWidth[i][j]['wch']) {
  //         result[j]['wch'] = colWidth[i][j]['wch'];
  //       }
  //     }
  //   }
  //   ws['!cols'] = result;
  // }
  //
  // /* add worksheet to workbook */
  // wb.SheetNames.push(ws_name);
  // wb.Sheets[ws_name] = ws;
  //
  // var wbout = XLSX.write(wb, {
  //   bookType: bookType,
  //   bookSST: false,
  //   type: 'binary'
  // });
  // saveAs(new Blob([s2ab(wbout)], {
  //   type: "application/octet-stream"
  // }), `${filename}.${bookType}`);
}

