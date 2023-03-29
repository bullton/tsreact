import React from "react";
import { Listings } from "../../componments";
import { MainLayout } from "../../layouts";

export const CityListings: React.FC = () => {
    return (
        <>
            <MainLayout>
                <Listings city={undefined} date={undefined} houseType="住商" bargainType="二手" pagesize={14}/>
            </MainLayout>
        </>
    );
}
