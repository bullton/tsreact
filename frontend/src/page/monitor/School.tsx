import React from "react";
import { Schools } from "../../componments";
import { MainLayout } from "../../layouts";

export const School: React.FC = () => {
    return (
        <>
        <MainLayout>
            <Schools pagesize= { 50} />
        </MainLayout>
        </>
    );
}
