import React, { Component } from "react";
import { API, Auth } from "aws-amplify";
import {FormGroup, FormControl, ControlLabel, ListGroupItem, Button} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import "./Login.css";
import LoaderButton from "../components/LoaderButton";
import {validateLink} from "../libs/urlValidator";


export default class ProjectSearch extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            hasResults: false,
            results: [],
            disableButton: [],
            searchString: "",
            email: ""
        };
    }



    validateForm() {
        return validateLink(this.state.searchString);

    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleSubmit = async event => {
        event.preventDefault();
        this.setState({ isLoading: true });
        this.setState({results: []});
        const e  = await Auth.currentAuthenticatedUser();
        this.setState({email: e.attributes.email});

        try{
            let qresults = await this.searchProjectByName();
            this.setState({results: qresults});
            this.setState({hasResults: true});
            console.log(qresults);
            this.setState({isLoading: false})
            let array = [];
            for(let i=0; i<qresults.length;i++){
                let toPut = 1;
                for(let j =0; j <qresults[i].participants.length;j++){
                    if(qresults[i].participants[j]===this.state.email){
                        toPut = 0;
                    }
                }
                array[qresults[i].projectId] = toPut;
            }
            console.log(array);
            this.setState({disableButton : array});
        }catch(e){
            this.setState({isLoading: false})
            alert(e);
        }
    }

    searchProjectByName(){
        let toPass = {
            queryStringParameters: {
                match : this.state.searchString
            }
        }
        return API.get("PMApp", "/searchProjectByName", toPass);
    }


    async addUserToProject(event, project){
        event.preventDefault();
        try{
            await this.addUserToProjectApiCall(project);
            var array = this.state.disableButton;
            array[project.projectId] = 0;
            this.setState({disableButton : array});
        }catch(e){
            alert(e);
        }
    }

    addUserToProjectApiCall(project){
        var toPass = {
            body : {
                projectName : project.projectName,
                email : this.state.email,
                creatorId: project.manager
            }
        }
        return API.post("PMApp", "/addUserToProject", toPass);

    }


    renderResults(){
        if(this.state.results.length === 0){
            return;
        }
        return(
            this.state.results.map(
                (result, i) =>
                    <LinkContainer
                        key={"Link" + i}
                        to={{pathname: `/project/${ this.state.email + result.projectName }`, state: result, email: this.state.email}}
                    >
                        <ListGroupItem key={i}>


                                {result.projectName}
                            <span className="pull-right">
                                { this.state.disableButton[result.projectId] === 0 ?
                                    <Button disabled={true}>
                                        Joined!
                                    </Button> :
                                    <Button
                                        onClick={(e) => this.addUserToProject(e, result)}
                                        disabled={this.state.disableButton[result.projectId] === 0}
                                    >
                                        <b>{"\uFF0B"}</b> Join
                                    </Button>
                                }
                                </span>
                        </ListGroupItem>
                    </LinkContainer>

            )
        );
    }

    renderEmpty(){
        return ;
    }
    render() {
        return (
            <div className="Search">
                <form onSubmit={this.handleSubmit}>
                    <FormGroup controlId="searchString" >
                        <ControlLabel>Project</ControlLabel>
                        <FormControl
                            autoFocus
                            value={this.state.searchString}
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    <LoaderButton
                        block
                        bsSize="large"
                        disabled={!this.validateForm()}
                        type="submit"
                        isLoading={this.state.isLoading}
                        text="Search"
                        loadingText="Searching"
                    />
                </form>
                <span> </span>
                {this.state.hasResults ? this.renderResults() : this.renderEmpty()}

            </div>

        );
    }
}