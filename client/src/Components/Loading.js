import '../Css files/Loading.css';

import React from 'react';

function Loading(props) {
    return <div className='d-flex align-items-left' id='loading'>
        <div className='spinner-border m-2' role='status' aria-hidden='true'></div>
        <strong>{props.msg}</strong>
    </div>;
}

export default Loading;