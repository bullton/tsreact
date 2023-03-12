import React from "react";
import { Housing } from "../../componments";
import { MainLayout } from "../../layouts";

export const HomePage: React.FC = () => {
    return (
        <>
            <MainLayout>
                <Housing />
            </MainLayout>
        </>
    );
}
