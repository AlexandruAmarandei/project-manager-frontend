/**
 * Taken from https://github.com/AnomalyInnovations/serverless-stack-demo-client under MIT license.
 * more exactly https://github.com/AnomalyInnovations/serverless-stack-demo-client/blob/master/src/components/AppliedRoute.js
 * I've studied the code and understood it's functionality.
 * There is no need to rename random variables or refactor the code.
 * https://serverless-stack.com/#table-of-contents
*/

import React from "react";
import { Route } from "react-router-dom";

export default ({ component: C, props: cProps, ...rest }) =>
    <Route {...rest} render={props => <C {...props} {...cProps} />} />;