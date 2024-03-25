import React from "react";
import { MonitorManager, ShowMap } from "../../componments";
import { MainLayout } from "../../layouts";

export const MapBrowse: React.FC = () => {
    return (
        <>
            <MainLayout>
                <ShowMap city="杭州" date={undefined} houseType="住宅" bargainType="二手" pagesize={14}/>
            </MainLayout>
        </>
    );
}
