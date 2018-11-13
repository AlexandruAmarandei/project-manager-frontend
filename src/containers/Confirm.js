import {Component} from "react";
import React from "react";
import { HelpBlock, FormGroup, FormControl, ControlLabel} from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import "./Signup.css";
import { Auth } from "aws-amplify"

export default class Confirm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            email: "",
            confirmationCode: ""
        };
    }


    validateConfirmationForm() {
        return this.state.confirmationCode.length > 0;
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleConfirmationSubmit = async event => {
        event.preventDefault();
        alert(this.props.location.email)
        // to do, change data into email
        this.setState({ isLoading: true });

        try {
            await Auth.confirmSignUp(this.props.location.email, this.state.confirmationCode);
            await Auth.signIn(this.props.location.email, this.props.location.password);

            this.props.userHasAuthenticated(true);
            this.props.history.push({
                pathname: '/',
                email: this.props.location.email,
            });
        } catch (e) {
            alert(e.message);
            this.setState({ isLoading: false });
        }
    }


    render() {
        return (
            <div className="Confirm">
                <form onSubmit={this.handleConfirmationSubmit}>
                    <FormGroup controlId="confirmationCode" bsSize="large">
                        <ControlLabel>Confirmation Code</ControlLabel>
                        <FormControl
                            autoFocus
                            type="tel"
                            value={this.state.confirmationCode}
                            onChange={this.handleChange}
                        />
                        <HelpBlock>Please check your email for the code.</HelpBlock>
                    </FormGroup>
                    <LoaderButton
                        block
                        bsSize="large"
                        disabled={!this.validateConfirmationForm()}
                        type="submit"
                        isLoading={this.state.isLoading}
                        text="Verify"
                        loadingText="Verifying…"
                    />
                </form>
            </div>
        );
    }

}