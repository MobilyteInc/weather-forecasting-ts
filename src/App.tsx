import React, { Component } from 'react';
import Autosuggest from 'react-autosuggest';
import {Select, Table, List, Row, Col } from 'antd';
import moment from 'moment';
import languages from './languages';
import 'antd/dist/antd.css';
import './App.css';
const { Option } = Select;

//Function to get city suggestion
const getSuggestions = value => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;
  return inputLength === 0 ? [] : languages.filter(lang =>{
    if(lang.name.toLowerCase().slice(0, inputLength) === inputValue)
    {return lang.id}
    }
  );
};

class App extends Component {
    public state = { value: '', suggestions: [], ouputdata:[], data:[] };
    public onChange=(value)=>{
       this.findWeather(value)
    }

//Function to find weather according to selected city
  public findWeather = (cityId) => {
    fetch(process.env.REACT_APP_WEATHER_URL+cityId+"&"+"appid="+process.env.REACT_APP_ID)
    .then(res => res.json())
    .then( (result) => {
        var newarray:any = [];
        var list = result.list;
        list.map((item,index)=>{
          let dateNow = item.dt_txt.split(" ");
          if(index === 0){
            newarray[dateNow[0]]= [];
            newarray[dateNow[0]].push(item);
          }else{
            let datePre = list[index-1].dt_txt.split(" ");
              if(dateNow[0] == datePre[0]){
                newarray[dateNow[0]].push(item);
              }else{
                newarray[dateNow[0]]= [];
                newarray[dateNow[0]].push(item);
              }
          }
        })
        this.setState({data:newarray});
          if(this.state.data){
            let dataval = Object.entries(this.state.data)
            this.setState({ouputdata:dataval})
          }else{ const rowVal = 0; }
        },
        (error) => {
          console.log("error",error);
        }
    )
  }

  public render(){
    const { value, suggestions, ouputdata } = this.state;
    const columns = [
      { title: "#", key: "index", render:(_,data,index)=> index },
      { title: "Date", render:(_,item)=>(moment(item.dt_txt).format('YYYY-MM-DD'))},
      { title: "Time", render:(_,item)=>(moment(item.dt_txt).format('hh:mm:ss a'))},
      { title: "Max Temp", render:(item)=>(item.main.temp_max)},
      { title: "Min Temp", render:(item)=>(item.main.temp_min)},
      {title:"weather", render:(item)=> {
        return item.weather.map(data=> <img src={process.env.REACT_APP_URL +data.icon+ ".png"} />)
      }}
    ];
    return (
      <div style={{width: '800px',margin: '0 auto',padding: '15px'}}>
      <Select showSearch style={{ width: 200 }} placeholder="Search City" optionFilterProp="children" onChange={this.onChange}>
      {languages.map(item=>
      <Option key={item.id} value={item.id}>{item.name}</Option>
      )}
      </Select>

      <List header={<div>Header</div>} bordered dataSource={ouputdata}
      renderItem={(item,index) => (
      <List.Item key={index} >
        <Row style={{width:'100%'}}>
          <Col span={24}><h2>{item[0]}</h2></Col>
          <Col span={24}>
            <Table dataSource={item[1]} columns={columns} rowKey={'dt'} pagination={false} style={{width:'100%'}}/>
          </Col>
        </Row>
      </List.Item>
      )}
      />
     </div>
    );
  }
}

export default App;

//END
