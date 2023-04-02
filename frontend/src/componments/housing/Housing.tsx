import React, { useState, useEffect } from 'react';
import type { TableProps } from 'antd';
import { Button, Space, Table, Row, Col, Divider, DatePicker } from 'antd';
import type { ColumnsType, FilterValue, SorterResult } from 'antd/es/table/interface';
import { intervalChart } from '../../common';
import { ArrowUpOutlined } from '@ant-design/icons';
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
  bargainType: string;
  houseType: string;
  date: string;
  dateUnix: number;
  square: string;
  quantity: string;
}

interface HouseProps {
  city: string | undefined,
  date: string | undefined,
  houseType: string | undefined,
  pagesize: number,
  bargainType: string | undefined
}

export const Housing: React.FC<HouseProps> = ({ city, date, houseType, pagesize, bargainType }) => {
  console.log('city', city, houseType);
  const [filteredInfo, setFilteredInfo] = useState<Record<string, FilterValue | null>>({});
  const [sortedInfo, setSortedInfo] = useState<SorterResult<DataType>>({});
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [dailyData, setDaily] = useState<DataType[]>([]);
  const [dateList, setDateList] = useState<any[]>([]);
  const [districtList, setDistrictList] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const count = useSelector((state) => state.count.count);
  const dateRange = useSelector((state) => state.dateRange.dateRange);
  const dispatch = useDispatch();


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

  const addCount = () => {
    // dispatch(addCountActionCreator(2));
    dispatch(countSlice.actions.addCount(20));
  }

  const changeDate = (dates: any, dateStrings: [string, string]) => {
    console.log('date', dates[0].startOf('day').unix(), dates[1].endOf('day').unix(), typeof (dates));
    console.log('dateString', dateStrings, typeof (dateStrings));
    dispatch(dateSlice.actions.changeDate({ startDate: dates[0].startOf('day').unix(), endDate: dates[1].endOf('day').unix() }));
  }

  const fetchData = () => {

    let url = `/api/house?houseType=${houseType}&startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`;
    city && (url += `&city=${city}`);
    bargainType && (url += `&bargainType=${bargainType}`);
    const chartData: any[] = [];
    const squareChartData: object[] = [];
    const monthlyQuantity: object[] = [];
    axios.get(url).then(res => {
      res.data.sort((a: any, b: any) => b.dateUnix - a.dateUnix);
      setDataSource(res.data);
      let dateList = Array.from(res.data.reduce((acc: any, cur: any) => {
        acc.add(cur.date);
        return acc;
      }, new Set()));
      dateList = dateList.map((item: any) => ({ text: item, value: item }));
      console.log('dateList', dateList);
      let districtList = Array.from(res.data.reduce((acc: any, cur: any) => {
        acc.add(cur.district);
        return acc;
      }, new Set()));
      districtList = districtList.map((item: any) => ({ text: item, value: item }));
      console.log('districtList', districtList);
      const groupByCity = lodash.groupBy(res.data, (item) => item.city);
      const cities = Object.keys(groupByCity).map((item) => ({ text: item, value: item }));
      console.log('cities', cities);
      const newDaily: any = [];
      cities.forEach((city: any) => {
        const groupedDataByDate = lodash.groupBy(groupByCity[city.value], (item) => item.date);
        console.log('groupedDataByDate', groupedDataByDate);
        const daily = Object.values(groupedDataByDate).map((items) => {
          const groupByDistrict = lodash.groupBy(items, (item) => item.district);
          const districtData = Object.values(groupByDistrict).map((items) => {
            return items.sort((a, b) => a.dateUnix - b.dateUnix).pop();
          }); //[{D1d1}, {D1d2}]
          if (city.value === '杭州' || city.value === '深圳') {
            const total = districtData.reduce((acc, cur) => {
              acc.date = cur.date;
              acc.dateUnix = cur.dateUnix;
              acc.bargainType = cur.bargainType;
              acc.houseType = cur.houseType;
              acc.square = (acc.square || 0) + parseFloat(cur.square);
              acc.quantity = (acc.quantity || 0) + parseInt(cur.quantity);
              return acc;
            }, { city: city.value, district: '全市' });
            total.square = `${total.square.toFixed(2)}m²`;
            total.quantity = `${total.quantity}套`;
            districtData.push(total);
            chartData.push({ date: total.date, sold: parseInt(total.quantity), city: total.city });
            squareChartData.push({ date: total.date, sold: parseFloat(total.square), city: total.city });
          }
          return districtData;
        });
        console.log('daily', daily);
        newDaily.push(...(lodash.flatten(daily)));
        const groupByMonthData = lodash.groupBy(chartData.filter((item) => item.city === city.value), (item) => moment(new Date(item.date)).format('YYYYMM'));
        console.log('groupByMonthData', groupByMonthData);
        const monthlyData = Object.keys(groupByMonthData).map((key) => {
          const monthTotal = groupByMonthData[key].reduce((acc, cur) => {
            console.log(city.value,);
            acc += cur.sold;
            return acc;
          }, 0);
          return { monthTotal, month: key, city: city.value }
        });
        monthlyQuantity.push(...monthlyData);
        // const districtSet = newDaily.reduce((acc, cur) => {
        //   acc.add(cur.district);
        //   return acc;
        // }, new Set());
        // const districtList = Array.from(districtSet).map((item) => ({text: item, value: item}));
      });
      console.log('monthlyQuantity', monthlyQuantity);
      setCities(cities);
      setDaily(newDaily);
      setDistrictList(districtList);
      setDateList(dateList);
      intervalChart(chartData.reverse(), 'hz2squantity', 'date', 'sold', 'city');
      intervalChart(squareChartData.reverse(), 'hz2ssquare', 'date', 'sold', 'city');
      intervalChart(monthlyQuantity.reverse(), 'hz2smonthly', 'month', 'monthTotal', 'city');
    });
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    console.log('.......', dateRange);
    fetchData();
  }, [dateRange]) //count更新时执行

  const columns: ColumnsType<DataType> = [
    {
      title: 'City',
      dataIndex: 'city',
      key: 'city',
      // width: 60,
      // filters: cities,
      // filteredValue: filteredInfo.city || null,
      // onFilter: (value: any, record: DataType) => record.city.includes(value),
      // sorter: (a, b) => a.city.length - b.city.length,
      // sortOrder: sortedInfo.columnKey === 'city' ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: '区域',
      dataIndex: 'district',
      key: 'district',
      // width: 90,
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
      // width: 60,
      sorter: (a, b) => parseInt(a.quantity) - parseInt(b.quantity),
      sortOrder: sortedInfo.columnKey === 'quantity' ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: '面积',
      dataIndex: 'square',
      key: 'square',
      // width: 120,
      sorter: (a, b) => parseFloat(a.square) - parseFloat(a.square),
      sortOrder: sortedInfo.columnKey === 'square' ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      // width: 90,
      filters: dateList,
      filteredValue: filteredInfo.date || null,
      onFilter: (value: any, record: DataType) => record.date.includes(value),
      sorter: (a, b) => a.dateUnix - b.dateUnix,
      sortOrder: sortedInfo.columnKey === 'date' ? sortedInfo.order : null,
      ellipsis: true,
    }
  ];
  console.log('dateRange', dateRange, count);
  const { RangePicker } = DatePicker;
  const dateFormat = 'YYYY/MM/DD';
  return (
    <>
      <Row>
        <Col className="gutter-row" span={24} style={{ padding: 24 }}>
          <Space style={{ marginBottom: 16 }}>
            <Button onClick={setAgeSort}>套数排序</Button>
            <Button onClick={clearFilters}>Clear filters</Button>
            <Button onClick={clearAll}>Clear filters and sorters</Button>
            <Button onClick={addCount}>Add Count</Button>
            <RangePicker
              onChange={changeDate}
              placeholder={['开始时间', '结束时间']}
              defaultValue={[dayjs.unix(dateRange.startDate), dayjs.unix(dateRange.endDate)]}
              format={dateFormat}
              allowClear={false}
            />
          </Space>
          <Table columns={columns} dataSource={dailyData} onChange={handleChange} pagination={{ defaultPageSize: pagesize }} size="small" />
        </Col>
      </Row>
      <Row>
        <Col className="gutter-row" span={24} style={{ padding: 0 }}>
          <div id='hz2squantity' style={{ height: 400 }}></div>
          <Divider plain><ArrowUpOutlined />{city}二手房日交易套数<ArrowUpOutlined /></Divider>
          <div id='hz2ssquare' style={{ height: 400 }}></div>
          <Divider plain><ArrowUpOutlined />{city}二手房日交易面积<ArrowUpOutlined /></Divider>
          <div id='hz2smonthly' style={{ height: 400 }}></div>
          <Divider plain><ArrowUpOutlined />{city}二手房月总数<ArrowUpOutlined /></Divider>
        </Col>
      </Row>
    </>
  );
};
