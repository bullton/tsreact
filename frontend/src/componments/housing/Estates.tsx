import React, { useState, useEffect } from 'react';
import type { TableProps, TableColumnsType } from 'antd';
import { Button, Space, Table, Row, Col, Divider, DatePicker, Badge, Dropdown } from 'antd';
import type { ColumnsType, FilterValue, SorterResult } from 'antd/es/table/interface';
import { intervalChart } from '../../common';
import { ArrowUpOutlined, DownOutlined } from '@ant-design/icons';
import axios from 'axios';
import lodash from 'lodash';
import moment from 'moment';
// import store from '../../redux/store';
import { countSlice } from '../../redux/count/slice';
import { useSelector } from '../../redux/hooks';
import { useDispatch } from "react-redux";
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { dateSlice } from '../../redux/date/slice';

interface DataType {
  _id: string;
  city: string;
  district: string;
  name: string;
  buildTime: string;
  buildType: string;
  propertyFee: number;
  propertyCompany: string;
  developer: string;
  totalBuilding: number;
  totalHouse: number;
  ljId: string;
}

interface EstatesProps {
  city: string | undefined,
  pagesize: number
}

interface ExpandedDataType {
  ljId: string;
  area: string;
  name: string;
  dateUnix: number;
  date: string;
  district: string;
  day30See: number;
  day90Sold: number;
  sellNum: number;
}

const items = [
  { key: '1', label: 'Action 1' },
  { key: '2', label: 'Action 2' },
];

export const Estates: React.FC<EstatesProps> = ({ city, pagesize }) => {
  const [filteredInfo, setFilteredInfo] = useState<Record<string, FilterValue | null>>({});
  const [sortedInfo, setSortedInfo] = useState<SorterResult<DataType>>({});
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [sellInfo, setSellInfo] = useState<ExpandedDataType[]>([]);

  const expandedRowRender = () => {
    const columns: TableColumnsType<ExpandedDataType> = [
      { title: '90天卖出', dataIndex: 'day90Sold', key: 'day90Sold' },
      { title: '30天带看', dataIndex: 'day30See', key: 'day30See' },
      { title: '正在出售', dataIndex: 'sellNum', key: 'sellNum' }
    ];
    const data = [Object.assign({}, sellInfo[0])];
    return <Table columns={columns} dataSource={sellInfo} pagination={false} />;
  };

  const handleChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter);
    setFilteredInfo(filters);
    setSortedInfo(sorter as SorterResult<DataType>);
  };

  const handleExpand: TableProps<DataType>['onExpand'] = (expanded, record) => {
    console.log('Various parameters', expanded, record);
    fetchSellInfo(record.ljId);
  };

  const fetchData = () => {
    let url = `/api/estates?`;
    city && (url += `&city=${city}`);
    axios.get(url).then(res => {
      res.data.sort((a: any, b: any) => b.dateUnix - a.dateUnix);
      setDataSource(res.data);
    });
  }

  const fetchSellInfo = (id: string) => {
    const url = `/api/sold?ljId=${id}`;
    axios.get(url).then(res => {
      setSellInfo(res.data);
    });
  }


  useEffect(() => {
    fetchData();
  }, []);

  const columns: ColumnsType<DataType> = [
    {
      title: '城市',
      dataIndex: 'city',
      key: 'city',
      ellipsis: true,
    },
    {
      title: '行政区',
      dataIndex: 'district',
      key: 'district',
      ellipsis: true,
    },
    {
      title: '区域',
      dataIndex: 'area',
      key: 'area',
      ellipsis: true,
    },
    {
      title: '小区名',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: '年代',
      dataIndex: 'buildTime',
      key: 'buildTime',
      ellipsis: true,
    },
    {
      title: '类型',
      dataIndex: 'buildType',
      key: 'buildType',
      ellipsis: true,
    },
    {
      title: '物业费',
      dataIndex: 'propertyFee',
      key: 'propertyFee',
      sorter: (a, b) => a.propertyFee - a.propertyFee,
      sortOrder: sortedInfo.columnKey === 'propertyFee' ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: '物业',
      dataIndex: 'propertyCompany',
      key: 'propertyCompany',
      ellipsis: true,
    },
    {
      title: '开发商',
      dataIndex: 'developer',
      key: 'developer',
      ellipsis: true,
    },
    {
      title: '建筑总数',
      dataIndex: 'totalBuilding',
      key: 'totalBuilding',
      sorter: (a, b) => a.totalBuilding - a.totalBuilding,
      sortOrder: sortedInfo.columnKey === 'totalBuilding' ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: '房屋总数',
      dataIndex: 'totalHouse',
      key: 'totalHouse',
      sorter: (a, b) => a.totalHouse - a.totalHouse,
      sortOrder: sortedInfo.columnKey === 'totalHouse' ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: '链家ID',
      dataIndex: 'ljId',
      key: 'ljId',
      ellipsis: true,
    },
  ];
  // console.log('dateRange', dateRange, count);
  // const { RangePicker } = DatePicker;
  // const dateFormat = 'YYYY/MM/DD';
  return (
    <>
      <Row>
        <Col className="gutter-row" span={24} style={{ padding: 24 }}>
          {/* <Space style={{ marginBottom: 16 }}>
            <Button onClick={setAgeSort}>套数排序</Button>
            <Button onClick={clearFilters}>Clear filters</Button>
            <Button onClick={clearAll}>Clear filters and sorters</Button>
            <Button onClick={addCount}>Add Count</Button>
            <RangePicker
              onChange={changeDate}
              placeholder={['开始时间','结束时间']}
              defaultValue={[dayjs.unix(dateRange.startDate), dayjs.unix(dateRange.endDate)]}
              format={dateFormat}
              allowClear={false}
            />
          </Space> */}
          <Table
            columns={columns}
            dataSource={dataSource}
            onChange={handleChange}
            pagination={{ defaultPageSize: pagesize }}
            size="small"
            rowKey='ljId'
            expandable={{ expandedRowRender, defaultExpandedRowKeys: ['0'] }}
            onExpand={handleExpand}
          />
        </Col>
      </Row>
      {/* <Row>
        <Col className="gutter-row" span={24} style={{ padding: 0 }}>
          <div id='hz2squantity' style={{height: 400}}></div>
          <Divider plain><ArrowUpOutlined />{city}二手房日交易套数<ArrowUpOutlined /></Divider>
          <div id='hz2ssquare' style={{height: 400}}></div>
          <Divider plain><ArrowUpOutlined />{city}二手房日交易面积<ArrowUpOutlined /></Divider>
          <div id='hz2smonthly' style={{height: 400}}></div>
          <Divider plain><ArrowUpOutlined />{city}二手房月总数<ArrowUpOutlined /></Divider>
        </Col>
      </Row> */}
    </>
  );
};
