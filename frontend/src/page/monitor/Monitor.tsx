import React from "react";
import { MonitorManager } from "../../componments";
import { MainLayout } from "../../layouts";

export const Monitor: React.FC = () => {
    return (
        <>
            <MainLayout>
                <MonitorManager pagesize={50}/>
            </MainLayout>
        </>
    );
}
