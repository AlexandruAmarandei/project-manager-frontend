import React, { Component } from "react";
import {Button, Glyphicon} from "react-bootstrap";

class Checkboxlist extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
        props.values.map((v, i) => {
            this.state[v] = false
        })
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    render() {
        return (
            <div className="list-group-item form-group">
                {this.props.values.map((value, i) => (
                    <div className="checkbox" key={i}>
                        <label>
                            <input
                                onChange={this.handleChange}
                                type='checkbox'
                                value={this.state[value]}
                            />
                            {value}
                        </label>
                    </div>
                ))}
            </div>
        )
    }
}


