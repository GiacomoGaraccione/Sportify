import '../Css files/OrizontalLine.css';
import React from 'react';
import line from '../Images/orizontal line.jpg'

function OrizontalLine(props){
    return <>
        <div className={"orizontal-line " + props.class}>
            <img src={line} alt="Resourse not found"/>
        </div>
    </>;
}

export {OrizontalLine};