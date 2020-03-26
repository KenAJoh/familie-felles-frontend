import React from 'react';
import { FamilieIkonVelger } from '@navikt/familie-ikoner';
import { kjønnType } from '@navikt/familie-typer';

export default {
    component: FamilieIkonVelger,
    parameters: {
        componentSubtitle: 'Copied from familie-ikoner for debug purposes.',
    },
    title: 'Komponenter/Header',
};

export const familievelger = () => {
    return (
        <>
            <FamilieIkonVelger alder={30} kjønn={kjønnType.KVINNE} />
            <FamilieIkonVelger alder={3} kjønn={kjønnType.KVINNE} />
            <FamilieIkonVelger alder={30} kjønn={kjønnType.MANN} />
            <FamilieIkonVelger alder={3} kjønn={kjønnType.MANN} />
        </>
    );
};
