import './Søk.less';

import Popover, { PopoverOrientering } from 'nav-frontend-popover';
import React, { useState } from 'react';

import { IkonFeil, IkonGyldig, IkonSpinner, IkonSøk } from '../icons';

export interface SøkProps {
    onSøk: (value: string) => void;
    onEndring?: (value: string) => void;
    spinner?: boolean;
    validator?: (value: string) => boolean;
    placeholder?: string;
    onGyldigVerdi?: (value: string) => void;
    autoSøk?: boolean;
    children?: React.ReactNode | React.ReactNode[];
}

export const Søk = ({ onSøk, onEndring, validator, onGyldigVerdi, autoSøk = true, spinner = false, placeholder, children }: SøkProps) => {
    const [verdi, settVerdi] = useState('');
    const [anker, settAnker] = useState<HTMLElement | undefined>(undefined);
    const [gyldig, settGyldig] = useState(false);

    const søk = (key?: string) => {
        const searchKey = key || verdi;

        searchKey.length > 0 && onSøk(searchKey);
    };

    const onKeyPress = (event: React.KeyboardEvent) => {
        //Show popover when a key is pressed. This is to ensure the search status is correctly displayed when it was back from hidden.
        settAnker(verdi.length > 0 ? event.currentTarget as HTMLElement : undefined);
        event.key === 'Enter' && verdi.length > 0 && søk();
    };

    const onClickSøk= (event: React.MouseEvent)=>{
        settAnker(verdi.length > 0 ? event.currentTarget as HTMLElement : undefined);
        søk();
    }

    const onChange = (event: React.ChangeEvent) => {
        const changed = (event.target as HTMLInputElement).value
        settVerdi(changed);
        //make sure popover is displayed
        settAnker(changed.length > 0 ? event.currentTarget as HTMLElement : undefined);
        onEndring?.(changed);
        const erGyldig = validator?.(changed);
        settGyldig(erGyldig || false);

        if (erGyldig) {
            onGyldigVerdi?.(changed);
            autoSøk && søk(changed);
        }
    };

    const prompt = !spinner && validator && gyldig && verdi.length > 0 && <IkonGyldig />
        || !spinner && validator && !gyldig && verdi.length > 0 && <IkonFeil />

    return (
        <div className='søk_container'>
            {prompt && <div className='søk_container__prompt'>{prompt}</div>}
            {spinner && <div className='søk_container__spinner'><IkonSpinner /></div>}
            <input className='søk_container__felt' onChange={onChange} onKeyPress={onKeyPress} value={verdi} placeholder={placeholder} />
            <button className='søk_container__knapp' onClick={onClickSøk}>
                <IkonSøk />
            </button>
            {children && <Popover
                id={'søkresultat'}
                ankerEl={anker}
                orientering={PopoverOrientering.UnderVenstre}
                autoFokus={false}
                onRequestClose={() => { settAnker(undefined); }}
                tabIndex={-1}
                utenPil
            >
                <div className='søk_container__resultat'>
                    {children}
                </div>
            </Popover>}
        </div>
    );
};