import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';

/**
 * 导出数据为 Excel 文件
 * @param data 要导出的数据
 * @param filename 文件名（不包含扩展名）
 * @param sheetName 工作表名称
 */
export const exportToExcel = (
  data: any[],
  filename: string = 'report',
  sheetName: string = 'Sheet1'
) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const excelBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

  saveAs(excelBlob, `${filename}.xlsx`);
};

/**
 * 导出数据为 PDF 文件
 * @param data 要导出的数据
 * @param columns 列配置
 * @param filename 文件名（不包含扩展名）
 * @param title 报表标题
 */
export const exportToPDF = (
  data: any[],
  columns: { header: string; dataKey: string }[],
  filename: string = 'report',
  title: string = '报表'
) => {
  const doc = new jsPDF();

  // 添加标题
  doc.setFontSize(16);
  doc.text(title, 14, 15);

  // 添加导出时间
  doc.setFontSize(10);
  doc.text(`导出时间：${new Date().toLocaleString('zh-CN')}`, 14, 22);

  // 添加表格
  const tableData = data.map(row => columns.map(col => row[col.dataKey] || ''));

  autoTable(doc, {
    head: [columns.map(col => col.header)],
    body: tableData,
    startY: 30,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [66, 139, 202],
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    margin: { top: 30 },
  });

  doc.save(`${filename}.pdf`);
};

/**
 * 导出 KPI 数据为 PDF
 * @param kpiData KPI数据对象
 * @param filename 文件名
 * @param title 标题
 */
export const exportKPIToPDF = (
  kpiData: Record<string, any>,
  filename: string = 'kpi-report',
  title: string = 'KPI指标报表'
) => {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text(title, 14, 15);

  doc.setFontSize(10);
  doc.text(`导出时间：${new Date().toLocaleString('zh-CN')}`, 14, 22);

  let yPos = 35;
  doc.setFontSize(12);

  Object.entries(kpiData).forEach(([key, value]) => {
    doc.text(`${key}: ${value}`, 14, yPos);
    yPos += 8;
  });

  doc.save(`${filename}.pdf`);
};

/**
 * 导出图表数据为 Excel
 * @param chartData 图表数据
 * @param filename 文件名
 */
export const exportChartToExcel = (
  chartData: any[],
  filename: string = 'chart-data'
) => {
  // 将图表数据转换为二维数组格式
  const wsData = chartData.map(item => Object.values(item));
  const headers = Object.keys(chartData[0] || {});

  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...wsData]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, '图表数据');

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const excelBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

  saveAs(excelBlob, `${filename}.xlsx`);
};

/**
 * 导出多工作表 Excel
 * @param sheets 工作表数据 { sheetName: data[] }
 * @param filename 文件名
 */
export const exportMultiSheetExcel = (
  sheets: Record<string, any[]>,
  filename: string = 'multi-sheet-report'
) => {
  const workbook = XLSX.utils.book_new();

  Object.entries(sheets).forEach(([sheetName, data]) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  });

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const excelBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

  saveAs(excelBlob, `${filename}.xlsx`);
};

/**
 * 按时间范围筛选数据
 * @param data 原始数据
 * @param dateField 日期字段名
 * @param startDate 开始日期
 * @param endDate 结束日期
 */
export const filterDataByDateRange = (
  data: any[],
  dateField: string,
  startDate: string,
  endDate: string
) => {
  return data.filter(item => {
    const itemDate = new Date(item[dateField]);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return itemDate >= start && itemDate <= end;
  });
};

/**
 * 按维度筛选数据
 * @param data 原始数据
 * @param filterField 筛选字段名
 * @param filterValue 筛选值
 */
export const filterDataByDimension = (
  data: any[],
  filterField: string,
  filterValue: string
) => {
  if (!filterValue) return data;
  return data.filter(item => item[filterField] === filterValue);
};
