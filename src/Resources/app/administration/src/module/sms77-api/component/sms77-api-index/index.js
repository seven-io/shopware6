import template from './sms77-api-index.html.twig';
import {Sms77ApiMixin} from '../Sms77ApiMixin';

const component = {
    columns: [
        {
            allowResize: true,
            dataIndex: 'type',
            label: 'sms77-api.compose.type',
            primary: true,
            property: 'type',
        },
        {
            allowResize: true,
            dataIndex: 'config',
            label: 'sms77-api.compose.config',
            property: 'config',
            sortable: false,
        },
        {
            allowResize: true,
            dataIndex: 'response',
            label: 'sms77-api.compose.response',
            property: 'response',
        },
        {
            allowResize: true,
            dataIndex: 'created_at',
            label: 'sms77-api.compose.created',
            property: 'created_at',
        },
        {
            allowResize: true,
            dataIndex: 'updated_at',
            label: 'sms77-api.compose.updated',
            property: 'updated_at',
        },
    ],

    async created() {
        this.messageRepository = this.repositoryFactory.create('sms77_message');

        this.systemConfig = await this.getSystemConfig();

        this.messages = await this.findAllMessages();
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

    mixins: [Sms77ApiMixin,],

    template,
};

Shopware.Component.register('sms77-api-index', component);