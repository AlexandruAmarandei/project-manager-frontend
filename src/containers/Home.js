import React, { Component } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Auth } from "aws-amplify";

import "./Home.css";
import { API } from "aws-amplify";

export default class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            notes: [],
            yourProjects: [],
            otherProjects: [],
            email: ""
        };
    }

    async componentDidMount() {
        if (!this.props.isAuthenticated) {
            return;
        }
        const e = await Auth.currentAuthenticatedUser();
        this.setState({email: e.attributes.email});
        try {
            const yourProjects = await this.getProjects("/listProjects");
            this.setState({ yourProjects });
            const otherProjects = await this.getProjects2();
            this.setState({ otherProjects });
        } catch (e) {
            console.log(e.message);
            alert(e);
        }

        this.setState({ isLoading: false });
    }

    getProjects(getLink){
        var toPass = {
            queryStringParameters: {
                email : this.state.email
            }
        }
        return API.get("PMApp", getLink, toPass);
    }

    getProjects2(){
        var toPass = {
            queryStringParameters: {
                email : this.state.email
            }
        }
        return API.get("PMApp", "/listProjectParticipant", toPass);
    }



    renderYourProjects(projects) {
        return [{}].concat(projects).map(
            (project, i) =>
                i !== 0
                    ? <LinkContainer
                        key={project.projectId}
                        to={{pathname: `/project/${ this.state.email + project.projectName }`, state: project, email: this.state.email}}
                    >
                        <ListGroupItem header={project.projectName}>
                            {"Manager: " + project.manager}
                        </ListGroupItem>
                    </LinkContainer>
                    : <LinkContainer
                        key="new"
                        to={{pathname: "/newProject", email :this.state.email}}
                    >
                        <ListGroupItem>
                            <h4>
                                <b>{"\uFF0B"}</b> Create a new project
                            </h4>
                        </ListGroupItem>
                    </LinkContainer>
        );
    }


    renderOtherProjects(projects) {
        return projects.map(
            (project, i) =>
                        <LinkContainer
                            key={project.projectId}
                            to={{pathname : `/project/${ this.state.email + project.projectName }`, state: project, email: this.state.email}}
                        >
                        <ListGroupItem header={project.projectName}>
                            {"Manager: " + project.manager}
                        </ListGroupItem>
                    </LinkContainer>
        );
    }

    renderLander() {
        return (
            <div className="lander">
                <h1>Project manager App</h1>
                <p>Log in to unlock app!</p>
            </div>
        );
    }

    renderNotes() {
        return (
            <div className="notes">
                <PageHeader>Projects you manage</PageHeader>
                <ListGroup>
                    {!this.state.isLoading && this.renderYourProjects(this.state.yourProjects)}
                </ListGroup>
                <PageHeader>Projects you take part in</PageHeader>
                <ListGroup>
                    {!this.state.isLoading && this.renderOtherProjects(this.state.otherProjects)}
                </ListGroup>
            </div>
        );
    }

    render() {
        return (
            <div className="Home">
                {this.props.isAuthenticated ? this.renderNotes() : this.renderLander()}
            </div>
        );
    }
}