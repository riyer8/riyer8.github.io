export function getSeason(date = new Date()) {
    const month = date.getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'autumn';
    return 'winter';
}

export const SEASON_PALETTES = {
    spring: {
        light: {
            accentPrimary: 'rgba(74, 222, 128, 0.12)',
            accentSecondary: 'rgba(244, 114, 182, 0.10)',
            blobBase: [90, 210, 140],
            label: 'spring',
        },
        dark: {
            accentPrimary: 'rgba(74, 222, 128, 0.08)',
            accentSecondary: 'rgba(244, 114, 182, 0.06)',
            blobBase: [80, 190, 140],
            label: 'spring',
        },
    },
    summer: {
        light: {
            accentPrimary: 'rgba(45, 212, 191, 0.12)',
            accentSecondary: 'rgba(56, 189, 248, 0.10)',
            blobBase: [50, 200, 220],
            label: 'summer',
        },
        dark: {
            accentPrimary: 'rgba(45, 212, 191, 0.08)',
            accentSecondary: 'rgba(56, 189, 248, 0.06)',
            blobBase: [60, 190, 230],
            label: 'summer',
        },
    },
    autumn: {
        light: {
            accentPrimary: 'rgba(251, 146, 60, 0.12)',
            accentSecondary: 'rgba(248, 113, 113, 0.10)',
            blobBase: [230, 140, 80],
            label: 'autumn',
        },
        dark: {
            accentPrimary: 'rgba(251, 146, 60, 0.08)',
            accentSecondary: 'rgba(248, 113, 113, 0.06)',
            blobBase: [220, 130, 80],
            label: 'autumn',
        },
    },
    winter: {
        light: {
            accentPrimary: 'rgba(129, 140, 248, 0.12)',
            accentSecondary: 'rgba(56, 189, 248, 0.10)',
            blobBase: [120, 140, 240],
            label: 'winter',
        },
        dark: {
            accentPrimary: 'rgba(129, 140, 248, 0.08)',
            accentSecondary: 'rgba(56, 189, 248, 0.06)',
            blobBase: [110, 130, 235],
            label: 'winter',
        },
    },
};
