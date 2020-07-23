import Sms77Client from 'sms77-client';

export const Sms77ApiMixin = {
    created() {
        this.messageRepository = this.repositoryFactory.create('sms77_message');
    },

    data: () => ({
        sms77Client: null,
        systemConfig: null,
    }),

    inject: ['repositoryFactory'],

    metaInfo() {
        return {
            title: this.$createTitle(),
        };
    },

    mounted() {
        //TODO wait merge https://github.com/shopware/platform/pull/1137
        document.querySelector('.sw-desktop__content').style.overflow = 'scroll';
    },

    methods: {
        getSms77Client(apiKey) {
            return new Sms77Client(apiKey, 'shopware6');
        },

        async getSystemConfig() {
            const config = await Shopware.Service('systemConfigApiService')
                .getValues('Sms77Shopware6.config');

            for (const [key, value] of Object.entries(config)) {
                if ('' !== value && undefined !== value) {
                    config[key.split('.').pop()] = value;
                }

                delete config[key];
            }

            if ((config.apiKey || '').length) {
                this.sms77Client = this.getSms77Client(config.apiKey);
            }

            return config;
        },
    },
};