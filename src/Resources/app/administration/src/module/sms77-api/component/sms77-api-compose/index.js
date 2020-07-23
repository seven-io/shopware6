import template from './sms77-api-compose.html.twig';
import {Sms77ApiMixin} from '../Sms77ApiMixin';
import {getCustomerPhones, addMessageSignature} from '../../util';

Shopware.Component.register('sms77-api-compose', {
    computed: {
        countryRepository() {
            return this.repositoryFactory.create('country');
        },

        customerRepository() {
            return this.repositoryFactory.create('customer');
        },

        customerGroupRepository() {
            return this.repositoryFactory.create('customer_group');
        },

        isDisabled() {
            return !(this.configuration.smsParams.text || '').length;
        },

        languageRepository() {
            return this.repositoryFactory.create('language');
        },

        salesChannelRepository() {
            return this.repositoryFactory.create('sales_channel');
        },
    },

    async created() {
        this.systemConfig = await this.getSystemConfig();

        this.countries = new Shopware.Data.EntityCollection(
            this.countryRepository.route,
            this.countryRepository.entityName,
            Shopware.Context.api
        );

        this.customerGroups = new Shopware.Data.EntityCollection(
            this.customerGroupRepository.route,
            this.customerGroupRepository.entityName,
            Shopware.Context.api
        );

        this.languages = new Shopware.Data.EntityCollection(
            this.languageRepository.route,
            this.languageRepository.entityName,
            Shopware.Context.api
        );

        this.salesChannels = new Shopware.Data.EntityCollection(
            this.salesChannelRepository.route,
            this.salesChannelRepository.entityName,
            Shopware.Context.api
        );

        this.configuration.smsParams.from = (this.systemConfig.from || '');
        this.configuration.smsParams.text = addMessageSignature(
            '', this.systemConfig.signature, this.systemConfig.signaturePosition);
    },

    data: () => ({
        configuration: {
            activeCustomers: true,
            countryIds: null,
            customerGroupIds: null,
            customerLimit: 500,
            guestCustomers: false,
            languageIds: null,
            salesChannelIds: null,
            smsParams: {
                delay: null,
                foreign_id: null,
                from: null,
                label: null,
                udh: null,
                debug: false,
                details: false,
                flash: false,
                json: false,
                no_reload: false,
                performance_tracking: false,
                return_msg_id: false,
                unicode: false,
                utf8: false,
                text: null,
                to: null,
                ttl: null,
            },
        },
        countries: null,
        customerGroups: null,
        info: null,
        isLoading: false,
        languages: null,
        salesChannels: null,
    }),

    methods: {
        commonSettingAttrs(name, placeholder = true) {
            const obj = {
                label: this.translateSettingLabel(name),
                name,
            };

            if (placeholder) {
                obj.placeholder = this.translateSettingDesc(name);
            }

            return obj;
        },

        async handleSubmit() {
            this.isLoading = true;

            const params = {...this.configuration.smsParams};
            const errors = [];

            if (!(this.configuration.to || '').length) {
                const filters = [
                    Shopware.Data.Criteria.equals(
                        'active', this.activeCustomers ? 1 : 0),
                    Shopware.Data.Criteria.equals(
                        'guest', this.guestCustomers ? 1 : 0),
                ];

                if (this.configuration.customerGroupIds) {
                    filters.push(Shopware.Data.Criteria.equalsAny(
                        'groupId', this.configuration.customerGroupIds));
                }

                if (this.configuration.salesChannelIds) {
                    filters.push(Shopware.Data.Criteria.equalsAny(
                        'salesChannelId', this.configuration.salesChannelIds));
                }

                if (this.configuration.countryIds) {
                    filters.push(Shopware.Data.Criteria.equalsAny(
                        'addresses.countryId', this.configuration.countryIds));
                }

                if (this.configuration.languageIds) {
                    filters.push(Shopware.Data.Criteria.equalsAny(
                        'languageId', this.configuration.languageIds));
                }

                const phones = getCustomerPhones(await this.searchCustomers(filters));

                if (phones.length) {
                    params.to = phones;
                }
            }

            if (!(params.to || '').length) {
                errors.push(this.$t('sms77-api.compose.to.error.empty'));
            }

            if (!(params.text || '').length) {
                errors.push(this.$t('sms77-api.compose.text.error.empty'));
            }

            if (errors.length) {
                this.isLoading = false;

                return this.createNotificationError({
                    message: errors.join(' '),
                });
            }

            for (const [k, v] of Object.entries(params)) {
                if ('' === v || null === v) {
                    delete params[k];
                }
            }

            const successKey = 'success';
            const sms77Res = await this.sms77Client.sms(params);
            const code = Number.isInteger(sms77Res)
                ? sms77Res : params.json
                    ? sms77Res[successKey] : JSON.parse(sms77Res)[successKey];

            const entity = this.messageRepository.create(Shopware.Context.api);
            entity.config = params;
            entity.response = params.json ? sms77Res : {[successKey]: code};
            entity.type = 'sms';

            const response =
                await this.messageRepository.save(entity, Shopware.Context.api);

            this.isLoading = false;

            if (204 !== response.status) {
                throw new Error(response);
            }

            this.$router.push({name: 'sms77.api.index',});
        },

        async searchCustomers(filters) {
            const criteria = new Shopware.Data.Criteria(1, this.customerLimit)
                .addAssociation('addresses');

            for (const filter of filters || []) {
                criteria.addFilter(filter);
            }

            return await this.customerRepository.search(criteria, Shopware.Context.api);
        },

        setCountryIds(countries) {
            this.countries = countries;

            this.configuration.countryIds = this.countries.getIds();
        },

        setCustomerGroupIds(customerGroups) {
            this.customerGroups = customerGroups;

            this.configuration.customerGroupIds = this.customerGroups.getIds();
        },

        setLanguageIds(languages) {
            this.languages = languages;

            this.configuration.languageIds = this.languages.getIds();
        },

        setSalesChannelIds(salesChannels) {
            this.salesChannels = salesChannels;

            this.configuration.salesChannelIds = this.salesChannels.getIds();
        },

        translateSetting(name, key) {
            return this.$t(`sms77-api.compose.${name}.${key}`);
        },

        translateSettingDesc(name) {
            return this.translateSetting(name, 'desc');
        },

        translateSettingLabel(name) {
            return this.translateSetting(name, 'label');
        },

        translateSettingTooltip(name) {
            return {message: this.translateSettingDesc(name)};
        },
    },

    mixins: [Sms77ApiMixin, Shopware.Mixin.getByName('notification')],

    template,
});
