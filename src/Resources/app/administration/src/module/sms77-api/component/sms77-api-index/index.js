import template from './sms77-api-index.html.twig';
import {Sms77ApiMixin} from '../Sms77ApiMixin';

const component = {
    mixins: [Sms77ApiMixin,],

    async created() {
        await this.setMessages();
    },

    columns: [
        {
            property: 'type',
            dataIndex: 'type',
            label: 'sms77-api.compose.type',
            allowResize: true,
            primary: true,
        },
        {
            property: 'config',
            dataIndex: 'config',
            label: 'sms77-api.compose.config',
            allowResize: true,
            sortable: false,
        },
        {
            property: 'response',
            dataIndex: 'response',
            label: 'sms77-api.compose.response',
            allowResize: true,
        },
        {
            property: 'created_at',
            dataIndex: 'created_at',
            label: 'sms77-api.compose.created',
            allowResize: true,
        },
        {
            property: 'updated_at',
            dataIndex: 'updated_at',
            label: 'sms77-api.compose.updated',
            allowResize: true,
        },
    ],

    data: () => ({
        isLoading: false,
        messages: null,
        repository: null,
    }),

    template,
};

Shopware.Component.register('sms77-api-index', component);