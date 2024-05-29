import SevenClient from '@seven.io/api';

export const SevenApiMixin = {
    created() {
        this.messageRepository = this.repositoryFactory.create('seven_message');
    },

    data: () => ({
        sevenClient: null,
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
        getSevenClient(apiKey) {
            return new SevenClient(apiKey, 'shopware6');
        },

        async getSystemConfig() {
            const config = await Shopware.Service('systemConfigApiService')
                .getValues('SevenShopware6.config');

            for (const [key, value] of Object.entries(config)) {
                if ('' !== value && undefined !== value) {
                    config[key.split('.').pop()] = value;
                }

                delete config[key];
            }

            if ((config.apiKey || '').length) {
                this.sevenClient = this.getSevenClient(config.apiKey);
            }

            return config;
        },
    },
};