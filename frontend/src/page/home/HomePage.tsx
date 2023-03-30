import React from "react";
import { Housing } from "../../componments";
import { MainLayout } from "../../layouts";

export const HomePage: React.FC = () => {
    return (
        <>
            <MainLayout>
                <Housing city={undefined} date={undefined} houseType="住宅" bargainType="二手" pagesize={50}/>
            </MainLayout>
        </>
    );
}
