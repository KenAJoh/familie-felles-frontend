import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';

import deepEqual from 'deep-equal';

import {
    defaultValidator,
    Felt,
    FeltState,
    NavBaseSkjemaProps,
    NavInputProps,
    ValiderFelt,
    Avhengigheter,
    Valideringsstatus,
} from './typer';
import { isChangeEvent } from './utils';

/**
 * Konfigurasjon for å opprette et felt.
 *
 * @verdi verdien til feltet med generisk Verdi type
 * @valideringsfunksjon optional valideringsfunksjon på feltet
 * @skalFeltetVises optional visningsfunksjon. Kan brukes dersom skjemaet
 * skjuler felter for bruker under gitte omstendigheter
 * @avhengigheter avhengighetene som brukes til validering og vis/skjul
 */
export interface FeltConfig<Verdi> {
    verdi: Verdi;
    valideringsfunksjon?: ValiderFelt<Verdi>;
    skalFeltetVises?: (avhengigheter: Avhengigheter) => boolean;
    avhengigheter?: Avhengigheter;
}

export function useFelt<Verdi = string>({
    verdi,
    valideringsfunksjon,
    skalFeltetVises,
    avhengigheter = {},
}: FeltConfig<Verdi>): Felt<Verdi> {
    const initialFeltState = {
        feilmelding: '',
        valider: valideringsfunksjon ? valideringsfunksjon : defaultValidator,
        valideringsstatus: Valideringsstatus.IKKE_VALIDERT,
        verdi,
    };

    const [feltState, settFeltState] = useState<FeltState<Verdi>>(initialFeltState);
    const [erSynlig, settErSynlig] = useState(
        skalFeltetVises ? skalFeltetVises(avhengigheter) : true,
    );

    const nullstill = () => {
        settFeltState(initialFeltState);
    };

    const validerOgSettFelt = (verdi: Verdi = feltState.verdi) => {
        const validertFelt = feltState.valider(
            {
                ...feltState,
                verdi,
            },
            avhengigheter,
        );

        if (!deepEqual(feltState, validertFelt)) {
            settFeltState(validertFelt);
        }
    };

    const hentAvhengighetArray = () => {
        return avhengigheter
            ? // eslint-disable-next-line
              Object.values(avhengigheter).reduce((acc: [], avhengighet: any) => {
                  if ('valideringsstatus' in avhengighet) {
                      return [...acc, (avhengighet as Felt<unknown>).verdi];
                  } else {
                      return [...acc, avhengighet];
                  }
              }, [])
            : [];
    };

    /**
     * Basert på avhengighetene til feltet håndterer vi vis/skjul
     * og nullstilling på feltet.
     */
    useEffect(() => {
        if (skalFeltetVises) {
            if (feltState.valideringsstatus !== Valideringsstatus.IKKE_VALIDERT) {
                nullstill();
            }
            settErSynlig(skalFeltetVises(avhengigheter));
        } else {
            validerOgSettFelt();
        }
    }, [...hentAvhengighetArray()]);

    const onChange = useCallback(
        (verdi: Verdi | ChangeEvent) => {
            const normalisertVerdi = isChangeEvent(verdi) ? verdi.target.value : verdi;

            validerOgSettFelt(normalisertVerdi as Verdi);
        },
        [validerOgSettFelt, settFeltState],
    );

    const hentNavInputProps = useCallback(
        (visFeilmelding: boolean): NavInputProps<Verdi> => ({
            feil: visFeilmelding ? feltState.feilmelding : undefined,
            value: feltState.verdi,
            onChange,
        }),
        [validerOgSettFelt, settFeltState],
    );

    const hentNavBaseSkjemaProps = useCallback(
        (visFeilmelding: boolean): NavBaseSkjemaProps<Verdi> => ({
            feil: visFeilmelding ? feltState.feilmelding : undefined,
            value: feltState.verdi,
        }),
        [validerOgSettFelt, settFeltState],
    );

    return useMemo(
        () => ({
            ...feltState,
            hentNavInputProps,
            hentNavBaseSkjemaProps,
            nullstill,
            erSynlig,
            onChange,
            validerOgSettFelt,
        }),
        [feltState, hentNavInputProps, validerOgSettFelt, nullstill, onChange],
    );
}
