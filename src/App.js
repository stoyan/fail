import React, { Component } from 'react';
import './App.css';

class App extends Component {
  
  constructor() {
    super();
    this.state = {
      files: [],
      data: [], // data about them files, after processing
    };
    document.documentElement.ondragenter = e => e.preventDefault();
    document.documentElement.ondragover = e => e.preventDefault();
    document.documentElement.ondrop = e => {
      e.preventDefault();
      this.update(e.dataTransfer.files);
    }
  }
  
  handleUploads(e) {
    this.update(e.target.files);
  }
  
  update(moreFiles) {
    const newFiles = Array.from(moreFiles);
    if (!newFiles) {
      return;
    }
    const files = this.state.files.concat(newFiles);
    this.setState({files});
    this.process(files);
  }
  
  process(files) {
    const data = this.state.data.slice();
    files.forEach((f, idx) => {
      if (!data[idx]) {
        const i = new Image();
        i.onload = () => {
          data[idx] = i.naturalWidth + 'x' + i.naturalHeight;
          this.setState({data});
        };
        i.src = window.URL.createObjectURL(f);
      }
    });
  }
  
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h1>Upload me some images</h1>
          <p>pst, you can just drop them anywhere</p>
        </div>
        <div className="Tool-in">
          <Uploads onChange={this.handleUploads.bind(this)} />
        </div>
        <div className="Tool-out">
          <Results files={this.state.files} data={this.state.data} />
        </div>
      </div>
    );
  }
}

const Uploads = ({onChange}) =>
  <div>
    <label htmlFor="files" className="Uploads-select">Select files...</label>
    <input 
      type="file" 
      id="files" 
      multiple 
      accept="image/*" 
      style={{display: 'none'}} 
      onChange={onChange}
    />
  </div>;


const Results = ({files, data}) => {
  if (files.length === 0) {return <span/>;}
  return (
    <table className="Results-table">
      <tbody>
      <tr><th>Image</th><th>filename</th><th>bytes</th><th>mime</th><th>dimensions</th></tr>
      {files.map((f, idx) => {
        if (!f.type.startsWith('image/')) {
          return null;
        }
        return (
          <tr key={idx}>
            <td><img alt={f.name} src={window.URL.createObjectURL(f)} height="60" /></td>
            <td>{f.name}</td>
            <td>{f.size}</td>
            <td>{f.type}</td>
            <td>{data[idx] || '...'}</td>
          </tr>
        );
      })}
      </tbody>
    </table>
  );
}

export default App;
