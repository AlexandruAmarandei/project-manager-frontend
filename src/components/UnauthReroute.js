/**
 * Taken from https://github.com/AnomalyInnovations/serverless-stack-demo-client under MIT license.
 * more exactly https://github.com/AnomalyInnovations/serverless-stack-demo-client/blob/master/src/components/UnauthenticatedRoute.js
 * I've studied the code and understood it's functionality.
 * There is no need to rename random variables or refactor the code.
 * https://serverless-stack.com/#table-of-contents
 */


import React from "react";
import { Route, Redirect } from "react-router-dom";

export default ({ component: C, props: cProps, ...rest }) =>
    <Route
        {...rest}
        render={props =>
            !cProps.isAuthenticated
                ? <C {...props} {...cProps} />
                : <Redirect to="/" />}
    />;