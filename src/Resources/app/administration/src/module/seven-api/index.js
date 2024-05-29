import './component/seven-api-compose';
import './component/seven-api-index';

import snippets from './snippet';

Shopware.Module.register('seven-api', {
    color: '#00d46a',
    description: 'Send SMS via the seven SMS gateway.',
    icon: 'default-communication-envelope',
    navigation: [{
        color: '#00d46a',
        icon: 'default-communication-envelope',
        label: 'seven-api.navigation',
        parent: 'sw-marketing',
        path: 'seven.api.index',
    }],
    routes: {
        compose: {
            component: 'seven-api-compose',
            path: 'compose',
        },
        index: {
            component: 'seven-api-index',
            path: 'index',
        },
    },
    snippets,
    targetVersion: '1.0.0',
    title: 'seven-api.navigation',
    type: 'plugin',
    version: '1.0.0',
});