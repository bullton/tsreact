import React, { useState, useEffect, useRef } from 'react';
import type { TableProps, TableColumnsType, InputRef, TableColumnType } from 'antd';
import { Button, Space, Table, Row, Col, Divider, DatePicker, Badge, Dropdown, Input } from 'antd';
import type { ColumnsType, FilterValue, SorterResult, FilterDropdownProps } from 'antd/es/table/interface';
import axios from 'axios';
import lodash from 'lodash';
import moment from 'moment';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';

type DataIndex = keyof DataType;

interface DataType {
  _id: string;
  schoolId: string;
  cname: string;
  cdist: string;
  gendChi: string;
  schoolTypeChi: string;
  band: string;
  rankUpper: number;
  rankLower: number;
  religionChi: string;
  pcJSDeg: string;
  pcDeg: string;
  pcDegMin: string;
  pcSubdeg: string;
}

interface SchoolsProps {
  pagesize: number
}

interface ExpandedDataType {
  pcJSDeg: string;
  pcDeg: string;
  pcDegMin: string;
  pcSubdeg: string;
}

const items = [
  { key: '1', label: 'Action 1' },
  { key: '2', label: 'Action 2' },
];

export const Schools: React.FC<SchoolsProps> = ({ pagesize }) => {
  const [filteredInfo, setFilteredInfo] = useState<Record<string, FilterValue | null>>({});
  const [sortedInfo, setSortedInfo] = useState<SorterResult<DataType>>({});
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [districtList, setDistrictList] = useState<any[]>([]);
  const [typeList, setTypeList] = useState<any[]>([]);
  const [religionList, setReligionList] = useState<any[]>([]);
  const [gendList, setGendList] = useState<any[]>([]);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);

  const bandList = ['1', '1A', '1B', '1C', '2', '2A', '2B', '2C', '3', '3A', '3B', '3C', 'NA'].map((item: any) => ({ text: item, value: item }));
  const nameList = ['男'].map((item: any) => ({ text: item, value: item }));

  const expandedRowRender = (record: DataType) => {
    const columns: TableColumnsType<ExpandedDataType> = [
      { title: '联招率', dataIndex: 'pcJSDeg', key: 'pcJSDeg' },
      { title: '学位率', dataIndex: 'pcDeg', key: 'pcDeg' },
      { title: '学位上线', dataIndex: 'pcDegMin', key: 'pcDegMin' },
      { title: '副学位', dataIndex: 'pcSubdeg', key: 'pcSubdeg' }
    ];
    return <Table columns={columns} dataSource={[record]} pagination={false} />;
  };

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps['confirm'],
    dataIndex: DataIndex,
  ) => {
    confirm();
    console.log('selectedKeys', selectedKeys);
    console.log('dataIndex', dataIndex);
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  const handleChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter) => {
    console.log('filterrrrrrrrrs', filters, filteredInfo);
    setFilteredInfo(filters);
    setSortedInfo(sorter as SorterResult<DataType>);
  };

  const clearFilters2 = () => {
    setFilteredInfo({});
  };

  const clearAll = () => {
    setFilteredInfo({});
    setSortedInfo({});
  };

  const fetchData = () => {
    let url = `/api/school`;
    axios.get(url).then(res => {
      const { schoolData } = res.data || { schoolData: [] };
      schoolData.sort((a: any, b: any) => a.schoolId - b.schoolId);
      const distSet = new Set();
      const typeSet = new Set();
      const religionSet = new Set();
      const gendSet = new Set();
      for (const item of schoolData) {
        distSet.add(item.cdist);
        typeSet.add(item.schoolTypeChi);
        religionSet.add(item.religionChi)
        gendSet.add(item.gendChi);
      }
      const districtList = (Array.from(distSet)).map((item: any) => ({ text: item, value: item }));
      const typeList = (Array.from(typeSet)).map((item: any) => ({ text: item, value: item }));
      const religionList = (Array.from(religionSet)).map((item: any) => ({ text: item, value: item }));
      const gendList = (Array.from(gendSet)).map((item: any) => ({ text: item, value: item }));
      setDataSource(schoolData);
      setDistrictList(districtList);
      setTypeList(typeList);
      setReligionList(religionList);
      setGendList(gendList);
    });
  }


  useEffect(() => {
    fetchData();
  }, []);



  

  const getColumnSearchProps = (dataIndex: DataIndex, isDropDownList: Boolean): TableColumnType<DataType> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => {
            console.log('press enter');
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => {
              console.log('press search');
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value: any, record: DataType) => {
      console.log('22222222222222', value, dataIndex);
      return record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase())
    },
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });


  const columns: TableColumnsType<DataType> = [
    {
      title: 'ID',
      dataIndex: 'schoolId',
      key: 'schoolId',
      width: '5%',
      ellipsis: true,
    },
    {
      title: '校名',
      dataIndex: 'cname',
      key: 'cname',
      ellipsis: true,
      width: '25%',
      filters: nameList,
      filteredValue: filteredInfo.cname,
      ...getColumnSearchProps('cname', true),
      // onFilter: (value: any, record: DataType) => record.cname.includes(value.toLowerCase()),
    },
    {
      title: '区域',
      dataIndex: 'cdist',
      key: 'cdist',
      filters: districtList,
      filteredValue: filteredInfo.cdist,
      onFilter: (value: any, record: DataType) => record.cdist.includes(value),
      sorter: (a, b) => a.cdist.localeCompare(b.cdist, 'zh-Hans-CN', { sensitivity: 'accent' }),
      sortOrder: sortedInfo.columnKey === 'cdist' ? sortedInfo.order : null,
      ellipsis: true,
      width: '9%',
    },
    {
      title: '男女',
      dataIndex: 'gendChi',
      key: 'gendChi',
      filters: gendList,
      filteredValue: filteredInfo.gendChi,
      onFilter: (value: any, record: DataType) => record.gendChi == value,
      ellipsis: true,
      width: '7%',
    },
    {
      title: '学校类型',
      dataIndex: 'schoolTypeChi',
      key: 'schoolTypeChi',
      filters: typeList,
      filteredValue: filteredInfo.schoolTypeChi,
      onFilter: (value: any, record: DataType) => record.schoolTypeChi.includes(value),
      ellipsis: true,
      width: '8%',
    },
    {
      title: 'BAND',
      dataIndex: 'band',
      key: 'band',
      filters: bandList,
      filteredValue: filteredInfo.band,
      onFilter: (value: any, record: DataType) => (record.band || 'NA').includes(value),
      sorter: (a, b) => (a.band || '').localeCompare(b.band || ''),
      sortOrder: sortedInfo.columnKey === 'band' ? sortedInfo.order : null,
      ellipsis: true,
      width: '8%',
    },
    {
      title: '排名上',
      dataIndex: 'rankUpper',
      key: 'rankUpper',
      sorter: (a, b) => Number(a.rankUpper) - Number(b.rankUpper),
      sortOrder: sortedInfo.columnKey === 'rankUpper' ? sortedInfo.order : null,
      ellipsis: true,
      width: '8%',
    },
    {
      title: '排名下',
      dataIndex: 'rankLower',
      key: 'rankLower',
      sorter: (a, b) => Number(a.rankLower) - Number(b.rankLower),
      sortOrder: sortedInfo.columnKey === 'rankLower' ? sortedInfo.order : null,
      ellipsis: true,
      width: '8%',
    },
    {
      title: '宗教',
      dataIndex: 'religionChi',
      key: 'religionChi',
      filters: religionList,
      filteredValue: filteredInfo.religionChi,
      // ...getColumnSearchProps('religionChi', true),
      onFilter: (value: any, record: DataType) => record.religionChi.includes(value),
      ellipsis: true,
      width: '15%',
    }
  ];


  // const { RangePicker } = DatePicker;
  // const dateFormat = 'YYYY/MM/DD';
  return (
    <>
      <Row>
        <Col className="gutter-row" span={24} style={{ padding: 24 }}>
          <Space style={{ marginBottom: 16 }}>
            <Button onClick={clearFilters2}>Clear filters</Button>
            <Button onClick={clearAll}>Clear filters and sorters</Button>
          </Space>
          <Table
            columns={columns}
            dataSource={dataSource}
            onChange={handleChange}
            pagination={{ defaultPageSize: pagesize }}
            size="small"
            rowKey='schoolId'
            expandable={{ expandedRowRender, defaultExpandedRowKeys: ['0'] }}
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
