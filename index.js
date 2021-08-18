import React from './react';
import ReactDom from './react-dom';

function action(){
    alert(12)
}

const ele = <div className="test" id="test" style={{ fontSize: '34px' }} onClick={action}>
    1111
    <span style="color:red">22222</span>
</div>

ReactDom.render(ele, document.getElementById('root'))

console.log(ele);