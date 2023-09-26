// import React, { useState, useEffect } from 'react';
import type { TableProps, TableColumnsType } from 'antd';
import { Button, Space, Table, Row, Col, Divider, DatePicker, Badge, Dropdown, Form, Input, Popconfirm, Modal, Radio, Select } from 'antd';
import type { ColumnsType, FilterValue, SorterResult } from 'antd/es/table/interface';
import axios from 'axios';
import lodash from 'lodash';
import moment from 'moment';
import React, { useContext, useEffect, useRef, useState } from 'react';
import type { InputRef } from 'antd';
import type { FormInstance } from 'antd/es/form';
import { AnyObject } from 'mongoose';

const EditableContext = React.createContext<FormInstance<any> | null>(null);

// interface DataType {
//   _id: string;
//   schoolId: string;
//   monitorType: string;
//   keyWords: [];
//   link: string;
//   addUser: string;
//   updateTime: number;
//   addTime: number;
// }

interface MonitorProps {
    //   city: string | undefined,
    pagesize: number
}

// interface ExpandedDataType {
//   ljId: string;
//   area: string;
//   name: string;
//   dateUnix: number;
//   date: string;
//   district: string;
//   day30See: number;
//   day90Sold: number;
//   sellNum: number;
// }

// const items = [
//   { key: '1', label: 'Action 1' },
//   { key: '2', label: 'Action 2' },
// ];

// export const MonitorManager: React.FC<MonitorProps> = ({ pagesize }) => {
//   const [filteredInfo, setFilteredInfo] = useState<Record<string, FilterValue | null>>({});
//   const [sortedInfo, setSortedInfo] = useState<SorterResult<DataType>>({});
//   const [dataSource, setDataSource] = useState<DataType[]>([]);
//   const [sellInfo, setSellInfo] = useState<any>({});

// //   const expandedRowRender = (record: DataType) => {
// //     const columns: TableColumnsType<ExpandedDataType> = [
// //       { title: '90天卖出', dataIndex: 'day90Sold', key: 'day90Sold' },
// //       { title: '30天带看', dataIndex: 'day30See', key: 'day30See' },
// //       { title: '正在出售', dataIndex: 'sellNum', key: 'sellNum' },
// //       { title: '更新日期', dataIndex: 'date', key: 'date' }
// //     ];
// //     return <Table columns={columns} dataSource={[sellInfo[record.ljId]]} pagination={false} />;
// //   };

//   const handleChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter) => {
//     setFilteredInfo(filters);
//     setSortedInfo(sorter as SorterResult<DataType>);
//   };

//   const fetchData = () => {
//     let url = `/api/monitor`;
//     axios.get(url).then(res => {
//       const {monitors} = res.data || {monitors: []};
//       setDataSource(monitors);
//     });
//   }

//   const fetchSellInfo = (id: string) => {
//     const url = `/api/sold?ljId=${id}`;
//     axios.get(url).then(res => {
//       setSellInfo(res.data);
//     });
//   }


//   useEffect(() => {
//     fetchData();
//   }, []);

//   const columns: ColumnsType<DataType> = [
//     {
//       title: '学校',
//       dataIndex: 'schoolId',
//       key: 'schoolId',
//       ellipsis: true,
//     },
//     {
//       title: '监控类型',
//       dataIndex: 'monitorType',
//       key: 'monitorType',
//       ellipsis: true,
//     },
//     {
//       title: 'keyWords',
//       dataIndex: 'keyWords',
//       key: 'keyWords',
//       ellipsis: true,
//     },
//     {
//       title: 'link',
//       dataIndex: 'link',
//       key: 'link',
//       ellipsis: true,
//     },
//     {
//       title: 'addUser',
//       dataIndex: 'addUser',
//       key: 'addUser',
//       ellipsis: true,
//     },
//     {
//       title: 'udpateTime',
//       dataIndex: 'udpateTime',
//       key: 'udpateTime',
//       ellipsis: true,
//     },
//     {
//       title: 'addTime',
//       dataIndex: 'addTime',
//       key: 'addTime',
//       ellipsis: true,
//     }
//   ];
//   // const { RangePicker } = DatePicker;
//   // const dateFormat = 'YYYY/MM/DD';
//   return (
//     <>
//       <Row>
//         <Col className="gutter-row" span={24} style={{ padding: 24 }}>
//           {/* <Space style={{ marginBottom: 16 }}>
//             <Button onClick={setAgeSort}>套数排序</Button>
//             <Button onClick={clearFilters}>Clear filters</Button>
//             <Button onClick={clearAll}>Clear filters and sorters</Button>
//             <Button onClick={addCount}>Add Count</Button>
//             <RangePicker
//               onChange={changeDate}
//               placeholder={['开始时间','结束时间']}
//               defaultValue={[dayjs.unix(dateRange.startDate), dayjs.unix(dateRange.endDate)]}
//               format={dateFormat}
//               allowClear={false}
//             />
//           </Space> */}
//           <Table
//             columns={columns}
//             dataSource={dataSource}
//             onChange={handleChange}
//             pagination={{ defaultPageSize: pagesize }}
//             size="small"
//             rowKey='schoolId'
//             // expandable={{ expandedRowRender, defaultExpandedRowKeys: ['0'] }}
//           />
//         </Col>
//       </Row>
//       {/* <Row>
//         <Col className="gutter-row" span={24} style={{ padding: 0 }}>
//           <div id='hz2squantity' style={{height: 400}}></div>
//           <Divider plain><ArrowUpOutlined />{city}二手房日交易套数<ArrowUpOutlined /></Divider>
//           <div id='hz2ssquare' style={{height: 400}}></div>
//           <Divider plain><ArrowUpOutlined />{city}二手房日交易面积<ArrowUpOutlined /></Divider>
//           <div id='hz2smonthly' style={{height: 400}}></div>
//           <Divider plain><ArrowUpOutlined />{city}二手房月总数<ArrowUpOutlined /></Divider>
//         </Col>
//       </Row> */}
//     </>
//   );
// };

