import { SideNavItems, SideNavSection } from '@modules/navigation/models';

export const sideNavSections: SideNavSection[] = [
    {
        text: '',
        items: ['tender'],
    },
];

export const sideNavItems: SideNavItems = {
    tender: {
        icon: 'tachometer-alt',
        text: 'Tender',
        link: '/tender',
    },
};
