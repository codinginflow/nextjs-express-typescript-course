"use client";

import PaginationBar from "@/components/PaginationBar";
import { useRouter } from "next/navigation";

interface BlogPaginationBarProps {
    currentPage: number,
    totalPages: number,
}

export default function BlogPaginationBar({ currentPage, totalPages }: BlogPaginationBarProps) {
    const router = useRouter();

    return (
        <PaginationBar
            currentPage={currentPage}
            pageCount={totalPages}
            onPageItemClicked={(page) => {
                router.push("/blog?page=" + page);
            }}
            className="mt-4"
        />
    );
}