import { useState } from 'react';
import { FamilieAxiosRequestConfig, preferredAxios, håndterApiRessurs, loggFeil } from './axios';
import {
    Ressurs,
    ApiRessurs,
    byggTomRessurs,
    byggHenterRessurs,
    byggFeiletRessurs,
} from '@navikt/familie-typer';
import { AxiosResponse, AxiosError } from 'axios';

export const useAppAxios = () => {
    const [ressurserSomLaster, settRessurserSomLaster] = useState<string[]>([]);

    /**
     * Funksjon som henter og pakker ut respons til en ressurs.
     * Typene D og T står for request og respons type.
     *
     * @param config konfigurasjon for request. Extender config fra axios.
     */
    const axiosRequest = async <D, T>(
        config: FamilieAxiosRequestConfig<D>,
    ): Promise<Ressurs<T>> => {
        const ressursId = `${config.method}_${config.url}`;
        config.påvirkerSystemLaster && settRessurserSomLaster([...ressurserSomLaster, ressursId]);

        return preferredAxios
            .request(config)
            .then((response: AxiosResponse<ApiRessurs<T>>) => {
                const responsRessurs: ApiRessurs<T> = response.data;

                config.påvirkerSystemLaster && fjernRessursSomLaster(ressursId);
                return håndterApiRessurs(responsRessurs);
            })
            .catch((error: AxiosError) => {
                loggFeil(error);

                config.påvirkerSystemLaster && fjernRessursSomLaster(ressursId);

                const responsRessurs: ApiRessurs<T> = error.response?.data;
                return håndterApiRessurs(responsRessurs);
            });
    };

    const fjernRessursSomLaster = (ressursId: string) => {
        setTimeout(() => {
            settRessurserSomLaster((prevState: string[]) => {
                return prevState.filter((ressurs: string) => ressurs !== ressursId);
            });
        }, 300);
    };

    const systemetLaster = () => {
        return ressurserSomLaster.length > 0;
    };

    const useRessurs = <D, T>(config: FamilieAxiosRequestConfig<D>) => {
        const [ressurs, settRessurs] = useState<Ressurs<T>>(byggTomRessurs<T>());

        const hentRessurs = (defaultFeilmelding: string) => {
            settRessurs(byggHenterRessurs());

            axiosRequest<D, T>(config)
                .then((hentetRessurs: Ressurs<T>) => settRessurs(hentetRessurs))
                .catch((_error: AxiosError) => {
                    settRessurs(byggFeiletRessurs(defaultFeilmelding));
                });
        };

        return {
            ressurs,
            hentRessurs,
        };
    };

    return {
        axiosRequest,
        systemetLaster,
        useRessurs,
    };
};
