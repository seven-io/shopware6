import template from './seven-api-index.html.twig';
import {SevenApiMixin} from '../SevenApiMixin';

const component = {
    columns: [
        {
            allowResize: true,
            dataIndex: 'type',
            label: 'seven-api.compose.type',
            primary: true,
            property: 'type',
        },
        {
            allowResize: true,
            dataIndex: 'config',
            label: 'seven-api.compose.config',
            property: 'config',
            sortable: false,
        },
        {
            allowResize: true,
            dataIndex: 'response',
            label: 'seven-api.compose.response',
            property: 'response',
        },
        {
            allowResize: true,
            dataIndex: 'created_at',
            label: 'seven-api.compose.created',
            property: 'created_at',
        },
        {
            allowResize: true,
            dataIndex: 'updated_at',
            label: 'seven-api.compose.updated',
            property: 'updated_at',
        },
    ],

    async created() {
        this.systemConfig = await this.getSystemConfig();

        this.messages = await this.messageRepository
            .search(new Shopware.Data.Criteria()
                    .addSorting(Shopware.Data.Criteria.sort('createdAt', 'DESC')),
                Shopware.Context.api);
    },

    data: () => ({
        isLoading: false,
        messageRepository: null,
        messages: null,
    }),

    methods: {
        async resend(msg) {
            await this.sendSms(msg.config);

            this.$router.go();
        }
    },

    mixins: [SevenApiMixin,],

    template,
};

Shopware.Component.register('seven-api-index', component);