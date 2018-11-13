/**
 * Taken from https://github.com/AnomalyInnovations/serverless-stack-demo-client under MIT license.
 * more exactly https://github.com/AnomalyInnovations/serverless-stack-demo-client/blob/master/src/components/LoaderButton.js
 * I've studied the code and understood it's functionality.
 * There is no need to rename random variables or refactor the code.
 * https://serverless-stack.com/#table-of-contents
 */


import React from "react";
import { Button, Glyphicon } from "react-bootstrap";
import "./LoaderButton.css";

export default ({
                    isLoading,
                    text,
                    loadingText,
                    className = "",
                    disabled = false,
                    ...props
                }) =>
    <Button
        className={`LoaderButton ${className}`}
        disabled={disabled || isLoading}
        {...props}
    >
        {isLoading && <Glyphicon glyph="refresh" className="spinning" />}
        {!isLoading ? text : loadingText}
    </Button>;