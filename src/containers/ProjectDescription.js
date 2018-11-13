import React, { Component } from "react";
import { API } from "aws-amplify";
import {FormGroup, FormControl, ListGroup, ListGroupItem, PageHeader, Button} from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import "./Notes.css";
import {LinkContainer} from "react-router-bootstrap";
import { Auth } from "aws-amplify";


export default class ProjectDescription extends Component {
    constructor(props) {
        super(props);

        this.file = null;

        this.state = {
            isLoading: null,
            isDeleting: null,
            projectInfo: null,
            description: "",
            projectName: "",
            manager: "",
            participants: []
        };
    }

    async componentDidMount() {
        if (!this.props.isAuthenticated) {
            return;
        }
        const e = await Auth.currentAuthenticatedUser();
        this.setState({email: e.attributes.email});
        try {
            const projectInfoArr = await this.getProjectInfo();
            const projectInfo = projectInfoArr[0];
            console.log(projectInfo);
            this.setState(projectInfo);

        } catch (e) {
            console.log(e.message);
            alert(e);
        }
    }

    getProjectInfo(){
        console.log(this.props.location);
        var toPass = {
            queryStringParameters: {
                projectId : this.props.location.state.projectId,
            }
        }
        return API.get("PMApp", "/getProjectInfo", toPass);

    }

    validateForm() {
        return this.state.description.length > 0;
    }



    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }


    updateProjectDescription(newDescription) {
        var toPass = {
            body : {
                projectId: newDescription.projectId,
                newDescription: newDescription.newDescription,
            }
        }
        console.log(toPass);
        return API.post("PMApp", `/updateProjectDescription`, toPass);
    }

    updateDescription = async event => {
        event.preventDefault();
        this.setState({ isLoading: true });

        try {
            await this.updateProjectDescription({
                projectId: this.state.projectId,
                newDescription: this.state.description,
            });
            alert("Description updated");
            this.setState({ isLoading: false });
        } catch (e) {
            alert(e);
            this.setState({ isLoading: false });
        }
    }

    updateStatus = async event => {
        event.preventDefault();
        this.setState({ isLoading: true });

        try {
            await this.updateStatusCall({
                projectId: this.state.projectId,
                status: "completed",
            });
            alert("Status changed to completed!");
            this.setState({status: "completed"});
            this.setState({ isLoading: false });
        } catch (e) {
            alert(e);
            this.setState({ isLoading: false });
        }
    }

    updateStatusCall(info){
        var toPass = {
            body : {
                projectId: info.projectId,
                status: info.status
            }
        }
        console.log(toPass);
        return API.post("PMApp", `/changeStatusOfProject`, toPass);
    }

    renderDescriptionForm(){
        return(
            <form onSubmit={this.updateDescription}>
                <FormGroup controlId="description">
                    <FormControl
                        onChange={this.handleChange}
                        value={this.state.description}
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
                    text="Update"
                    loadingText="Updating…"
                />
            </form>
        );
    }

    renderDescriptionText(){
        return(
            <ListGroupItem >
                {this.state.description}
            </ListGroupItem>
        );
    }

    async handleDelete(event,participantId, participantName){
        event.preventDefault();
        var participants2 = this.state.participants;
        participants2.splice(participantId, 1);
        try {
            await this.deleteUserCall(participantName);
            this.setState({participants: participants2});
        }catch(e){
            console.log(e.message);
            alert(e.message);
        }

    }

    deleteUserCall(participantName){
        var toPass = {
            body: {
                projectName : this.state.projectName,
                email : this.props.location.email,
                userToRemove : participantName
            }
        }
        return API.post("PMApp", "/removeUserFromProject", toPass);

    }

    renderDeleteButtonForParticipant(participantId, participantName){
        if(participantName === this.props.location.email){
            return;
        }
        return(
            <Button onClick={(e) => this.handleDelete(e, participantId, participantName)}>
                X
            </Button>
        );
    }

    renderNothing(){
        return;
    }

    renderParticipants(){
        const len = this.state.participants.length;
        let paramArray = this.state.participants;

        if(this.props.location.email === this.state.manager){
            paramArray = paramArray.concat([{}]);
        }
        return paramArray.map(
            (participant, i) =>
                i !== len ?
                    <LinkContainer
                        key = {"Profile" + i}
                        to = {{pathname: "/profileSkills",  email :participant}}
                        >
                        <ListGroupItem key={i}>
                            {this.props.location.email === this.state.manager? this.renderDeleteButtonForParticipant(i, participant) : this.renderNothing()}
                            { i + ": " +participant}
                        </ListGroupItem>
                    </LinkContainer>

                    :
                    <LinkContainer
                        key="new"
                        to={{pathname: "/addParticipant", state : this.state.projectName, email :this.props.location.email}}
                    >
                        <ListGroupItem>
                            <h4>
                                <b>{"\uFF0B"}</b>  Add participant
                            </h4>
                        </ListGroupItem>
                    </LinkContainer>
        );
    }

    renderChangeStatusButton(){
        return(
            <Button onClick={(e) => this.updateStatus(e)}>Change status to complete!</Button>
        );
    }

    render() {
        return (
            <div className="Project">
                <ListGroup>
                    <PageHeader>Project name:</PageHeader>
                    <ListGroupItem >
                        {this.state.projectName}
                    </ListGroupItem>
                    <PageHeader>Project Manager:</PageHeader>
                    <ListGroupItem >
                        {this.state.manager}
                    </ListGroupItem>
                    <PageHeader>Status</PageHeader>
                    <ListGroupItem>
                        {this.state.status}
                        {this.state.email === this.state.manager? this.renderChangeStatusButton(): this.renderNothing()};
                    </ListGroupItem>
                    <PageHeader>Description:</PageHeader>
                        {this.state.email === this.state.manager ? this.renderDescriptionForm() : this.renderDescriptionText()}
                    <PageHeader>Participants:</PageHeader>
                    {this.renderParticipants()}
                </ListGroup>
            </div>
        );
    }
}