interface Item {
    key: string;
    name: string;
    age: string;
    address: string;
}

interface EditableRowProps {
    index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

interface EditableCellProps {
    title: React.ReactNode;
    editable: boolean;
    children: React.ReactNode;
    dataIndex: keyof Item;
    record: Item;
    handleSave: (record: Item) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
}) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef<InputRef>(null);
    const form = useContext(EditableContext)!;

    useEffect(() => {
        if (editing) {
            inputRef.current!.focus();
        }
    }, [editing]);

    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({ [dataIndex]: record[dataIndex] });
    };

    const save = async () => {
        try {
            const values = await form.validateFields();

            toggleEdit();
            handleSave({ ...record, ...values });
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };

    let childNode = children;

    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{ margin: 0 }}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `${title} is required.`,
                    },
                ]}
            >
                <Input ref={inputRef} onPressEnter={save} onBlur={save} />
            </Form.Item>
        ) : (
            <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }} onClick={toggleEdit}>
                {children}
            </div>
        );
    }

    return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0];

interface DataType {
    _id: string;
    schoolId: string;
    monitorType: string;
    keyWords: [];
    link: string;
    addUser: string;
    udpateTime: number;
    addTime: number;
}

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

interface Values {
    title: string;
    description: string;
    modifier: string;
}

interface CollectionCreateFormProps {
    open: boolean;
    schools: any;
    keys: any;
    onCreate: (values: Values) => void;
    onCancel: () => void;
}

const CollectionCreateForm: React.FC<CollectionCreateFormProps> = ({
    open,
    schools,
    keys,
    onCreate,
    onCancel,
}) => {
    const [form] = Form.useForm();
    const options = schools.map((s: any) => {
        return {
            value: s._id.toString(),
            label: s.name
        }
    });
    const keyOptions = keys.map((s: any) => {
        return {
            value: s,
            label: s
        }
    });
    const filterOption = (input: string, option?: { label: string; value: string }) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    return (
        <Modal
            open={open}
            title="创建一条新的监控"
            okText="Save"
            cancelText="Cancel"
            onCancel={onCancel}
            onOk={() => {
                form
                    .validateFields()
                    .then((values) => {
                        form.resetFields();
                        console.log('vvv', values)
                        onCreate(values);
                    })
                    .catch((info) => {
                        console.log('Validate Failed:', info);
                    });
            }}
        >
            <Form
                form={form}
                layout="vertical"
                name="form_in_modal"
                initialValues={{ modifier: 'public' }}
            >
                <Form.Item
                    name="schoolId"
                    label="学校"
                    rules={[{ required: true, message: 'Please input the school!' }]}
                >
                    <Select
                        showSearch
                        placeholder="Select a person"
                        optionFilterProp="children"
                        // onChange={onChange}
                        // onSearch={onSearch}
                        filterOption={filterOption}
                        options={options}
                    />
                </Form.Item>
                <Form.Item name="monitorType" label="monitorType">
                    <Select
                        style={{ width: '100%' }}
                        // onChange={handleChange}
                        filterOption={filterOption}
                        options={[
                            {
                                value: 'admision',
                                label: 'admision'
                            },
                            {
                                value: 'open day',
                                label: 'open day'
                            }
                        ]}
                    />
                </Form.Item>
                <Form.Item name="keyWords" label="keyWords">
                    <Select
                        mode="tags"
                        style={{ width: '100%' }}
                        placeholder="Tags Mode"
                        // onChange={handleChange}
                        filterOption={filterOption}
                        options={keyOptions}
                    />
                </Form.Item>
                <Form.Item name="link" label="link">
                    <Input type="textarea" />
                </Form.Item>
                <Form.Item name="label" label="label">
                    <Input type="textarea" />
                </Form.Item>
                {/* <Form.Item name="modifier" className="collection-create-form_last-form-item">
            <Radio.Group>
              <Radio value="public">Public</Radio>
              <Radio value="private">Private</Radio>
            </Radio.Group>
          </Form.Item> */}
            </Form>
        </Modal>
    );
};

