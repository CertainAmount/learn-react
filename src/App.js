import React, { Component } from "react";
import "./App.css";
import Control from "./component/Control";

class Subject extends Component {
  render() {
    return (
      <header>
        <h1>
          <a
            href="/"
            onClick={function (e) {
              e.preventDefault();
              this.props.onChangePage();
            }.bind(this)}
          >
            {this.props.title}
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
            href={"content/" + data[i].id}
            onClick={function (id, e) {
              e.preventDefault();
              this.props.onChangePage(id);
            }.bind(this, data[i].id)}
            data-id={data[i].id}
          >
            {data[i].title}
          </a>
        </li>
      );
      i = i + 1;
    }

    return (
      <nav>
        <ul>{lists}</ul>
      </nav>
    );
  }
}

class ReadContent extends Component {
  render() {
    return (
      <article>
        <h2>{this.props.title}</h2>
        {this.props.desc}
      </article>
    );
  }
}

class CreateContent extends Component {
  render() {
    return (
      <article>
        <h2>Create</h2>
        <form
          action="/create_process"
          method="post"
          onSubmit={function (e) {
            e.preventDefault();
            this.props.onSubmit(e.target.title.value, e.target.desc.value);
          }.bind(this)}
        >
          <p>
            <input type="text" name="title" placeholder="title"></input>
          </p>
          <p>
            <textarea name="desc" placeholder="description"></textarea>
          </p>
          <p>
            <input type="submit"></input>
          </p>
        </form>
      </article>
    );
  }
}

class UpdateContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.data.id,
      title: this.props.data.title,
      desc: this.props.data.desc,
    };
  }
  render() {
    console.log(this.props.data);
    return (
      <article>
        <h2>Update</h2>
        <form
          action="/create_process"
          method="post"
          onSubmit={function (e) {
            e.preventDefault();
            this.props.onSubmit(
              this.state.id,
              this.state.title,
              this.state.desc);
          }.bind(this)}
        >
          <input type="hidden" name='id' value={this.state.id}></input>
          <p>
            <input
              type="text"
              name="title"
              placeholder="title"
              value={this.state.title}
              onChange={function (e) {
                this.setState({[e.target.name]: e.target.value });
              }.bind(this)}
            ></input>
          </p>
          <p>
            <textarea
              name="desc"
              placeholder="description"
              value={this.state.desc}
              onChange={function (e) {
                this.setState({[e.target.name]: e.target.value})
              }.bind(this)}
            ></textarea>
          </p>
          <p>
            <input type="submit"></input>
          </p>
        </form>
      </article>
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
      max_content_id: 3,
      mode: "welcome",
      selected_content_id: 2,
      subject: { title: "WEB", sub: "world wide web!" },
      welcome: { title: "Welcome", desc: "Hello, React!!" },
      contents: [
        { id: 1, title: "HTML", desc: "HTML is HyperText ..." },
        { id: 2, title: "CSS", desc: "CSS is for design" },
        { id: 3, title: "JS", desc: "JavaScript is for interactive" },
      ],
    };
  }
  getReadContent() {
    var i = 0;
    while (i < this.state.contents.length) {
      var data = this.state.contents[i];
      if (data.id === this.state.selected_content_id) {
        return data;
      }
      i = i + 1;
    }
  }
  getContent() {
    var _title,
      _desc,
      _article = null;
    if (this.state.mode === "welcome") {
      _title = this.state.welcome.title;
      _desc = this.state.welcome.desc;
      _article = <ReadContent title={_title} desc={_desc}></ReadContent>;
    } else if (this.state.mode === "read") {
      var i = 0;
      while (i < this.state.contents.length) {
        var data = this.state.contents[i];
        if (data.id === this.state.selected_content_id) {
          _title = this.state.contents[i].title;
          _desc = this.state.contents[i].desc;
          break;
        }
        i = i + 1;
      }
      _article = <ReadContent title={_title} desc={_desc}></ReadContent>;
    } else if (this.state.mode === "create") {
      _article = (
        <CreateContent
          onSubmit={function (_title, _desc) {
            var max_content_id = this.state.max_content_id + 1;
            var _contents = this.state.contents.concat({
              id: max_content_id,
              title: _title,
              desc: _desc,
            });
            this.setState({
              max_content_id: max_content_id,
              contents: _contents,
            });
          }.bind(this)}
        ></CreateContent>
      );
    } else if (this.state.mode === "update") {
      var _contents = this.getReadContent();
      _article = (
        <UpdateContent
          data={_contents}
          onSubmit={function (_id, _title, _desc) {
            var _contents = Array.from(this.state.contents);
            
            var i = 0;
            while ( i < _contents.length) {
              if (_contents[i].id === _id) {
                _contents[i] = {id:_id, title: _title, desc:_desc}
                break;
              }
              
              i = i + 1;
            }

            this.setState({
              contents: _contents
            });
          }.bind(this)}
        ></UpdateContent>
      );
    }
    return _article;
  }

  render() {
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
          onChangePage={function (id) {
            this.setState({
              mode: "read",
              selected_content_id: Number(id),
            });
          }.bind(this)}
          data={this.state.contents}
        ></TOC>
        <Control
          onChangeMode={function (_mode) {
            if (_mode === 'delete') {
              var _contents = Array.from(this.state.contents)
              if (window.confirm("really?")) {
                var i = 0;
                while (i < _contents.length) {
                  if (_contents[i].id === this.state.selected_content_id) {
                    _contents.splice(i, 1)
                    break;
                  }
                  i = i + 1;
                }
                this.setState({
                  mode:'welcome',
                  contents:_contents
                })
              }
            } else {
            this.setState({
              mode: _mode,
            });
            }
          }.bind(this)}
        ></Control>
        {this.getContent()}
      </div>
    );
  }
}

export default App;
