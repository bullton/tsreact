import React from "react";
import { Housing } from "../../componments";
import { MainLayout } from "../../layouts";

export const Shenzhen2hand: React.FC = () => {
    return (
        <>
            <MainLayout>
                <Housing city="深圳" date={undefined} houseType="住宅" pagesize={12}/>
            </MainLayout>
        </>
    );
}
