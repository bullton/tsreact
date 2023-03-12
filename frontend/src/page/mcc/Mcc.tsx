import React from "react";
import { MccSearch } from "../../componments";
import { MainLayout } from "../../layouts";

export const Mcc: React.FC = () => {
    return (
        <>
            <MainLayout>
                <MccSearch />
            </MainLayout>
        </>
    );
}