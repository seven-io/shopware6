import template from './sms77-api-compose.html.twig';
import {Sms77ApiMixin} from '../Sms77ApiMixin';

Shopware.Component.register('sms77-api-compose', {
    computed: {
        customerGroupRepository() {
            return this.repositoryFactory.create('customer_group');
        },

        customerRepository() {
            return this.repositoryFactory.create('customer');
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
                && !this.hasCustomerGroups;
        },

        salesChannelRepository() {
            return this.repositoryFactory.create('sales_channel');
        },
    },

    async created() {
        this.systemConfig = await this.getSystemConfig();

        this.configuration.smsParams.from = (this.systemConfig.from || '');
        this.configuration.smsParams.text = this.addSignature('');

        this.customerGroups = this.repoToCollection(this.customerGroupRepository);
        this.salesChannels = this.repoToCollection(this.salesChannelRepository);
    },

    data: () => ({
        configuration: {
            customerGroupIds: null,
            customerLimit: 500,
            onlyActiveCustomers: true,
            salesChannelIds: null,
            smsParams: {
                text: null,
                to: null,
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
                ttl: null,
            },
        },
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

        defaultCriteria() {
            return new Shopware.Data.Criteria(1, this.customerLimit)
                .addAssociation('addresses');
        },

        filterActive() {
            return Shopware.Data.Criteria.equals(
                'active', 1);
        },

        filterEqualsAny(prop, arr) {
            return Shopware.Data.Criteria.equalsAny(prop, arr || []);
        },

        filterGroupId() {
            return this.filterEqualsAny('groupId', this.configuration.customerGroupIds);
        },

        filterSalesChannelId() {
            return this.filterEqualsAny('salesChannelId', this.configuration.salesChannelIds);
        },

        getFilters() {
            const filters = [];

            if (this.configuration.onlyActiveCustomers) {
                filters.push(this.filterActive());
            }

            if (this.hasCustomerGroups) {
                filters.push(this.filterGroupId());
            }

            if (this.hasSalesChannels) {
                filters.push(this.filterSalesChannelId());
            }

            return filters;
        },

        async handleSubmit() {
            const errors = [];
            const params = {...this.configuration.smsParams};

            this.isLoading = true;

            if (this.hasCustomerGroups) {
                let phoneNumbers = [];

                for (const customer of await this.searchCustomers(this.getFilters())) {
                    let phone = null;

                    for (const address of customer.addresses) {
                        if ((address.phoneNumber || '').length) {
                            phone = address.phoneNumber;

                            if (customer.defaultShippingAddressId) {
                                break;
                            }

                            break;
                        }
                    }

                    if (phone) {
                        phoneNumbers.push(phone);
                    }
                }

                if (phoneNumbers.length) {
                    params.to = phoneNumbers.join(',');
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

            const response = await this.sendSms(params);
            const entity = this.createEntity(response);
            await this.saveEntity(entity);

            this.isLoading = false;

            this.$router.push({name: 'sms77.api.index',});
        },

        async searchCustomers(filters) {
            const criteria = this.defaultCriteria();

            for (const filter of filters || []) {
                criteria.addFilter(filter);
            }

            return await this.customerRepository.search(criteria, Shopware.Context.api);
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
