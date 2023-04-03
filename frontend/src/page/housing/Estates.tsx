import React from "react";
import { Estates } from "../../componments";
import { MainLayout } from "../../layouts";

export const EstateInfo: React.FC = () => {
    return (
        <>
            <MainLayout>
                <Estates city='杭州' pagesize={50}/>
            </MainLayout>
        </>
    );
}
