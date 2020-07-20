import Sms77Client from 'sms77-client';

const context = Shopware.Context.api;

export const Sms77ApiMixin = {
    inject: ['repositoryFactory'],

    mounted() {
        document.querySelector('.sw-desktop__content').style.overflow = 'scroll'; //TODO wait merge https://github.com/shopware/platform/pull/1137
    },

    data: () => ({
        repository: null,
        sms77Client: null,
        systemConfig: null,
    }),

    created() {
        this.repository = this.repositoryFactory.create('sms77_message');
    },

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

        async sendSms(form) {
            const toBool = (k, v) => this.$options.optionalFields.booleans.includes(k)
                ? 'on' === v ? 1 : 0 : v;

            const toObject = form => Object.assign(...
                [...new FormData(form).entries()]
                    .filter(([, v]) => '' !== v)
                    .map(([k, v]) => ({[k]: toBool(k, v)})));

            const successKey = 'success';
            const config = toObject(form);
            const sms77Res = await this.sms77Client.sms(config);
            const code = Number.isInteger(sms77Res)
                ? sms77Res : config.json
                    ? sms77Res[successKey] : JSON.parse(sms77Res)[successKey];

            return {
                type: 'sms',
                config,
                response: config.json ? sms77Res : {[successKey]: code},
            };
        },

        createEntity(obj) {
            const entity = this.repository.create(context);

            for (const [key, value] of Object.entries(obj)) {
                entity[key] = value;
            }

            return entity;
        },

        findAll() {
            return this.repository
                .search(new Shopware.Data.Criteria()
                    .addSorting(Shopware.Data.Criteria.sort('createdAt', 'DESC')), context)
                .then(messages => messages);
        },

        async saveEntity(proxy) {
            const response = await this.repository.save(proxy, context);

            if (204 !== response.status) {
                throw new Error(response);
            }

            return response;
        },

        setMessages() {
            return this.findAll()
                .then(messages => {
                    this.messages = messages;

                    return this.messages;
                })
                .catch(fromRepo => console.error({fromRepo}));
        },
    },
};