import { MDBBtn, MDBBtnGroup, MDBContainer, MDBRow } from "mdb-react-ui-kit";
import React from "react";
import { useEffect, useState } from "react";

export function PaginatedTable<T>({itemsPerPage, items, table}: {itemsPerPage: number, items: T[], table: (items: T[]) => JSX.Element}) {

    const [page, setPage] = useState(1);
    const [shownItems, setShownItems] = useState<T[]>([]);

    const changePage = (pageNumber: number) => (_: any) => {
        const safePageNr = Math.max(1, Math.min(pageNumber, totalPages(items.length, itemsPerPage)))
        setPage(safePageNr);
    }

    useEffect(() => {
        const start = Math.min(items.length, itemsPerPage * (page-1));
        const end = Math.min(items.length, start + itemsPerPage);

        setShownItems(items.slice(start, end))
    } , [page, itemsPerPage, items])

    const totalPages = (numItems: number, itemsPerPage: number) => ((numItems + itemsPerPage - 1) / itemsPerPage)
    const pagesArray = (page: number, numItems: number, itemsPerPage: number): number[] => {
        //  [p-2, p-1, p, p+1, p+2]
        const numPages =  totalPages(numItems, itemsPerPage);
        const shownPages = Math.min(5, numPages);
        const padding = Math.floor(shownPages/2)

        const middleLow = Math.max(1 + padding, page) //lower bound check
        const middle = Math.min(middleLow, numPages - padding) //upper bound check

        return Array.from({length: (shownPages)}, (_, i) => i + middle - padding)
    }

    return(
        <MDBContainer>
            <MDBRow>
                {table(shownItems)}
            </MDBRow>
            <MDBRow>
                <MDBBtnGroup toolbar className='mb-3 pagination-btn-group' role='toolbar' aria-label='Toolbar with button groups'>

                <MDBBtn onClick={changePage(page-10)} key={`${page}-${page-10}`} className='me-2' >{"<<"}</MDBBtn>
                {pagesArray(page, items.length, itemsPerPage).map( (i: number) => {
                    return <MDBBtn onClick={changePage(i)} key={`${page}-${i}`} className='me-2' active={page === i}>{i}</MDBBtn>}
                )}
                <MDBBtn onClick={changePage(page+10)} key={`${page}-${page+10}`} className='me-2'>{">>"}</MDBBtn>

                </MDBBtnGroup>
            </MDBRow>
        </MDBContainer>
    )
}