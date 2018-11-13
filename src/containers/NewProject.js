import React, { Component } from "react";
import {FormGroup, FormControl, ControlLabel} from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import "./NewNote.css";
import { API } from "aws-amplify";

export default class NewProject extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: null,
            name: "",
            content: ""
        };
    }

    validateForm() {
        return this.state.content.length > 0 && this.state.name.length > 0;
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleSubmit = async event => {
        event.preventDefault();

        this.setState({ isLoading: true });

        try {
            await this.createProject();
            this.props.history.push({
                pathname: '/',
                email: this.props.location.email
            });
        } catch (e) {
            alert(e);
            this.setState({ isLoading: false });
        }
    }

    createProject() {
        var toPass = {
            body: {
                projectName : this.state.name,
                description : this.state.content,
                email : this.props.location.email
            }
        }
        return API.post("PMApp", "/createProject", toPass);
    }

    render() {
        return (
            <div className="New project">
                <form onSubmit={this.handleSubmit}>
                    <FormGroup controlId="name">

                        <ControlLabel>Title</ControlLabel>
                        <FormControl
                            autoFocus
                            value={this.state.name}
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    <FormGroup controlId="content">
                        <ControlLabel>Description</ControlLabel>
                        <FormControl
                            onChange={this.handleChange}
                            value={this.state.content}
                            componentClass="textarea"
                        />
                    </FormGroup>
                    <LoaderButton
                        block
                        bsStyle="primary"
                        bsSize="large"
                        disabled={!this.validateForm()}
                        type="submit"
                        isLoading={this.state.isLoading}
                        text="Create"
                        loadingText="Creating…"
                    />
                </form>
            </div>
        );
    }
}