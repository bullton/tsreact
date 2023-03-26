import React from "react";
import { Housing } from "../../componments";
import { MainLayout } from "../../layouts";

export const Hangzhou2handTotal: React.FC = () => {
    return (
        <>
            <MainLayout>
                <Housing city="杭州" date={undefined} houseType="住商" pagesize={14}/>
            </MainLayout>
        </>
    );
}
