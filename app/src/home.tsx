import { MDBCard, MDBCardBody, MDBCardHeader, MDBCol, MDBContainer, MDBRow } from 'mdb-react-ui-kit';
import React from 'react';

export function Home() {

    return (
        <MDBContainer>
            <MDBRow>
                <MDBCol className="d-flex flex-column justify-content-center"> 
                    <MDBCard className="flex-grow-1">
                        <MDBCardHeader className="">
                            <h1 className='align-center'>Welcome home</h1>
                        </MDBCardHeader>
                        <MDBCardBody>
                            <p>This is a homepage
                                under construction</p>
                        </MDBCardBody>
                      
                    </MDBCard>       
                </MDBCol>
            </MDBRow>
        </MDBContainer>
       

    )
}