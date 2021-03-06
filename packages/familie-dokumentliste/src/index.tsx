import * as React from 'react';
import styled from 'styled-components';
import navFarger from 'nav-frontend-core';
import { Element, Undertekst } from 'nav-frontend-typografi';
import PilVenstre from '@navikt/familie-ikoner/dist/utils/PilVenstre';
import PilNed from '@navikt/familie-ikoner/dist/utils/PilNed';
import PilHøyre from '@navikt/familie-ikoner/dist/utils/PilHøyre';
import { Journalposttype } from '@navikt/familie-typer';

const StyledDokumentListe = styled.ul`
    padding: 0;
    margin: 0;
    list-style-type: none;
`;

const StyledKnapp = styled.button`
    padding: 0.5rem 1rem;
    display: grid;
    grid-gap: 0 1rem;
    grid-template-columns: minmax(min-content, max-content);
    grid-template-rows: repeat(2, min-content);
    grid-template-areas:
        'ikon tittel'
        'ikon dato';
    max-width: 300px;
    background-color: transparent;
    border: none;

    :hover {
        background-color: ${navFarger.navLysGra};
        cursor: pointer;
    }
`;

const JournalpostIkon = styled.span`
    grid-area: ikon;
    padding-top: 0.3rem;
`;
const StyledUndertekst = styled(Undertekst)`
    grid-area: dato;
`;

const StyledDokumentnavn = styled(Element)`
    text-overflow: ellipsis;
    max-width: 100%;
    overflow: hidden;
    color: ${navFarger.navBla};
    grid-area: tittel;
`;

interface JournalpostikonProps {
    journalposttype: Journalposttype;
}

const Journalpostikon: React.FC<JournalpostikonProps> = ({ journalposttype }) => {
    switch (journalposttype) {
        case 'I':
            return <PilVenstre heigth={16} width={16} />;
        case 'N':
            return <PilNed heigth={16} width={16} />;
        case 'U':
            return <PilHøyre heigth={16} width={16} />;
        default:
            return <div />;
    }
};

export interface DokumentProps {
    tittel: string;
    dato?: string;
    journalpostId: string;
    journalposttype: Journalposttype;
    dokumentinfoId: string;
    filnavn?: string;
}

export interface DokumentElementProps {
    dokument: DokumentProps;
    onClick: (dokument: DokumentProps) => void;
}

export interface DokumentlisteProps {
    dokumenter: DokumentProps[];
    onClick: (dokument: DokumentProps) => void;
}

export const DokumentElement: React.FC<DokumentElementProps> = ({ dokument, onClick }) => {
    return (
        <li>
            <StyledKnapp onClick={() => onClick(dokument)}>
                <JournalpostIkon>
                    <Journalpostikon journalposttype={dokument.journalposttype} />
                </JournalpostIkon>
                <StyledDokumentnavn>{dokument.tittel}</StyledDokumentnavn>
                <StyledUndertekst>{dokument.dato}</StyledUndertekst>
            </StyledKnapp>
        </li>
    );
};

const Dokumentliste: React.FC<DokumentlisteProps> = ({ dokumenter, onClick }) => {
    return (
        <StyledDokumentListe>
            {dokumenter.map((dokument: DokumentProps, indeks: number) => {
                return <DokumentElement dokument={dokument} onClick={onClick} key={indeks} />;
            })}
        </StyledDokumentListe>
    );
};

export default Dokumentliste;