export const MonitorManager: React.FC<MonitorProps> = ({ pagesize }) => {
    const [dataSource, setDataSource] = useState<DataType[]>([]);
    const [meta, setMetaData] = useState<any>({});
    const [open, setOpen] = useState(false);
    const [count, setCount] = useState(2);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalText, setModalText] = useState('Content of the modal');

    const handleDelete = (_id: React.Key) => {
        const newData = dataSource.filter((item) => item._id !== _id);
        setDataSource(newData);
        //处理后端数据
    };

    const showModal = () => {
        setOpen(true);
    };

    const handleOk = () => {
        setModalText('The modal will be closed after two seconds');
        setConfirmLoading(true);
        setTimeout(() => {
            setOpen(false);
            setConfirmLoading(false);
        }, 2000);
    };

    const handleCancel = () => {
        console.log('Clicked cancel button');
        setOpen(false);
    };

    const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
        {
            title: 'name',
            dataIndex: 'name',
            editable: false

        },
        {
            title: 'monitorType',
            dataIndex: 'monitorType',
        },
        {
            title: 'label',
            dataIndex: 'label',
        },
        {
            title: 'keyWords',
            dataIndex: 'keyWords',
            render: (_, record) => record.keyWords.join('|')
        },
        {
            title: 'link',
            dataIndex: 'link',
            // render: (_, record: { key: React.Key }) =>
            //   dataSource.length >= 1 ? (
            //     <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
            //       <a>Delete</a>
            //     </Popconfirm>
            //   ) : null,
        },
        {
            title: 'addUser',
            dataIndex: 'addUser',
        },
        {
            title: 'addTime',
            dataIndex: 'addTime',
        },
        {
            title: 'updateTime',
            dataIndex: 'updateTime',
        },
        {
            title: 'getText',
            dataIndex: 'getText',
            render: (_, record) => record.getText.map((r: string) => <p>{r}</p>)
        },
    ];

    useEffect(() => {
        fetchData();
    }, []);

    const handleAdd = (values: AnyObject) => {
        console.log('vvvvvvvvvvvvv', values);
        setOpen(false);
        const params = {action: 'add', data: [values]}
        axios.post('/api/monitor/add', params, {
            headers:{
                 'Content-Type':'application/json'
            },
            params
        })
          .then(function (response) {
            console.log(response);
            fetchData();
          })
          .catch(function (error) {
            console.log(error);
          });

        // axios({
        //     method:"post",
        //     url:"/api/monitor/add",
        //     params: {'a': 1}
        //     }).then(data => {
        //     console.log(data);
        // })

        //   const newData: DataType = {
        //     key: count,
        //     name: `Edward King ${count}`,
        //     age: '32',
        //     address: `London, Park Lane no. ${count}`,
        //   };
        //   setDataSource([...dataSource, newData]);
        //   setCount(count + 1);
    };

    const handleSave = (row: DataType) => {
        //   const newData = [...dataSource];
        //   const index = newData.findIndex((item) => row.key === item.key);
        //   const item = newData[index];
        //   newData.splice(index, 1, {
        //     ...item,
        //     ...row,
        //   });
        //   setDataSource(newData);
    };

    const fetchData = () => {
        let url = `/api/monitor`;
        axios.get(url).then(res => {
            const { monitors, metaData } = res.data || { monitors: [], metaData: {} };
            console.log('metaData', metaData.hongkongMiddleSchool)
            for (const item of monitors) {
                item.name = metaData.hongkongMiddleSchool[item.schoolId] && metaData.hongkongMiddleSchool[item.schoolId]['name'] || metaData.hongkongprimaryschools[item.schoolId] && metaData.hongkongprimaryschools[item.schoolId]['name'] || 'NA';
            }
            setDataSource(monitors);
            setMetaData(metaData);
        });
    }

    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };

    const columns = defaultColumns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: DataType) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave,
            }),
        };
    });

    const onCreate = (values: any) => {
        console.log('Received values of form: ', values);
        setOpen(false);
    };
    console.log('meta', meta);
    const schools = Object.values(meta.hongkongMiddleSchool || {}).concat(Object.values(meta.hongkongprimaryschools || {}))
    const keysSet = new Set();
    const keys = dataSource.forEach((d) => {
        d.keyWords.forEach((k) => {
            keysSet.add(k);
        });
    });
    return (
        <div>
            <Button onClick={showModal} type="primary" style={{ marginBottom: 16 }}>
                Add a row
            </Button>
            <Table
                components={components}
                rowClassName={() => 'editable-row'}
                bordered
                dataSource={dataSource}
                columns={columns as ColumnTypes}
                rowKey='_id'
            />
            {/* <Modal
                title="Add monitor"
                open={open}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
            >
                <p>{modalText}</p>
            </Modal> */}
            <CollectionCreateForm
                open={open}
                keys={Array.from(keysSet)}
                schools={schools}
                onCreate={handleAdd}
                onCancel={() => {
                    setOpen(false);
                }}
            />
        </div>
    );
};
