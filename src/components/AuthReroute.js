/**
 * Taken from https://github.com/AnomalyInnovations/serverless-stack-demo-client under MIT license.
 * more exactly https://github.com/AnomalyInnovations/serverless-stack-demo-client/blob/master/src/components/AuthenticatedRoute.js
 * I've studied the code and understood it's functionality.
 * There is no need to rename random variables or refactor the code.
 * https://serverless-stack.com/#table-of-contents
 */

import { Route, Redirect } from "react-router-dom";
import React from "react";

export default ({ component: C, props: cProps, ...rest }) =>
    <Route
        {...rest}
        render={props =>
            cProps.isAuthenticated
                ? <C {...props} {...cProps} />
                : <Redirect
                    to={`/login?redirect=${props.location.pathname}${props.location
                        .search}`}
                />}
    />;