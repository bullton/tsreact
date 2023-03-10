import React, { useState, useEffect } from 'react';
import type { TableProps } from 'antd';
import { Button, Space, Table } from 'antd';
import type { ColumnsType, FilterValue, SorterResult } from 'antd/es/table/interface';
import axios from 'axios';
import lodash from 'lodash';

interface DataType {
  city: string;
  district: string;
  bargainType: string;
  houseType: string;
  date: string;
  dateUnix: number;
  square: string;
  quantity: string;
}

const DataTable: React.FC = () => {
  const [filteredInfo, setFilteredInfo] = useState<Record<string, FilterValue | null>>({});
  const [sortedInfo, setSortedInfo] = useState<SorterResult<DataType>>({});
  const [dataSource, setDataSource] = useState<DataType[]> ([]);
  const [dailyData, setDaily] = useState<DataType[]> ([]);
  const [dateList, setDateList] = useState<any[]> ([]);
  const [districtList, setDistrictList] = useState<any[]> ([]);


  const handleChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter);
    setFilteredInfo(filters);
    setSortedInfo(sorter as SorterResult<DataType>);
  };

  const clearFilters = () => {
    setFilteredInfo({});
  };

  const clearAll = () => {
    setFilteredInfo({});
    setSortedInfo({});
  };

  const setAgeSort = () => {
    setSortedInfo({
      order: 'descend',
      columnKey: 'quantity',
    });
  };
  //items.sort((a, b) => a.dateUnix -b.dateUnix).pop()
  useEffect(() => {
    const url = `/api/house`;
    axios.get(url).then(res=>{
      res.data.sort((a: any, b:any) => b.dateUnix - a.dateUnix);
      setDataSource(res.data);
      const groupedDataByDate = lodash.groupBy(res.data, (item) => item.date);
      const dateList = Object.keys(groupedDataByDate).map((item) => ({text: item, value: item}));
      const daily = Object.values(groupedDataByDate).map((items) => {
        const groupByDistrict = lodash.groupBy(items, (item) => item.district);
        const districtData = Object.values(groupByDistrict).map((items) => {
          return items.sort((a, b) => a.dateUnix -b.dateUnix).pop();
        }); //[{D1d1}, {D1d2}]
        const total = districtData.reduce((acc, cur) => {
          acc.date = cur.date;
          acc.dateUnix = cur.dateUnix;
          acc.bargainType = cur.bargainType;
          acc.houseType = cur.houseType;
          acc.square = (acc.square || 0) + parseFloat(cur.square);
          acc.quantity = (acc.quantity || 0) + parseInt(cur.quantity);
          return acc;
        }, {city: '合计', district: '合计'});
        total.square = `${total.square} m²`;
        total.quantity = `${total.quantity} 套`;
        districtData.push(total);
        return districtData;
      });
      const newDaily = lodash.flatten(daily);
      const districtSet = newDaily.reduce((acc, cur) => {
        acc.add(cur.district);
        return acc;
      }, new Set());
      const districtList = Array.from(districtSet).map((item) => ({text: item, value: item}));
      setDaily(newDaily);
      setDistrictList(districtList);
      setDateList(dateList);
    });
  }, []);

  const columns: ColumnsType<DataType> = [
    {
      title: 'City',
      dataIndex: 'city',
      key: 'city',
      filters: [
        { text: '杭州', value: '杭州' }
      ],
      filteredValue: filteredInfo.city || null,
      onFilter: (value: any, record: DataType) => record.city.includes(value),
      sorter: (a, b) => a.city.length - b.city.length,
      sortOrder: sortedInfo.columnKey === 'city' ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: '区域',
      dataIndex: 'district',
      key: 'district',
      filters: districtList,
      filteredValue: filteredInfo.district || null,
      onFilter: (value: any, record: DataType) => record.district.includes(value),
      sorter: (a, b) => a.district.length - b.district.length,
      sortOrder: sortedInfo.columnKey === 'district' ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: '套数',
      dataIndex: 'quantity',
      key: 'quantity',
      sorter: (a, b) => parseInt(a.quantity) - parseInt(b.quantity),
      sortOrder: sortedInfo.columnKey === 'quantity' ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
        title: '面积',
        dataIndex: 'square',
        key: 'square',
        sorter: (a, b) => parseFloat(a.square) - parseFloat(a.square),
        sortOrder: sortedInfo.columnKey === 'square' ? sortedInfo.order : null,
        ellipsis: true,
    },
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      filters: dateList,
      filteredValue: filteredInfo.date || null,
      onFilter: (value: any, record: DataType) => record.date.includes(value),
      sorter: (a, b) => a.dateUnix - b.dateUnix,
      sortOrder: sortedInfo.columnKey === 'date' ? sortedInfo.order : null,
      ellipsis: true,
    }
  ];

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={setAgeSort}>套数排序</Button>
        <Button onClick={clearFilters}>Clear filters</Button>
        <Button onClick={clearAll}>Clear filters and sorters</Button>
      </Space>
      <Table columns={columns} dataSource={dailyData} onChange={handleChange} pagination={false}/>
    </>
  );
};

export default DataTable;