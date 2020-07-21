import template from './sms77-api-compose.html.twig';
import {Sms77ApiMixin} from '../Sms77ApiMixin';

const strings = {
    delay: null,
    foreign_id: null,
    from: null,
    label: null,
    udh: null,
};

const booleans = {
    debug: false,
    details: false,
    flash: false,
    json: false,
    no_reload: false,
    performance_tracking: false,
    return_msg_id: false,
    unicode: false,
    utf8: false,
};

const numbers = {
    ttl: null,
};

Shopware.Component.register('sms77-api-compose', {
    computed: {
        customerGroupRepository() {
            return this.repositoryFactory.create('customer_group');
        },

        isDisabled() {
            if ((!this.configuration.smsParams.text || '').length) {
                return true;
            }

            return !(this.configuration.smsParams.to || '').length
                && !this.hasCustomerGroups;
        },

        customerRepository() {
            return this.repositoryFactory.create('customer');
        },

        hasCustomerGroups() {
            return (this.configuration.customerGroupIds || []).length;
        },
    },

    async created() {
        this.systemConfig = await this.getSystemConfig();

        this.configuration.smsParams.from = (this.systemConfig.from || '');
        this.configuration.smsParams.text = this.addSignature('');

        this.customerGroups = new Shopware.Data.EntityCollection(
            this.customerGroupRepository.route,
            this.customerGroupRepository.entityName,
            Shopware.Context.api
        );
    },

    data: () => ({
        configuration: {
            customerGroupIds: null,
            customerLimit: 500,
            onlyActiveCustomers: true,
            smsParams: {
                text: null,
                to: null,
                ...strings,
                ...booleans,
                ...numbers,
            },
        },
        customerGroups: null,
        info: null,
        isLoading: false,
    }),

    methods: {
        setCustomerGroupIds(customerGroups) {
            this.customerGroups = customerGroups;

            this.configuration.customerGroupIds = this.customerGroups.getIds();
        },

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

        filterByType(type) {
            return Object.keys(this.configuration.smsParams)
                .filter(key => typeof this.configuration.smsParams[key] === type);
        },

        translateSetting(name, key) {
            return this.$tc(`sms77-api.compose.${name}.${key}`);
        },

        translateSettingTooltip(name) {
            return {message: this.translateSettingDesc(name)};
        },

        translateSettingLabel(name) {
            return this.translateSetting(name, 'label');
        },

        translateSettingDesc(name) {
            return this.translateSetting(name, 'desc');
        },

        defaultCriteria() {
            return new Shopware.Data.Criteria(1, this.customerLimit)
                .addAssociation('addresses');
        },

        filterActive() {
            return Shopware.Data.Criteria.equals(
                'active', 1);
        },

        filterGroupId() {
            return Shopware.Data.Criteria.equalsAny(
                'groupId', this.configuration.customerGroupIds || []);
        },

        getFilters() {
            const filters = [];

            if (this.configuration.onlyActiveCustomers) {
                filters.push(this.filterActive());
            }

            if (this.hasCustomerGroups) {
                filters.push(this.filterGroupId());
            }

            return filters;
        },

        async searchCustomers(filters) {
            const criteria = this.defaultCriteria();

            for (const filter of filters || []) {
                criteria.addFilter(filter);
            }

            return await this.customerRepository.search(criteria, Shopware.Context.api);
        },

        async handleSubmit() {
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

            const response = await this.sendSms(params);
            const entity = this.createEntity(response);
            await this.saveEntity(entity);

            this.isLoading = false;

            this.$router.push({name: 'sms77.api.index',});
        },
    },

    mixins: [Sms77ApiMixin,],

    optionalFields: {
        booleans: Object.keys(booleans),
        numbers: Object.keys(numbers),
        strings: Object.keys(strings),
    },

    template,
});
