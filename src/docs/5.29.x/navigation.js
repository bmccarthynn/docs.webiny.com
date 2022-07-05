import React from "react";
// import { Collapsable, Page, Section } from "@/docs/utils/navigation";
import { Navigation as BaseNavigation } from "../5.28.x/navigation";

export const Navigation = () => {
    return (
        <>
            {/* Inherit navigation from 5.28.x. */}
            <BaseNavigation />
            {/* Add new items here. */}
        </>
    );
};
