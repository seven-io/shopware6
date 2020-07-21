import './component/sms77-api-compose';
import './component/sms77-api-index';

import snippets from './snippet';

Shopware.Module.register('sms77-api', {
    color: '#00d46a',
    description: 'Send SMS via the sms77io SMS gateway.',
    icon: 'default-communication-envelope',
    navigation: [{
        color: '#00d46a',
        icon: 'default-communication-envelope',
        label: 'sms77-api.navigation',
        parent: 'sw-marketing',
        path: 'sms77.api.index',
    }],
    routes: {
        compose: {
            component: 'sms77-api-compose',
            path: 'compose',
        },
        index: {
            component: 'sms77-api-index',
            path: 'index',
        },
    },
    snippets,
    targetVersion: '1.0.0',
    title: 'sms77-api.navigation',
    type: 'plugin',
    version: '1.0.0',
});