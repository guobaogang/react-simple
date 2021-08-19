import React from './react';
import ReactDom from './react-dom';
/* 
function action() {
    alert(12)
}

const ele = <div className="test" id="test" style={{ fontSize: '34px' }} onClick={action}>
    1111
    <span style="color:red">22222</span>
</div>

function Home(props) {
    return <div className="test" name={props.name} id="test" style={{ fontSize: '34px' }} onClick={action}>
        1111
        <span style="color:red">22222</span>
    </div>
} */

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            num: 0
        }
    }

    componentWillMount() {
        console.log('componentWillMount');
    }

    componentDidMount() {
        console.log('componentDidMount');
    }

    componentWillUpdate() {
        console.log('componentWillUpdate');
    }

    componentDidUpdate() {
        console.log('componentDidUpdate');
    }

    handleClick() {
        this.setState({
            num: this.state.num + 1
        })
    }

    render() {
        return <div className="test" name={this.props.name} id="test" style={{ fontSize: '34px' }}>
            <div>计数器：{this.state.num}</div>
            <div style="color:red">22222</div>
            <div>
                <button onClick={this.handleClick.bind(this)}>计数</button>
            </div>
        </div>
    }
}

ReactDom.render(<App name='home' />, document.getElementById('root'))