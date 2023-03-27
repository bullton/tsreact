import React from "react";
import { Housing } from "../../componments";
import { MainLayout } from "../../layouts";

export const Hangzhou2hand: React.FC = () => {
    return (
        <>
            <MainLayout>
                <Housing city="杭州" date={undefined} houseType="住宅" bargainType="二手" pagesize={14}/>
            </MainLayout>
        </>
    );
}
