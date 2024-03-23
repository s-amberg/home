import React from "react";

type Props = {
    isLoading: boolean,
    children: JSX.Element
}
export const Loader = ({isLoading, children}: Props ): JSX.Element => {


    return (
        isLoading  
        ?   <div className="text-center">
                <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        :   <>{children}</>
    )
}