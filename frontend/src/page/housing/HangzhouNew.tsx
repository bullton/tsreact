import React from "react";
import { Housing } from "../../componments";
import { MainLayout } from "../../layouts";

export const HangzhouNew: React.FC = () => {
    return (
        <>
            <MainLayout>
                <Housing city="杭州" date={undefined} houseType="住商" bargainType="新房" pagesize={14}/>
            </MainLayout>
        </>
    );
}
