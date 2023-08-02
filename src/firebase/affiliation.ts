function getCookie(name: string) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
}

function setCookie(name: string, value: string) {
    document.cookie = `${name}=${value}; path=/`;
}

const AFFILIATION_COOKIE_NAME = 'affiliation';

export const getAffiliation = () => {
    return getCookie(AFFILIATION_COOKIE_NAME);
    }

export const setAffiliation = (affiliation: string) => {
    setCookie(AFFILIATION_COOKIE_NAME, affiliation);
    }

