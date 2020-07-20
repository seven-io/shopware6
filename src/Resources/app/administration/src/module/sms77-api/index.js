import './component/sms77-api-compose';
import './component/sms77-api-index';

import snippets from './snippet';

const name = 'sms77-api';

Shopware.Module.register(name, {
    color: '#ff3d58',
    description: 'Send SMS via the sms77io SMS gateway.',
    icon: 'default-shopping-paper-bag-product',
    name,
    navigation: [{
        color: '#ff3d58',
        icon: 'default-shopping-paper-bag-product',
        label: 'sms77-api.navigation',
        parent: 'sw-marketing',
        path: 'sms77.api.index',
    }],
    routes: {
        index: {
            component: 'sms77-api-index',
            path: 'index',
        },
        compose: {
            component: 'sms77-api-compose',
            path: 'compose',
        },
    },
    snippets,
    targetVersion: '1.0.0',
    title: 'sms77-api.navigation',
    type: 'plugin',
    version: '1.0.0',
});