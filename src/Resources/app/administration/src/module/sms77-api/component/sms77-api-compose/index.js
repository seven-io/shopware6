import template from './sms77-api-compose.html.twig';
import {Sms77ApiMixin} from '../Sms77ApiMixin';
import {getCustomerPhones} from '../../util';

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

        hasCountries() {
            return (this.configuration.countryIds || []).length;
        },

        hasCustomerGroups() {
            return (this.configuration.customerGroupIds || []).length;
        },

        hasSalesChannels() {
            return (this.configuration.salesChannelIds || []).length;
        },

        isDisabled() {
            if ((!this.configuration.smsParams.text || '').length) {
                return true;
            }

            return !(this.configuration.smsParams.to || '').length
                && !this.hasCountries
                && !this.hasCustomerGroups
                && !this.hasSalesChannels;
        },

        salesChannelRepository() {
            return this.repositoryFactory.create('sales_channel');
        },
    },

    async created() {
        this.systemConfig = await this.getSystemConfig();

        this.countries = this.repoToCollection(this.countryRepository);
        this.customerGroups = this.repoToCollection(this.customerGroupRepository);
        this.salesChannels = this.repoToCollection(this.salesChannelRepository);

        this.configuration.smsParams.from = (this.systemConfig.from || '');
        this.configuration.smsParams.text = this.addSignature('');
    },

    data: () => ({
        configuration: {
            countryIds: null,
            customerGroupIds: null,
            customerLimit: 500,
            onlyActiveCustomers: true,
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
            const filters = [];

            if (this.configuration.onlyActiveCustomers) {
                filters.push(Shopware.Data.Criteria.equals(
                    'active', 1));
            }

            if (this.hasCustomerGroups) {
                filters.push(Shopware.Data.Criteria.equalsAny(
                    'groupId', this.configuration.customerGroupIds));
            }

            if (this.hasSalesChannels) {
                filters.push(Shopware.Data.Criteria.equalsAny(
                    'salesChannelId', this.configuration.salesChannelIds));
            }

            if (this.hasCountries) {
                filters.push(Shopware.Data.Criteria.equalsAny(
                    'addresses.countryId', this.configuration.countryIds));
            }

            if (filters.length || !(params.to || '').length) {
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
                return this.createNotificationError({
                    message: errors.join(' '),
                });
            }

            await this.sendSms(params);

            this.isLoading = false;

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
