import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import NotFound from "./containers/NotFound";
import Login from "./containers/Login";
import Confirm from "./containers/Confirm";
import Signup from "./containers/Signup";
import ProjectDescription from "./containers/ProjectDescription";
import NewProject from "./containers/NewProject";
import AddParticipantToProject from "./containers/AddParticipantToProject";
import ProjectSearch from "./containers/ProjectSearch";
import Profile from "./containers/Profile";
import AuthReroute from "./components/AuthReroute";
import UnauthReroute from "./components/UnauthReroute";

export default ({ childProps }) =>
    <Switch>
        <AuthReroute path="/" exact component={Home} props={childProps} />
        <UnauthReroute path="/login" exact component={Login} props={childProps} />
        <UnauthReroute path="/signup" exact component={Signup} props={childProps} />
        <UnauthReroute path="/confirm" exact component={Confirm} props={childProps} />
        <AuthReroute path="/project/:id" exact component={ProjectDescription} props={childProps} />
        <AuthReroute path="/newProject" exact component={NewProject} props={childProps}/>
        <AuthReroute path="/addParticipant" exact component={AddParticipantToProject} props={childProps}/>
        <AuthReroute path="/searchProjects" exact component={ProjectSearch} props = {childProps}/>
        <AuthReroute path="/profileSkills" exact component={Profile} props = {childProps}/>
        <Route component={NotFound} />
    </Switch>