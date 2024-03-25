import React, { useState, useEffect, useRef } from 'react';
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
import Map from 'react-map-gl';

import 'mapbox-gl/dist/mapbox-gl.css';


//mapboxgl.accessToken = 'pk.eyJ1IjoiYnVsbHRvbiIsImEiOiJjbHUydWJpcDEwdGFhMmlycDNyN3BsdDBkIn0.hGqXzb0_2W1RcV5yEHQymA';



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

export const ShowMap: React.FC<HouseProps> = ({ city, date, houseType, pagesize, bargainType }) => {
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
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(114.173096); //114.173096,22.283547
  const [lat, setLat] = useState(22.283547);
  const [zoom, setZoom] = useState(9);


//   useEffect(() => {
//     if (map.current) return; // initialize map only once
//     map.current = new mapboxgl.Map({
//       container: mapContainer.current,
//       style: 'mapbox://styles/mapbox/streets-v12',
//       center: [lng, lat],
//       zoom: zoom
//     });
//   });


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
  return (
    <Map
      mapboxAccessToken="pk.eyJ1IjoiYnVsbHRvbiIsImEiOiJjbHUydWJpcDEwdGFhMmlycDNyN3BsdDBkIn0.hGqXzb0_2W1RcV5yEHQymA"
      initialViewState={{
        longitude: -122.4,
        latitude: 37.8,
        zoom: 14
      }}
      style={{width: 600, height: 400}}
      mapStyle="mapbox://styles/mapbox/streets-v9"
    />
  );
};
