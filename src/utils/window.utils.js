export const isMobile = () => window.innerWidth <= 700

export const isTablet = () => !isMobile() && window.innerWidth <= 1180
