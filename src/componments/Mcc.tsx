import React from "react";
import { Button, Input } from 'antd';
import axios from 'axios';

interface Props {

}

interface State {
    totalMerchantCode: string,
    mcc: string,
    bank: string,
    name: string,
    mccStatus: string,
    mccType: string
}

class Mcc extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            totalMerchantCode: '',
            mcc: '',
            name: '',
            bank: '',
            mccStatus: '',
            mccType: ''
        };
    }

    checkMerchantData = (totalMerchantCode: string) : void => {
        const url = `http://192.168.248.185:7001/api/check/merchant_code?totalMerchantCode=${totalMerchantCode}`
        axios.get(url).then(res=>{
          const {totalMerchantCode, name = 'mcc不存在', bank = 'mcc不存在'} = res.data || {};
          this.setState({totalMerchantCode, name, bank});
        })
    }

    checkMccValid = (mcc: string) : void => {
        const url = `http://192.168.248.185:7001/api/check/mcc?mcc=${mcc}`
        axios.get(url).then(res=>{
          const {code: mcc, valid: mccStatus = '无效', type: mccType = 'mcc不存在' } = res.data || {};
          console.log(res.data);
          this.setState({mcc, mccStatus, mccType});
        })
    }

    inputChangedTotalMcc = (e: React.ChangeEvent<HTMLInputElement>) : void => {
        const {value: totalMerchantCode} = e.target;
        this.setState({totalMerchantCode});
    }
    inputChangedMcc = (e: React.ChangeEvent<HTMLInputElement>) : void => {
        const {value: mcc} = e.target;
        this.setState({mcc});
    }


    render(): React.ReactNode {
        const mcc = this.state.mcc;
        const totalMerchantCode = this.state.totalMerchantCode;
        return <div>
            <Input.Group compact>
                <Input style={{ width: 'calc(100% - 200px)' }} onChange={this.inputChangedTotalMcc} placeholder="请输入商户码"/>
                <Button type="primary" onClick={() => this.checkMerchantData(totalMerchantCode)}>Submit</Button>
            </Input.Group>
            <h2>{this.state.name}</h2>
            <p>{this.state.totalMerchantCode}</p>
            <p>{this.state.bank}</p>
            <Input.Group compact>
                <Input style={{ width: 'calc(100% - 200px)' }} onChange={this.inputChangedMcc} placeholder="请输入MCC"/>
                <Button type="primary" onClick={() => this.checkMccValid(mcc)}>Submit</Button>
            </Input.Group>
            <h2>{this.state.mcc}</h2>
            <p>{this.state.mccStatus}</p>
            <p>{this.state.mccType}</p>
        </div>
    }
}

export default Mcc;