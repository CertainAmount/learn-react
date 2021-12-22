import React, { Component } from "react";
import "./App.css";

class Subject extends Component {
  render() {
    return (
      <header>
        <h1>
          <a 
            href="/" 
            onClick={function(e) {
              e.preventDefault();
              this.props.onChangePage();
              }.bind(this)}
              >{this.props.title}
          </a>
        </h1>
        {this.props.sub}
      </header>
    );
  }
}

class TOC extends Component {
  render() {
    var lists = [];
    var data = this.props.data;

    var i = 0;
    while (i < data.length) {
      lists.push(
        <li key={data[i].id}>
          <a 
            href={"content/"+data[i].id}
            onClick={function(id, e) {
              e.preventDefault();
              this.props.onChangePage(id);
            }.bind(this, data[i].id)}
            data-id={data[i].id}>{data[i].title}</a>
        </li>)
      i = i + 1;
    }

    return (      
      <nav>
        <ul>
          {lists}
        </ul>
      </nav>
    );
  }
}

class Content extends Component {
  render() {
    return (
      <article>
        <h2>{this.props.title}</h2>
        {this.props.desc}
      </article>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode:'welcome',
      selected_content_id:2,
      subject: { title: "WEB", sub: "world wide web!" },
      welcome:{title:'Welcome', desc:'Hello, React!!'},
      contents: [
        { id: 1, title: "HTML", desc: "HTML is HyperText ..." },
        { id: 2, title: "CSS", desc: "CSS is for design" },
        { id: 3, title: "JS", desc: "JavaScript is for interactive" }
      ],
    };
  }
  
  render() {
    var _title, _desc = null;
    if (this.state.mode === "welcome") {
      _title = this.state.welcome.title;
      _desc = this.state.welcome.desc;
    } else if (this.state.mode === "read") {
      var i = 0;
      while(i < this.state.contents.length) {
        var data = this.state.contents[i];
        if(data.id === this.state.selected_content_id) {
          _title = this.state.contents[i].title;
          _desc = this.state.contents[i].desc;
          break;
        }
        i = i +1;
      }
    }

    return (
      <div className="App">
        <Subject
          title={this.state.subject.title}
          sub={this.state.subject.sub}
          onChangePage={function () {
            this.setState({
              mode: "welcome",
            });
            }.bind(this)}
        ></Subject>
        <TOC 
          onChangePage={function(id) {
            this.setState({
              mode: "read",
              selected_content_id:Number(id)
            });
          }.bind(this)}
          data={this.state.contents}>
        </TOC>
        <Content title={_title} desc={_desc}></Content>
      </div>
    );
  }
}

export default App;
