import { Fragment } from "react";
import { Pagination } from "react-bootstrap";

interface PaginationBarProps {
    pageCount: number,
    currentPage: number,
    onPageItemClicked: (page: number) => void,
    className?: string,
}

export default function PaginationBar({ pageCount, currentPage, onPageItemClicked, className }: PaginationBarProps) {
    const paginationMaxPage = Math.min(pageCount, Math.max(currentPage + 4, 10));
    const paginationMinPage = Math.max(1, Math.min(currentPage - 5, paginationMaxPage - 9));

    const numberedPageItems: JSX.Element[] = [];

    for (let i = paginationMinPage; i <= paginationMaxPage; i++) {
        let paginationItem: JSX.Element;

        if (i === currentPage) {
            const currentPageItemSizeMdOnly = <Pagination.Item active className="d-none d-md-block">{i}</Pagination.Item>
            const currentPageItemSizeSmOnly = <Pagination.Item active className="d-sm-block d-md-none">Page: {i}</Pagination.Item>

            paginationItem =
                <Fragment key={i}>
                    {currentPageItemSizeMdOnly}
                    {currentPageItemSizeSmOnly}
                </Fragment>
        } else {
            paginationItem =
                <Pagination.Item
                    key={i}
                    className="d-none d-md-block"
                    onClick={() => onPageItemClicked(i)}>
                    {i}
                </Pagination.Item>
        }
        numberedPageItems.push(paginationItem);
    }

    return (
        <Pagination className={className}>
            {currentPage > 1 &&
                <>
                    <Pagination.First onClick={() => onPageItemClicked(1)} />
                    <Pagination.Prev onClick={() => onPageItemClicked(currentPage - 1)} />
                </>
            }
            {numberedPageItems}
            {currentPage < pageCount &&
                <>
                    <Pagination.Next onClick={() => onPageItemClicked(currentPage + 1)} />
                    <Pagination.Last onClick={() => onPageItemClicked(pageCount)} />
                </>
            }
        </Pagination>
    );
}