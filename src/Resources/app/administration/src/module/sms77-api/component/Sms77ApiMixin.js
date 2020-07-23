import Sms77Client from 'sms77-client';

const context = Shopware.Context.api;

export const Sms77ApiMixin = {
    inject: ['repositoryFactory'],

    mounted() {
        //TODO wait merge https://github.com/shopware/platform/pull/1137
        document.querySelector('.sw-desktop__content').style.overflow = 'scroll';
    },

    data: () => ({
        sms77Client: null,
        systemConfig: null,
    }),

    metaInfo() {
        return {
            title: this.$createTitle(),
        };
    },

    methods: {
        getClient(apiKey) {
            return new Sms77Client(apiKey, 'shopware6');
        },

        addSignature(text) {
            if (this.systemConfig.signature && this.systemConfig.signaturePosition) {
                text = 'append' === this.systemConfig.signaturePosition
                    ? `${this.systemConfig.signature}${text}`
                    : `${text}${this.systemConfig.signature}`;
            }

            return text;
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
                this.sms77Client = this.getClient(config.apiKey);
            }

            return config;
        },

        repoToCollection(repository) {
            return new Shopware.Data.EntityCollection(
                repository.route,
                repository.entityName,
                Shopware.Context.api
            );
        },

        async sendSms(config) {
            for (const [k, v] of Object.entries(config)) {
                if ('' === v || null === v) {
                    delete config[k];
                }
            }

            const successKey = 'success';
            const sms77Res = await this.sms77Client.sms(config);
            const code = Number.isInteger(sms77Res)
                ? sms77Res : config.json
                    ? sms77Res[successKey] : JSON.parse(sms77Res)[successKey];

            const entity = this.messageRepository.create(context);
            entity.config = config;
            entity.response = config.json ? sms77Res : {[successKey]: code};
            entity.type = 'sms';

            const response = await this.messageRepository.save(entity, context);

            if (204 !== response.status) {
                throw new Error(response);
            }

            return response;
        },

        async findAllMessages() {
            return await this.messageRepository
                .search(new Shopware.Data.Criteria()
                    .addSorting(Shopware.Data.Criteria.sort('createdAt', 'DESC')), context);
        },
    },
};